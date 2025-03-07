import { OnInit, AfterViewChecked, ChangeDetectorRef, destroyPlatform, OnDestroy, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl, AbstractControl, Validator } from '@angular/forms';
import { FormService } from '../../_services/form.service';
import { User } from '../../auth/_models';
import { Helpers } from '../../helpers';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { WebService } from '../../_services/web.service';
import { ModalService } from './../../theme/pages/default/modal/modal.service';
import { WorkspaceService } from '../../_services/workspace.service';
import { consoleLog } from '../../globals';
import { HttpClient } from '@angular/common/http';
import { DomainService } from '../../_services/domain.service';
import { HeadersService } from '../../_services/header.service';
import { LoadingService } from '../../_services/loading.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tf-form-base',
  template: ''
})
export abstract class TfFormBaseComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy{
  entidade:string;
  formulario:FormGroup;
  formularioPaiAdicional:FormGroup;
  abas:any[];
  public currentUser: User;
  public formArrayName:string;
  public listDadosSelect={};
  public listCarousel;
  public rowId: number;
  public modalAdicional: boolean = false;
  public subscriptions: Subscription =  new Subscription();
  public formService: FormService;

  //#region inicializações
  constructor(
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    public modalNgb: NgbModal,
    public webService: WebService,
    public workspaceService: WorkspaceService,
    public changeDetectorRef: ChangeDetectorRef,
    public modalService: ModalService,
    protected http: HttpClient,
    private domainService: DomainService,
    private headersService: HeadersService,
    private loadingService: LoadingService,
    public renderer:Renderer2,
    public element:ElementRef
    ) {
    this.currentUser = this.workspaceService.currentUser;
    Helpers.setLoading(true);
    this.formService = new FormService(this.http,this.domainService,this.modalService,this.formBuilder,this.headersService, this.loadingService)
  }

  childInit(){};

  ngOnInit(){
    this.changeDetectorRef.detectChanges();
    this.childInit();
    this.inicializarFormService();
    // this.initFormArrayRows(); // Inicialização das linhas do form dinâmico
    if (this.rowId != null && !this.modalAdicional){
      this.editForm();
    }
    this.popularLists();
    
  }

  ngAfterViewInit(): void {
    this.renderer.addClass(this.element.nativeElement.parentElement, 'animated-50')
    this.renderer.addClass(this.element.nativeElement.parentElement, 'fadeIn');
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
    // this.renderer.addClass(this.element.nativeElement.parentElement, 'zoomOutDown');
    // this.renderer.addClass(this.element.nativeElement.parentElement, 'animated')
  }

  inicializarFormService(){
    this.formService.inicializar(
      this.entidade,
      this.formulario,
      this.activeModal,
      this.listDadosSelect
    );    
  }

  ngAfterViewChecked(){
    if (!this.rowId && Object.entries(this.listDadosSelect).length === 0){
      Helpers.setLoading(false);
    }
  }

  //#endregion

  //#region formService

  editForm() {
    consoleLog("É aqui miseravi!")
    this.formService.edit(`${this.rowId}/edit`, this.listCarousel);
  }

  onSubmit() {
    this.loadingService.addRequest();
    this.formulario.updateValueAndValidity();
    if(this.modalAdicional == false){
      consoleLog("form service zuado né?")
      consoleLog(this.formService.entidade_nome);
      this.formService.save(this.listCarousel);
    }else{
      this.activeModal.close(this.formulario);
      this.loadingService.removeRequest();
    }
  }

  removeItem(emLote?) {
    this.formService.remove(this.rowId, emLote)
  }

  resetar() {
    this.formulario.reset();
  }

  popularLists(){
    this.formService.popularLists();
  }

  //#endregion

  //#region Validações

  aplicaCss(campo: string) {
    let c = this.formulario.get(campo);
    if (c){
      return this.aplicaCssCampo(c);
    }
  }

  aplicaCssItemRow(campo: string, pai, index) {
    // consoleLog(campo);
    // consoleLog(pai);
    // consoleLog(index);
    let c = pai.controls[campo];
    if(c){
      return this.aplicaCssCampo(c);
    }
  }

  aplicaCssCampo(c: AbstractControl){
    return {
      'has-danger': this.verificaValidTouched(c),
      'has-success': this.success(c)
    };
  }

  success(campo){
    return campo.touched && campo.valid;
  }

  verificaValidTouched(campo) {
    return campo.invalid && (campo.touched || campo.dirty);
  }

  //#endregion

  //#region formArray
// formArrayPai:FormArray,
  definirComoModalAdicional(formInitRow){
    this.modalAdicional = true;
    if (formInitRow){
      this.formulario = formInitRow;
      // this.rowId = form.value.id;
      // this.
    }else{
      // formArrayPai.controls.push(this.formulario)
      this.rowId = null;
    }

  }

  initFormArrayName(formArrayName){
    this.formArrayName = formArrayName;
    return this.formBuilder.array([]);
  }

  initFormArrayRows(){
    if (this.rowId){
    }else{
      this.formulario.controls[this.formArrayName] = this.formBuilder.array([this.initItemRows()]);
    }
  }

  initItemRows(){return null}

  get formArray(){
    return this.formulario.get(this.formArrayName) as FormArray;
  }

  addNewRow() {
    this.formArray.push(this.initItemRows());
  }
  
  habilitarRow(itemrow, rowId?):boolean{
    if (rowId){
    if (!itemrow.value.new_record){ // EXISTE
      if (itemrow.value._destroy){ // EXCLUIR
        // consoleLog("Entrou no EXISTE EXCLUIR")
        // consoleLog(itemrow.value.new_record)
        // consoleLog(itemrow.value._destroy)
        return false
      } else { // EXIBIR
        // consoleLog("Entrou no EXISTE EXIBIR")
        // consoleLog(itemrow.value.new_record)
        // consoleLog(itemrow.value._destroy)
        return true
      }
    } else { // NÃO EXISTE
      if (itemrow.value._destroy){ // EXCLUIR
        // consoleLog("Entrou no NÃO EXISTE EXCLUIR")
        // consoleLog(itemrow.value.new_record)
        // consoleLog(itemrow.value._destroy)
        return false
      } else { // EXIBIR
        // consoleLog("Entrou no NÃO EXISTE EXIBIR")
        // consoleLog(itemrow.value.new_record)
        // consoleLog(itemrow.value._destroy)
        return true;
      }
    }
  } else {
    if (!itemrow.value.new_record){ // EXISTE
      if (itemrow.value._destroy){ // EXCLUIR
        return false
      } else { // EXIBIR
        return true
      }
    } else { // NÃO EXISTE
      if (itemrow.value._destroy){ // EXCLUIR
        return false
      } else { // EXIBIR
        return true;
      }
    }
  }
  }

  restoreRow(index:number){ 
    var itemControl = this.formArray.controls[index].value
    if (!!!itemControl.new_record){
      itemControl._destroy = false;
      this.formArray.controls[index].setValue(itemControl);
    }
  }

  deleteRow(itemrow, index){
    consoleLog(itemrow.value);
    consoleLog(index);
    consoleLog(itemrow.value.new_record)
    consoleLog(itemrow.value._destroy)
    consoleLog(this.formulario);
    consoleLog(this.formArray);
    consoleLog("quem é rowId?")
    consoleLog(this.rowId);
    if (this.rowId){
      if (itemrow.value.new_record == false){
        itemrow.value._destroy = true;
        consoleLog(itemrow.value.new_record)
        consoleLog(itemrow.value._destroy)
        consoleLog(this.formulario);
        consoleLog(this.formArray); 
      } else {
        this.formArray.removeAt(index);
        consoleLog(itemrow.value.new_record)
        consoleLog(itemrow.value._destroy)
        consoleLog(this.formulario);
        consoleLog(this.formArray);
      }
    } else {
      this.formArray.removeAt(index);
    }

    // consoleLog("formulario e formArray Antes de deletar");
    // consoleLog(this.formulario.value.instalacoes_attributes);
    // consoleLog(this.formArray);
    // consoleLog(this.formulario);
    // // acessar o formulario na posição Index, e caso o item não seja new_record, setar _destroy:true
    // // var item = (<any[]>this.formulario.value.instalacoes_attributes)[index]
    // // consoleLog(item);
    // // (<any[]>this.formulario.value.instalacoes_attributes).find(index)
    // consoleLog("remove At formarray")
    // // this.formArray.removeAt(index);
    // consoleLog("recuperando o var item para retroalimentar");
    // // this.formulario.get("instalacoes_attributes")
    // // consoleLog("index passado por parâmetro")
    // // consoleLog(index)
    // // var objeto = this.formArray.at(index)
    // // consoleLog("valor do _destroy antes")
    // // consoleLog(objeto.value._destroy)
    // var itemControl = this.formArray.controls[index].value
    // if (!!!itemControl.new_record){
    //   itemControl._destroy = true;
    // }
    // this.formArray.controls[index].setValue(itemControl)
    // // this.formArray.controls.forEach((f, i) => {
    // //   consoleLog("f");
    // //   consoleLog(f);
    // //     if (!!!f.value.new_record){
    // //       // this.formArray.removeAt(i);
    // //     // }else{         
    // //       f.value._destroy = true;
    // //     }
    // // });
    // // consoleLog("valor do _destroy depois")
    // // consoleLog(objeto.value._destroy)
    // consoleLog("formulario e formArray após de deletar");
    // consoleLog(this.formulario.value.instalacoes_attributes);
    // consoleLog(this.formArray);
    // consoleLog(this.formulario);
  }

  prepararFormArraySelectMultiplo(validators:Validators[]){
    let formArray = this.formBuilder.array([])
    // if (validators){
    //   validators.forEach((v:Validators)=>{
      formArray.setValidators(Validators.required);
    //   })
    // }
    return formArray;
  }

  prepararFormArraySelectMultiploSemRequired(){
    let formArray = this.formBuilder.array([])
    // if (validators){
    //   validators.forEach((v:Validators)=>{
      // formArray.setValidators(Validators.required);
    //   })
    // }
    return formArray;
  }

  //#endregion

  //#region codigos antigos da Loiane

  // primeiraAbaValida?(){
    //   return this.formulario.controls[primeiro_campo].valid &&
    //   this.formulario.controls[segundo].valid
    // }

    // segundaAbaValida?(){
      //   return this.formulario.controls[tercerios_campos].valid &&
      //   this.formulario.controls[quarto_campo].valid
      // }

      // verificaRequired(campo: string) {
        //   return (
          //     this.formulario.get(campo).hasError('required') &&
          //     (this.formulario.get(campo).touched || this.formulario.get(campo).dirty)
  //   );
  // }

  // verificarValidacoesForm(formGroup: FormGroup) {
    //   Object.keys(formGroup.controls).forEach(campo => {
      //     let control = formGroup.get(campo);
      //     control.markAsDirty();
      //     if (control instanceof FormGroup) {
        //       this.verificarValidacoesForm(control);
        //     }
        //   })
        // }

        // validarCss(control) {
          //   return {
  //     'has-danger': this.formulario.get(control).touched
  //       && this.formulario.get(control).invalid,
  //     'has-success': this.formulario.get(control).touched
  //       && this.formulario.get(control).valid
  //   }
  // }

  // verificaValidacoesForm(formGroup: FormGroup | FormArray) {
    //   Object.keys(formGroup.controls).forEach(campo => {
      //     consoleLog(campo);
      //     const controle = formGroup.get(campo);
      //     controle.markAsDirty();
      //     controle.markAsTouched();
      //     if (controle instanceof FormGroup || controle instanceof FormArray) {
        //       this.verificaValidacoesForm(controle);
        //     }
        //   });
        // }

        // verificaEmailInvalido() {
          //   const campoEmail = this.formulario.get('email');
          //   if (campoEmail.errors) {
            //     return campoEmail.errors['email'] && campoEmail.touched;
            //   }
            // }

            // aplicaCssErro(campo: string) {
  //   return {
  //     'has-error': this.verificaValidTouched(campo),
  //     'has-feedback': this.verificaValidTouched(campo)
  //   };
  // }

  //#endregion

  //#region Carousel

  onRemovedFileCarousel(event, atributo) {
    Helpers.setLoading(true);
    if (this.rowId == null){return;}
    consoleLog(event)
    var filename = event.src.replace(/^.*[\\\/]/, '');
    consoleLog(filename)
    consoleLog(this.listCarousel[atributo])
    // this.filesDeletePublicidade.push(filename);
    // this.listCarousel[atributo]['fileHolder'] = this.listCarousel[atributo]['fileHolder']
    //   .filter(fh => fh.filename !== filename);
    let newArray = [];
    this.listCarousel[atributo]['fileHolder'].forEach((value, index) => {
      consoleLog("percorrendo lista");
      consoleLog(value.filename);
      if (value.filename == filename){
        consoleLog("achou o cara. vai delletar:")
        consoleLog(value);
        newArray.push(value);
        this.listCarousel[atributo]['fileHolder'].splice(index,1);
        // this.listCarousel[atributo]['fileHolder'].removeItem(fh);
      }
    });

    // this.listCarousel[atributo]['fileHolder'] = newArray;
    consoleLog("tem q ter conseugido remover o item do fileholder");
    consoleLog(this.listCarousel);
    Helpers.setLoading(false);
  }

  atualizarFileList(uploadList, atributo, remove?){
    Helpers.setLoading(true);
    consoleLog("atualizando file list:")
    this.listCarousel[atributo]['fileList'] = uploadList;
    consoleLog(this.listCarousel);

    Helpers.setLoading(false);
  }
  //#endregion
}
