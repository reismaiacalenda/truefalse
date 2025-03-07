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
import { PessoaFormPessoasComponent } from './pessoa-form-pessoas/pessoa-form-pessoas.component';
import { WorkspaceService } from '../../../../../../_services/workspace.service';
import { ReservaModalService } from '../../reserva-modal/reserva-modal.service';
// import { PessoaFormComponent } from './pessoa-form/pessoa-form.component';
import { consoleLog } from '../../../../../../globals';
import { ActivatedRoute } from '@angular/router';
import { CheckModalService } from '../../checks-modal/check-modal.service';
import { Subscription } from 'rxjs';
import { ImportarAgendaService } from '../../../../../../_services/importar-agenda.service';

// declare function bindPessoa(): any;
// declare function closePessoa(): any;

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./quadro-pessoas.component.html",
  encapsulation: ViewEncapsulation.None,
})

export class PessoaComponent implements OnInit, OnDestroy {
  // apiUrl: string;
  atual_reserva_id;
  grupos: any[];
  formularioPessoas: any;
  dataSelecionada: any;
  public currentUser: User;
  public formArrayName:string;
  flagInicioInscricao = false;
  // public dia = (new Date).toLocaleDateString("PT");

  private subscriptions: Subscription = new Subscription();

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
    public workspaceService:WorkspaceService,
    public importarAgendaService:ImportarAgendaService
    ){
      this.currentUser = this.workspaceService.currentUser;
    }
    // @Inject(DOCUMENT) private document: any
    // ) {
    // this.apiUrl = `${this.domainService.getApiUrl()}/pessoas`;
    // }

  formulario= this.formBuilder.group({
    data: [(new Date).toLocaleDateString("PT")],
    // pessoas: this.formBuilder.array([])
  })

  // openFormModal(rowId?: string) {
  //   let ngbModalOptions: NgbModalOptions={
  //         backdrop: 'static',
  //         keyboard: false
  //     }
  //   const modalRef = this.modalNgb.open(PessoaFormComponent, ngbModalOptions);
  //   modalRef.componentInstance.rowId = rowId;
  //   modalRef.result.then((responseSuccess) => {
  //   // consoleLog("Como está vindo o console success")
  //   // consoleLog(responseSuccess)
  //     if (responseSuccess) {
  //       this.carregarPessoa();
  //     // consoleLog("Passou pela chamada do carregarPessoa")
  //     }
  //   })
  // }

  openModalPessoas(rowId?: string) {
    let ngbModalOptions: NgbModalOptions={
          backdrop: 'static',
          keyboard: false
      }
    const modalRef = this.modalNgb.open(PessoaFormPessoasComponent, ngbModalOptions);
    if (this.formularioPessoas){
      modalRef.componentInstance.formulario = this.formularioPessoas;
    }
    modalRef.result.then((formularioModal) => {
    // consoleLog("Como está vindo o console responseSuccess")
    // consoleLog(formularioModal)
      if (formularioModal) {
      // consoleLog("Entrou no If")
        // this.pessoas = responseSuccess.value.pessoas_attributes;
      // consoleLog("this.formulario.get('pessoas')")
      // consoleLog(this.formularioPessoas)
        this.formularioPessoas = formularioModal;
      // consoleLog("this.formulario.get('pessoas')");
      // consoleLog(this.formularioPessoas);
        this.carregarPessoa();
      // consoleLog("Passou pela chamada do carregarPessoa")
      }
    })
  }

  ngOnInit() {
    // this.observarImportarAgenda();
    var qrPessoaId = this.route.snapshot.queryParams['p'] || '/';
    if (qrPessoaId != '/'){
      this.webService.get(`checks/new?pessoa_id=${qrPessoaId}`)
        .subscribe(response=>{
        // consoleLog(response);
          //TODO: verificiar priemiro se existe a key check_type. nao sei se esse if funciona de prima.
          if (response['check_type'] == "in" || response['check_type']=="out"){
            this.checkModalService.fabricarModalCheck(response)
            .subscribe(()=>{
              this.carregarPessoa();
            })
          }else {
            this.reservaModalService.fabricarAssessorista('simples', 'qrcode_check_on', response)
            .subscribe(()=> {
              this.carregarPessoa();
            })
          }
          Helpers.setLoading(false)
        },
        (error: any) => {
          this.modalService.tratarError(error)
          Helpers.setLoading(false);
        });
    }else{
      this.carregarPessoa();
    }
    // this.switchModal(atob(q).split(","));
  }

  carregarPessoa() {
    Helpers.setLoading(true);
  // consoleLog("Entrou no carregarPessoa")
    // let params = new HttpParams().set("data",this.data).set("unidade",'2');
    // pessoas: this.formulario.get('pessoas').value
    var body = {
      data: this.formulario.get('data').value,
      unidade: 2
    }
    if (this.formularioPessoas){
      // JSON.stringify()
      body["pessoas"] = this.formularioPessoas.get("pessoas_attributes").value
    }
  // consoleLog(body);
  // consoleLog("Data enviada no carregarPessoa")
  // consoleLog(this.formulario.get('data').value)
  // consoleLog("Pessoas enviado no carregarPessoa")
  // consoleLog(this.formularioPessoas)
    // consoleLog(this.formulario.get('pessoas').value)
    this.webService.put(`funcionarios/quadro`, body)
       .subscribe(
         dados => {
          this.grupos = dados.body.grupos
        // consoleLog("Como está vindo o dados do pessoa")
        // consoleLog(dados)
        // consoleLog("Como está vindo o dados.servicos do pessoa")
        // consoleLog(this.grupos)
          // this.atual_reserva_id = dados.body.servicos.pessoas.atual_reserva_id
          // consoleLog("Como está vindo o 'atual_reserva_id' do pessoa")
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

  observarImportarAgenda(){
    this.subscriptions.add(
      this.importarAgendaService.observarImportacao$
        .subscribe((item)=>{
          if (this.flagInicioInscricao == false){
            this.flagInicioInscricao = true;
          }else {
            this.carregarPessoa();
          }
        })
    )
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
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