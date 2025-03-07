import { FormGroup, Validators } from '@angular/forms';
import { ModalService } from './../../pages/default/modal/modal.service';
import { User } from './../../../auth/_models/user';
import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { Helpers } from '../../../helpers';
import { Meta } from '@angular/platform-browser';
import { DomainService } from '../../../_services/domain.service';
import { NavigationEnd, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { globals, consoleLog } from '../../../globals';
import { version } from '../../../../../package.json';
import { WorkspaceService } from '../../../_services/workspace.service';
import { WebService } from '../../../_services/web.service';
import { AngularTokenService, ResetPasswordData } from 'angular-token';
import { ReservaModalService } from '../../pages/default/reservas/reserva-modal/reserva-modal.service';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs/operators';
import { SwUpdate } from '@angular/service-worker';
import { UpdateService } from '../../../_services/update.service';
import { interval, Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoadingService } from '../../../_services/loading.service';
import { CalendaNpsService } from '../../pages/default/cadastros/calenda-nps/calenda-nps.service';

declare function getStatus(): boolean;
declare function abrirChat(): any;
declare function esconderChat(): any;
declare let mLayout: any;

@Component({
	selector: "app-header-nav",
	templateUrl: "./header-nav.component.html",
  styleUrls: ['./header-nav.component.scss'],
	encapsulation: ViewEncapsulation.None,
	standalone: false
})
export class HeaderNavComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
	private currentUser: any;
	private unidades: any;
	private unidadeSelecionada: any;
	_version = version;
	subscriptions:Subscription = new Subscription();
	newVersionApi = "";
	notifications = [];
	timeToGetNotification = 180000;
	timerIterval: any;
	
  flagASideMenu:boolean=false;
	
	isIndex: boolean = true;
	atualizado: boolean = true;
	isMobile: boolean = Helpers.isMobile();
	primeiroNome: string;
	public unidade: any;
	public teste;
	public unidadeNomeSelecionada;
	@ViewChild('modal', {static: false}) public modal: ElementRef;
	@ViewChild('closeModal', {static: false}) public closeModal: ElementRef;
	@ViewChild('dropdownUpdateVersion', {static:false, read: NgbDropdown}) dropdownUpdateVersion: NgbDropdown;
	// @ViewChild('dropdownUpdateVersion', { static: true }) dropdownUpdateVersion: NgbDropdown;
	// @ViewChild(NgbDropdown) public dropdown: NgbDropdown;
	// @ViewChild(NgbDropdown) private dropdown: NgbDropdown;


	// public static updateUserStatus: Subject<boolean> = new Subject();
	constructor(
		private _router: Router,
		private metaService: Meta,
		private http: HttpClient,
		private ds: DomainService,
		private modalService: ModalService,
		private workspaceService: WorkspaceService,
		public tokenService: AngularTokenService,
		public reservaModalService: ReservaModalService,
		private webService: WebService,
		public updates: SwUpdate,
		public CalendaNpsModalService: CalendaNpsService,
		public loadingService: LoadingService
		// private updateService: UpdateService
		) {
			this.currentUser = this.workspaceService.currentUser;
			this.unidades = this.workspaceService.unidades;
			this.unidadeSelecionada = this.workspaceService.unidadeSelecionada;
			consoleLog("header-nav.component");
			consoleLog("preencher currentUser");
			consoleLog(this.currentUser);
			consoleLog("")
	
			

		//     this.teste = JSON.parse(localStorage.getItem('currentUser'));
		// })
	}
	
	ngOnInit() {
		this.getNotifications();
		
		if (environment.production == true){
			this.checkForUpdates();
			consoleLog("chamando um check update diretão de largada")
			this.updates.checkForUpdate()
				.then((evt) => {
					consoleLog("ooooopa")
					consoleLog('check update: checking for update entrou no then. evt:')
					consoleLog(evt)
				})
			this.inscreverAtualizacoes();
		}

		// this.updateService.checkForUpdates();
		// consoleLog("service worker no header nav")
		// consoleLog("enabled? ")
		// this.updates.checkForUpdate
		// consoleLog(this.updates.isEnabled);
		// this.updates.activated.subscribe((evt) =>{
		// 	consoleLog('subscribe activaded');
		// 	consoleLog(evt)
		// })
		// this.updates.available.subscribe((evt) =>{
		// 	consoleLog('subscribe available');
		// 	consoleLog(evt)
		// })

		if (this.currentUser != null && this.currentUser.name != null){
			this.primeiroNome = this.currentUser.name.split(" ")[0];
		}
		// if (!this.isMobile){
			// }

		this._router.events.pipe(
			filter(event => event instanceof NavigationEnd)
		)
			.subscribe(event => {
				this.isIndex = (<any>event).url == '/index'
			});
	}

	async getNotificationsAgain(): Promise<void> {
		this.timerIterval = setInterval(() => {
			this.webService.get(`notifications`, {})
			.subscribe(
				response =>{
					this.notifications = response;
				},
				(error) => {
					this.modalService.tratarError(error);
				}
			)
		},this.timeToGetNotification)
	}

	async getNotifications(): Promise<void> {
		this.webService.get(`notifications`, {})
		.subscribe(
			response =>{
				this.setNotifications(response);
			},
			(error) => {
				this.modalService.tratarError(error);
			}
		)
	}

	readNotification(id, read) {
		if (read === false) {
			this.webService.put(`notifications/${id}/read`, {})
      .subscribe(
        response =>{
					this.setNotifications(response.body);
        },
        (error) => {
          Helpers.setLoading(false);
          this.modalService.tratarError(error);
        }
      )
		}
	}

	readAllNotifications() {
		this.webService.post(`notifications/read_all`, {})
		.subscribe(
			response =>{
				this.setNotifications(response.body);
			},
			(error) => {
				Helpers.setLoading(false);
				this.modalService.tratarError(error);
			}
		)
	}

	setNotifications(response){
		consoleLog(response)
		this.notifications = response
		// if (this.timerIterval) { clearInterval(this.timerIterval); }
		// this.getNotificationsAgain();
	}

	public inscreverAtualizacoes(){
		consoleLog("inscreverAtualizações: entru no inscreverAtualizações()")
		if (this.updates.isEnabled) {
      consoleLog("inscreverAtualizações: tá enabled sim. fazendo interval de 5 horas");
      interval(1000 * 60 * 6).subscribe(() => {
				consoleLog("inscreverAtualizações: deu um intervalo. tá na hora de chamar o check for update")
				this.updates.checkForUpdate()
        .then((evt) => {
          consoleLog('inscreverAtualizações: checking for update entrou no then. evt:')
          consoleLog(evt)
        })
			});
    }
	}

	public checkForUpdates(): void {
    consoleLog("checkForUpdates: entrou no checkForUpdates()");
		this.subscriptions.add(
			this.updates.available.subscribe(event => {
				consoleLog("checkForUpdates: updates.available disparou evento e caiu no then:");
				consoleLog(event);
				this.promptUser();
			})
		)
  }

  private promptUser(): void {
    consoleLog('prompUser. enntrou no prompUser.');
    this.updates.activateUpdate().then((evt) => {
      consoleLog("prompUser. Opa, tamo aqui no then do activateUpdate. evt:");
      consoleLog(evt)
			consoleLog("prompUser: bela hora pra dar reload, vamo só montar o balão");
			this.atualizado = false;
			setTimeout(() => {
				this.dropdownUpdateVersion.open();
			}, 1000);
      // document.location.reload()
    }); 
  }
		
	ngAfterViewInit() {
			// esconderChat();
			Helpers.setLoading(true);
			mLayout.initHeader();
			consoleLog("after view init header")
			// this.verificarVersao();
		// this.modalService.tratarError("Ocorreu um erro ao contactar o servidor")
		// this.modalService.montarUnidade();
	}

	ngAfterViewChecked(){
		if (this.flagASideMenu == false && document.getElementById('m_aside_left_minimize_toggle') != undefined && $('#m_aside_left').length > 0){
			document.getElementById('m_aside_left_minimize_toggle').click();
      this.flagASideMenu = true;
    }
	}

	toggleASideLeft(){
		if (this.flagASideMenu == true){
			globals.asideOpen = !globals.asideOpen;
		}
		consoleLog(globals.asideOpen);
	}

	isASideLeftToggled(){
		return !$('body').hasClass('m-aside-left--minimize');
		// return !!globals.asideOpen;
	}

	abrirCalendaNps(questionario_id){
		this.CalendaNpsModalService.abrirCustomModal(questionario_id);
	}

	atualizarVersao() {
		// location.reload(true);
		// window.location.href = window.location.href;
		location.reload();

		
		// ?reload=true
		// localStorage.setItem("reloaded", "false");
		// this._router.navigate(['/index'], { queryParams: { reload: true}});
		// window.location.assign('/');
	}

	verificarVersao() {
		this.http.get(`${this.ds.getApiUrl()}/truefalse/versao.json`)
		.subscribe(
				(response:any) => {
					consoleLog("vericiando versão Header-nav");
					consoleLog("versão do cleinte:" + version);
					consoleLog("versão do server:" + response.versao);
					this._version = version;//this.metaService.getTag("name='version'").content;
					this.newVersionApi = response.versao;
					// this.atualizado = response.versao == this._version;
					
					// consoleLog("Atualizado?" + this.atualizado);
					// if (!this.atualizado){
					// 	// location.reload();
					// 	this.dropdownUpdateVersion.open();
					// 	consoleLog("reloadiando...");
					// 	// this.atu
					// 	//location.reload(true);
					// 	// this._router.navigate(['/logout']);
					// }

				}
		)
	}

	desabilitarRadio(id){
		// consoleLog("desabilita rradio::");
		// consoleLog(this.currentUser);
		return this.currentUser.unidades.find(u=>u.id==id) == undefined;
		//this.currentUser.unidades.indexOf(id)==-1;
	}

	onGetStatus() {
		return getStatus();
	}

	openUnidadeForm() {
    this.modal.nativeElement.click();
  }

  putForm(header, body) {
		consoleLog(body);
    this.http.put(`${this.ds.getApiUrl()}/funcionarios/${this.currentUser.id}/selecionar_unidade.json`,
      body, { headers: header, observe: 'response'})
      .subscribe(
      (response) => {
				Helpers.setLoading(false);
				// window.location.assign('/');
				consoleLog("caiu aqui dsigraça");
				this.unidade = this.currentUser.unidades.find(e=>e.id==body.unidade_id)

				// this.unidade = u.id;
				consoleLog(this.unidade);
				consoleLog(this.unidade);
				this.unidadeSelecionada = this.unidade;
        // this.closeModal.nativeElement.click();
				// this.modalService.tratarSucesso(response);
				// this.renavegar();
				location.reload(true);
      },
      (error: any) => {
        Helpers.setLoading(false);
        this.modalService.tratarError(error);
      }
    );
	}
	
	setarRadio(u) {
		var header = new HttpHeaders();
		header.append('Content-Type', 'application/json');
		let funcionario = {
			unidade_id: u.id
		};
		var body = (funcionario);
		this.putForm(header, body);
	}

	renavegar(){
		this._router.routeReuseStrategy.shouldReuseRoute = function(){return false;};

		let currentUrl = this._router.url + '?';

		this._router.navigateByUrl(currentUrl)
				.then(() => {
				this._router.navigated = false;
				this._router.navigate([this._router.url]);
				consoleLog("#4:" + this.unidade);
				});
		// consoleLog("#5:" + this.unidade);
	}

	printable(){
		if (globals == undefined && globals.printable == undefined){
			return false;
		}else{
			return !globals.printable;
		}
	}

	debugable(){
		if (globals == undefined && globals.debug == undefined){
			return false;
		}else{
			return globals.debug;
		}
	}

	onDebug(){
		globals.debug = !globals.debug;
	}

	dispararEsqueciSenha(){
		this.modalService
			.tratarConfirmacao("Trocar senha", "Deseja realmente redefinir sua senha?")
			.then(response=>{
				if (response){
					Helpers.setLoading(true);
					var resetData: ResetPasswordData = <ResetPasswordData>{};
					resetData.login = this.workspaceService.currentUser.email;
					this.tokenService.resetPassword(resetData).subscribe(
						res => {
							this.modalService.tratarMensagem("E-mail enviado!", res.message);
							// this.output = res;
							Helpers.setLoading(false);
						}, error => {
							consoleLog(error);
							this.modalService.tratarError(error);
							Helpers.setLoading(false);
						}
					);
				}
			})
					
	}

	onAbrirChat(){
		abrirChat()
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
		// clearInterval(this.timerIterval);
	}

	logoCustom(){
		if (this.workspaceService.workspace.carousel_logo != undefined &&
      this.workspaceService.workspace.carousel_logo.length > 0){
      return this.workspaceService.workspace.carousel_logo[0].url;
    }else{
      return './assets/app/media/svg/logos/calenda_mh1a.svg';  
    }
	}

	logoCustomClosed(){
		if (this.workspaceService.workspace.carousel_logo != undefined &&
      this.workspaceService.workspace.carousel_logo.length > 0){
      return this.workspaceService.workspace.carousel_logo[0].url;
    }else{
      return './assets/app/media/svg/logos/calenda_full.svg';  
    }
	}
}
