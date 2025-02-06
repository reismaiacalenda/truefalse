// import { UnidadeFormComponent } from './unidade-form/unidade-form.component';
import { User } from './../../../../auth/_models/user';
import { Component, OnInit, ViewEncapsulation, AfterViewInit, AfterViewChecked, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { RequestOptions } from '@angular/http';
import { DomainService } from '../../../../_services/domain.service';
import { ModalService } from '../modal/modal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReservaModalService } from '../reservas/reserva-modal/reserva-modal.service';
import { consoleLog } from '../../../../globals';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { WebService } from '../../../../_services/web.service';
import { ShepherdService } from 'angular-shepherd';
import { WorkspaceService } from '../../../../_services/workspace.service';
import { Subscription } from 'rxjs';
import { MiniCalendarIndexComponent } from './mini-calendar-index/mini-calendar-index.component';
import { JornalHotdeskComponent } from './jornal-hotdesk/jornal-hotdesk.component';
import { JornalSmartroomComponent } from './jornal-smartroom/jornal-smartroom.component';
import { JornalServicosRecursosComponent } from './jornal-servicos-recursos/jornal-servicos-recursos.component';
import { CheckModalService } from '../reservas/checks-modal/check-modal.service';
// import { steps as defaultSteps, defaultStepOptions} from '../data';

// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare function setarOcupacao(data): any;
declare function setarFrequencia(data): any;
declare function setarSituacao(data): any;
declare function abrirChat(): any;

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./index.component.html",
  encapsulation: ViewEncapsulation.None
})
export class IndexComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  isMobile:boolean = Helpers.isMobile();
  engajamento:any;
  nps:any;
  jornal:any;
  date_param:any = '';
  @ViewChild(MiniCalendarIndexComponent,{static:false}) miniCalendar:MiniCalendarIndexComponent;
  @ViewChild(JornalHotdeskComponent,{static:false}) jornalHotdesk:JornalHotdeskComponent;
  @ViewChild(JornalSmartroomComponent,{static:false}) jornalSmartroom:JornalSmartroomComponent;
  @ViewChild(JornalServicosRecursosComponent,{static:false}) jornalServicosRecursos:JornalServicosRecursosComponent;

  constructor(
    public http: HttpClient,
    public ds: DomainService,
    public webService:WebService,
    public modalService: ModalService,
    public workspaceService: WorkspaceService,
    public reservaModalService: ReservaModalService,
    public shepherdService: ShepherdService,
    public _route: ActivatedRoute,
    private checkModalService: CheckModalService,
    ) {
  }

  ngOnInit() {
    var qrUnidadeId = this._route.snapshot.queryParams['u'] || '/';
    if (qrUnidadeId != '/'){
      this.webService.get(`checks/new?unidade_id=${qrUnidadeId}`)
        .subscribe(response=>{
          //TODO: verificiar priemiro se existe a key check_type. nao sei se esse if funciona de prima.
          if (response['check_type'] == "in" || response['check_type']=="out" || response['check_type']==null){
            this.checkModalService.fabricarModalCheck(response)
            .subscribe(()=>{
              // this.carregarQuestionarios();
              this.carregarJornalCalendario();
            })
          }
          Helpers.setLoading(false)
        },
        (error: any) => {
          this.modalService.tratarError(error)
          Helpers.setLoading(false);
        });
    }else{
      // this.carregarQuestionarios();
      this.carregarJornalCalendario();
    }
    // consoleLog("repassou aqui");
    // var bool = (this._route.snapshot.queryParams["reload"] || "false") == "true";
    // consoleLog(bool);
    // if (bool){
    //   consoleLog("reloaded?")
    //   var reloaded = localStorage.getItem("reloaded");
    //   consoleLog(reloaded);
    //   if (reloaded == undefined || reloaded == "false"){
    //     localStorage.setItem("reloaded", "true");
    //     // window.location.reload(true);
    //   }
    // }

    // if (reloaded != undefined || reloaded != "false"){

    // }
    // Helpers.setLoading(true);
    // this.carregarRelatorios();
  }

  ngAfterViewInit() {
    // this._script.load('body',
    // 'assets/app/js/data.js');

    var flagTour = (this._route.snapshot.queryParams["tour"] || "false") == "true";
    if (flagTour){
      // this.tour();
    }

    var flagBoasvindas = (this._route.snapshot.queryParams["boasvindas"] || "false") == "true";
    if (flagBoasvindas){
      this.boasVindas();
    }

    if (flagTour == false && flagBoasvindas == false){
      var cacheBoasVindas = localStorage.getItem('boasvindas');
      if (cacheBoasVindas == undefined || cacheBoasVindas != 'true'){
        localStorage.setItem('boasvindas', 'true')
        setTimeout(()=>{this.boasVindas()}, 2000);
      }
    }


  }

  ngAfterViewChecked(){

  }

  boasVindas(){
    this.modalService.abrirBoasVindas().then(result=>{
      if (result == true){
        // this.tour();
      }
    });
  }

  convidarPessoas() {
    this.reservaModalService.abrirModalConvidarPessoas();
  }

  tour(){
    this.shepherdService.start();

    // const tour = new Shepherd.Tour({
    //   defaultStepOptions: {
    //     cancelIcon: {
    //       enabled: true
    //     },
    //     classes: 'class-1 class-2',
    //     scrollTo: { behavior: 'smooth', block: 'center' }
    //   }
    // });

  }

  onAbrirChat(){
		abrirChat()
	}

  carregarQuestionarios(){
    Helpers.setLoading(true);
    this.webService.get(`questionarios/dashboard`)
		.subscribe(
			response =>{
        if (response.questionarios[0].template_enum == 'engajamento'){
          this.engajamento = response.questionarios[0];
          this.nps = response.questionarios[1];
        }else{
          this.nps = response.questionarios[0];
          this.engajamento = response.questionarios[1];
        }
        Helpers.setLoading(false);
				//this.modalService.tratarSucesso(response)
			},
			(error) => {
				Helpers.setLoading(false);
				this.modalService.tratarError(error);
			}
		)
  }

  carregarJornalCalendario(date?){
    Helpers.setLoading(true);
    if (date != undefined){
      this.date_param = '?date=' + date;
    }
    this.subscriptions.add(
      this.webService.get(`reservas/jornal/${this.date_param}`)
        .subscribe( dados => {
            consoleLog("retornou /jornla")
            consoleLog(dados);
            this.jornal = dados.jornal;
            this.miniCalendar.jornal = dados.jornal;
            this.miniCalendar.update();
            if (this.jornalSmartroom != undefined){
              this.jornalSmartroom.jornal = dados.jornal;
            }
            if (this.jornalHotdesk != undefined){
              this.jornalHotdesk.jornal = dados.jornal;
            }
            if (this.jornalServicosRecursos != undefined){
              this.jornalServicosRecursos.jornal = dados.jornal;
            }
            consoleLog("recebeu coletar jornal")
            Helpers.setLoading(false)
          },
          (error: any) => {
            this.modalService.tratarError(error)
            Helpers.setLoading(false);
          }
        )
      )
  }

  alterarDiaJornal(evento){
    console.log('alterarDiaJornal');
    console.log(evento);
    if (evento.monthChanged == true){
      this.carregarJornalCalendario(evento.date);
    }
    if (this.jornalSmartroom != undefined){
      this.jornalSmartroom.diaSelecionado = evento.day;
      this.jornalSmartroom.date = evento.date;
    }
    if (this.jornalHotdesk != undefined){
      this.jornalHotdesk.diaSelecionado = evento.day;
      this.jornalHotdesk.date = evento.date
    }
    if (this.jornalServicosRecursos != undefined){
      this.jornalServicosRecursos.diaSelecionado = evento.day;
      this.jornalServicosRecursos.date = evento.date
    }
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }

}
