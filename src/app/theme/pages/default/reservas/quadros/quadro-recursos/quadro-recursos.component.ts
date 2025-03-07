import { Component, OnInit, ViewEncapsulation, Inject, OnDestroy, EventEmitter, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../../helpers';
import { DomainService } from '../../../../../../_services/domain.service';
import { ModalService } from '../../../modal/modal.service';
import { DOCUMENT } from "@angular/common";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NgbModalOptions, NgbModal, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { WebService } from '../../../../../../_services/web.service';
import { User } from '../../../../../../auth/_models/user';
import { FormBuilder, FormArray } from '@angular/forms';
import { RecursoFormRecursosComponent } from './recurso-form-recursos/recurso-form-recursos.component';
import { WorkspaceService } from '../../../../../../_services/workspace.service';
import { ReservaModalService } from '../../reserva-modal/reserva-modal.service';
// import { RecursoFormComponent } from './recurso-form/recurso-form.component';
import { consoleLog } from '../../../../../../globals';
import { ActivatedRoute } from '@angular/router';
import { CheckModalService } from '../../checks-modal/check-modal.service';

// declare function bindRecurso(): any;
// declare function closeRecurso(): any;

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./quadro-recursos.component.html",
  encapsulation: ViewEncapsulation.None,
})

export class RecursoComponent implements OnInit, OnDestroy {
  // apiUrl: string;
  atual_reserva_id;
  servicos: any[];
  formularioRecursos: any;
  dataSelecionada: any;
  public currentUser: User;
  public formArrayName:string;
  // public dia = (new Date).toLocaleDateString("PT");

  constructor(
    // private domainService: DomainService,
    // private calendar: NgbCalendar,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private modalNgb: NgbModal,
    private reservaModalService: ReservaModalService,
    private checkModalService: CheckModalService,
    private webService: WebService,
    public modalService: ModalService,
    public workspaceService:WorkspaceService 
    ){
      this.currentUser = this.workspaceService.currentUser;
  }
    // @Inject(DOCUMENT) private document: any
    // ) {
    // this.apiUrl = `${this.domainService.getApiUrl()}/recursos`;
    // }

  formulario= this.formBuilder.group({
    data: [(new Date).toLocaleDateString("PT")],
    // recursos: this.formBuilder.array([])
  })

  // openFormModal(rowId?: string) {
  //   let ngbModalOptions: NgbModalOptions={
  //         backdrop: 'static',
  //         keyboard: false
  //     }
  //   const modalRef = this.modalNgb.open(RecursoFormComponent, ngbModalOptions);
  //   modalRef.componentInstance.rowId = rowId;
  //   modalRef.result.then((responseSuccess) => {
  //   // consoleLog("Como está vindo o console success")
  //   // consoleLog(responseSuccess)
  //     if (responseSuccess) {
  //       this.carregarRecurso();
  //     // consoleLog("Passou pela chamada do carregarRecurso")
  //     }
  //   })
  // }

  openModalRecursos(rowId?: string) {
    let ngbModalOptions: NgbModalOptions={
          backdrop: 'static',
          keyboard: false
      }
    const modalRef = this.modalNgb.open(RecursoFormRecursosComponent, ngbModalOptions);
    if (this.formularioRecursos){
      modalRef.componentInstance.formulario = this.formularioRecursos;
    }
    modalRef.result.then((formularioModal) => {
    // consoleLog("Como está vindo o console responseSuccess")
    // consoleLog(formularioModal)
      if (formularioModal) {
      // consoleLog("Entrou no If")
        // this.recursos = responseSuccess.value.recursos_attributes;
      // consoleLog("this.formulario.get('recursos')")
      // consoleLog(this.formularioRecursos)
        this.formularioRecursos = formularioModal;
      // consoleLog("this.formulario.get('recursos')");
      // consoleLog(this.formularioRecursos);
        this.carregarRecurso();
      // consoleLog("Passou pela chamada do carregarRecurso")
      }
    })
  }

  ngOnInit() {
    var qrEspacoId = this.route.snapshot.queryParams['e'] || '/';
    if (qrEspacoId != '/'){
      this.webService.get(`checks/new?recurso_id=${qrEspacoId}`)
        .subscribe(response=>{
        // consoleLog(response);
          //TODO: verificiar priemiro se existe a key check_type. nao sei se esse if funciona de prima.
          if (response['check_type'] == "in" || response['check_type']=="out"){
            this.checkModalService.fabricarModalCheck(response)
            .subscribe(()=>{
              this.carregarRecurso();
            })
          }else {
            this.reservaModalService.fabricarAssessorista('simples', 'qrcode_check_on', response)
            .subscribe(()=> {
              this.carregarRecurso();
            })
          }
          Helpers.setLoading(false)
        },
        (error: any) => {
          this.modalService.tratarError(error)
          Helpers.setLoading(false);
        });
    }else{
      this.carregarRecurso();
    }
    // this.switchModal(atob(q).split(","));
  }

  carregarRecurso() {
    Helpers.setLoading(true);
  // consoleLog("Entrou no carregarRecurso")
    // let params = new HttpParams().set("data",this.data).set("unidade",'2');
    // recursos: this.formulario.get('recursos').value
    var body = {
      data: this.formulario.get('data').value,
      unidade: 2
    }
    if (this.formularioRecursos){
      // JSON.stringify()
      body["recursos"] = this.formularioRecursos.get("recursos_attributes").value
    }
  // consoleLog(body);
  // consoleLog("Data enviada no carregarRecurso")
  // consoleLog(this.formulario.get('data').value)
  // consoleLog("Recursos enviado no carregarRecurso")
  // consoleLog(this.formularioRecursos)
    // consoleLog(this.formulario.get('recursos').value)
    this.webService.put(`recursos/quadro`, body)
       .subscribe(
         dados => {
          this.servicos = dados.body.servicos
        // consoleLog("Como está vindo o dados do recurso")
        // consoleLog(dados)
        // consoleLog("Como está vindo o dados.servicos do recurso")
        // consoleLog(this.servicos)
          // this.atual_reserva_id = dados.body.servicos.recursos.atual_reserva_id
          // consoleLog("Como está vindo o 'atual_reserva_id' do recurso")
          // consoleLog(this.atual_reserva_id)
          Helpers.setLoading(false)
         },
         (error: any) => {
           this.modalService.tratarError(error)
           Helpers.setLoading(false);
         }
       )
  }

  configTelaReserva(){
    this.reservaModalService.configTelaReserva()
  }

  parametrizacoes(){
    this.reservaModalService.parametrizacoes()
  }

  ngOnDestroy() {
  }

  alteracaoCollapse(event){
    Helpers.setLoading(true);
    var elementI = event.target.querySelector('i');
    var elementFoco = event.target;
    if (elementI != null){
      if (elementI.classList.contains('la-angle-down')){
          elementI.classList.remove('la-angle-down');
          elementI.classList.add('la-angle-right');
      } else{
          elementI.classList.remove('la-angle-right');
          elementI.classList.add('la-angle-down');
      }
    } else{
      if (elementFoco.classList.contains('la-angle-down')){
        elementFoco.classList.remove('la-angle-down');
        elementFoco.classList.add('la-angle-right');
      } else{
        elementFoco.classList.remove('la-angle-right');
        elementFoco.classList.add('la-angle-down');
      }
    }
    Helpers.setLoading(false);
  }
  
  carregarReservas() {
    throw new Error('Method not implemented.');
  }

}