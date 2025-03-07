import { Component, OnInit, ViewEncapsulation, Inject, OnDestroy, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Helpers } from '../../../../../../helpers';
import { DomainService } from '../../../../../../_services/domain.service';
import { ModalService } from '../../../modal/modal.service';
import { DOCUMENT } from "@angular/common";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NgbModalOptions, NgbModal, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { WebService } from '../../../../../../_services/web.service';
import { User } from '../../../../../../auth/_models/user';
import { FormBuilder, FormArray } from '@angular/forms';
import { QuadroFormAmenitiesComponent } from '../../filtros-visualizacao/quadro-form-amenities/quadro-form-amenities.component';
import { WorkspaceService } from '../../../../../../_services/workspace.service';
import { ReservaModalService } from '../../reserva-modal/reserva-modal.service';
// import { QuadroFormComponent } from './quadro-form/quadro-form.component';
import { consoleLog } from '../../../../../../globals';
import { ActivatedRoute } from '@angular/router';
import { CheckModalService } from '../../checks-modal/check-modal.service';
import { ImportarAgendaService } from '../../../../../../_services/importar-agenda.service';
import { Subscription } from 'rxjs';
import moment from 'moment';
// declare function bindQuadro(): any;
// declare function closeQuadro(): any;

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./quadro-espacos.component.html",
  encapsulation: ViewEncapsulation.None,
})

export class QuadroComponent implements OnInit, OnDestroy {
  // apiUrl: string;
  isMobile:boolean = Helpers.isMobile();
  atual_reserva_id;
  cards: any[];
  formularioAmenities: any;
  dataSelecionada: any;
  salas:boolean = true;
  mesas:boolean = false;
  categoria = 0;
  flagInicioInscricao = false;
  primeiroHoraInicio = moment().format('HH:mm')
  primeiroHoraFim = moment().hour(parseInt(this.primeiroHoraInicio)+1).startOf('hour').format('HH:mm')
  timeoutID;

  public currentUser: User;
  public formArrayName:string;
  // public dia = (new Date).toLocaleDateString("PT");

  subscriptions:Subscription = new Subscription();

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
    public importarAgendaService: ImportarAgendaService 
    ){
      this.currentUser = this.workspaceService.currentUser;
    }
    // @Inject(DOCUMENT) private document: any
    // ) {
    // this.apiUrl = `${this.domainService.getApiUrl()}/espacos`;
    // }

  date = new Date;
  formulario= this.formBuilder.group({
    data: [this.date.toLocaleDateString("PT")],
    horaInicio: [this.primeiroHoraInicio],
    horaFim: [((this.primeiroHoraFim != '00:00') ? this.primeiroHoraFim : '23:59')],
    capacidadePessoas: ['']
    // recursos: this.formBuilder.array([])
  })

  // openFormModal(rowId?: string) {
  //   let ngbModalOptions: NgbModalOptions={
  //         backdrop: 'static',
  //         keyboard: false
  //     }
  //   const modalRef = this.modalNgb.open(QuadroFormComponent, ngbModalOptions);
  //   modalRef.componentInstance.rowId = rowId;
  //   modalRef.result.then((responseSuccess) => {
  //     consoleLog("Como está vindo o console success")
  //     consoleLog(responseSuccess)
  //     if (responseSuccess) {
  //       this.carregarQuadro();
  //       consoleLog("Passou pela chamada do carregarQuadro")
  //     }
  //   })
  // }

  openModalAmenities(rowId?: string) {
    let ngbModalOptions: NgbModalOptions={
          backdrop: 'static',
          keyboard: false
      }
    const modalRef = this.modalNgb.open(QuadroFormAmenitiesComponent, ngbModalOptions);
    if (this.formularioAmenities){
      modalRef.componentInstance.formulario = this.formularioAmenities;
    }
    modalRef.result.then((formularioModal) => {
      consoleLog("Como está vindo o console responseSuccess")
      consoleLog(formularioModal)
      if (formularioModal) {
        consoleLog("Entrou no If")
        // this.recursos = responseSuccess.value.recursos_attributes;
        consoleLog("this.formulario.get('recursos')")
        consoleLog(this.formularioAmenities)
        this.formularioAmenities = formularioModal;
        consoleLog("this.formulario.get('recursos')");
        consoleLog(this.formularioAmenities);
        this.carregarQuadro();
        consoleLog("Passou pela chamada do carregarQuadro")
      }
    })
  }

  ngOnInit() {
    this.habilitarSalasMesasSegundoModulo();
    // this.observarImportarAgenda();
    var qrEspacoId = this.route.snapshot.queryParams['e'] || '/';
    if (qrEspacoId != '/'){
      this.webService.get(`checks/new?espaco_id=${qrEspacoId}`)
        .subscribe(response=>{
          consoleLog(response);
          //TODO: verificiar priemiro se existe a key check_type. nao sei se esse if funciona de prima.
          if (response['check_type'] == "in" || response['check_type']=="out"){
            this.checkModalService.fabricarModalCheck(response)
            .subscribe(()=>{
              this.carregarQuadro();
            })
          }else{
            if(response['tipo_reserva'] == 'estacoes_flexiveis'){
              this.reservaModalService.fabricarAssessorista('estacoes_flexiveis', 'qrcode_check_on', response)
              .subscribe(()=> {
                this.carregarQuadro();
              })
            }else{
              this.reservaModalService.fabricarAssessorista('simples', 'qrcode_check_on', response)
              .subscribe(()=> {
                this.carregarQuadro();
              })
            }
          }
          Helpers.setLoading(false)
        },
        (error: any) => {
          this.modalService.tratarError(error)
          Helpers.setLoading(false);
          this.carregarQuadro();
        });
    }else{
      this.carregarQuadro();
    }
    // this.switchModal(atob(q).split(","));
  }

  habilitarSalasMesasSegundoModulo(){
    if(!this.workspaceService.currentUser.subdominio.modulos.includes('Smartrooms')){
      this.salas = false;
      this.mesas = true;
    }
    this.setarCategoria();
  }

  filtrarCapacidade(){
    clearTimeout(this.timeoutID);
    
    this.timeoutID = setTimeout(() => {
      this.carregarQuadro();
    }, 500);
  }

  carregarQuadro() {
    Helpers.setLoading(true);
    if(this.formulario.get('capacidadePessoas').value == "0"){
      this.formulario.get('capacidadePessoas').setValue('');
    }
    consoleLog("Entrou no carregarQuadro")
    // let params = new HttpParams().set("data",this.data).set("unidade",'2');
    // recursos: this.formulario.get('recursos').value
    var body = {
      data: this.formulario.get('data').value,
      horaInicio: this.formulario.get('horaInicio').value,
      horaFim: this.formulario.get('horaFim').value,
      capacidadePessoas: this.formulario.get('capacidadePessoas').value,
      unidade: 2,
      categoria: this.categoria
    }
    if (this.formularioAmenities){
      body["amenities"] = this.formularioAmenities.get("amenities_attributes").value
    }
    consoleLog(body);
    consoleLog("Data enviada no carregarQuadro")
    consoleLog(this.formulario.get('data').value)
    consoleLog("Recursos enviado no carregarQuadro")
    consoleLog(this.formularioAmenities)
    // consoleLog(this.formulario.get('recursos').value)
    this.webService.put(`espacos/cards_reserva`, body)
       .subscribe(
         dados => {
          this.cards = dados.body.cards
          consoleLog("Como está vindo o dados do quadro")
          consoleLog(dados)
          consoleLog("Como está vindo o dados.cards do quadro")
          consoleLog(this.cards)
          // this.atual_reserva_id = dados.body.cards.espacos.atual_reserva_id
          // consoleLog("Como está vindo o 'atual_reserva_id' do quadro")
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

  recuperarData(){
    // return this.formulario.get('data').value;
    return "23/06/2021";
  }

  toggleSala(){
    if(!this.workspaceService.currentUser.subdominio.modulos.includes('Hotdesks')){return;}
    this.salas = !this.salas
    if (this.salas == false && this.mesas == false){
      this.mesas = true;
    }
    this.setarCategoria();
    this.carregarQuadro();
  }

  toggleMesa(){
    if(!this.workspaceService.currentUser.subdominio.modulos.includes('Smartrooms')){return;}
    this.mesas = !this.mesas;
    if (this.mesas == false && this.salas == false){
      this.salas = true;
    }
    this.setarCategoria();
    this.carregarQuadro();
  }

  setarCategoria(){
    if(this.mesas == this.salas){
      this.categoria = -1
    }else if (this.salas == true){
      this.categoria = 0;
    }else if (this.mesas == true){
      this.categoria = 1;
    }
  }

  observarImportarAgenda(){
    this.subscriptions.add(
      this.importarAgendaService.observarImportacao$
        .subscribe(item=>{
          if (this.flagInicioInscricao == false){
            this.flagInicioInscricao = true;
          }else {
            this.carregarQuadro();
          }
        })
    )
  }

  carregarReservas() {
    throw new Error('Method not implemented.');
  }

  atualizarHorariosFormulario() {
    this.primeiroHoraInicio = moment().format('HH:mm');
    this.primeiroHoraFim = moment().hour(parseInt(this.primeiroHoraInicio) + 1).startOf('hour').format('HH:mm');
    this.formulario.patchValue({
      horaInicio: this.primeiroHoraInicio,
      horaFim: this.primeiroHoraFim
    });
  }
  
  carregarQuadroComHorariosAtualizados() {
    this.atualizarHorariosFormulario();
    this.carregarQuadro();
  }

}