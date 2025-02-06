import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomainService } from './../_services/domain.service';
import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation, ElementRef, Renderer2, AfterViewInit } from "@angular/core";
import { ActivatedRoute, Router, Params, NavigationEnd, NavigationStart } from "@angular/router";
import { ScriptLoaderService } from "../_services/script-loader.service";
import { AuthenticationService } from "./_services/authentication.service";
import { AlertService } from "./_services/alert.service";
import { AlertComponent } from "./_directives/alert.component";
import { LoginCustom } from "./_helpers/login-custom";
import { Helpers } from "../helpers";
import { RegisterData, SignInData, UpdatePasswordData, ResetPasswordData } from 'angular-token/lib/angular-token.model';
import { AngularTokenService } from 'angular-token';
import { NgForm } from '@angular/forms';
import { options } from '../theme/pages/default/cadastros/empresa/empresa.module';
import { Location } from '@angular/common'
import { routerTransition } from './auth.animations';
import 'rxjs/add/operator/filter';
import { WorkspaceService } from '../_services/workspace.service';
import { consoleLog, globals } from '../globals';
import { ModalService } from '../theme/pages/default/modal/modal.service';


@Component({
	selector: ".m-grid.m-grid--hor.m-grid--root.m-page",
	templateUrl: "./auth.component.html",
	encapsulation: ViewEncapsulation.None,
})
// animations: [ routerTransition ]

export class AuthComponent implements OnInit, AfterViewInit{
	model: any = {};
	loading = false;
	returnUrl: string;
	resetTokenPassword: string;
	qrcode: string;
	loginUrl: string = "404";
	isMobile: boolean = Helpers.isMobile();
	isAnima: boolean;
	outputSignin: any;
	outputSignup: any;
	outputChangePassword: any;
	outputForgetPassword: any;
	registerData: RegisterData = <RegisterData>{};
	resetData: ResetPasswordData = <ResetPasswordData>{};
	signInData: SignInData = <SignInData>{};
	updatePasswordData: UpdatePasswordData = <UpdatePasswordData>{};
	headerInfo: any;
	contadorDebug = 0;

	workspace_route:string;
	responseWorkspace;

	@ViewChild('alertSignin', { read: ViewContainerRef, static: false }) alertSignin: ViewContainerRef;
	@ViewChild('alertSignup', { read: ViewContainerRef, static: false }) alertSignup: ViewContainerRef;
	@ViewChild('alertForgetPass', { read: ViewContainerRef, static: false }) alertForgetPass: ViewContainerRef;
	@ViewChild('alertChangePass', { read: ViewContainerRef, static: false }) alertChangePass: ViewContainerRef;
	@ViewChild('registerForm', { static: false }) registerForm: NgForm;
	@ViewChild('signInForm', { static: false }) signInForm: NgForm;
	@ViewChild('changePasswordForm', { static: false }) changePasswordForm: NgForm;
	@ViewChild('forgetPasswordForm', { static: false }) forgetPasswordForm: NgForm;
	@ViewChild('loading', { read: ViewContainerRef, static: false }) workspaceLoading: ViewContainerRef;
	@ViewChild('nao_encontrado', { read: ViewContainerRef, static: false }) workspaceNaoEncontrado: ViewContainerRef;
	@ViewChild('indefinido', { read: ViewContainerRef, static: false }) workspace_indefinido: ViewContainerRef;
	@ViewChild('acessar', { read: ViewContainerRef, static: false }) workspace_acessar: ViewContainerRef;
	@ViewChild('descobrir', { read: ViewContainerRef, static: false }) workspace_descobrir: ViewContainerRef;
	@ViewChild('restrito_signin', { read: ViewContainerRef, static: false }) workspace_restrito_signin: ViewContainerRef;
	@ViewChild('publico_signin', { read: ViewContainerRef, static: false }) workspace_publico_signin: ViewContainerRef;
	@ViewChild('forget_password', { read: ViewContainerRef, static: false }) workspaceForgetPassword: ViewContainerRef;
	// @ViewChild('descobrir', { read: ViewContainerRef, static: false }) workspace_descobrir: ViewContainerRef;
	// @ViewChild('descobrir', { read: ViewContainerRef, static: false }) workspace_descobrir: ViewContainerRef;

	constructor(private _router: Router,
		private _script: ScriptLoaderService,
		private _route: ActivatedRoute,
		private _authService: AuthenticationService,
		private _alertService: AlertService,
		private cfr: ComponentFactoryResolver,
		private ds: DomainService,
		private http: HttpClient,
		private tokenService: AngularTokenService,
		private el: ElementRef,
		private renderer: Renderer2,
		private location: Location,
		private workspaceService: WorkspaceService,
		public modalService: ModalService
	) {
		Helpers.setLoading(true);
		// consoleLog("auth.construtor");
	}

	ngOnInit() {
		// consoleLog("auth.ngOnInit");
		
		var workspace_subdominio = this._route.queryParams['workspace_subdominio'] || '/';
		// consoleLog("olha como ainda tem param no authcomeont:")
		// consoleLog(workspace_subdominio);

		if (this.workspaceService.workspace !=	undefined &&
			this.workspaceService.workspace.preparando != undefined &&
			this.workspaceService.workspace.preparando == true){
				this._router.navigate(['login/preparando']);
			}
		else if(this.ds.isClienteSubdominio()){
			if (workspace_subdominio != '/' || (this.workspaceService.workspace != undefined &&
				this.workspaceService.workspace.new_record != undefined &&
				this.workspaceService.workspace.new_record == true)){
				consoleLog("nao fazer nada, pois tamo no corre do preparandoWorkspace após confirmação já no subdominio");
			}else{

				this.workspaceService.buscarWorkspace(this.ds.subdominio)
				.subscribe(
					(response:any)=>{
						this.workspaceService.workspace = response;

						this.workspaceService.inicializarCoresWhitelabel();
						// document.documentElement.style.setProperty('--primary-hover', 'red');

						consoleLog('this.tokenService.currentAuthData');
						consoleLog(this.tokenService.currentAuthData);

						consoleLog("verificando se o user tá vindo com auth token")
						var accessToken = this._route.snapshot.queryParams['auth_token'] || '/';
						var resetToken = this._route.snapshot.queryParams['reset_password_token'] || '/';
						consoleLog(accessToken)
						if (resetToken != '/'){
							// consoleLog("Opa")
						}
						else if (accessToken != '/'){
							consoleLog("logando ele no sistema")
							this.tokenService.processOAuthCallback();
							this._router.navigate(['/']);
						}
						else if (response.provider_login == "calenda"){
							this._router.navigate(['login/publico_signin'],{skipLocationChange: true})
						}else{
							this._router.navigate(['login/restrito_signin'],{skipLocationChange: true})
						}
						Helpers.setLoading(false);
					},
					(error)=>{
						this.location.replaceState("login")
						this._router.navigate(['login/nao_encontrado'],
							{skipLocationChange: true})
						this.loading = false;
						Helpers.setLoading(false);
					}
				)
			}
		}else{

			//estamos no app, usuario começando sem workpsace nem login.
			// localStorage.setItem('plano', "pro")

			var about = localStorage.getItem('about');

			var start = localStorage.getItem('start')
			var periodo = localStorage.getItem('periodo')
			// consoleLog("olha o plano no auth compeontne")
			// consoleLog(start);
			if (about == 'true'){
				localStorage.setItem('about', '');
				this._router.navigate(['about']);
			}else if (start != undefined){
				// consoleLog("cadê o navigate?")
				this._router.navigate(['login/criar'], { skipLocationChange: true})
			}else {
				this._router.navigate(['login/acessar'], {skipLocationChange: true})
			}

		}

		// consoleLog("on init")
		// Helpers.setLoading(true);
		// this.loading = true;
		// this.model.remember = true;
		// get return url from route parameters or default to '/'
		// consoleLog("auth.component.ngOnInit");
		// consoleLog("montando returnUrl e qrcode:");
		// this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
		// this.resetTokenPassword = this._route.snapshot.queryParams['reset_password_token'] || '/';
		// consoleLog(this.returnUrl);
		// consoleLog(this.qrcode);

		// // consoleLog(this._route.snapshot);
		// consoleLog("Conferindo se return é igual signin");
		// if (this.returnUrl == 'signin') {
		// 	Helpers.setLoading(true);
		// 	this.loading = true;
		// 	this.returnUrl = "/";
		// 	consoleLog("Invocando signin passando os queryParams:");
		// 	consoleLog(this._route.snapshot.queryParams);
		// 	this.signinOutlook(this._route.snapshot.queryParams['email'], this._route.snapshot.queryParams['code'])
		// 	// this._router.navigate(['/login'], {queryParams: this._route.snapshot.queryParams});
		// 	// }else if(this.returnUrl == 'failLogin'){
		// 	//
		// 	// }else if(this.qrcode != '/'){
		// 	// if usuario previamente logado (ou cookies salovs){
		// 	//     salva na session o qrcode (talvez utilizando o localStorage(cookie/cache))
		// 	// localStorage.setItem('qrcode',this.qrcode);

		// 	//     route pra tela do qrcalenda
		// 	// this._router.navigate(['/agendamento/qrcode']);

		// 	// consoleLog(localStorage.getItem('qrcode'));

		// 	//     o componente do qrcalenda sempre inciailizará consultando a session se já existie um qrcode.
		// 	//         se ja existir o qrcode, ele ja inciialia suas modal filha.
		// 	//     caso seja dificil fazer o lance da session, é melhor só fazer o route repassando o parametro "q"
		// 	//      asssim que processar a modal, tem q deletar da session, senão toda vez q abrir vai epgar qrvelho. TOMAR MUITO CUIDADO AQUI
		// 	// }
		// 	// else{usuaio nao logado}
		// 	// salva na session, deixa o fluxo de login normal acontecer.
		// 	// e logo após o login, direcionar pro componente qrcalenda caso tenha o paraam "q" na session

		// } else if (this.resetTokenPassword != '/') {
		// 	// LoginCustom.displayChangePasswordForm();
		// 	consoleLog("dados do token service neste instnate");
		// 	consoleLog(this.resetTokenPassword);
		// 	// LoginCustom.displayChangePasswordForm();
		// 	this.editPass();
		// }
		// else {
		// 	consoleLog("nao tem redirecte. apenas termine de inicailizar o componente /login");
		// 	// consoleLog("navegando para:" + this.returnUrl);
			//  this._router.navigate([this.returnUrl]);
		// }

		this._script.load('body',
			'assets/vendors/base/vendors.bundle.min.js',
			'assets/vendors/base/vendors2.bundle.min.js',
			'assets/demo/default/base/scripts.bundle.min.js')
			.then(() => {
				// Helpers.setLoading(false);
				LoginCustom.init();
			});
	}

	ngAfterViewInit(){

	}

	signinOutlook(email, code) {
		this.loading = true;
		consoleLog("auth.component.signin chamando agora authService.login");
		this._authService.login(email, code);
		consoleLog("auth.component.signin navegando para:" + this.returnUrl);
		this._router.navigate([this.returnUrl]);
		// Helpers.setLoading(false);
	}

	signin() {
		this.loading = true;
		// this._authService.loginB(this.model.email, this.model.password).subscribe(
		//     data => {
		// this._router.navigate([this.returnUrl]);
		// },
		// error => {
		//     this.showAlert('alertSignin');
		//     this._alertService.error(error);
		//     this.loading = false;
		// });

		this.tokenService.signIn(this.signInData)
			.subscribe(
				res => {
					this.outputSignin = res;
					consoleLog(this.outputSignin);
					if (this.outputSignin.status == 200) {
						consoleLog(localStorage.getItem("currentUser"));
						this._router.navigate([this.returnUrl]);
					}
					// this.signInForm.resetForm;
				}, error => {
					this.outputSignin = error;
					consoleLog(this.outputSignin);
					// this.signInForm.resetForm;
				}

			).add(() => { this.loading = false; });
	}

	signup() {
		this.loading = true;
		this.registerData.passwordConfirmation = this.registerData.password;
		this.tokenService.registerAccount(this.registerData)
			.subscribe(
				res => {
					this.outputSignup = res;
					consoleLog(this.outputSignup);
					// this.registerForm.resetForm();
					if (this.outputSignup.status == "success") {
						localStorage.setItem('currentUser', JSON.stringify(this.outputSignup.data));
						consoleLog(localStorage.getItem("currentUser"));
						this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
						consoleLog("return url:::");
						consoleLog(this.returnUrl);
						this._router.navigate([this.returnUrl]);
					}
				}, error => {
					this.outputSignup = error;
					consoleLog(this.outputSignup);
					// this.registerForm.resetForm();
				}
			).add(() => { this.loading = false; })

		// FIX this._userService.create(this.model)
		//     .subscribe(
		//     data => {
		//         this.showAlert('alertSignin');
		//         this._alertService.success('Thank you. To complete your registration please check your email.', true);
		//         this.loading = false;
		//         LoginCustom.displaySignInForm();
		//         this.model = {};
		//     },
		//     error => {
		//         this.showAlert('alertSignup');
		//         this._alertService.error(error);
		//         this.loading = false;
		//     });
	}

	changePassword() {
		this.loading = true;
		var header = new HttpHeaders();
		header.append('Content-Type', 'application/json');
		header.append('Accept', 'application/json;q=0.9,*/*;q=0.8'); // Fix for Firefox
		header.append('access-token', this.headerInfo.token);
		header.append('client', this.headerInfo.client_id);
		header.append('expiry', this.headerInfo.expiry);
		header.append('uid', this.headerInfo.uid);
		header.append('token-type', 'Bearer');

		var body = {
			password: this.updatePasswordData.password,
			password_confirmation: this.updatePasswordData.passwordConfirmation,
			reset_password_token: this.resetTokenPassword,
			uid: this.headerInfo.uid
		}

		this.http.put(`${this.ds.getHost()}/auth/password.json`,
			body, { headers: header })
			.subscribe((response: Response) => {
				consoleLog("voltou da troca");
				consoleLog(response);
				LoginCustom.displaySignInForm();
				this.outputSignin = response;
				this.signInData.login = this.headerInfo.uid;
				this.loading = false;
			},
				(error: any) => {
					consoleLog(error.error.errors[0])
					this.outputChangePassword = error;
					;
					this.loading = false;
				}

			);
		// let body = { search: { reset_password_token: this.resetTokenPassword, redirect_url: 'auth/password' } };

		// this.outputChangePassword = null;
		// this.tokenService.updatePassword(this.updatePasswordData).subscribe(
		//     res => {
		//         this.outputChangePassword = res;
		//         this.changePasswordForm.resetForm();
		//     }, error =>{
		//         this.outputChangePassword = error;
		//         this.changePasswordForm.resetForm();
		//     }
		// )
	}

	forgetPass() {
		this.loading = true;
		// Helpers.setLoading(true);
		this.resetData.login = this.signInData.login;
		this.tokenService.resetPassword(this.resetData).subscribe(
			res => {
				// if 
				// this.showAlert('alertSignin');
				// this._alertService.success('Beleza! As instruções para nova senha foram enviadas a seu e-mail.', true);
				this.loading = false;
				consoleLog(res);
				// Helpers.setLoading(false);
				this.outputForgetPassword = res;
				// LoginCustom.displaySignInForm();
				this.model = {};
			}, error => {
				consoleLog(error);
				// Helpers.setLoading(false);
				// this.showAlert('alertForgetPass');
				// this._alertService.error(error);
				this.outputForgetPassword = error;
				this.loading = false;
			}
		);
	}

	editPass() {
		// this._route.queryParams.subscribe((params: Params) => {
		var header = new HttpHeaders();
		header.append('Content-Type', 'application/json');
		// let body = { search: { reset_password_token: this.resetTokenPassword, redirect_url: 'auth/password' } };

		this.http.get(`${this.ds.getHost()}/auth/password/edit.json?reset_password_token=${this.resetTokenPassword}`,
			{ headers: header })
			.subscribe(
				(res) => {
					this.headerInfo = res;
					consoleLog("OVO PAROU NO MAP?")
					consoleLog(this.headerInfo);
					Helpers.setLoading(false);
					LoginCustom.displayChangePasswordForm();
					// this.bloquearSubmit = false;
					// this.modalService.tratarSucesso(response, this.activeModal);
				},
				(error: any) => {
					Helpers.setLoading(false);
					this.outputChangePassword = "Ops. Tivemos um problema no preparo dessa requisição."
					// err => {
					//     this._alertService.error('Password could not be reset with this token');
					//     this._router.navigate(['/users/signin']);
					// }
					// );
					// this.bloquearSubmit = false;
					// this.modalService.tratarError(error);
				}
			);



	}

	showAlert(target) {
		this[target].clear();
		let factory = this.cfr.resolveComponentFactory(AlertComponent);
		let ref = this[target].createComponent(factory);
		ref.changeDetectorRef.detectChanges();
	}

	// esqueceuSenha() {
	// 	this.transicionar(this.workspaceForgetPassword, this.workspace_publico_signin);
	// }

	// cancelarEsqueceuSenha(){
	// 	consoleLog("caiu?");
	// 	this.transicionar(this.workspace_publico_signin, this.workspaceForgetPassword);
	// }

	// workspaceAcessar() {
	// 	this.transicionar(this.workspace_acessar, this.workspace_indefinido);
	// 	const element = this.renderer.selectRootElement('#workspace_input')
	// 	setTimeout(()=>element.focus(), 0);
	// }

	// workspaceNaoEncontradoParaAcessar(){
	// 	this.transicionar(this.workspace_acessar, this.workspaceNaoEncontrado);
	// 	const element = this.renderer.selectRootElement('#workspace_input')
	// 	// element.value = this._route.params['workspace'];
	// 	setTimeout(()=>element.focus(), 0);
	// }

	// volta() {
	// 	this.transicionar(this.workspace_indefinido, this.workspace_acessar);
	// }

	// descobri(){
	// 	this.transicionar(this.workspace_descobrir, this.workspace_acessar);
	// }

	// voltarAcessar(){
	// 	this.transicionar(this.workspace_acessar, this.workspace_descobrir);
	// }

	// workspaceSignin(workspace){
	// 	this.responseWorkspace = workspace;
	// 	this.location.replaceState(this.responseWorkspace.workspace_route);
	// 	if (this.responseWorkspace.authorize_url){
	// 		this.transicionar(this.workspace_restrito_signin,this.workspace_acessar);
	// 	}else{
	// 		this.transicionar(this.workspace_publico_signin, this.workspace_acessar);
	// 	}
	// }

	getState(outlet) {
    return outlet.activatedRouteData.state;
	}
	
	habilitarDebug(){
		this.contadorDebug++;
		// consoleLog(this.contadorDebug);
		if (this.contadorDebug > 9){
			globals.debug = true;
		}
	}

	termosDeUso(){
		this.modalService.tratarMensagem("teste", "oi")
	}

	logoCustom(){
		if (this.workspaceService.workspace != undefined &&
			this.workspaceService.workspace.carousel_logo != undefined &&
      this.workspaceService.workspace.carousel_logo.length > 0){
      return this.workspaceService.workspace.carousel_logo[0].url;
    }else{
      return './assets/app/media/img/logos/mv2a.svg'
    }
		// background: linear-gradient(to bottom right, rgb(113, 106, 202), rgb(69, 90, 255));
	}

}

//TODO: descobrir pq q nao consigo reiniciar o fluxo;

