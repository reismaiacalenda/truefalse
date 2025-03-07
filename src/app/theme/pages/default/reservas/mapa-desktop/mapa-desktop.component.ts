import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { fabric } from 'fabric';
import { Subscription } from 'rxjs';
import { Helpers } from '../../../../../helpers';
import { consoleLog } from '../../../../../globals';
import { WorkspaceService } from '../../../../../_services/workspace.service';
import { ModalSelecionarLocalizacaoComponent } from './modal-selecionar-localizacao/modal-selecionar-localizacao.component';
import { WebService } from '../../../../../_services/web.service';
import { MapaService } from '../../../../../_services/mapa.service';
import { ModalSelecionarHorarioComponent } from './modal-selecionar-horario/modal-selecionar-horario.component';
import { ModalSelecionarDataComponent } from './modal-selecionar-data/modal-selecionar-data.component';
import { PlantaHelper } from '../../../../../_services/planta-helper';
import { RodapeReservarComponent } from './rodape-reservar/rodape-reservar.component';
import { RodapeDetalheReservaComponent } from './rodape-detalhe-reserva/rodape-detalhe-reserva.component';
import { RodapeEspacoBloqueadoComponent } from './rodape-espaco-bloqueado/rodape-espaco-bloqueado.component';
import { ModalService } from '../../modal/modal.service';
import moment from 'moment';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { MapaModalFormComponent } from './mapa-modal/mapa-modal-form.component';
import { ReservaModalService } from '../reserva-modal/reserva-modal.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalSalaReservadaComponent } from './modal-reservar-sala/modal-sala-reservada.component';
import { ModalContinuacaoReservaComponent } from './modal-continuacao-reserva/modal-continuacao-reserva.component';
import { LoadingService } from '../../../../../_services/loading.service';
import { ModalLoadingMapaComponent } from './modal-loading-mapa/modal-loading-mapa.component';
import { QuadroFormAmenitiesComponent } from '../filtros-visualizacao/quadro-form-amenities/quadro-form-amenities.component';

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  styleUrls: ["./mapa-desktop.component.scss"],
  templateUrl: "./mapa-desktop.component.html",
  // directives: [RodapeReservarComponent],
  encapsulation: ViewEncapsulation.None,
})
export class MapaDesktopComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  public planta: fabric.Canvas;
  @ViewChild(RodapeReservarComponent,{static:false}) rodapeReservar:RodapeReservarComponent;
  @ViewChild(RodapeDetalheReservaComponent,{static:false}) rodapeDetalheReserva:RodapeDetalheReservaComponent;
  @ViewChild(RodapeEspacoBloqueadoComponent,{static:false}) rodapeEspacoBloqueado:RodapeEspacoBloqueadoComponent;
  modalLoadingMapa:NgbModalRef;
  
  pausePanning = false;
  panning = false;
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
  // textHourStart = "Agora";
  textHourStart = "Início do dia";
  horaEnd;
  textHourEnd = "Fim do dia";
  recorrencia;
  textRepeat = "Repetir";
  categoria = '';
  formularioAmenities: any;

  plantaHelper:PlantaHelper;

  fabricSelecionado: any;
  espacoSelecionado: any;
  public espacosReservas: any[];
  public espacosReservasFiltrados: any[];
  
  constructor(public workspaceService:WorkspaceService,
    public modalNgb: NgbModal,
    public webService: WebService,
    public mapaService: MapaService,
    public modalService: ModalService,
    public router: Router,
    private route: ActivatedRoute,
    public reservaModalService:ReservaModalService,
    public loadingService: LoadingService) {
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
    Helpers.setLoading(true);
    consoleLog("ngonit: ");
    consoleLog("this.data");
    consoleLog(this.data);
    consoleLog('this.textData')
    consoleLog(this.textData);
    this.categoria = this.route.snapshot.queryParams['categoria'] || '';
    this.recuperarLocalizacaoCacheada();
    this.reservaModalService.construirFormulario();
    this.reservaModalService.formulario.get('data_inicio').setValue(this.data.format('DD/MMM/YYYY'));
    this.abrirMapaModalForm();
  }

  ngAfterViewInit() {
    consoleLog('ngAfterViewInit');
    setTimeout(()=>{
      consoleLog('construir planta canvas');
      this.construirPlantaCanvas();
      this.plantaHelper = new PlantaHelper(this.planta);
      Helpers.setLoading(false);
    },100)
  }

  abrirPlanta(jsonData){
    this.planta.clear();
    this.planta.loadFromJSON(jsonData, ()=>{
      this.planta.renderAll();
      this.plantaHelper.createGrid();
      this.prepararInteracoesEspacos();
      this.pan();
      this.hoverEffects();
      // this.registrarPanZoom();
      // this.zoom();
      this.plantaHelper.zoom();
      this.carregarReservas();
      // this.planta.defaultCursor = 'pointer';
      // this.planta.hoverCursor = 'grab';
      // this.planta.moveCursor ='grabbing';
    })
  }

  construirPlantaCanvas(){
    var larguraDivPai = document.getElementById("divColMapa").clientWidth;
    // var alturaDivPai = document.getElementById("divColMapa").clientHeight;

    let mContent = $("#divColMapa").parent().parent()
    let existingHeight = mContent.children().eq(0).height(); //+
      // mContent.children().eq(1).height() +
      //1 + //mContent.children().eq(2).height() +
      // mContent.children().eq(3).height();
    
    consoleLog('$(".m-content").parent().height()');
    consoleLog($(".m-content").parent().height());
    consoleLog('existingHeight');
    consoleLog(existingHeight);
    
    let alturaDivPai = $(".m-content").parent().height() - existingHeight - 36;
    $('#divColMapa').parent().height(alturaDivPai);
    $('#divColMapa').height(alturaDivPai);

    consoleLog("esse é o heght divColMapa")
    consoleLog(alturaDivPai);
      consoleLog('new fabric canvas')
    this.planta = new fabric.Canvas('planta',
      {
        fireMiddleClick: true,
        fireRightClick: true,
        stopContextMenu: true,
        selection: false,        
        // allowtouchscrolling: true,
        width: larguraDivPai,
        height: alturaDivPai,
        backgroundColor: '#ebedf0',
        //'#f5f7fa'//'#F3F6F9' '#f2f3f8' 'f7f7fa',
        defaultCursor: 'grab'
        // hoverCursor: 'grab',
        // moveCursor:'grabbing'
      });
  }

  hoverEffects(){
    this.planta.on('mouse:over', e => {
      this.montarHoverInEspaco(e);
      this.planta.renderAll();
    });
  
    this.planta.on('mouse:out', e => {
      this.montarHoverOutEspaco(e);
      this.planta.renderAll();
    });
  }

  montarHoverInEspaco(e){
    consoleLog("hoverEspaco");
    consoleLog('categoria');
    consoleLog(this.categoria);
    let tipo = e.target != undefined && e.target.tipo != undefined && e.target.id > 0 ? e.target.tipo : '';
    if ((tipo == 'mesa' && this.categoria == 'mesa')
     || (tipo == 'estacionamento' && this.categoria == 'estacionamento')
     || (tipo == 'fretado' && this.categoria == 'fretado')){
      consoleLog("hover Mesa");
      e.target.item(0).set("fill", e.target.backupColor+'99')
      e.target.item(1).set("fill", e.target.backupColor+'99')
      this.plantaHelper.construirTooltip(e.target)
    }else if(tipo == 'sala' && (this.categoria == 'mesa')){
      e.target.item(0).set("fill", e.target.backupColor+'99')
      // this.construirTooltip(e.target)
    }else{
      if (this.panning == true){
        e.target.hoverCursor = 'grabbing'
      }else{
        e.target.hoverCursor = 'grab'
      }
    }
  }

  prepararMapaComReservas(){
    //dentro dele. percorrer todos os objetos das plantas
    this.planta.getObjects().forEach( (obj) => {
      let espacoReserva
      switch (obj.tipo) {
        case 'imagemPlanta':
        case 'pavimento':
          obj.selectable = false;
          obj.hasControls = false;
          obj.hoverCursor = 'default';
          break;

        case 'sala':
          espacoReserva = this.espacosReservas.find(x=>x.id == obj.id)
          this.prepararSala(espacoReserva, obj)
          break;
        case 'mesa':
        case 'estacionamento':
        case 'fretado':
          espacoReserva = this.espacosReservas.find(x=>x.id == obj.id)
          this.prepararMesa(espacoReserva, obj)
          break;
      
        default:
          break;
      }

    })
    this.planta.renderAll();
  }

  prepararMesa(espacoReserva, objeto){
    objeto.selectable = false;
    objeto.hasControls = false;
    objeto.hoverCursor = 'pointer';
    var situacao = espacoReserva == undefined ? '' : espacoReserva.situacao;

    switch (situacao) {
      case 'livre':
        objeto.set({situacao: espacoReserva.situacao,
          backupColor: this.mapaService.stateColors.successHeavy})
        objeto._objects[0].set("fill",this.mapaService.stateColors.successHeavy);
        objeto._objects[1].set("fill",this.mapaService.stateColors.successHeavy);
        break;

      case 'ocupado':
        objeto.set({situacao: espacoReserva.situacao,
          backupColor: this.mapaService.stateColors.dangerHeavy})
        objeto._objects[0].set("fill",this.mapaService.stateColors.dangerHeavy);
        objeto._objects[1].set("fill",this.mapaService.stateColors.dangerHeavy);
        break;
    
      case 'espera':
        objeto.set({situacao: espacoReserva.situacao,
          backupColor: this.mapaService.stateColors.warningHeavy})
        objeto._objects[0].set("fill",this.mapaService.stateColors.warningHeavy);
        objeto._objects[1].set("fill",this.mapaService.stateColors.warningHeavy);
        break;

      case 'bloqueado':
        objeto.set({situacao: espacoReserva.situacao,
          backupColor: this.mapaService.stateColors.secondary})
        objeto._objects[0].set("fill",this.mapaService.stateColors.secondary);
        objeto._objects[1].set("fill",this.mapaService.stateColors.secondary);
        break;

      default:
        objeto.set({backupColor: this.mapaService.stateColors.secondary})
        objeto._objects[0].set("fill",this.mapaService.stateColors.secondary);
        objeto._objects[1].set("fill",this.mapaService.stateColors.secondary);
        objeto.selectable = false;
        objeto.hasControls = false;
        objeto.hoverCursor = 'default';
        break;
    }
  }

  prepararSala(espacoReserva, objeto){
    objeto.selectable = false;
    objeto.hasControls = false;
    objeto.hoverCursor = 'pointer';
    var situacao = espacoReserva == undefined ? '' : espacoReserva.situacao;

    objeto._objects[0].set("strokeWidth",1);
    switch (situacao) {
      case 'livre':
        objeto.set({situacao: espacoReserva.situacao,
          backupColor: this.mapaService.stateColors.successHeavyB})
        objeto._objects[0].set("fill",this.mapaService.stateColors.successHeavyB);
        objeto._objects[0].set("stroke",this.mapaService.stateColors.successHeavy);
        break;

      case 'ocupado':
        objeto.set({situacao: espacoReserva.situacao,
          backupColor: this.mapaService.stateColors.dangerHeavyB})
        objeto._objects[0].set("fill",this.mapaService.stateColors.dangerHeavyB);
        objeto._objects[0].set("stroke",this.mapaService.stateColors.dangerHeavy);
        break;
    
      case 'espera':
        objeto.set({situacao: espacoReserva.situacao,
          backupColor: this.mapaService.stateColors.warningHeavyB})
        objeto._objects[0].set("fill",this.mapaService.stateColors.warningHeavyB);
        objeto._objects[0].set("stroke",this.mapaService.stateColors.warningHeavy);
        break;

      case 'bloqueado':
        objeto.set({situacao: espacoReserva.situacao,
          backupColor: this.mapaService.stateColors.secondary})
        objeto._objects[0].set("fill",this.mapaService.stateColors.secondary);
        objeto._objects[0].set("stroke",this.mapaService.stateColors.secondary);
        break;

      default:
        objeto.set({backupColor: this.mapaService.stateColors.secondary})
        objeto._objects[0].set("fill",this.mapaService.stateColors.secondary);
        objeto._objects[0].set("stroke",this.mapaService.stateColors.secondary);
        objeto.selectable = false;
        objeto.hasControls = false;
        objeto.hoverCursor = 'default';
        break;
    }
  }

  montarHoverOutEspaco(e){
    let tipo = e.target != undefined && e.target.tipo != undefined && e.target.id > 0 ? e.target.tipo : '';
    if ((tipo == 'mesa' && this.categoria == 'mesa')
     || (tipo == 'estacionamento' && this.categoria == 'estacionamento')
     || (tipo == 'fretado' && this.categoria == 'fretado')){
      e.target.item(0).set("fill", e.target.backupColor)
      e.target.item(1).set("fill", e.target.backupColor)
      this.plantaHelper.destruirTooltip();
    }else if(tipo == 'sala' && this.categoria == 'mesa'){
      e.target.item(0).set("fill", e.target.backupColor)
      // this.destruirTooltip();
    }else{
    }
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
        this.abrirModalLoadingMapa();
        consoleLog("recebi aqui o id da planta")
        // consoleLog(localizacao_id);
        this.textLocalizacao = currentLocalizacao.text;
        this.localizacaoId = currentLocalizacao.id;
        this.carregarPlantaLocalizacao();
      }
    })
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

        consoleLog("retorno modal selecao data: ");
        consoleLog("this.data");
        consoleLog(this.data);
        consoleLog('this.textData')
        consoleLog(this.textData);
    
        if (this.localizacaoId != undefined){
          this.carregarReservas();
        }else{
          Helpers.setLoading(false);
        }
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
          this.carregarReservas();
        }else{
          Helpers.setLoading(false);
        }
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
        this.carregarPlantaLocalizacao();
        consoleLog("Passou pela chamada do carregarQuadro")
      }
    })
  }

  carregarPlantaLocalizacao(){
    this.subscriptions.add(
      this.webService.get(`localizacoes/${this.localizacaoId}/carregar_mapa`)
        .subscribe(response=>{
          this.abrirPlanta(response.planta);
        })
    )
  }

  carregarReservas(reservaRealizada?){
    Helpers.setLoading(true);
    var horaInicio = this.textHourStart;
    var horaFim = this.textHourEnd;

    if (horaInicio == "Início do dia"){
      // horaInicio = (new Date).toLocaleTimeString().slice(-8, -3);
      horaInicio = "00:00";
    }

    if (horaFim == "Fim do dia"){
      horaFim = "23:59";
    }

    var data
    if (this.data == undefined){
      data = (new Date).toLocaleDateString("PT")
    }else{
      data = this.data.format('DD/MM/YYYY');
    }

    var body = {
      localizacao_id: this.localizacaoId,
      data: data,
      horaInicio: horaInicio,
      horaFim: horaFim,
      recorrencia: this.recorrencia,
      categoria: -1
    }

    if (this.formularioAmenities){
      body["amenities"] = this.formularioAmenities.get("amenities_attributes").value
    }
    
    this.webService.put('espacos/mapa_reserva', body)
    .subscribe(
      dados => {
        this.espacosReservas = dados.body.espacos;
        this.espacosReservasFiltrados = [dados.body.espacos];
        consoleLog("Como está vindo o dados do quadro")
        consoleLog(dados)
        consoleLog(reservaRealizada);
        consoleLog('reservaRealizada');
        // this.prepararMapaComReservas();
        this.rodapeReservar.fecharRodape();
        this.rodapeDetalheReserva.fecharRodape();
        this.rodapeEspacoBloqueado.fecharRodape();

        this.prepararMapaComReservas();

        if (reservaRealizada != undefined){
          this.selecionarEspaco(this.espacoSelecionado.id);
          consoleLog(this.espacoSelecionado)
          consoleLog("resetando espaco")
          this.reservaModalService.abrirModalSalaReservada(this.espacoSelecionado, this.textData, ModalSalaReservadaComponent)
          .result.then((retornoModal)=>{
            if (retornoModal == true){
              this.reservaModalService.abrirModalContinuacaoReserva(ModalContinuacaoReservaComponent)
              .result.then((retornoInicio)=>{
                if (retornoInicio == true){
                  Helpers.setLoading(true)
                  this.router.navigate(['/index']);
                }
              });
            }
          });
          // this.rodapeDetalheReserva.abrirRodape();
        }
        consoleLog('chamando pra resenhar mapa com reservas')
        this.plantaHelper.desenharMapaComReservas(this.espacosReservas);
        Helpers.setLoading(false)
        this.modalLoadingMapa.close();
      },
      (error: any) => {
        this.modalService.tratarError(error)
        Helpers.setLoading(false);
        this.modalLoadingMapa.close();
      }
    )

  }

  prepararInteracoesEspacos(){
    this.planta.on({'mouse:down': event => {
      consoleLog("clicando no gesture");
      consoleLog(event);
      if (event.e.which == 1){
        consoleLog("reconheceu");
        consoleLog("reconheceu");
        let tipo = event.target.tipo != undefined && event.target.id > 0 ? event.target.tipo : '';
        consoleLog(tipo);
        if (tipo == 'mesa' || tipo == 'sala' || tipo == 'estacionamento' || tipo == 'fretado'){
          // duplo clique?
          if (this.fabricSelecionado === event.target){
            // se sim, limpa a seleção. TODO: Avaliar se pode ser feita uma segunda chamada aqui.
            // alert("olha aí a oportunidade de abrir uma mini modal-tooltip detalhada e bonita")
          }else{
            Helpers.setLoading(true);
            this.removerSelecaoEspaco();
            this.fabricSelecionado = event.target;
            this.selecionarEspaco(this.fabricSelecionado.id);
            consoleLog("espacoSelecionado")
            consoleLog(this.espacoSelecionado);
            if (this.espacoSelecionado != undefined){
              this.destacarSelecaoEspaco()
              this.focarEspacoSelecionado();
              if(this.espacoSelecionado.situacao == "livre"){
                consoleLog("como estão as propriedes")
                consoleLog(this.textData);
                this.rodapeEspacoBloqueado.fecharRodape();
                this.rodapeDetalheReserva.fecharRodape();
                this.rodapeReservar.abrirRodape();
              }else if(this.espacoSelecionado.situacao == "bloqueado"){
                this.rodapeDetalheReserva.fecharRodape();
                this.rodapeReservar.fecharRodape();
                this.rodapeEspacoBloqueado.abrirRodape();
              }else{
                this.rodapeEspacoBloqueado.fecharRodape();
                this.rodapeReservar.fecharRodape();
                this.rodapeDetalheReserva.abrirRodape();
              }
            }
            // this.abrirRodape();
          }
        }else{
          this.recuperarTodosEspacos();
          this.rodapeReservar.fecharRodape();
        }
        this.planta.renderAll();
      }
    }});
  }

  selecionarEspaco(fabricId){
    this.espacoSelecionado = this.espacosReservas.find(x=>x.id == fabricId);
    this.rodapeDetalheReserva.espacoSelecionado = this.espacoSelecionado;
    this.rodapeReservar.espacoSelecionado = this.espacoSelecionado;
    this.rodapeEspacoBloqueado.espacoSelecionado = this.espacoSelecionado;
  }

  removerSelecaoEspaco(){
    if (this.fabricSelecionado != undefined){
      consoleLog(this.fabricSelecionado);
      //TODO: backup e recupera a linha
      if (this.fabricSelecionado.tipo == "mesa"|| this.fabricSelecionado.tipo == "estacionamento" || this.fabricSelecionado.tipo == "fretado"){
        this.fabricSelecionado._objects[0].set("stroke",this.fabricSelecionado.backupLine);
        this.fabricSelecionado._objects[0].set("strokeWidth",0);
        this.fabricSelecionado._objects[0].set("strokeDashArray", null);
      }else{
        this.fabricSelecionado._objects[0].set("stroke",this.fabricSelecionado.backupLine);
        this.fabricSelecionado._objects[0].set("strokeDashArray", null);
      }
      // this.espacoSelecionado._objects[0].set("strokeWidth",0);
      this.fabricSelecionado = undefined;
      // this.espacoSelecionado._objects[0].set("strokeDashArray", [40, 4]);
    }
  }

  destacarSelecaoEspaco(){
    this.fabricSelecionado._objects[0].set("stroke",this.mapaService.stateColors.primaryLight);
    this.fabricSelecionado._objects[0].set("strokeWidth",1);
    this.fabricSelecionado._objects[0].set("strokeDashArray", [40, 4]);
    this.fabricSelecionado._objects[0].set("strokeUniform",true);
  }

  focarEspacoSelecionado(){
    var zoom = 1.2;
    this.planta.setZoom(1);
    var vpw = this.planta.width / zoom
    var vph = this.planta.height / zoom
    var descontoModalInferior = 60;
    var centroXObjeto = (this.fabricSelecionado.width + (this.fabricSelecionado.left*2))/2
    var centroYObjeto = (this.fabricSelecionado.height + (this.fabricSelecionado.top*2))/2 + descontoModalInferior;

    var x = (centroXObjeto - vpw / 2)  // x is the location where the top left of the viewport should be
    var y = (centroYObjeto - vph / 2)  // y idem
    this.planta.absolutePan({x:x, y:y})
    this.planta.setZoom(zoom)
  }

  recuperarTodosEspacos(){
    this.removerSelecaoEspaco();
    this.planta.renderAll();
    this.espacosReservasFiltrados.length = 0;
    this.espacosReservasFiltrados = [this.espacosReservas];
  }

  abrirMapaModalForm(){
    let ngbModalOptions: NgbModalOptions={
      backdrop: 'static',
      // keyboard: false,
      centered: true
    }
    let modal = this.modalNgb.open(MapaModalFormComponent, ngbModalOptions);
    modal.result.then((params)=>{
      if (params != undefined){
        this.abrirModalLoadingMapa();
      }
      consoleLog(params);
      this.localizacaoId = params.localizacaoId;
      this.textLocalizacao = params.textLocalizacao;
      this.data = params.data;
      this.textData = params.textData;
      this.horaStart = params.horaStart;
      this.textHourStart = params.textHourStart;
      this.horaEnd = params.horaEnd;
      this.textHourEnd = params.textHourEnd;
      this.reservaModalService.formulario.get('recorrencia').setValue(params.recorrencia);
      this.formularioAmenities = params.amenities;
      consoleLog(this.reservaModalService.formulario.get('recorrencia').value)
      if (this.localizacaoId != undefined && this.localizacaoId > 0){
        consoleLog("to chamando sim a localizacao")
        this.carregarPlantaLocalizacao();
      }
    })
  }

  abrirModalRecorrencia(){
    Helpers.setLoading(true);
    this.reservaModalService.formulario.get('data_inicio').setValue(this.data.format('DD/MMM/YYYY'));
    consoleLog(this.reservaModalService.formulario.get('recorrencia').value);
    this.reservaModalService.abrirModalRecorrencia()
      .then((resultadoModal) => {
        consoleLog(this.reservaModalService.formulario);
        // this.inicializarFormService();
        this.recorrencia = this.reservaModalService.formulario.get('recorrencia').value
        Helpers.setLoading(false)
      })
  }

  zoom() {
    this.planta.on('mouse:wheel', opt => {

      // this.reiniciarTooltip();

      var delta = opt.e.deltaY;
      var zoom = this.planta.getZoom();
    // consoleLog(delta);
      zoom -= .001 * delta
      // zoom *= 0.999 ** delta;
      if (zoom > 2) zoom = 2;
      if (zoom < 0.5) zoom = 0.5;
      this.planta.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
      var vpt = this.planta.viewportTransform;
      if (zoom < 400 / 1000) {
        vpt[4] = 200 - 1000 * zoom / 2;
        vpt[5] = 200 - 1000 * zoom / 2;
      } else {
        if (vpt[4] >= 0) {
          vpt[4] = 0;
        } else if (vpt[4] < this.planta.getWidth() - 1000 * zoom) {
          vpt[4] = this.planta.getWidth() - 1000 * zoom;
        }
        if (vpt[5] >= 0) {
          vpt[5] = 0;
        } else if (vpt[5] < this.planta.getHeight() - 1000 * zoom) {
          vpt[5] = this.planta.getHeight() - 1000 * zoom;
        }
      }
    })
  }

  pan() {
    this.planta.on('mouse:down', (opt) => {
  
      // consoleLog('opt.button');
      // consoleLog(opt.button);
      // consoleLog(opt);
      
      var evt = opt.e;
      // if (evt.alt_key==true)
      // if (this.planta.getActiveObjects().length == 0) {
      // if (opt.button === 2 || opt.button === 3 || (opt.button === 1 && menu === 'mapa')) {
      // if (opt.button === 1) {
        // this.planta.selection = false;
      // }
      
      this.planta.selection = false;
      if ((opt.target.tipo == undefined || opt.target.tipo =='imagemPlanta' || opt.target.tipo =='pavimento')
        && (opt.button === 1 || opt.button === 2 || opt.button === 3)) {
        this.panning = true;
        consoleLog('mouse down')
        this.planta.isDragging = true;
        this.planta.lastPosX = evt.clientX;
        this.planta.lastPosY = evt.clientY;
        // opt.target.hoverCursor = 'grabbing'

        // var this.plantaElement = document.getElementById('planta');
        // plantaElement.classList.add('ui-draggable-handle');
        // planta.cursor = 'grab'

        // var mybody = document.find('body');
        // mybody.addClass('waiting');   // set cursor to hourglass
        // setTimeout(function() {
        //     doSlowStuff();
        //     $scope.$apply();
        //     mybody.removeClass('waiting');  // set cursor to normal
        // }, 0);
      }
    });

    this.planta.on('mouse:move', opt => {
      if (this.planta.isDragging) {
        consoleLog("mouse move dragging")
        if ((opt.target.tipo == undefined || opt.target.tipo =='imagemPlanta' || opt.target.tipo =='pavimento')){
          opt.target.hoverCursor = 'grabbing'
        }
        var e = opt.e;
        var vpt = this.planta.viewportTransform;
        vpt[4] += e.clientX - this.planta.lastPosX;
        vpt[5] += e.clientY - this.planta.lastPosY;
        this.planta.requestRenderAll();
        this.planta.lastPosX = e.clientX;
        this.planta.lastPosY = e.clientY;
        // e.target.hoverCursor = 'grabbing'
      }else{
        consoleLog("mouse move not dragging")
        if ((opt.target.tipo == undefined || opt.target.tipo =='imagemPlanta' || opt.target.tipo =='pavimento')){
          opt.target.hoverCursor = 'grab'
        }
        // opt.target.hoverCursor = 'grab'
      }
    });
    this.planta.on('mouse:up', opt => {
      if ((opt.target.tipo == undefined || opt.target.tipo =='imagemPlanta' || opt.target.tipo =='pavimento')){
        opt.target.hoverCursor = 'grab'
      }
      // on mouse up we want to recalculate new interaction
      // for all objects, so we call setViewportTransform
      consoleLog("tô aqui no mouse up")
      // consoleLog(this.planta.viewportTransform);
      this.panning = false;
      this.planta.setViewportTransform(this.planta.viewportTransform);
      this.planta.isDragging = false;
      this.planta.selection = true;
      this.planta.requestRenderAll();
      // opt.target.hoverCursor = 'grab'
      
    });
  }

  recuperarLocalizacaoCacheada(){
    var cache_id = localStorage.getItem(`localizacao_${this.categoria}_id`);
    if (cache_id != undefined){
      this.localizacaoId = cache_id;
      this.textLocalizacao = localStorage.getItem(`localizacao_${this.categoria}_text`);
    }
  }

  abrirModalLoadingMapa(){
    let ngbModalOptions: NgbModalOptions={
      backdrop: false,
      keyboard: false,
      centered: true
    }

    this.modalLoadingMapa = this.modalNgb.open(ModalLoadingMapaComponent, ngbModalOptions);
    this.modalLoadingMapa.result.then((params)=>{
      
    })

  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }

}
