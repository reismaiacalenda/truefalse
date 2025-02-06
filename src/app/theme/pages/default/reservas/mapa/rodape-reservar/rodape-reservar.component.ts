// import { Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, OnDestroy, Renderer2, Output, EventEmitter, Input } from '@angular/core';
// import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { WebService } from '../../../../../../_services/web.service';
import { Helpers } from '../../../../../../helpers';
import { ReservaModalService } from '../../reserva-modal/reserva-modal.service';
import { ModalService } from '../../../modal/modal.service';
import { consoleLog } from '../../../../../../globals';
import { ModalSalaReservadaComponent } from '../modal-reservar-sala/modal-sala-reservada.component';
import { NgbModal, NgbModalOptions, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ModalTermoComponent } from '../modal-termo/modal-termo.component';
import { ModalMaisOpcoesComponent } from '../../reserva-modal/modal-mais-opcoes/modal-mais-opcoes.component';

declare function montarTreeLocalizacoes(data: any);

@Component({
  selector: 'rodape-reservar',
  templateUrl: 'rodape-reservar.component.html'
})
export class RodapeReservarComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  @ViewChild('rodape', {static: false}) public rodape: ElementRef;
  @Input() espacoSelecionado;
  @Input() date;
  @Input() textData = "";
  @Input() horaInicio = "";
  @Input() horaFim = "";
  textHour: string;
  @Input() recorrencia;
  @Output() reservaRealizada = new EventEmitter<any>();
  @Output() modalFechada = new EventEmitter<any>();
  loading: boolean = false;
  rodapeAberto: boolean = false;
  responseNew;
  public agree:boolean = false;

  constructor(public modalNgb: NgbModal,
    public renderer:Renderer2,
    public reservaModalService: ReservaModalService,
    public webService: WebService,
    public modalService: ModalService){}

  ngOnInit(){
    this.recuperarCheckCacheado();
  }

  ngAfterViewInit(){
  }

  onSubmit() {
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  abrirRodape(){
    this.prepararNew();
  }

  fecharRodape(){
    if (this.rodapeAberto == false){return};
    this.rodapeAberto = false;
    this.renderer.removeClass(this.rodape.nativeElement, 'slideInUp');
    this.renderer.addClass(this.rodape.nativeElement, 'slideOutDown');
    setTimeout(()=>{
      this.renderer.addClass(this.rodape.nativeElement, 'd-none'); 
      this.modalFechada.emit(true);
    },751)
  }

  prepararNew(){
    Helpers.setLoading(true);

    consoleLog('this.hora')
    var horaInicio = this.horaInicio;
    consoleLog(horaInicio);
    if (this.horaInicio == undefined || horaInicio == "Agora"){
      horaInicio = (new Date).toLocaleTimeString().slice(-8, -3);
    }
    consoleLog(horaInicio);

    var horaFim = this.horaFim;
    consoleLog(horaFim);
    if (this.horaFim == undefined || horaFim == "Fim do dia"){
      horaFim = "23:59";
    }
    consoleLog(horaFim);
    // consoleLog('this.data')
    // consoleLog(this.date)
    // consoleLog('this.data.date')
    // consoleLog(this.date.date)
    // consoleLog(this.date.format("DD/MM/YYYY"))
    // consoleLog('this.textData')
    // consoleLog(this.textData)
    // var data = this.textData
    // consoleLog(data)
    // if (this.textData == undefined || this.textData == "Hoje"){
      // data = (new Date).toLocaleDateString("PT")
    // }
    // consoleLog('var data')
    // consoleLog(data)
    if (this.espacoSelecionado.tipo_espaco == "mesa"){
      var tela = 'mapa_espaco_estacoes_flexiveis'
    }else if(this.espacoSelecionado.tipo_espaco == "sala"){
      var tela = 'mapa_espaco_eventos'
    }else if(this.espacoSelecionado.tipo_espaco == "estacionamento"){
      var tela = 'mapa_espaco_estacionamentos'
    }else if(this.espacoSelecionado.tipo_espaco == "fretado"){
      var tela = 'mapa_espaco_fretados'
    }

    var body = {
      espaco_id: this.espacoSelecionado.id,
      tela: tela,
      data: this.date.format("DD/MM/YYYY"),
      hr_inicio_previsto: horaInicio,
      hr_fim_previsto: horaFim
    }

    // if (this.espacoSelecionado.tipo_espaco == 'sala'){
    // body['campo_alterado'] = 'hr_inicio_previsto';
    // }else{
    // if (horaFim == "23:59"){
    //   body['campo_alterado'] = 'dia_todo';
    //   body['dia_todo'] = true;
    // }

    this.webService.get(`reservas/new`, body)
    .subscribe(
      dados => {      
        consoleLog("get")
        consoleLog(dados);
        this.responseNew = dados;
        consoleLog('formulario após new')
        consoleLog(this.reservaModalService.formulario);
        this.textHour = `${dados.hr_inicio_previsto} às ${dados.hr_fim_previsto}`
        this.efeitosAbrirRodape();
      }
    )
  }

  efeitosAbrirRodape(){
    consoleLog("como estão as propriedes")
    consoleLog(this.date);
    if (this.rodapeAberto == true){
      Helpers.setLoading(false);
      return
    };
    this.rodapeAberto = true;
    this.renderer.removeClass(this.rodape.nativeElement, 'slideOutDown');
    this.renderer.addClass(this.rodape.nativeElement, 'slideInUp');
    this.renderer.removeClass(this.rodape.nativeElement, 'd-none');
    setTimeout(()=>{
      Helpers.setLoading(false);
    },751);
  }

  abrirTermo(){
    this.checkAgree(); //apenas pra inverter o click indevido.
    this.reservaModalService.abrirModalTermo(ModalTermoComponent)
  }

  abrirMaisOpcoes(tipo_espaco){
    consoleLog('formulario ao abrir')
    consoleLog(this.reservaModalService.formulario)
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      // backdrop: 'static',
      // keyboard: false,[]
      centered: true
    }
    const modal = this.modalNgb.open(ModalMaisOpcoesComponent, ngbModalOptions);
    modal.componentInstance.reservaModalService = this.reservaModalService;
    modal.componentInstance.tipo_espaco = tipo_espaco;
    modal.componentInstance.anfitriao_email = this.responseNew.anfitriao_email;
    modal.componentInstance.convidados_emails = this.responseNew.convidados_emails;
    modal.componentInstance.assunto = this.responseNew.assunto;
    modal.componentInstance.observacao = this.responseNew.observacao;

    modal.result.then(maisOpcoes=>{
      if (maisOpcoes!=undefined && maisOpcoes !='' && maisOpcoes != false){
        this.responseNew.assunto = maisOpcoes.assunto;
        this.responseNew.anfitriao_email = maisOpcoes.anfitriao_email;
        this.responseNew.convidados_emails = maisOpcoes.convidados_emails;
        this.responseNew.observacao = maisOpcoes.observacao;
        this.responseNew.recorrencia = this.reservaModalService.formulario.get('recorrencia').value;
        consoleLog('retornou com response new')
        consoleLog(this.responseNew)
        consoleLog('formulario de dentro')
        consoleLog(this.reservaModalService.formulario);
      }
    })
  }

  modalReserva(){
    this.cachearCheck();
    this.loading = true;
    Helpers.setLoading(true);
    this.webService.post(`reservas`, this.responseNew)
    .subscribe(
      response=>{
        consoleLog("post")
        Helpers.setLoading(false);
        this.loading = false;
        this.fecharRodape();
        if (response.status === 200){
          this.modalService.tratarSucesso(response);
        }else if(response.status === 204){
          this.reservaRealizada.emit(true);
        }
      },
      (error) => {
        Helpers.setLoading(false);
        this.loading = false;
        this.modalService.tratarError(error, 'post');
    }
    )
    
  }

  checkAgree(){
		this.agree = !this.agree;
	}

  cachearCheck(){
    let checkCache = localStorage.getItem('checkAgree');
    if (checkCache == undefined){
      localStorage.setItem('checkAgree', 'true');
    }
  }

  recuperarCheckCacheado(){
    let checkCache = localStorage.getItem('checkAgree');
    if (checkCache != undefined){
      this.agree = true;
    }
  }

}