import { HttpClient, HttpHeaders } from '@angular/common/http';
import { take, distinctUntilChanged, debounceTime, switchMap, map, catchError } from 'rxjs/operators';
import { DomainService } from './domain.service';
import { ModalService } from '../theme/pages/default/modal/modal.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Helpers } from '../helpers';
import { Observable, Subscription, concat, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { HeadersService } from './header.service';
import { consoleLog, globals } from '../globals';
import { Person } from '../_andaime/tf-inputs/tf-select-email/tf-select-email.component';
import { FileHolder } from 'angular2-image-upload';
import { LoadingService } from './loading.service';


export class FormService{
  public entidade_nome:string;
  public entidade_url:string;
  public activeModal: NgbActiveModal;
  public formulario: FormGroup;
  public listDadosSelect:any[];
  resultA;
  resultB;

  //TODO: subscriptions dispose;

  constructor(protected http: HttpClient,
    private domainService: DomainService,
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private headersService: HeadersService,
    private loadingService: LoadingService){

    }
    

  inicializar(entidade, formulario:FormGroup, activeModal, listDadosSelect){
    this.entidade_nome = entidade;
    this.entidade_url = `${this.domainService.getApiUrl()}/${this.entidade_nome}`;
    this.formulario = formulario;
    this.listDadosSelect = listDadosSelect;
    if (activeModal){this.activeModal = activeModal}
  }

  edit(action, listCarousel?){
    this.loadingService.addRequest();
    this.http.get(`${this.entidade_url}/${action}.json`, {headers: this.headersService.definirHeaders()})
      .subscribe(
        (response) => {
          FormService.patchValueWithFormArray(this.formulario, response, listCarousel);
          this.loadingService.removeRequest();
          
        // consoleLog(this.formulario);

          if (globals.debug){
            this.modalService.debugService("Form", "Edit", response);
          }
          },
        (error: any) => {
          this.modalService.tratarError(error);
          this.loadingService.removeRequest();
        }
      );
  }

  static patchValueWithFormArray(formulario, dados, listCarousel?){
    let formBuilder:FormBuilder= new FormBuilder();
    Object.keys(formulario.controls).forEach(key => {
      if (key.split('_')[0] == "carousel"){
        consoleLog("olhando a key:");
        consoleLog(key);
        consoleLog(dados[key]);
        listCarousel[key]['fileHolder'] = dados[key];
        // Object.keys(listCarousel[key]['fileHolder']).forEach(fh =>{
          // 
        // })
        // listCarousel[key]['fileList'] = dados[key];
        // this.inicializarListCarousel(key, dados[key]);
        consoleLog(listCarousel);
      }else if (formulario.controls[key] instanceof FormArray){
        formulario.controls[key].clear();
        if (dados[key]){
          dados[key].forEach(e => {
            consoleLog("form.service 63:");
            consoleLog(dados[key]);
            var fcontrol = formBuilder.group(e);
            (<FormArray>formulario.controls[key]).push(fcontrol)
          });
        }
      }
    });
    formulario.patchValue(dados);
  }

  // async show(id): Promise<any>{
  //   if (typeof this.resultB === 'undefined'){
  //     Helpers.setLoading(true);
  //     this.http.get(`${this.entidade_url}/${id}.json`)
  //       .toPromise()
  //       .then(response => {
  //         Helpers.setLoading(false);
  //         Object.keys(this.formulario.controls).forEach(key => {
  //           if (this.formulario.controls[key] instanceof FormArray){
  //             response[key].forEach(e => {
  //               var fcontrol = this.formBuilder.group({
  //                     id: [4],
  //                     new_record: [false],
  //                     _destroy: [null]
  //                   });
  //               (<FormArray>this.formulario.controls[key]).push(fcontrol)
  //             });
  //           }
  //         });
  //         this.formulario.patchValue(response);
  //       })
  //       .catch((error:any)=>{Helpers.setLoading(false);this.modalService.tratarError(error)})
  //   }
  //   return this.resultB;
  // }

  save(listCarousel?){
    consoleLog("tamo pra salva ro ojbeotvo.")
    let body = this.montarBody(listCarousel)
    if (this.formulario.value.id){
      return this.update(body, listCarousel!=undefined);
    }else{
      return this.create(body, listCarousel!=undefined);
    }
  }

  private montarBody(listCarousel?){
    consoleLog(listCarousel);
    if (listCarousel == undefined || listCarousel == {}){
      consoleLog("raw form")
      return this.formulario.value;
    }else{
      consoleLog('form data')
      consoleLog("sacou q tem q tem listCaroussel. vai montar o body de outro jeito");
      let formData: FormData = new FormData();
      Object.keys(this.formulario.controls).forEach(key => {
        consoleLog("olhando a key:");
        consoleLog(key);
        if (key.split('_')[0] == "carousel"){
          consoleLog('investigando list')
          consoleLog(listCarousel);
          consoleLog(listCarousel[key] != undefined)
          consoleLog(listCarousel[key]['fileList'] != undefined)
          consoleLog(listCarousel[key]['fileList'] != {})

          if (listCarousel[key]['fileHolder'] != undefined && listCarousel[key]['fileHolder'].length > 0){
            listCarousel[key]['fileHolder'].forEach(e => {
              //   // var fh: FileHolder = e;
              let tag_persistir = key.replace("carousel_","") + "_persistir";
              consoleLog("entrou no else. o arquivo já existente vai pro append com a key:")
              consoleLog(tag_persistir);
              consoleLog("e vai com o value:")
              consoleLog(e.filename);
              formData.append(`[${tag_persistir}][]`, e.filename);
            });
          }

          if (listCarousel[key] != undefined && listCarousel[key]['fileList'] != undefined &&
            listCarousel[key]['fileList'].files != undefined && listCarousel[key]['fileList'].files.length > 0){
            consoleLog("adicionando esse carousel")

            //TOOD: tratamento pra preencher o array de persistir quando o usuario não encostar
            //TOOD: tratamento pra preencher o array de persistir quando o usuario clicar em deletar
            let fileList: FileHolder[] = listCarousel[key]['fileList'].files;
            consoleLog("percorrente o array de fileholder do file list")
            fileList.forEach(e => {
              var fh: FileHolder = e;
              consoleLog("conferindo nome do file pra ver se já existe")
              consoleLog(fh.file.name);
              if (fh.file.name != "undefined"){
                formData.append(`[${key}][]`, fh.file, fh.file.name);
                // 
                // formData.append(`[${key}][]`, listCarousel[key].file, listCarousel[key].file.name);
              }else{
                // event.src.replace(/^.*[\\\/]/, '');
                // let tag_persistir = key.replace("carousel_","") + "_persistir";
                // consoleLog("entrou no else. o arquivo já existente vai pro append com a key:")
                // consoleLog(tag_persistir);
                // consoleLog("e vai com o value:")
                // consoleLog(fh.src.split("/")[7]);
                // formData.append(`[${tag_persistir}][]`, fh.src.split("/")[7]);
              }
            });
            consoleLog("geta all key list carousel:")
            consoleLog(formData.getAll(`[${key}][]`));
          }
        }else{
          if (this.formulario.controls[key].value != undefined){
            formData.append(`[${key}]`, this.formulario.controls[key].value);   
          }
        }

        // if (this.formulario.controls[key] instanceof FormArray){
          
        //   this.formulario.controls[key].clear();
        //   if (dados[key]){
        //     dados[key].forEach(e => {
        //       consoleLog("form.service 63:");
        //       consoleLog(dados[key]);
        //       var fcontrol = formBuilder.group(e);
        //       (<FormArray>this.formulario.controls[key]).push(fcontrol)
        //     });
        //   }
        // }
      });
      consoleLog("olha como tá sendo devolvido o formData")
      consoleLog(formData);
      // formulario.patchValue(dados);
      // formData.append('[layout][nome]', this.formulario.value.nome);
      return formData
    }
  }

  private create(body, multipart){
    consoleLog("entrou no create, variavel multipart tá vindo:")
    consoleLog(multipart)
    consoleLog("com esse body:")
    consoleLog(body);
    this.http.post(`${this.entidade_url}.json`, body,
      { headers: this.headersService.definirHeaders(multipart), observe: 'response'})
      .subscribe(
        (response) => {
          this.modalService.tratarSucesso(response, this.activeModal);
          if (globals.debug){
            this.modalService.debugService("Form", "Create", response);
          }
          this.loadingService.removeRequest();
        },
        error => {
          this.modalService.tratarError(error, 'post');
          this.loadingService.removeRequest();
        }
        )
  }

  private update(body, multipart?){
    let id = (multipart == undefined || multipart == false) ? body.id : body.getAll('[id]');
    this.http.put(`${this.entidade_url}/${id}.json`, body,
      { headers: this.headersService.definirHeaders(multipart), observe: 'response'})
      .subscribe(
        (response) => {
          this.modalService.tratarSucesso(response, this.activeModal);
          if (globals.debug){
            this.modalService.debugService("Form", "Update", response);
          }
          this.loadingService.removeRequest();
        },
        (error) => {
          this.modalService.tratarError(error, 'put');
          this.loadingService.removeRequest();
        }
      )
  }

  // remove(id, emLote){
  //   this.modalService.tratarExclusao().then(
  //     respostaModal => {
  //       if (respostaModal) {
  //         Helpers.setLoading(true);
  //         this.http.delete(`${this.entidade_url}/${id}.json`,{observe: 'response',
  //           headers: this.headersService.definirHeaders()})
  //           .subscribe(
  //             (response) => {
  //               this.modalService.tratarSucesso(response, this.activeModal);
  //               // if (response.status > 199 && response.status < 300) {
  //                 // consoleLog("na hora de tratar o o remove dentro de form.service. como tá o response/?")
  //                 // consoleLog(response)
  //                 // this.activeModal.close(true);
  //               // }
  //             },
  //             (error: any) => this.modalService.tratarError(error))
  //           .add(()=>Helpers.setLoading(false));
  //       }
  //     }
  //   );
  // }

  remove(id, modalLote?){ 
    console.log('Eu estou aqui');
    console.log(modalLote);
    var queryParam = "";
    if (modalLote != undefined && modalLote == true){
      this.modalService.tratarLote()
        .then(r => {
          if (r!=undefined && r=='lote'){queryParam = "?em_lote=true"}
          this.callDelete(r, id, queryParam)
        });
    }else{
      queryParam = ""//"?em_lote=false"
      this.modalService.tratarExclusao("Deseja realmente processar essa exclusão?")
        .then(r => {this.callDelete(r, id, queryParam)});
    }
  }

  callDelete(r, id, queryParam){
    if (r) {
      Helpers.setLoading(true);
      // this.subscriptions.add(
        this.http.delete(
        `${this.entidade_url}/${id}.json${queryParam}`,{observe: 'response',
          headers: this.headersService.definirHeaders()})
        .subscribe(
          (response) => {
            this.modalService.tratarSucesso(response, this.activeModal);
            // if (response.status > 199 && response.status < 300) {
            //   this.index();
            // }
          },
          (error: any) => this.modalService.tratarError(error))
        .add(()=>Helpers.setLoading(false))
      // );
    }
  }

  call

  async list(entidade): Promise<any>{
    Helpers.setLoading(true);
    if (typeof this.resultA === 'undefined'){

      let rota, entidadeTemp;
      if (entidade.includes('/')){
        rota = `${entidade}.json`;
        entidadeTemp = entidade.split('/')[1].split('_')[1];
      }else{
        rota = `${entidade}/list_andaime.json`;
        entidadeTemp = entidade;
      }

      this.resultA = await this.http
      .get(`${this.domainService.getApiUrl()}/${rota}`,
        {headers: this.headersService.definirHeaders()})
      .toPromise()
      .then(response => {
        Helpers.setLoading(false);
        consoleLog(this.listDadosSelect)
        consoleLog(entidadeTemp);
        this.listDadosSelect[entidade] = response[entidadeTemp];
        if (globals.debug){
          this.modalService.debugService("Form", "List", response);
        }
      })
      .catch((error: any) => {
        Helpers.setLoading(false);
        this.modalService.tratarError(error)})
    }
    return this.resultA;
  }

  popularLists(){
    if (Object.entries(this.listDadosSelect).length !== 0){
      Object.keys(this.listDadosSelect).forEach(e => {
        Helpers.setLoading(true);
        this.list(e);
      });
    }
  }

}
