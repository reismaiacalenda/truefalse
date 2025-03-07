import { OnInit, AfterViewChecked, Input, OnChanges, SimpleChange, ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { FormService } from '../../_services/form.service';
import { User } from '../../auth/_models';
import { Helpers } from '../../helpers';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WorkspaceService } from '../../_services/workspace.service';
import { consoleLog } from '../../globals';
import { LoadingService } from '../../_services/loading.service';
// import { WebService } from 'src/app/_services/web.service';

@Component({
  template: ''
})
export abstract class TfFormModalBaseComponent implements AfterViewChecked, OnChanges {
  currentUser: User
  @Input() formGroup: FormGroup;
  @Input() rowId: number;
  @Input() entidade:string;
  @Input() label:string;
  @Input() listDadosSelect:any = {};
  public formulario: FormGroup;
  public modalTitle: string;
  public formArrayName:string;
  
  // abstract initialize();
  
  constructor(
    public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    public workspaceService: WorkspaceService,
    protected changeDetectorRef:ChangeDetectorRef,
    public loadingService: LoadingService
    
    // public webService: WebService
    // public modalNgb: NgbModal
    ) {
    this.currentUser = this.workspaceService.currentUser;
    // Helpers.setLoading(true);
    // this.initialize();
    // this.datatable = this.datatableService.datatable;
  // }


  // superInitialize(entidade, listDadosSelect, formArrayName?){
    // this.entidade = entidade;
    // listDadosSelect.forEach(e=>{
    //   this.listDadosSelect[e] = [];
    // })
    // if (formArrayName){
    //   this.formArrayName = formArrayName;
    // }
    // listDadosSelect.forEach(e=>{
    //   var item = {nome: e, data: []}
    //   this.listDadosSelect.push(item);
    // })
  };

  ngOnChanges(changes: { [propName: string]: SimpleChange }){
    // if (changes.formulario.isFirstChange()){
  //     this.formulario = this.formGroup;
  //     this.formService.inicializar(this.entidade, this.formulario, this.activeModal, this.listDadosSelect);
  //     Helpers.setLoading(false);
  //     this.popularLists();
  //     // }

  //   // }
  // // ngOnInit() {
  //   if (this.rowId == null) {
  //     this.modalTitle = `Criar ${this.label}`;
  //   } else {
  //     this.modalTitle = `Editar ${this.label}`;
  //     this.showForm();
  //   }

  }

  ngAfterViewChecked(){
    // if (!this.rowId && Object.entries(this.listDadosSelect).length === 0){
    //   Helpers.setLoading(false);
    // }
  }

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

  // onSubmit() {
  //   if (this.formulario.valid) {
  //     this.submit();
  //   } else {
  //     consoleLog('formulario invalido');
  //     this.verificaValidacoesForm(this.formulario);
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

}
