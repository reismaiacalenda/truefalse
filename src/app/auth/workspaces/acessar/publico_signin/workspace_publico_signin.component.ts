import { Component, AfterViewInit, ElementRef, Renderer2, OnInit } from '@angular/core';
import { WorkspaceService } from '../../../../_services/workspace.service';
import { AngularTokenService, SignInData } from 'angular-token';
import { Helpers } from '../../../../../app/helpers';
import { Router } from '@angular/router';
import { globals, consoleLog } from '../../../../globals';
import { DomainService } from '../../../../_services/domain.service';

@Component({
	selector: "workspace-publico-signin",
	templateUrl: "./workspace_publico_signin.component.html"
})

export class WorkspacePublicoSigninComponent implements OnInit, AfterViewInit {
	public workspace: any;
	public loading: boolean = false;
	public loadingCalenda: boolean = false;
	public loadingGoogle: boolean = false;
	public loadingMicrosoft: boolean = false;
	public signInData: SignInData = <SignInData>{};
	public output;
	public convidado: boolean = false;
	public agree:boolean = false;
	// public acesso_convidado;

	// public mostrarDebug = "false";
	// public easterEggPassword = "ovo"

	constructor(public element: ElementRef,
		public router: Router,
		public renderer: Renderer2,
		public tokenService: AngularTokenService,
		public workspaceService: WorkspaceService,
		public domainService: DomainService
	) {
		// consoleLog("uai, cadê o workspace?")
		// consoleLog(this.workspaceService.workspace)

		var acessoConvidado = localStorage.getItem("acesso_convidado") || '/';
		if (acessoConvidado != '/'){
			// consoleLog("publico sigin com coisa do convidado aqui.")
			localStorage.removeItem("acesso_convidado")
			var acessarConvidadoParams = decodeURIComponent(atob(decodeURIComponent(acessoConvidado))).split('&');
			this.signInData.login = acessarConvidadoParams[0].split('=')[1];
			// var provider =  acesso_convidadoParams[1].split('=')[1];
			this.convidado = true;
			// consoleLog("atob:")
		}
	}

	ngOnInit() {
		// consoleLog("ou????")
		this.workspace = this.workspaceService.workspace;
	}

	ngAfterViewInit() {
		this.renderer.addClass(this.element.nativeElement.children[0], 'flipInX');
		this.renderer.addClass(this.element.nativeElement.children[0], 'animated')
	}

	onSubmit() {
		if (this.loading == false) {
			this.loading = true;
			this.loadingCalenda = true;
			Helpers.setLoading(true);
			// // consoleLog(this.signInData.login)
			// // consoleLog("this.easterEgg(this.signInData.login);")
			// this.easterEgg(this.signInData.login);
			if (this.convidado == true){
				this.signInData.userType = "convidado";
			}
			this.tokenService.signIn(this.signInData)
				.subscribe(
					res => {
						this.output = res;
						consoleLog("login:")
						consoleLog(this.output);
						this.output.headers
						consoleLog(this.tokenService.userSignedIn())
						// consoleLog(this.tokenService.validateToken()
						// .subscribe(res=>{
						// 	consoleLog("retorno valide token")
						// 	consoleLog(res);
						// }))
						// consoleLog(this.tokenService.currentAuthData)
						// consoleLog(this.tokenService.currentUserData)
						// consoleLog(this.tokenService.getAuthDataFromStorage())
						// consoleLog(this.tokenService.getAuthHeadersFromResponse(this.output))
						// consoleLog("this.tokenService.currentAuthData")
						// consoleLog(this.tokenService.currentAuthData)

						if (this.output.status == 200) {
							this.workspaceService.currentUser = this.output.body.data;

							// consoleLog(this.output.body.data
							// consoleLog(localStorage.getItem("currentUser"));

							this.loading = false;
							this.loadingCalenda = false;
							Helpers.setLoading(false);

							if (this.workspaceService.workspace != undefined && this.workspaceService.workspace.new_record == true) {
								this.router.navigate(["/login/preparando"]);
							}
							else if (this.workspaceService.userPossuiUnidade()) {
								this.router.navigate(["/"]);
							} else {
								this.router.navigate(["/login/selecionar_unidade"], { skipLocationChange: true });
							}

							//TODO:
							// this._router.navigate([this.returnUrl]);
						}
						// this.signInForm.resetForm;
					}, error => {
						this.output = error;
						// consoleLog(this.output);
						// consoleLog(this.output.errors);
						this.loading = false;
						this.loadingCalenda = false;
						Helpers.setLoading(false);
						// this.signInForm.resetForm;
					}

				).add(() => { this.loading = false; });
		}
	}

	// switch (provedor) {
	// 	case 'calenda':
	// 		this.tokenService.registerAccount(this.registerData)
	// 	.subscribe(
	// 		res => {
	// 			this.output = res;
	// 			if (this.output.status == "success") {
	// 				if (this.domainService.isClienteSubdominio()){
	// 					var returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
	// 					consoleLog("return url:::");
	// 					consoleLog(returnUrl);

	// 					// if (this.workspaceService.workspace.convite_obrigatorio == true){
	// 					if (this.workspaceService.userPossuiUnidade()){
	// 						this.router.navigate(['/']);
	// 					}else{
	// 						this.router.navigate(["/login/selecionar_unidade"], {skipLocationChange: true});
	// 					}
	// 				}else{
	// 					this.router.navigate(["/login/preparando"], {skipLocationChange: true});
	// 				}
	// 			}
	// 		}, error => {
	// 			this.output = error;
	// 			consoleLog(this.output);
	// 			// this.registerForm.resetForm();
	// 		}
	// 	).add(() => { this.loading = false; })
	// 		break;
	signinGoogle() {
		console.log("entru no sigin")
		if (this.loading == false) {
			console.log("loading false, entrou no if")
			// this.loading = true;
			// this.loadingGoogle = true;
			this.tokenService.signInOAuth("google_oauth2")
			.subscribe(
				res => {
						console.log("entrou no response do subsibre")
						console.log(res);
						this.workspaceService.currentUser = res;
						this.router.navigate(["/"], { skipLocationChange: true });
						// if (this.domainService.isClienteSubdominio()) {
						// 	var returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
						// 	this.router.navigate(["/login/selecionar_unidade"], { skipLocationChange: true });
						// } else {
						// 	this.router.navigate(["/login/preparando"], { skipLocationChange: true });
						// }
						//this.loading = false;
						//this.loadingGoogle = false;
					}, error  => {
						console.log("entrou no error do subscribee")
						console.log(error);
						this.loading = error;
						// consoleLog(this.output);
						// consoleLog("error");
						// consoleLog(error);
						// consoleLog(this.output.errors);
						this.loadingGoogle = false;
					}).add(()=>console.log("oi"))
		}
	}

	signinMicrosoft() {
		if (this.loading == false) {
			//this.loading = true;
			//this.loadingMicrosoft = true;
			// consoleLog("caiu no microsoft")
			this.tokenService.signInOAuth("microsoft_graph")
				.subscribe(
					res => {
						// consoleLog("opa12");
						// consoleLog(res);
						this.workspaceService.currentUser = res;
						// if (res.new_record == true)
						this.router.navigate(["/"], { skipLocationChange: true });
						// if (this.domainService.isClienteSubdominio()){
						// var returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
						// this.router.navigate(["/login/selecionar_unidade"], {skipLocationChange: true});
						// }else{
						// this.router.navigate(["/login/preparando"], {skipLocationChange: true});
						// }
						this.loading = false;
						this.loadingMicrosoft = false;
					}, err => {
						consoleLog(err);
						this.loading = false;
						this.loadingMicrosoft = false;
						// Helpers.setLoading(false);
					}
				)
		}
	}

	// debugable(){
	// 	if (globals == undefined && globals.debug == undefined){
	// 		return false;
	// 	}else{
	// 		return globals.debug;
	// 	}
	// }

	// onDebug(){
	// 	globals.debug = !globals.debug;
	// }

	// easterEgg(userEasterEgg){
	// 	// consoleLog("Entrou no easterEgg()")
	// 	// consoleLog(userEasterEgg)
	// 	// consoleLog(this.easterEggPassword)
	// 	if(userEasterEgg == this.easterEggPassword){
	// 		this.mostrarDebug = "true";
	// 		// consoleLog(this.mostrarDebug)
	// 	}
	// 	else {
	// 		this.mostrarDebug = "false";
	// 		// consoleLog(this.mostrarDebug)
	// 	}
	// }

	placeholderSenha(){
		if (this.convidado == true){
			return "Defina sua senha (mínimo 6 caracteres)";
		}else{
			return "Senha";
		}
	}

	logoCustom(){
		if (this.workspaceService.workspace != undefined &&
			this.workspaceService.workspace.carousel_logo != undefined &&
      this.workspaceService.workspace.carousel_logo.length > 0){
      return this.workspaceService.workspace.carousel_logo[0].url;
    }else{
      return './assets/app/media/img/logos/mv2a.svg'
    }
	}

	checkAgree(){
		this.agree = !this.agree;
	}
}