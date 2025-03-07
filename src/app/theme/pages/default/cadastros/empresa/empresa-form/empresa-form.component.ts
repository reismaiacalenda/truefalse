import { FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, NO_ERRORS_SCHEMA, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ModalService } from '../../../modal/modal.service';
import { DomainService } from '../../../../../../_services/domain.service';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Helpers } from '../../../../../../helpers';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
import { User } from '../../../../../../auth/_models';
import { WorkspaceService } from '../../../../../../_services/workspace.service';
// import { timingSafeEqual } from 'crypto';
import { consoleLog } from '../../../../../../globals';

@Component({
  selector: 'empresa-form',
  templateUrl: 'empresa-form.html'
})
export class EmpresaFormComponent implements OnInit, AfterViewInit{
  public modalTitle: string;
  public listUnidade: any[];
  public listFuncionario: any[];
  public listLocalizacao: any[];
  @ViewChild('responsavel', {static: false}) responsavel;
  @ViewChild('funcionarios', {static: false}) funcionarios;
  // @ViewChild('localizacoes', {static: false}) localizacoes;
  private apiUrl: string;
  public rowId: number;
  public isDataAvailable: boolean = false;
  public isListAvailable:boolean = false;
  public maskDinamico = "00.000.000/0000-00";//"000.000.000-009";
  public currentUser: User;
  empresa = {
    nome: null,
    razao_social: null,
    num_cadastro_pessoa: null,
    email: null,
    tipo_pessoa: "PJ",
    telefone: null,
    inscricao_municipal: null,
    inscricao_estadual: null,
    logradouro: null,
    numero: null,
    complemento: null,
    bairro: null,
    municipio: null,
    uf: null,
    cep: null,
    responsavel_id: null,
    funcionario_ids: [null],
    funcionario_emails: [null],
    empresas_localizacoes_attributes: [{
      localizacao_id: null,
      plano_horas: null,
      residente: false
    }]
  };

  constructor(private http: HttpClient,
    public activeModal: NgbActiveModal,
    private _sanitizer: DomSanitizer,
    private modalNgb: NgbModal,
    private modalService: ModalService,
    private _script: ScriptLoaderService,
    private workspaceService: WorkspaceService,
    private domainService: DomainService) {
    this.currentUser = this.workspaceService.currentUser;
    this.apiUrl = `${domainService.getApiUrl()}/empresas`;
  }
  
  ngOnInit() {
    this.popularLists();
    if (this.rowId == null) {
      this.modalTitle = "Nova";
      this.isDataAvailable = true;
    } else {
      this.modalTitle = "Editar";
      this.showForm();
      // consoleLog("voltou"));
    }
  }

  ngAfterViewInit(){
    this._script.load('empresa-form',
    'assets/demo/default/custom/components/forms/widgets/select2.js');
  }

  onSubmit(form) {
    consoleLog(form.value);
    consoleLog(this.empresa);
    var header = new HttpHeaders();
    header.append('Content-Type', 'application/json');
    var body = (this.empresa);
    consoleLog("booody:")
    // if(body.funcionario_ids != undefined) {body.funcionario_ids = body.funcionario_ids.map(f => parseInt(f,10))}
    body.funcionario_ids = [];
    if(body.responsavel_id != undefined) {
      body.responsavel_id = parseInt(body.responsavel_id,10)
      if(body.funcionario_ids != undefined){
        if (!body.funcionario_ids.includes(body.responsavel_id)){
          body.funcionario_ids.push(body.responsavel_id);
        }
      }
    }
    body.funcionario_emails = Array.apply(null,this.funcionarios.nativeElement)  // convert to real Array
    .filter(option => option.selected)
    .map(option => (option.text))


    consoleLog("body enviado ao form");
    consoleLog(body);
    if (this.rowId == null) {
      this.postForm(header, body);
    } else {
      this.putForm(header, body);
    }
  }

  postForm(header, body) {
    this.http.post(`${this.apiUrl}.json`,
      body, { headers: header, observe: 'response'})
      .subscribe(
        (response) => this.modalService.tratarSucesso(response, this.activeModal),
        (error: any) => this.modalService.tratarError(error)
      );
  }

  putForm(header, body) {
    this.http.put(`${this.apiUrl}/${this.rowId}.json`,
      body, { headers: header, observe: 'response' })
      .subscribe(
      (response) => this.modalService.tratarSucesso(response, this.activeModal),
      (error: any) => this.modalService.tratarError(error)
      );
  }

  showForm() {
    

    return this.http.get(`${this.apiUrl}/${this.rowId}.json`)
      .subscribe((dados:any)=>{
        consoleLog("recebeu os dados. mask dinamico:")
        consoleLog(this.maskDinamico);
        // this.maskDinamico = "000.000.000-009";
        // if (dados.tipo_pessoa != undefined && dados.tipo_pessoa == "PF"){
        //   this.maskDinamico = "000.000.000-009";
        // }else{
        //   this.maskDinamico = "00.000.000/0000-00";
        // }
        this.empresa = dados;
        this.setParticipantes(dados.funcionarios)
        this.isDataAvailable = true}
      );
  }

  setParticipantes(funcionarios){
    var values:string[] = [];
    for (var i = 0; i<funcionarios.length;i++){
      // this.http.get(`${this.domainService.getApiUrl()}/funcionarios/${this.reserva.funcionario_ids[i]}.json`)
      // .subscribe(
      //   dados => {
          var par = document.createElement("option");
          par.text = `${funcionarios[i].name}`;
          par.value = `${funcionarios[i].value}`;
          par.selected = true;
          this.funcionarios.nativeElement.add(par);
          // values.push(par.value);
        // });
    };
  }

  popularLists() {
    Helpers.setLoading(true);
    consoleLog("popular list mepresa:");
    this.http.get(`${this.domainService.getApiUrl()}/funcionarios/listb.json`)
    .subscribe(
      dados => {this.listFuncionario = (<any>dados).funcionarios
      consoleLog(this.listFuncionario);}
    ).add(()=>{
      this.http.get(`${this.domainService.getApiUrl()}/localizacoes/listb.json`)
      .subscribe(
        dados => {this.listLocalizacao = (<any>dados).localizacoes
        consoleLog(this.listLocalizacao)}
      ).add(()=>{
        Helpers.setLoading(false);
        this.isListAvailable = true;
      });
    })
  }

  verificarValidacoesForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(campo => {
      let control = formGroup.get(campo);
      control.markAsDirty();
      if (control instanceof FormGroup) {
        this.verificarValidacoesForm(control);
      }
    })
  }

  validarCss(control) {
    return {
      // 'has-danger': this.formulario.get(control).touched
      //   && this.formulario.get(control).invalid,
      // 'has-success': this.formulario.get(control).touched
      //   && this.formulario.get(control).valid
    }
  }

  // contemUnidade(uId){
  //   // this.empresa.unidades_ids
  //   var flag = false;
  //   // while(this.unidadesReady == false){ }
  //   if (this.empresa.unidade_ids != null){
  //     flag = this.empresa.unidade_ids.includes(uId);
  //     consoleLog(flag);
  //   }else{
  //     consoleLog("tá vazio")
  //   }
  //   return flag;
  // }

  checkResidente() {
    this.empresa.empresas_localizacoes_attributes[0].residente = !this.empresa.empresas_localizacoes_attributes[0].residente;
    // this.empresa.residente = this.formulario.controls.instalado.value);
  }

  radioRole(tipo) {
  }

  // setarUnidade(u){
  //   consoleLog("ciau aqui");
  //   consoleLog(u.target.value);
  //   // var ovo:any[] = this.formulario.controls.unidades.value;
  //   var i = ovo.indexOf(u);
  //   if (i > -1){
  //     ovo.splice(i,1);
  //   }else{
  //     ovo.push(u);
  //   }
  //   consoleLog(ovo);
  //   this.formulario.controls.unidades.setValue(ovo);
  //   consoleLog(this.formulario.controls.unidades);
  // }

  // checkUnidade(u){
  //   var ovo:any[] = this.formulario.controls.unidades.value;
  //   return ovo.indexOf(u) > -1
  // }
  // maskDinamicoInit(){
  //   if (this.empresa.num_cadastro_pessoa == undefined) {return this.maskDinamico}
  //   if (this.empresa.num_cadastro_pessoa.length > 11){
  //     this.empresa.tipo_pessoa = "PJ";
  //     this.maskDinamico = "00.000.000/0000-00";
  //   }else{
  //     this.empresa.tipo_pessoa = "PF";
  //     this.maskDinamico = "000.000.000-009";
  //   }
  //   return this.maskDinamico;
  // }
  
  cnpj_cpf_dinamico(value){
      // if (this.empresa.num_cadastro_pessoa != undefined && this.empresa.num_cadastro_pessoa.length > 11){
      if (value != undefined && value.length > 14){
      this.empresa.tipo_pessoa = "PJ";
        this.maskDinamico = "00.000.000/0000-00";
      }else{
        this.empresa.tipo_pessoa = "PF";
        this.maskDinamico = "000.000.000-009";
      }
      // return this.maskDinamico;
    // }else{
    //   return "";
    //   if (this.empresa.num_cadastro_pessoa == undefined){return "00.000.000/0000-00"}
    //   else if(this.empresa.num_cadastro_pessoa.length > 11){
    //     this.empresa.tipo_pessoa = "PJ";
    //     return "00.000.000/0000-00";
    //   }else{
    //     this.empresa.tipo_pessoa = "PF";
    //     return "000.000.000-009"
    //   }
    // }
  }

  consultaCEP(cep){
    var cep = cep.replace(/\D/g, '');

    if (cep != ""){
      var validacep = /^[0-9]{8}$/;

      if (validacep.test(cep)){
        var h = new HttpHeaders;
        h.append("Access-Control-Allow-Origin", "*");
        h.append('Content-Type', 'application/json')
        this.http.get(`https://viacep.com.br/ws/${cep}/json`, {headers: h})
          .subscribe(response =>{
            var dados:any = response;
            this.empresa.logradouro = dados.logradouro;
            this.empresa.municipio = dados.localidade;
            this.empresa.uf = dados.uf;
            this.empresa.bairro = dados.bairro;
          });
      }
    }
  }
}
