import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { fabric } from 'fabric-with-gestures';
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
import { ModalSalaReservadaComponent } from "../mapa/modal-reservar-sala/modal-sala-reservada.component";
import { ModalContinuacaoReservaComponent } from "../mapa/modal-continuacao-reserva/modal-continuacao-reserva.component";
import { LoadingService } from '../../../../../_services/loading.service';
import { ModalLoadingMapaComponent } from './modal-loading-mapa/modal-loading-mapa.component';
import { QuadroFormAmenitiesComponent } from '../filtros-visualizacao/quadro-form-amenities/quadro-form-amenities.component';

@Component({
  selector: "mapa",
  styleUrls: ["./mapa.component.scss"],
  templateUrl: "./mapa.component.html",
  // directives: [RodapeReservarComponent],
  encapsulation: ViewEncapsulation.None,
})
export class MapaComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  public planta: fabric.Canvas;
  @ViewChild(RodapeReservarComponent,{static:false}) rodapeReservar:RodapeReservarComponent;
  @ViewChild(RodapeDetalheReservaComponent,{static:false}) rodapeDetalheReserva:RodapeDetalheReservaComponent;
  @ViewChild(RodapeEspacoBloqueadoComponent,{static:false}) rodapeEspacoBloqueado:RodapeEspacoBloqueadoComponent;
  modalLoadingMapa:NgbModalRef;

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
  // textHourStart = "Agora";
  textHourStart = "Início do dia";
  horaEnd;
  textHourEnd = "Fim do dia";
  recorrencia;
  textRepeat = "Repetir";
  categoria = ''
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
    setTimeout(()=>{
      this.construirPlantaCanvas();
      this.plantaHelper = new PlantaHelper(this.planta);
      Helpers.setLoading(false);
    },50)
  }

  abrirPlanta(jsonData){
    this.planta.clear();
    this.planta.loadFromJSON(jsonData, ()=>{
      this.planta.renderAll();
      this.plantaHelper.createGrid();
      this.prepararInteracoesEspacos();
      this.registrarPanZoom();
      this.carregarReservas();
    })
  }

  construirPlantaCanvas(){
    var larguraDivPai = document.getElementById("divColMapa").clientWidth;
    var alturaDivPai = document.getElementById("divColMapa").clientHeight;
    consoleLog("esse é o heght divColMapa")
    consoleLog(alturaDivPai);
    this.planta = new fabric.Canvas('planta',
      {
        // fireMiddleClick: true,
        // fireRightClick: true,
        // stopContextMenu: true,
        selection: false,        
        // allowtouchscrolling: true,
        width: larguraDivPai,
        height: alturaDivPai,
        backgroundColor: '#ebedf0'
        //'#f5f7fa'//'#F3F6F9' '#f2f3f8' 'f7f7fa',
        // defaultCursor: 'pointer'
      });//fcfcfc

      // this.planta.on({
      //   'touch:gesture': ()=> {
      //     alert(' Gesture ');
      //   },
      //   'touch:drag': ()=> {
      //     alert(' Dragging ');
      //   },
      //   'touch:orientation': ()=> {
      //     alert(' Orientation ');
      //   },
      //   'touch:shake': ()=> {
      //     alert(' Shaking ');
      //   },
      //   'touch:longpress': ()=> {
      //     alert(' Longpress ');
      //   },
      // });

      // this.planta.on(
      //   'mouse:down', (opt) => {
      //     alert("oopa")
      //   }
      // )
      var zoomStartScale;
      // this.planta.on({
      // 'touch:gesture': e=> {
      //   if (e.e.touches && e.e.touches.length == 2) {
      //     // pausePanning = true;
      //     var point = new fabric.Point(e.self.x, e.self.y);
      //     if (e.self.state == "start") {
      //       consoleLog("entrou aqui")
      //       zoomStartScale = this.planta.getZoom();
      //     }
      //     var delta = zoomStartScale * e.self.scale;
      //     this.planta.zoomToPoint(point, delta);
      //     // pausePanning = false;
      //     // limit zoom to 4x in
      //     if (delta > 4) delta = 4;
      //     // limit zoom to 1x out
      //     if (delta < 1) {
      //       delta = 1;
      //       this.planta.setViewportTransform([1, 0, 0, 1, 0, 0]);
      //     }
      //   }
      // }})
    // this.registrarPan()

    // this.planta.on('touch:drag', (evt) => {
    //   consoleLog("draaag");
    //   // this.planta.isDragging = true;
    //   // this.planta.selection = false;
    //   // consoleLog('this.planta')
    //   // consoleLog(this.planta)
    //   consoleLog('evt');
    //   consoleLog(evt);
    //   // consoleLog('evt.e.pageX');
    //   // consoleLog(evt.e.pageX);
    //   // consoleLog(this.planta.viewportTransform);
    //   // this.planta.lastPosX = evt.e.pageX;
    //   // this.planta.lastPosY = evt.e.pageY;
    //   // consoleLog(this.planta.viewportTransform);
    //   // this.planta.setViewportTransform(this.planta.viewportTransform);
    //   // this.planta.isDragging = false;

    //   var currentX = evt.self.x;
    //   var currentY = evt.self.y;
    //   var xChange = currentX - evt.e.pageX;
    //   var yChange = currentY - evt.e.pageY;

    //   if( (Math.abs(currentX - evt.e.pageX) <= 50) && (Math.abs(currentY - evt.e.pageY) <= 50)) {
    //       var delta = new fabric.Point(xChange, yChange);
    //       this.planta.relativePan(delta);
    //   }

    // })
  }

  registrarPanZoom(){
    consoleLog(this.planta.getZoom());
    consoleLog('this.planta.getZoom()');
    this.planta.on({
      'touch:gesture': (e)=> {
          if (e.e.touches && e.e.touches.length == 2) {
              this.pausePanning = true;
              consoleLog(e);
              var point = new fabric.Point(e.self.x, e.self.y);
              if (e.self.state == "start") {
                this.zoomStartScale = this.planta.getZoom();
              }
              var delta = this.zoomStartScale * e.self.scale;
              this.planta.zoomToPoint(point, delta);
              this.pausePanning = false;
          }
      },
      'object:selected': ()=> {
          this.pausePanning = true;
      },
      'selection:cleared': ()=> {
          this.pausePanning = false;
      },
      'touch:drag': (e)=> {
        consoleLog("tamo aqui?")
        consoleLog(e);
        if (this.pausePanning == false && undefined != e.e.targetTouches && undefined != e.e.targetTouches[0].clientX){ //&& undefined != e.e.layerX && undefined != e.e.layerY) {
          var currentX = e.e.targetTouches[0].clientX;
          var currentY = e.e.targetTouches[0].clientY;
          var xChange = currentX - this.lastX;
          var yChange = currentY - this.lastY;

          if( (Math.abs(currentX - this.lastX) <= 50) && (Math.abs(currentY - this.lastY) <= 50)) {
              var delta = new fabric.Point(xChange, yChange);
              this.planta.relativePan(delta);
          }

          this.lastX = e.e.targetTouches[0].clientX;
          this.lastY = e.e.targetTouches[0].clientY;
        }
      }
  });

    // this.planta.on('mouse:down', (opt) => {
    //   var evt = opt.e;
    //   // if (evt.alt_key==true)
    //   // if (this.planta.getActiveObjects().length == 0) {
    //   // alert(opt.button);
    //   if (opt.button === 1) {
    //     this.planta.isDragging = true;
    //     this.planta.selection = false;
    //     this.planta.lastPosX = evt.clientX;
    //     this.planta.lastPosY = evt.clientY;

    //     // var plantaElement = document.getElementById('planta');
    //     // plantaElement.classList.add('ui-draggable-handle');
    //     // planta.cursor = 'grab'

    //     // var mybody = document.find('body');
    //     // mybody.addClass('waiting');   // set cursor to hourglass
    //     // setTimeout(function() {
    //     //     doSlowStuff();
    //     //     $scope.$apply();
    //     //     mybody.removeClass('waiting');  // set cursor to normal
    //     // }, 0);
    //   }
    // });
    // this.planta.on('mouse:move', opt => {
    //   if (this.planta.isDragging) {
    //     var e = opt.e;
    //     var vpt = this.planta.viewportTransform;
    //     vpt[4] += e.clientX - this.planta.lastPosX;
    //     vpt[5] += e.clientY - this.planta.lastPosY;
    //     this.planta.requestRenderAll();
    //     this.planta.lastPosX = e.clientX;
    //     this.planta.lastPosY = e.clientY;
    //   }
    // });
    // this.planta.on('mouse:up', opt => {
    //   // on mouse up we want to recalculate new interaction
    //   // for all objects, so we call setViewportTransform
    //   consoleLog("tô aqui no mouse up")
    //   consoleLog(this.planta.viewportTransform);
    //   this.planta.setViewportTransform(this.planta.viewportTransform);
    //   this.planta.isDragging = false;
    //   this.planta.selection = true;
    // });



  //   this.planta.on({
  //     'touch:gesture': function(e) {
  //       // consoleLog("gesture")
  //       //   if (e.e.touches && e.e.touches.length == 2) {
  //       //     consoleLog("dois touches")
  //       //       this.pausePanning = true;
  //       //       var point = new fabric.Point(e.self.x, e.self.y);
  //       //       if (e.self.state == "start") {
  //       //         this.zoomStartScale = this.planta.getZoom();
  //       //       }
  //       //       var delta = this.zoomStartScale * e.self.scale;
  //       //       this.planta.zoomToPoint(point, delta);
  //       //       this.pausePanning = false;
  //       //   }
  //     },
  //     'object:selected': function() {
  //       consoleLog("selected");
  //         this.pausePanning = true;
  //     },
  //     'selection:cleared': function() {
  //       consoleLog("selection clrared");
  //         this.pausePanning = false;
  //     },
  //     'touch:drag': (evt) => {
  //       consoleLog("draaag");
  //       this.planta.isDragging = true;
  //       this.planta.selection = false;
  //       this.planta.lastPosX = evt.clientX;
  //       this.planta.lastPosY = evt.clientY;

  //       // var plantaElement = document.getElementById('planta');
  //       // plantaElement.classList.add('ui-draggable-handle');
  //       // planta.cursor = 'grab'

  //       // var mybody = document.find('body');
  //       // mybody.addClass('waiting');   // set cursor to hourglass
  //       // setTimeout(function() {
  //       //     doSlowStuff();
  //       //     $scope.$apply();
  //       //     mybody.removeClass('waiting');  // set cursor to normal
  //       // }, 0);
  //         // if (this.pausePanning == false && undefined != e.e.layerX && undefined != e.e.layerY) {
  //         //   consoleLog("tá entrando no if?")
  //         //     this.currentX = e.e.layerX;
  //         //     this.currentY = e.e.layerY;
  //         //     this.xChange = this.currentX - this.lastX;
  //         //     this.yChange = this.currentY - this.lastY;

  //         //     if( (Math.abs(this.currentX - this.lastX) <= 50) && (Math.abs(this.currentY - this.lastY) <= 50)) {
  //         //         var delta = new fabric.Point(this.xChange, this.yChange);
  //         //         this.planta.relativePan(delta);
  //         //     }

  //         //     this.lastX = e.e.layerX;
  //         //     this.lastY = e.e.layerY;
  //         // }
  //     }
  // });
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
        // consoleLog("Como está vindo o dados do quadro")
        // consoleLog(dados)
        // this.prepararMapaComReservas();
        this.rodapeReservar.fecharRodape();
        this.rodapeDetalheReserva.fecharRodape();
        this.rodapeEspacoBloqueado.fecharRodape();
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
      if (event.e.touches && event.e.touches.length == 1){
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
      // backdrop: 'static',
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
