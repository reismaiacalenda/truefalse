import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { fabric } from 'fabric-with-gestures';
import { Subscription } from 'rxjs';
import { Helpers } from '../../../../../../helpers';
import { consoleLog } from '../../../../../../globals';
import { WorkspaceService } from '../../../../../../_services/workspace.service';
import { ModalSelecionarLocalizacaoComponent } from '../modal-selecionar-localizacao/modal-selecionar-localizacao.component';
import { WebService } from '../../../../../../_services/web.service';
import { MapaService } from '../../../../../../_services/mapa.service';
import { ModalSelecionarHorarioComponent } from '../modal-selecionar-horario/modal-selecionar-horario.component';
import { ModalSelecionarDataComponent } from '../modal-selecionar-data/modal-selecionar-data.component';
import { PlantaHelper } from '../../../../../../_services/planta-helper';
import { RodapeReservarComponent } from '../rodape-reservar/rodape-reservar.component';
import { RodapeDetalheReservaComponent } from '../rodape-detalhe-reserva/rodape-detalhe-reserva.component';
import { RodapeEspacoBloqueadoComponent } from '../rodape-espaco-bloqueado/rodape-espaco-bloqueado.component';
import { ModalService } from '../../../modal/modal.service';
import moment from 'moment';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReservaModalService } from '../../reserva-modal/reserva-modal.service';
import { ActivatedRoute } from '@angular/router';
import { QuadroFormAmenitiesComponent } from '../../filtros-visualizacao/quadro-form-amenities/quadro-form-amenities.component';

@Component({
  selector: 'mapa-modal-form',
  templateUrl: 'mapa-modal-form.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class MapaModalFormComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  // public planta: fabric.Canvas;
  // @ViewChild(RodapeReservarComponent,{static:false}) rodapeReservar:RodapeReservarComponent;
  // @ViewChild(RodapeDetalheReservaComponent,{static:false}) rodapeDetalheReserva:RodapeDetalheReservaComponent;
  // @ViewChild(RodapeEspacoBloqueadoComponent,{static:false}) rodapeEspacoBloqueado:RodapeEspacoBloqueadoComponent;
  
  pausePanning = false;
  zoomStartScale;
  currentX;
  currentY;
  xChange;
  yChange;
  lastX;
  lastY;

  localizacaoId;
  textLocalizacao = "Selecione uma localização"
  data;
  textData = "Hoje";
  horaStart;
  horaEnd;
  // textHourStart = "Agora";
  textHourStart = "Início do dia";
  textHourEnd = "Fim do dia";
  repetir;
  textRepeat = "Repetir";
  categoria='';

  plantaHelper:PlantaHelper;

  fabricSelecionado: any;
  espacoSelecionado: any;
  formularioAmenities: any;
  public espacosReservas: any[];
  public espacosReservasFiltrados: any[];

  constructor(public workspaceService:WorkspaceService,
    public modalNgb: NgbModal,
    public webService: WebService,
    public mapaService: MapaService,
    public activeModal: NgbActiveModal,
    public modalService: ModalService,
    private route: ActivatedRoute,
    public reservaModalService:ReservaModalService) {
    moment.locale('pt-BR');
    this.data = moment();
    // this.horaStart = moment().format('HH:mm');
    this.horaStart = moment().startOf('day').format('HH:mm');
    this.horaEnd = moment().endOf('day').format('HH:mm');
    // this.hora = (date => new Date(Math.round(date / 9e5) * 9e5));
    // this.hora = this.hora.toTimeString().split(' ')[0]

    // var rounding = 15 * 60 * 1000; /*ms*/
    // var start = moment();
    // start = moment(Math.ceil((+start) / rounding) * rounding);
    // this.hora = start.format("HH:mm");

    // const start = moment('2018-12-08 09:42');
    // const remainder = 30 - (start.minute() % 30);
    // this.hora = moment(start).add(remainder, "minutes").format("HH:mm");

    consoleLog('calculo de arredondar');
    // consoleLog(this.hora)

    // var remainder = 30 - (this.data.minute() % 30);
    // this.hora = moment(this.data).add(remainder, "minutes").format("HH:mm");

  }
  ngOnInit() {
    this.categoria = this.route.snapshot.queryParams['categoria'] || '';
    consoleLog("ngonit: ");
    consoleLog("this.data");
    consoleLog(this.data);
    consoleLog('this.textData')
    consoleLog(this.textData);
    Helpers.setLoading(true);
    this.reservaModalService.construirFormulario();
    this.reservaModalService.formulario.get('data_inicio').setValue(this.data.format('DD/MMM/YYYY'))
    this.recuperarLocalizacaoCacheada();
  }

  ngAfterViewInit() {
    setTimeout(()=>{
      // this.construirPlantaCanvas();
      // this.plantaHelper = new PlantaHelper(this.planta);
      Helpers.setLoading(false);
    },50)
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }

  abrirModalSelecaoData(){
    Helpers.setLoading(true);

    consoleLog("antes selecao data: ");
    consoleLog("this.data");
    consoleLog(this.data);
    consoleLog('this.textData')
    consoleLog(this.textData);

    let ngbModalOptions: NgbModalOptions={
      // backdrop: 'static',
      // keyboard: false,
      centered: true
    }
    let modal = this.modalNgb.open(ModalSelecionarDataComponent, ngbModalOptions);
    modal.componentInstance.selectedDay = this.data;
    modal.result.then((data)=>{
      consoleLog(data);
      if (data != undefined){
        this.data = data.date;
        if (data.today){
          this.textData = "Hoje"
        }else{
          this.textData = data.date.format('ddd, DD/MMM/YYYY');
        }

        // consoleLog("retorno modal selecao data: ");
        // consoleLog("this.data");
        // consoleLog(this.data);
        // consoleLog('this.textData')
        // consoleLog(this.textData);
    
        // if (this.localizacaoId != undefined){
        //   this.carregarReservas();
        // }else{
        //   Helpers.setLoading(false);
        // }
      }
      Helpers.setLoading(false);
    })
  }

  abrirModalSelecaoHora(start){
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      // backdrop: 'static',
      // keyboard: false,
      centered: true
    }
    let modal = this.modalNgb.open(ModalSelecionarHorarioComponent, ngbModalOptions);
    if (start == true){
      modal.componentInstance.iniciarComponentPicker(this.horaStart);
    }else{
      modal.componentInstance.iniciarComponentPicker(this.horaEnd);
    }
    modal.result.then(horario=>{
      if (horario!=undefined && horario!=''){
        consoleLog("recebi aqui o id da planta")
        consoleLog(horario);
        if (start == true){
          this.textHourStart = horario;
          if (this.textHourStart == 'Início do dia'){
            // this.horaStart = moment().format('HH:mm');
            this.horaStart = '00:00'
          }else{
            this.horaStart = horario;
          }
          // consoleLog(this.hora);
        }else{
          this.textHourEnd = horario;
          if (this.textHourEnd == 'Final do dia'){
            // this.horaEnd = moment().format('HH:mm');
            this.horaEnd = '23:59'
          }else{
            this.horaEnd = horario;
          }
        }
        
        if (this.localizacaoId != undefined){
          // this.carregarReservas();
        }else{
          Helpers.setLoading(false);
        }
      }
    })
  }

  abrirModalRecorrencia(){
    Helpers.setLoading(true);
    this.reservaModalService.formulario.get('data_inicio').setValue(this.data.format('DD/MMM/YYYY'));
    this.reservaModalService.abrirModalRecorrencia()
      .then((resultadoModal) => {
        console.log(this.reservaModalService.formulario);
        // this.inicializarFormService();
        Helpers.setLoading(false)
      })
  }

  abrirModalSelecaoLocalizacao(){
    Helpers.setLoading(true);
    let ngbModalOptions: NgbModalOptions={
      // backdrop: 'static',
      // keyboard: false,[]
      centered: true
    }
    let modal = this.modalNgb.open(ModalSelecionarLocalizacaoComponent, ngbModalOptions);
    modal.result.then(currentLocalizacao=>{
      if (currentLocalizacao!=undefined && currentLocalizacao !='' && currentLocalizacao != false){
        consoleLog("recebi aqui o id da planta")
        // consoleLog(localizacao_id);
        this.textLocalizacao = currentLocalizacao.text;
        this.localizacaoId = currentLocalizacao.id;
        // this.carregarPlantaLocalizacao();
      }
    })
  }

  openModalAmenities(rowId?: string) {
    let ngbModalOptions: NgbModalOptions={
          // backdrop: 'static',
          // keyboard: false
          centered: true
      }
    const modalRef = this.modalNgb.open(QuadroFormAmenitiesComponent, ngbModalOptions);
    if (this.formularioAmenities){
      modalRef.componentInstance.formulario = this.formularioAmenities;
    }
    modalRef.result.then((formularioModal) => {
      if (formularioModal) {
        this.formularioAmenities = formularioModal;
      }
    })
  }

  aplicarFiltros(){
    let params = {
      localizacaoId: this.localizacaoId,
      textLocalizacao: this.textLocalizacao,
      data: this.data,
      textData: this.textData,
      horaStart: this.horaStart,
      horaEnd: this.horaEnd,
      textHourStart: this.textHourStart,
      textHourEnd: this.textHourEnd,
      recorrencia: this.reservaModalService.formulario.get('recorrencia').value,
      amenities: this.formularioAmenities
    }
    this.activeModal.close(params);
  }

  recuperarLocalizacaoCacheada(){
    var cache_id = localStorage.getItem(`localizacao_${this.categoria}_id`);
    if (cache_id != undefined){
      this.localizacaoId = cache_id;
      this.textLocalizacao = localStorage.getItem(`localizacao_${this.categoria}_text`);
    }
  }

}