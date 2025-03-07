import { Helpers } from './../../helpers';
import { Injectable, Inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Rx";
import { AuthenticationService } from '../_services';
import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomainService } from '../../_services/domain.service';
import { AngularTokenService } from 'angular-token';
import { WorkspaceService } from '../../_services/workspace.service';
import { HeadersService } from '../../_services/header.service';
import { consoleLog } from '../../globals';
// import { version } from '../../../../package.json';

@Injectable()
export class AuthGuard implements  CanActivate {
	versaoServer;
	qrcode: string;
	returnUrl: string;
	redirectFallback: string;
	resetPasswordToken: string;

	constructor(private _router: Router,
		private domainService: DomainService,
		private http: HttpClient,
		private _authService: AuthenticationService,
		private tokenService: AngularTokenService,
		private workspaceService: WorkspaceService,
		private headersService: HeadersService,
		@Inject(DOCUMENT) private document: any) {
		consoleLog("contrutor auth.guard");
		// this.validarVersao();
	}

	signin(email, code) {
		// this.loading = true;
		consoleLog("auth.component.signin chamando agora authService.login");
		this._authService.login(email, code);
		// consoleLog("auth.component.signin navegando para:" + this.returnUrl);
		// this._router.navigate([this.returnUrl]);
		// Helpers.setLoading(false);
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
		var invite_key = route.queryParams['i'] || '/';
		this.redirectFallback = route.queryParams['r'] || '/';
		var accessToken = route.queryParams['auth_token'] || '/';
		var client = route.queryParams['client_id'] || '/';
		var uid = route.queryParams['uid'] || '/';
		var qrEspacoId = route.queryParams['e'] || '/';
		var qrRecursoId = route.queryParams['r'] || '/';
		var qrUnidadeId = route.queryParams['u'] || '/';
		this.resetPasswordToken = route.queryParams['reset_password_token'] || '/';
		var start = route.queryParams['start'] || '/';
		var criar_token = route.queryParams['criar_token'] || '/';
		var about = route.queryParams['about'] || '/';
		consoleLog("about");
		consoleLog(about);

		var acesso_convidado = route.queryParams['acesso_convidado'] || '/';

		// consoleLog(criar_token)
		if (criar_token != '/'){
			var workspace_var = decodeURIComponent(atob(decodeURIComponent(criar_token))).split('&');
			// consoleLog("atob:")
			// consoleLog(workspace_var);
			this.workspaceService.workspace = {};
			this.workspaceService.workspace.convite_obrigatorio = workspace_var[0].split('=')[1]
			this.workspaceService.workspace.faixa_colaboradores = +workspace_var[1].split('=')[1]
			this.workspaceService.workspace.nome = workspace_var[2].split('=')[1]
			this.workspaceService.workspace.periodo = workspace_var[3].split('=')[1]
			this.workspaceService.workspace.plano = workspace_var[4].split('=')[1]
			this.workspaceService.workspace.subdominio = workspace_var[5].split('=')[1]
			this.workspaceService.workspace.telefone = workspace_var[6].split('=')[1]
			this.workspaceService.workspace.confirmation_token = workspace_var[7].split('=')[1]
			this.workspaceService.workspace.new_record = true;
			this.workspaceService.workspace.preparando = true;
			this._router.navigate(['/login/preparando'])
			return false;
		}

		if (invite_key != '/'){
			this._router.navigate([`/i/${invite_key}`]);
			return false;
		}

		//consoleLog(route)
		if(about == 'true'){
			localStorage.setItem('about', 'true');
			// this._router.navigate(['/about']);
			// return false;
		}

		if (acesso_convidado != '/'){
			// consoleLog("setando coisa do acesso_convidado")
			localStorage.setItem("acesso_convidado", acesso_convidado);
		}

		this.redirectFallback = decodeURI(this.redirectFallback);

		if (this.redirectFallback != '/') {
			localStorage.setItem('redirectFallback', this.redirectFallback);
		}

		if (this.resetPasswordToken != '/'){
			// consoleLog("nvegando reset password token 88888888888");
			this._router.navigate(['/login/change_password'], { queryParams: {reset_password_token: this.resetPasswordToken} });//?returnUrl=resetPasswordToken']);
			return false;
		}

		if (qrEspacoId != '/'){
			localStorage.setItem('qrEspacoId', qrEspacoId);
			consoleLog("tá rolando");
		}
		if (qrRecursoId != '/'){
			localStorage.setItem('qrRecursoId', qrRecursoId);
		}
		if (qrUnidadeId != '/'){
			localStorage.setItem('qrUnidadeId', qrUnidadeId);
		}

		if (start!='/'){
			// consoleLog("ooooi");
			// consoleLog("plano:")
			// consoleLog(start);
			localStorage.setItem('start', start);
			var periodo = 'anual';//route.queryParams['periodo'] || 'anual'
			// consoleLog(periodo);
			localStorage.setItem('periodo', periodo);
			// this._router.navigate(['/login/criar'], { skipLocationChange: true, queryParams: {plano: plano}})
			// return false;
		}

		consoleLog("o que tá vindo no route?")
		consoleLog(route);
		consoleLog("o que tá vindo no query params?")
		consoleLog(route.queryParams);
		consoleLog("accessToken")
		consoleLog(accessToken)
		consoleLog("currentAuthData:")
		consoleLog(this.tokenService.currentAuthData)
		consoleLog("local storage:")
		consoleLog(localStorage);
		
		if (accessToken != '/'){
			this.tokenService.processOAuthCallback();
		}
		// 	// this.tokenService. = {};
		// 	this.tokenService.currentAuthData.accessToken = accessToken;
		// 	this.tokenService.currentAuthData.client = client;
		// 	this.tokenService.currentAuthData.uid = uid;
		// }

		consoleLog("auth.guard.canActivate()")
		return this.tokenService.validateToken()
			.map(
				response => {
					consoleLog("return true validate token")
					this.workspaceService.currentUser = response.data;
					if(this.workspaceService.userPossuiUnidade()){
						// consoleLog()
						consoleLog("user possui unidade")
						if (this.domainService.isClienteSubdominio()){
							consoleLog("está em um subdominio")
							return true;
						}else{
							consoleLog("não está em um subdominio. redirecionando.")
							var redirectUrl = this.domainService.montarRedirectSubdominio(this.workspaceService.userSubdominio());
							window.location.href = redirectUrl;
							return false;
						}
					}else{
						consoleLog("user não possui unidade. redirecionando para tela de login.")
						this._router.navigate(['/login/selecionar_unidade']);
						return false;
					}
				}
			).catch(
				err => {
					consoleLog("return false validate token")
					consoleLog(err);
					this._router.navigate(['/login']);// , { queryParams: route.queryParams });
					return Observable.throw(err);
				}
			);

		
		// this.returnUrl = route.queryParams['returnUrl'] || '/';
		// this.qrcode = route.queryParams['q'] || '/';
		// this.redirectFallback = route.queryParams['r'] || '/';
		// this.redirectFallback = decodeURI(this.redirectFallback);
		// consoleLog("RedirectFallback no authguardCanactivate:");
		// consoleLog(this.redirectFallback);
		// consoleLog("Reset passowrd token?");
		// consoleLog(this.resetPasswordToken);
		// consoleLog(this._router);
		// consoleLog(route);
		// if (this.redirectFallback != '/') {
		// 	localStorage.setItem('redirectFallback', this.redirectFallback);
		// }
		// if (this.qrcode != '/') {
		// 	localStorage.setItem('qrcode', this.qrcode);
		// }
		// consoleLog(route);

		// consoleLog("chegou aqui? Como tá o document?");
		// consoleLog(this.document.location.hostname);

		// if (!this.ds.isAnima()) {
		// 	consoleLog("recuperando currentUser");
		// 	let currentUser = JSON.parse(localStorage.getItem('currentUser'));
		// 	consoleLog(currentUser);

		// 	if (this.resetPasswordToken != '/'){
		// 		consoleLog("nvegando reset password token 88888888888");
		// 		this._router.navigate(['/login'], { queryParams: {reset_password_token: this.resetPasswordToken} });//?returnUrl=resetPasswordToken']);
		// 		return false;
		// 	}

		// 	if (currentUser != null && currentUser.email != undefined && currentUser.email == "anderson@reismaia.com") {
		// 		consoleLog("true para anderson... limpando-o.");
		// 		currentUser == null;
		// 		this._authService.logout();
		// 	}
		// 	if (currentUser == null) {
		// 		consoleLog("na hora do relogin")
		// 		if (this.qrcode != '/') {
		// 			this._router.navigate(['/login']);
		// 			return false;
		// 		}
		// 		else {
		// 			consoleLog("bora mandar pro login, retornando false.")
		// 			this._router.navigate(['/login']);
		// 			// Helpers.user = JSON.parse("{\"id\":0,\"email\":\"visitante@calenda.com.br\",\"code\":\"\",\"fullName\":\"visitante\",\"nickname\":\"visitante\",\"nome\":\"visitante\",\"name\":\"visitante\",\"role\":\"prelogin\",\"role_number\":-1,\"empresa\":\"\",\"empresa_ids\":[0],\"responsavel\":false,\"unidades\":[{\"id\":2,\"nome\":\"Semear - Funcionários\",\"created_at\":\"2019-02-15T17:22:05.059-02:00\",\"updated_at\":\"2019-06-28T21:56:18.576-03:00\",\"sigla\":\"BU\",\"instituicao_id\":1,\"calenda\":null,\"client_api_id\":34,\"ativada\":true,\"codigoUnidadeBaseCliente\":null}],\"unidade_selecionada\":{\"id\":2,\"nome\":\"Semear - Funcionários\"},\"unidadeDefault\":{\"id\":2,\"nome\":\"Semear - Funcionários\",\"created_at\":\"2019-02-15T17:22:05.059-02:00\",\"updated_at\":\"2019-06-28T21:56:18.576-03:00\",\"sigla\":\"BU\",\"instituicao_id\":1,\"calenda\":null,\"client_api_id\":34,\"ativada\":true,\"codigoUnidadeBaseCliente\":null}}");
		// 			// localStorage.setItem('currentUser', JSON.stringify(Helpers.user));
		// 			// consoleLog(JSON.stringify(localStorage.getItem('currentUser')));
		// 			// consoleLog(Helpers.user);
		// 			return false;
		// 		}
		// 	} else {
		// 		return true;
		// 	}
		// }

		// consoleLog("caiu aqui no auth.guard.canActivate");
		// consoleLog("tá voltando da microsoft?");
		// if (this.returnUrl == 'signin') {
		// 	consoleLog("sim! logando o usuario com os queryparams retornados:")
		// 	consoleLog(route.queryParams);
		// 	var email = route.queryParams['email'] || '/';
		// 	var code = route.queryParams['code'] || '/';
		// 	this._authService.login(email, code);
		// 	// }else if(){

		// 	// }
		// } else {
		// 	// return true;
		// 	consoleLog("coletando user do localStorage:");
		// 	let currentUser = JSON.parse(localStorage.getItem('currentUser'));
		// 	consoleLog(currentUser);
		// 	if (currentUser == null) {
		// 		consoleLog("não tem usuario salvo no cache, redirecionando pra /login...");
		// 		consoleLog("route.queryParams:");
		// 		consoleLog(route.queryParams);
		// 		this._router.navigate(['/login']);
		// 		return false;
		// 	}
		// }
		// return this.http.get(`${this.ds.getHost()}/outlook/auth/validate${this._userService.params()}`)
		// .map(
		// 	(data:any)=>{
		// 	consoleLog("Retorno da response de verify:");
		// 		consoleLog(data);
		// 		consoleLog("Verifica se data && data.code:");
		// 		consoleLog(data && data.code);


		// 		if (data && data.code) {
		// 			// logged in so return true
		// 			consoleLog("Se true, salva no localStorage:")
		// 			localStorage.setItem('currentUser', JSON.stringify(data));
		// 			consoleLog("retornando true");
		// 			// route.queryParams = {};
		// 			// this._router.
		// 			// this._router.navigate(['/cadastro/layout']);
		// 			return true;
		// 		}
		// 		consoleLog("Deu false,")
		// 		consoleLog("Vai navegar para /login com route.queryParam:");
		// 		consoleLog(route.queryParams);



		// 		// error when verify so redirect to login page with the return url
		// 		consoleLog("returnUrl" + state.url);
		// 		this._router.navigate(['/login'], { queryParams: route.queryParams });
		// 		consoleLog("retornando false");
		// 		return false;
			
		// 	}
		// 	,(error:any)=>{
		// 		consoleLog("Deu error no verify() dentro do canActivate.");
		// 		consoleLog("returnUrl" + state.url);
		// 		this._router.navigate(['/login'], { queryParams: route.queryParams });
		// 		consoleLog("retornando false");
		// 		return false;
		// 	}
		// );




			// .subscribe((data: any) => {
			// 	consoleLog("Retorno da response de verify:");
			// 	consoleLog(data);
			// 	consoleLog("Verifica se data && data.code:");
			// 	consoleLog(data && data.code);


			// 	if (data && data.code) {
			// 		// logged in so return true
			// 		consoleLog("Se true, salva no localStorage:")
			// 		localStorage.setItem('currentUser', JSON.stringify(data));
			// 		consoleLog("retornando true");
			// 		// route.queryParams = {};
			// 		// this._router.
			// 		// this._router.navigate(['/cadastro/layout']);
			// 		return true;
			// 	}
			// 	consoleLog("Deu false,")
			// 	consoleLog("Vai navegar para /login com route.queryParam:");
			// 	consoleLog(route.queryParams);



			// 	// error when verify so redirect to login page with the return url
			// 	consoleLog("returnUrl" + state.url);
			// 	this._router.navigate(['/login'], { queryParams: route.queryParams });
			// 	consoleLog("retornando false");
			// 	return false;
			// })
				// () => {
				// 	consoleLog("Deu error no verify() dentro do canActivate.");
				// 	consoleLog("returnUrl" + state.url);
				// 	this._router.navigate(['/login'], { queryParams: route.queryParams });
				// 	consoleLog("retornando false");
				// 	return false;
				// }
			// )
	}

	validarVersao() {
		consoleLog("Validando Verao no AuthGuard");
		return this.http.get(`${this.domainService.getApiUrl()}/truefalse/versao.json`)
			.subscribe(
				dados => {
					consoleLog("Recebeu a versão do server:");
					this.versaoServer = (<any>dados).versao;
					consoleLog(this.versaoServer);
					consoleLog("Comparando com a versão do cliente:");
					// consoleLog(version);
					// var atualizado = this.versaoServer == version;
					consoleLog("Está atualizado?");
					// consoleLog(atualizado);
					// if (!atualizado) {
						// this._router.navigate(['/logout']);
						// consoleLog("recarregando location");
						// location.reload(true);
						// location.reload();
					// }
				}
			)
	}
}
