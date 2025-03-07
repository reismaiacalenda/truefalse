import { Router, ActivatedRoute } from '@angular/router';
import { DomainService } from '../../../../../_services/domain.service';
import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import { ModalService } from '../../modal/modal.service';
import { ModalDismissReasons, NgbDateStruct, NgbModal, NgbActiveModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import moment from 'moment';
import { User } from '../../../../../auth/_models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WebService } from '../../../../../_services/web.service';
import { Body } from '@angular/http/src/body';
import { ReservaModalService } from '../reserva-modal/reserva-modal.service';
import { WorkspaceService } from '../../../../../_services/workspace.service';
import { Subscription } from 'rxjs';
import { consoleLog } from '../../../../../globals';
import { ImportarAgendaService } from '../../../../../_services/importar-agenda.service';

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",//app-calendar-basic
  templateUrl: "./agenda.component.html",
  encapsulation: ViewEncapsulation.None,
})

export class AgendaComponent implements OnInit, AfterViewInit, OnDestroy {
  [x: string]: any;
  calendarOptions: Options;
  events: any;
  @ViewChild(CalendarComponent, {static: false}) ucCalendar: CalendarComponent;
  displayEvent:any;
  private apiUrl: string;
  public listEspaco: any[];
  selectedEspaco = -1;
  isMobile:boolean = Helpers.isMobile();
  isAnima:boolean = this.domainService.isAnima();
  espaco;
  subscriptions:Subscription = new Subscription();
  agendaIdsHabilitados:any[] = [];
  data_formatar = new Date()
  flagInicioInscricao = false;
    // .toLocaleDateString('pt-BR', {timeZone: 'UTC'});

  constructor(private _script: ScriptLoaderService,
    private modalNgb: NgbModal,
    private http: HttpClient,
    private webService: WebService,
    private _router: Router,
    private route: ActivatedRoute,
    private modalService: ModalService,
    private domainService: DomainService,
    private reservaModalService: ReservaModalService,
    private importarAgendaService: ImportarAgendaService)  {
      this.apiUrl = `${domainService.getApiUrl()}/reservas`
  }


  ngOnInit() {
    consoleLog("id do bixin:")
    consoleLog(this.route.snapshot.params['id'] || '0');
    this.inicializarCalendario();
    this.popularList();
    consoleLog(this.calendarOptions);
    // this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
    // var body = localStorage.getItem("agendaBody");
    // if (body != undefined){
    this.observarImportarAgenda();

    // }
  }

  configTelaReserva(){
    this.reservaModalService.configTelaReserva()
  }

  parametrizacoes(){
    this.reservaModalService.parametrizacoes()
  }

  ngAfterViewInit(){
  }

  inicializarCalendario(){
    consoleLog("inicializar calendario")
    consoleLog(this.selectedEspaco);
    // Helpers.setLoading(true);
    // this.webService.get(`reservas/${this.selectedEspaco}/calendario`)
    // .subscribe(dados => {
    //   consoleLog(dados);
      this.events = [];
      this.calendarOptions = {
        events: this.events,
        header: {
          left: 'prevYear,prev,next,nextYear today',
          center: 'title',
          right: (this.isMobile ? '' : 'month,listWeek,agendaDay')
        },
        buttonText: {
          day: 'dia',
          list: 'sem',
          month: 'mês',
          today: 'hoje',
          prev: '<',
          next: '>',
          prevYear: '<<',
          nextYear: '>>'
        },
        // buttonIcons:{
        //     prev: 'la-angle-double-right',
        //     next: 'la la-angle-double-right',
        //     prevYear: 'la-angle-double-right',
        //     nextYear: 'la-angle-double-right'
        // },
        locale: 'pt-br',
        timeFormat: 'HH:mm',
        //calendario
        defaultView: (this.isMobile ? 'listWeek' : 'month'),
        showNonCurrentDates: false,
        editable: false,
        hiddenDays: [],
        aspectRatio: 1.6,
        // height: '100%',
        selectable: true,
        // navLinks: true,
        // navLinkDayClick: function(date, jsEvent) {
            //     consoleLog('day', date.format()); // date is a moment
            //     // consoleLog('coords', jsEvent.pageX, jsEvent.pageY);
            //     this.ucCalendar.
            // },
        //Event Popopver
        eventLimit: 3,
        eventLimitText: "reservas",

        //mês
        fixedWeekCount: false,

        //lista semana
        noEventsMessage: 'Sem reservas para esse período.',

        //agenda dia
        allDayText: 'Dia inteiro',
        allDaySlot: false,
        slotEventOverlap: true,
        nowIndicator: true,
        minTime: moment.duration('06:00'),
        scrollTime: moment.duration("08:00"),
        maxTime: moment.duration('22:00'),
        businessHours: {
          dow: [1,2,3,4,5],
          start: '08:00',
          end: '19:00'
        },

      }
      Helpers.setLoading(false);
    // });
    // consoleLog(this.calendarOptions);
  }

  reiniciarCalendario(data?, agendaIdsHabilitados?){
    consoleLog("reinicializar calendario")
    Helpers.setLoading(true);
    if (agendaIdsHabilitados != undefined){
      this.agendaIdsHabilitados = agendaIdsHabilitados
    }
    var body = {
      agenda_ids_habilitados: this.agendaIdsHabilitados.join(',')
    }
    if (data != undefined) {
      body["data"] = new Date(data).toLocaleString('pt-BR', {timeZone: 'UTC'})
    }else{
      body["data"] = new Date(this.data_formatar).toLocaleString('pt-BR', {timeZone: 'UTC'})
    }

    this.events = [];
    this.webService.get(`reservas/${this.selectedEspaco}/calendario`, body)
     .subscribe(dados => {
       consoleLog((<any>dados).reservas);
       this.events = (<any>dados).reservas;
    }).add(()=>{Helpers.setLoading(false);})
  }

  clickButton(e) {
    consoleLog(e);
    this.displayEvent = e;
    this.data_formatar = this.displayEvent.data._d;
    if ((e.buttonType == "prev" || e.buttonType == "prevYear" ||
    e.buttonType == "next" || e.buttonType == "nextYear" ||
    e.buttonType == "today")){
      consoleLog(e.data._d);
      this.reiniciarCalendario(e.data._d)
    }
    consoleLog("clickButton");
    consoleLog(e.data._d);
    consoleLog(this.displayEvent.data._d) // <- PROCURAR A DATA AQUI (this.displayEvent.data._d)
    consoleLog("display event");
    consoleLog(this.displayEvent);
    consoleLog("data_formatar");
    consoleLog(this.data_formatar);
  }

  eventClick(model: any) {
    model = {
      event: {
        id: model.event.id,
        start: model.event.start,
        end: model.event.end,
        title: model.event.title,
        allDay: model.event.allDay
        // other params
      },
      duration: {}
    }
    consoleLog("event click chamando service de  modal detalhe reserva");
    this.reservaModalService.abrirModalDetalheReserva(model.event.id)
      .subscribe(resultado=>{
        consoleLog("abrimodaldetalhe reserva retornando subscribe. resultado:")
        consoleLog(resultado)
        if (resultado == true){
          this.reiniciarCalendario();
        }
      });
    this.displayEvent = model;
  }

  eventMouseover(model: any){
    model = {
        event: {
          id: model.event.id,
          start: model.event.start,
          end: model.event.end,
          title: model.event.title,
          allDay: model.event.allDay
          // other params
        },
        duration: {}
      }
      this.displayEvent = model;
  }

  updateEvent(model: any) {
    model = {
      event: {
        id: model.event.id,
        start: model.event.start,
        end: model.event.end,
        title: model.event.title
        // other params
      },
      duration: {
        _data: model.duration._data
      }
    }
    this.displayEvent = model;
    consoleLog("updateEvent");
  }

  dayClickEvent(event){
    consoleLog("Day Click Event")
    consoleLog(event.detail.date._d)
    this.data_formatar = event.detail.date._d;
  }

  // openFormModal(rowId?: string) {
  //  let ngbModalOptions: NgbModalOptions={
  //    backdrop: 'static',
  //    keyboard: false
  //  }
  //   const modalRef = this.modalNgb.open(ReservaModalSimplesFormComponent, ngbModalOptions);
  //   modalRef.componentInstance.rowId = rowId;
  //   modalRef.componentInstance.selectedEspaco = this.selectedEspaco;
  //   modalRef.result.then((responseSuccess) => {
  //   if (responseSuccess) {
  //     this.reiniciarCalendario();
  //   }
  //  })
  // }

  montarBodyAgendar(){
    return {
      data: new Date(this.data_formatar).toLocaleString('pt-BR', {timeZone: 'UTC'}),
      tela: 'calendario_'
    }
  }

  openFormModalEdit(rowId: string) {
    consoleLog("open form modal edit");
    Helpers.setLoading(true);
    this.webService.get(`reservas/${rowId}/edit`)
    .subscribe(
      dados => {
        this.reservaModalService.fabricarAssessorista(dados.tipo_reserva, dados.tela, dados)
        .subscribe(resultadoModal=>{
          if (resultadoModal == true){
            this.reiniciarCalendario();
          }
        });
        Helpers.setLoading(false)
      },
      (error: any) => {
        this.modalService.tratarError(error)
        Helpers.setLoading(false);
      }
    )
  }

  popularList(){
    consoleLog("tá achgenado aqui");
    Helpers.setLoading(true);
    let h = new HttpHeaders({
      // 'unidade': Helpers.getUnidade().id.toString()
    });
    consoleLog(h);
    consoleLog(h.get("unidade"));
    this.webService.get(`espacos`)
    .subscribe(
      dados => {
        this.listEspaco = (<any>dados).espacos;
        var paramUrl = parseInt(this.route.snapshot.params['id'] || '0')
        if (isNaN(paramUrl)){paramUrl = 0};
        consoleLog("resultado ParamUrl:");
        consoleLog(paramUrl);
        var buscarEspaco = this.listEspaco.find(s=> s.id == paramUrl)
        consoleLog(buscarEspaco);
        if (buscarEspaco == undefined){
          this.selectedEspaco = -1;//this.listEspaco[0].id;
        }else{
          this.selectedEspaco = buscarEspaco.id;
        }
        consoleLog(this.selectedEspaco);
        // this.inicializarCalendario();
        Helpers.setLoading(false);
      }
    )
  }

  navLinkDayClick(){
    consoleLog("naaa");
  }

  navLinkWeekClick(){
    consoleLog("naaa");
  }

  observarImportarAgenda(){
    this.subscriptions.add(
      this.importarAgendaService.observarImportacao$
        .subscribe(item=>{
          consoleLog("mudou,chamou");
          if (this.flagInicioInscricao == false){
            this.flagInicioInscricao = true;
          }else {
            this.reiniciarCalendario();
          }
        })
    )
  }

  ngOnDestroy(){
    consoleLog("destruindo calendario")
    consoleLog(this.subscriptions);
    this.subscriptions.unsubscribe();
  }

}
