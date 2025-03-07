import { AfterViewInit, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { fabric } from 'fabric';
import { Subject, Subscription } from 'rxjs';
import { transform } from 'typescript';
import { ModalService } from '../../modal/modal.service';
import { WebService } from '../../../../../_services/web.service';
import { MapaService } from '../../../../../_services/mapa.service';
import { FormBuilder } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { QuadroFormAmenitiesComponent } from '../filtros-visualizacao/quadro-form-amenities/quadro-form-amenities.component';
import { consoleLog } from '../../../../../globals';
import { ReservaModalService } from '../reserva-modal/reserva-modal.service';
import { WorkspaceService } from '../../../../../_services/workspace.service';
import { User } from '../../../../../auth/_models/user';
import { PlantaHelper } from '../../../../../_services/planta-helper';
import { ImportarAgendaService } from '../../../../../_services/importar-agenda.service';

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  styleUrls: ["./mapa-interativo.component.scss"],
  templateUrl: "./mapa-interativo.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class MapaInterativoComponent implements OnInit, AfterViewInit, OnDestroy {

  public currentUser: User;
  public localizacoes:any[];
  public currentLocalizacaoId;
  esconderPlanta: boolean = false;
  date = new Date;
  formulario= this.formBuilder.group({
    data: [this.date.toLocaleDateString("PT")],
    hora: [`${this.date.toLocaleTimeString().slice(-8, -3)}`]
    // recursos: this.formBuilder.array([])
  })
  formularioRecursos: any;
  public espacosReservas: any[];
  public espacosReservasFiltrados: any[];
  salas:boolean = true;
  mesas:boolean = true;
  estacionamentos:boolean = true;
  fretados:boolean = true;
  categoria = -1;
  flagInicioInscricao = false;

  public planta: fabric.Canvas;
  public _clipboard;

  private subscriptions: Subscription = new Subscription();

  public tabStateManager = {
    activeState: 1
  }
  changeTab(index) {
    this.tabStateManager.activeState = index;
  }

  performOperation: Subject<any> = new Subject<any>();
  espacoSelecionado: any;
  rect: any;
  canvasJson;
  showHeader: boolean = true;
  
  groupGrid;
  groupPavimento;
  groupSalas;
  groupMesas;
  groupEstacionamentos;
  groupFretados;

  CENTER_LINE_COLOR = "blue";
  CENTER_LINE_WIDTH = .5;
  CENTER_LINE_DASH = false;
  ALIGNING_LINE_COLOR = "red";
  ALIGNING_LINE_WIDTH = .5;
  ALIGNING_LINE_DASH = true;
  COLORS = ["red", "blue", "#57648C", "#934A5F", "#C2B4D6", "#E5E5E5", "#A3C6C4"];

  pos = { x: 0, y: 0 }

  polygon: any;
  isImageDrawn: boolean = false;
  isPolygonDrawn: boolean = false;
  points = [];
  newPt: any;

  plantaHelper:PlantaHelper;

  tooltip:any;

  constructor(public webService:WebService,
    public mapaService:MapaService,
    public formBuilder:FormBuilder,
    public modalNgb:NgbModal,
    public reservaModalService:ReservaModalService,
    public modalService:ModalService,
    public workspaceService:WorkspaceService,
    public importarAgendaService:ImportarAgendaService) {
    this.currentUser = this.workspaceService.currentUser;
  }

  ngOnInit() {
    this.habilitarSalasMesasSegundoModulo();
    this.iniciarLocalizacoesTree();
    this.observarImportarAgenda();
  }

  ngAfterViewInit() {
  }

  habilitarSalasMesasSegundoModulo(){
    if(!this.workspaceService.currentUser.subdominio.modulos.includes('Smartrooms')){
      this.salas = false;
    }
    if(!this.workspaceService.currentUser.subdominio.modulos.includes('Hotdesks')){
      this.mesas = false;
      this.estacionamentos = false;
      this.fretados = false;
    }
    this.setarCategoria();
  }

  iniciarLocalizacoesTree(){
    this.mapaService.carregarLocalizacoes(this.localizacoes);
    $('#kt_tree_localizacoes').on("select_node.jstree",
      (e, data) => {
        this.currentLocalizacaoId = data.node.original.id;
        this.abrirPlanta(data.node.original.planta);
        this.carregarReservas();
        // this.mapaService.createGrid(this.planta, this.groupGrid)

        // this.planta.loadFromJSON(data.node.original.planta, ()=>{
        //   this.planta.renderAll();
        // })
        // this.mapaService.fromJson(this.planta, data.node.original.planta);
        // this.mapaService.createGrid(this.planta)
        // this.mapaService.desabilitarPavimento();
        // this.mapaService.desabilitarSalas();
        // this.mapaService.desabilitarMesas();
      }
    )
  }

  iniciarPlantaCanvas(){
    if (this.planta){
      this.planta.clear();
    }else {

      this.planta = new fabric.Canvas('planta',
      {
        fireMiddleClick: true, fireRightClick: true,
        stopContextMenu: true, selection: false,
        width: "auto", height: "400",
        backgroundColor: '#ebedf0'//'#f5f7fa'//'#F3F6F9' '#f2f3f8' 'f7f7fa',
        // defaultCursor: 'pointer'
      });//fcfcfc
    }
  }

  abrirPlanta(plantaData){
    this.iniciarPlantaCanvas();
    this.mapaService.ajustarPlantaCanvas(this.planta, 'mapa');
    this.mapaService.fromJson(this.planta, plantaData);
    this.groupGrid = this.mapaService.createGrid(this.planta);
    this.hoverEffects(this.planta);
    this.prepararModalAcoes();
    this.plantaHelper = new PlantaHelper(this.planta);
    this.plantaHelper.zoom();
  }

   hoverEffects(planta){
    planta.on('mouse:over', e => {
      this.montarHoverInEspaco(e);
      planta.renderAll();
    });
  
    planta.on('mouse:out', e => {
      this.montarHoverOutEspaco(e);
      planta.renderAll();
    });
  }

  montarHoverInEspaco(e){
    consoleLog("hoverEspaco");
    let tipo = e.target != undefined && e.target.tipo != undefined && e.target.id > 0 ? e.target.tipo : '';
    if ((tipo == 'mesa' && (this.categoria == -1 || this.categoria == 1)) || (tipo == 'estacionamento' && (this.categoria == -1 || this.categoria == 2)) || (tipo == 'fretado' && (this.categoria == -1 || this.categoria == 3))){
      consoleLog("hover Mesa");
      e.target.item(0).set("fill", e.target.backupColor+'99')
      e.target.item(1).set("fill", e.target.backupColor+'99')
      this.plantaHelper.construirTooltip(e.target)
    }
    else if(tipo == 'sala' && (this.categoria == -1 || this.categoria == 0)){
      e.target.item(0).set("fill", e.target.backupColor+'99')
      // this.construirTooltip(e.target)
    }
  }

  montarHoverOutEspaco(e){
    let tipo = e.target != undefined && e.target.tipo != undefined && e.target.id > 0 ? e.target.tipo : '';
    if ((tipo == 'mesa' && (this.categoria == -1 || this.categoria == 1)) || (tipo == 'estacionamento' && (this.categoria == -1 || this.categoria == 2)) || (tipo == 'fretado' && (this.categoria == -1 || this.categoria == 3))){
      e.target.item(0).set("fill", e.target.backupColor)
      e.target.item(1).set("fill", e.target.backupColor)
      this.plantaHelper.destruirTooltip();
    }else if(tipo == 'sala' && (this.categoria == -1 || this.categoria == 0)){
      e.target.item(0).set("fill", e.target.backupColor)
      // this.destruirTooltip();
    }
  }


  carregarReservas(){
    Helpers.setLoading(true);
    //chamer webserice pra cerregar os gente boas
    var body = {
      localizacao_id: this.currentLocalizacaoId,
      data: this.formulario.get('data').value,
      hora: this.formulario.get('hora').value,
      categoria: this.categoria
    }
    if (this.formularioRecursos){
      // JSON.stringify()
      body["recursos"] = this.formularioRecursos.get("recursos_attributes").value
    }
    this.webService.put('espacos/mapa_reserva', body)
    .subscribe(
      dados => {
        this.espacosReservas = dados.body.espacos;
        this.espacosReservasFiltrados = [...dados.body.espacos];
      // consoleLog("Como está vindo o dados do quadro")
      // consoleLog(dados)
        this.prepararMapaComReservas();
        Helpers.setLoading(false)
      },
      (error: any) => {
        this.modalService.tratarError(error)
        Helpers.setLoading(false);
      }
    )

  }

  openModalAmenities(rowId?: string) {
    let ngbModalOptions: NgbModalOptions={
          backdrop: 'static',
          keyboard: false
      }
    const modalRef = this.modalNgb.open(QuadroFormAmenitiesComponent, ngbModalOptions);
    if (this.formularioRecursos){
      modalRef.componentInstance.formulario = this.formularioRecursos;
    }
    modalRef.result.then((formularioModal) => {
      consoleLog("Como está vindo o console responseSuccess")
      consoleLog(formularioModal)
      if (formularioModal) {
        consoleLog("Entrou no If")
        // this.recursos = responseSuccess.value.recursos_attributes;
        consoleLog("this.formulario.get('recursos')")
        consoleLog(this.formularioRecursos)
        this.formularioRecursos = formularioModal;
        consoleLog("this.formulario.get('recursos')");
        consoleLog(this.formularioRecursos);
        this.carregarReservas();
        consoleLog("Passou pela chamada do carregarQuadro")
      }
    })
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

      // case 'finalizando':
      //   objeto.set({situacao: espacoReserva.situacao,
      //     backupColor: this.mapaService.stateColors.infoHeavy})
      //   objeto._objects[0].set("fill",this.mapaService.stateColors.infoHeavy);
      //   objeto._objects[1].set("fill",this.mapaService.stateColors.infoHeavy);
      //     break;

      case 'bloqueado':
        objeto.set({situacao: espacoReserva.situacao,
          backupColor: this.mapaService.stateColors.secondary})
        objeto._objects[0].set("fill",this.mapaService.stateColors.secondary);
        objeto._objects[1].set("fill",this.mapaService.stateColors.secondary);
        break;

      default:
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

      // case 'finalizando':
      //   objeto.set({situacao: espacoReserva.situacao,
      //     backupColor: this.mapaService.stateColors.infoHeavy})
      //   objeto._objects[0].set("fill",this.mapaService.stateColors.infoHeavy);
      //   objeto._objects[1].set("fill",this.mapaService.stateColors.infoHeavy);
      //     break;

      default:
        objeto._objects[0].set("fill",this.mapaService.stateColors.secondary);
        objeto._objects[0].set("stroke",this.mapaService.stateColors.secondary);
        objeto.selectable = false;
        objeto.hasControls = false;
        objeto.hoverCursor = 'default';
        break;
    }
  }

  prepararModalAcoes(){
    this.planta.on('mouse:down', event => {
      if (event.e.which == 1){
        let tipo = event.target.tipo != undefined && event.target.id > 0 ? event.target.tipo : '';
        if (tipo == 'mesa' || tipo == 'sala' || tipo == 'estacionamento' || tipo == 'fretado'){
          this.changeTab(2);
          // event.target.situacao
          // this.espacosReservasFiltrados
          this.espacosReservasFiltrados.length = 0;
          // let achou = ;
          // consoleLog(this.espacosReservas)
          // consoleLog(achou);
          this.espacosReservasFiltrados.push(this.espacosReservas.find(x=>x.id == event.target.id))
          consoleLog("osssi")
          consoleLog(event.target)

          
          // duplo clique?
          if (this.espacoSelecionado === event.target){
            // se sim, limpa a seleção. TODO: Avaliar se pode ser feita uma segunda chamada aqui.
            // alert("olha aí a oportunidade de abrir uma mini modal-tooltip detalhada e bonita")
          }else{
            this.removerSelecaoEspaco();
            this.destacarSelecaoEspaco(event.target)
          }


          // this.openNewOrEdit(event.target.atual_reserva_id, event.target.id);
        // }else if(tipo == 'sala'){
        //   this.changeTab(2);
        //   // alert(event.target.situacao);
        //   // alert(event.target.id);
        //   this.espacosReservasFiltrados.length = 0;
        //   // this.espacosReservasFiltrados.push(this.espacosReservas.find(x=>x.id == event.target.id))
        }else{
          this.recuperarTodosEspacos();
        }
        this.planta.renderAll();
      }
    });
  }

  destacarSelecaoEspaco(espacoFabric){
    espacoFabric._objects[0].set("stroke",this.mapaService.stateColors.primaryLight);
    // espacoFabric._objects[0].set("strokeWidth",2);
    espacoFabric._objects[0].set("strokeDashArray", [40, 4]);
    espacoFabric._objects[0].set("strokeUniform",true);
    this.espacoSelecionado = espacoFabric;
  }

  removerSelecaoEspaco(){
    if (this.espacoSelecionado != undefined){
      //TODO: backup e recupera a linha
      this.espacoSelecionado._objects[0].set("stroke",this.mapaService.stateColors.primary);
      // this.espacoSelecionado._objects[0].set("strokeWidth",0);
      this.espacoSelecionado = undefined;
      // this.espacoSelecionado._objects[0].set("strokeDashArray", [40, 4]);
    }
  }

  recuperarTodosEspacos(){
    this.removerSelecaoEspaco();
    this.planta.renderAll();
    this.espacosReservasFiltrados.length = 0;
    this.espacosReservasFiltrados = [...this.espacosReservas];
  }


  openNewOrEdit(reserva, espaco){
    if (reserva != undefined && reserva > 0){
      this.reservaModalService.abrirModalDetalheReserva(reserva)
      .subscribe(resultado=>{
        consoleLog("retornando do edit do card")
        consoleLog(resultado);
        if (resultado == true) {
          this.carregarReservas();
        }
      });
    }else{
      this.openModalNew(espaco);
    }
  }

  openModalNew(espaco) {
    Helpers.setLoading(true);
    var body = {
      espaco_id: espaco,
      tela: "quadro_espaco_evento", //TODO: dinamizar tela da ultima interação. ex: qrcode_check_on.
      data: this.formulario.get('data').value
    }
    var tipoModal = 'eventos';
    if (Helpers.isMobile() == true){
      tipoModal = 'simples';
    }
    this.webService.get(`reservas/new`, body)
    .subscribe(
      dados => {
        this.reservaModalService
          .fabricarAssessorista(tipoModal, 'quadro_espaco_evento', dados)
          .subscribe(resultadoModal => {
            if (resultadoModal == true) {
              this.carregarReservas();
            }
          })
        Helpers.setLoading(false)
      },
      (error: any) => {
        this.modalService.tratarError(error)
        Helpers.setLoading(false);
      }
    )
  }
  
  toggleSala(){
    if(!this.workspaceService.currentUser.subdominio.modulos.includes('Hotdesks')){return;}
    this.salas = !this.salas
    if (this.salas == false && this.mesas == false){
      this.mesas = true;
      this.estacionamentos = true;
      this.fretados = true;
    }
    this.setarCategoria();
    this.carregarReservas();
  }

  toggleMesa(){
    if(!this.workspaceService.currentUser.subdominio.modulos.includes('Smartrooms')){return;}
    this.mesas = !this.mesas;
    this.estacionamentos = !this.estacionamentos;
    this.fretados = !this.fretados;
    if (this.mesas == false && this.salas == false){
      this.salas = true;
    }
    this.setarCategoria();
    this.carregarReservas();
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
            this.carregarReservas();
          }
        })
    )
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }

}
