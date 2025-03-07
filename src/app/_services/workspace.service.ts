import { Injectable } from "@angular/core";
import { WebService } from './web.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { AngularTokenService } from 'angular-token';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomainService } from './domain.service';
import { async } from 'rxjs/internal/scheduler/async';
import { Helpers } from '../helpers';
import { HeadersService } from './header.service';
import { User } from '../auth/_models';
import { consoleLog, globals } from '../globals';
import { ModalService } from '../theme/pages/default/modal/modal.service';

@Injectable()
export class WorkspaceService{
  private _currentUser: User;
	private _workspace;
	private _unidades:any[];
	private _unidadeSelecionada;

	constructor(private http: HttpClient,
		private domainService:DomainService,
		private headersService:HeadersService,
		private modalService:ModalService,
		private tokenService: AngularTokenService){
		// consoleLog("Construtor workspace.service")
		// consoleLog("autorizar")
		// consoleLog(this.autorizar)
	}
	
	set currentUser(u){
		this._currentUser = u;
		this.prepararWorkspace();
		this.prepararUnidades();
  }

  get currentUser():User{
    return this._currentUser;
  }

  get unidadeSelecionada(){
    return this._unidadeSelecionada;
	}

	get unidades(){
		return this._unidades;
	}

	private prepararWorkspace(){
		if (this._currentUser.subdominio != undefined && this._workspace == undefined){
			this._workspace = this._currentUser.subdominio;
		}
	}

	prepararUnidades(){
		if (this._currentUser.unidades){
			this._unidades = this._currentUser.unidades
			let busca = this._unidades.find(u=>u.id == this._currentUser.unidade_selecionada);
			consoleLog("_unidades")
			consoleLog(this._unidades)
			if (globals.debug){
				this.modalService.debugService("Workspace", "prepararUnidades", busca);
			}
			if (busca != null){
				this._unidadeSelecionada = {
					id: busca.id,
					text: busca.text
				}
			}
			consoleLog("unidadeSelecionada")
			consoleLog(this._unidadeSelecionada);
		}
	}


	// async
	// async prepararUnidades(): Promise<any>{
	// 	Helpers.setLoading(true);
	// 	consoleLog("asyncGet")
	// 	if (typeof this._unidades === 'undefined'){
	// 		this._unidades = await this.http
	// 		.get(`${this.domainService.getApiUrl()}/unidades/list_andaime.json`,
	// 			{headers: this.headersService.definirHeaders()})
	// 		.toPromise()
	// 		.then(response => {
	// 			Helpers.setLoading(false);
	// 			consoleLog(response);
	// 			consoleLog("result saiu")
	// 			this._unidades = response;
	// 			consoleLog(this._unidades)
	// 			return response;
	// 		})
	// 		.catch((error: any) => {
	// 			Helpers.setLoading(false);
	// 		})
	// 	}
	// 	consoleLog("return")
	// 	consoleLog(this._unidades)
	// 	return this._unidades;
	// }

	userPossuiUnidade():boolean{
		return this._currentUser.unidades != undefined &&
			this._currentUser.unidades.length > 0;
	}

	userSubdominio(){
		return this._currentUser.subdominio;
	}
	
  get workspace(){
    return this._workspace;
  }

  set workspace(response){
    this._workspace = response;
  }

  buscarWorkspace(subdominio){
		consoleLog("buscando no hwokspace")
		return this.http.get(
			`${this.domainService.getApiUrl()}/clientes/workspace/${subdominio}.json`,
			{ headers: this.headersService.definirHeaders()}
		);

	


    // return this.webservice.get(`/clientes/workspace/${subdominio}`)
      // .subscribe(response => {
      //   this.workspace = response;
      // })
			// .subscribe(
			// 	(response)=>{
			// 		consoleLog("asodasdsa")
      //     consoleLog(response);
      //     // this
			// 		// this.location.replaceState(response.workspace_route)
			// 		// if (response.authorize_url){
			// 		// 	consoleLog("nao ta caindo aqui?")
			// 		// 	this.router.navigate(['login/restrito_signin'],
			// 		// 		{skipLocationChange: true, state: {workspace: response}})
			// 		// }else{
			// 		// 	this.router.navigate(['login/publico_signin'],
			// 		// 		{skipLocationChange: true, state: {workspace: response}})
			// 		// }
			// 		// Helpers.setLoading(false);
			// 	},
			// 	// (error)=>{
			// 	// 	this.output = error.error.errors;
			// 	// 	this.loading = false;
			// 	// 	Helpers.setLoading(false);
			// 	// }
			// )
	}
	
	autorizar(...pontos_de_funcao:string[]){
		var retorno:boolean = false;
		if (this._currentUser != undefined){
			pontos_de_funcao.forEach(pf => {
				if(this._currentUser.permissoes_ativas[pf] != undefined && this._currentUser.permissoes_ativas[pf] == true){
					retorno = true;
				}
			})
		}
		return retorno; 
	}

	autorizarModulos(...pontos_de_funcao:string[]){
		var retorno:boolean = false;
		if (this._currentUser != undefined){
			pontos_de_funcao.forEach(pf => {
				if(this._currentUser.subdominio.modulos != undefined && this._currentUser.subdominio.modulos.includes(pf)){
					retorno = true;
				}
			})
		}
		return retorno;
	}

	// Legenda Módulos:
	// hd (hotdesk)
	// smr (smartroom)
	// eh (escala híbrida)
	// sr (serviços e recursos)
	// phe  (people hybrid experience)

	conferirModulosCombinados(...siglas_modulos:string[]){
		var retorno:boolean = false;
		if (this._currentUser != undefined && 
			this._currentUser.subdominio != undefined &&
			this._currentUser.subdominio.modulos_combinado_sigla != undefined){
				siglas_modulos.forEach(sigla_modulo => {
					if (this._currentUser.subdominio.modulos_combinado_sigla == sigla_modulo){
						retorno = true;
					}
				}
			)
		}
		return retorno;
	}

	contemModulo(...siglas_modulos:string[]){
		var retorno:boolean = false;
		if (this._currentUser != undefined && 
			this._currentUser.subdominio != undefined &&
			this._currentUser.subdominio.modulos_combinado_sigla != undefined){
			siglas_modulos.forEach(sigla_modulo => {
				if (this._currentUser.subdominio.modulos_combinado_sigla.includes(sigla_modulo)){
					retorno = true;
				}
			})
		}
		return retorno;
	}

	quantidadeAcoesModulo(qtdeAcoes){
		switch (qtdeAcoes) {
			case 4:
				return this.conferirModulosCombinados('smr_hd_eh_sr_phe','smr_hd_sr_phe');
			case 3:
				return this.conferirModulosCombinados(
					'smr_hd_eh_sr',
					'smr_hd_sr',
					'smr_hd_phe',
					'hd_eh_sr_phe',
					'smr_hd_eh_phe',
					'smr_eh_sr_phe',
					'hd_sr_phe')
				|| this.conferirModulosCombinados('hd_sr',
					'hd_phe',
					'sr_phe',
					'smr_hd_eh',
					'smr_sr',
					'hd_eh_sr',
					'smr_hd',
					'smr_phe',
					'hd_eh_phe',
					'eh_sr_phe')
				|| this.conferirModulosCombinados('hd',
					'sr',
					'phe',
					'smr',
					'hd_eh',
					'smr_eh',
					'eh_sr',
					'eh_phe')
				|| this.conferirModulosCombinados('eh');
		}
	}

	orelhasCalendario(qtdeOrelhas){
		switch (qtdeOrelhas) {
			case 3:
				return this.conferirModulosCombinados('smr_hd_eh_sr','smr_hd_sr','smr_hd_eh_sr_phe','smr_hd_sr_phe');
			case 2:
				return this.conferirModulosCombinados('hd_sr','smr_hd_eh','smr_sr','hd_eh_sr','smr_hd',
				'smr_hd_phe','hd_eh_sr_phe','smr_hd_eh_phe','smr_eh_sr_phe','hd_sr_phe');
			case 1:
				return this.conferirModulosCombinados('hd','sr','smr','hd_eh','smr_eh','hd_phe',
				'eh_sr','sr_phe','smr_phe','hd_eh_phe','eh_sr_phe');
			case 0:
				return this.conferirModulosCombinados('eh', 'phe', 'eh_phe');
		}
	}

	formacaoColunas(formacao){
		switch (formacao) {
			case '3-3-3-3':
				return this.conferirModulosCombinados('hd_sr',
				'smr_hd_eh',
				'smr_sr',
				'hd_eh_sr',
				'smr_hd',
				'smr_hd_phe',
				'hd_eh_sr_phe',
				'smr_hd_eh_sr',
				'smr_hd_sr',
				'smr_hd_eh_sr_phe',
				'smr_hd_eh_phe',
				'smr_hd_sr_phe',
				'smr_eh_sr_phe',
				'hd_sr_phe');
			case '3-5-4':
				return this.conferirModulosCombinados('eh',
				'phe',
				'eh_phe',
				'hd',
				'sr',
				'smr',
				'hd_eh',
				'smr_eh',
				'hd_phe',
				'eh_sr',
				'sr_phe',
				'smr_phe',
				'hd_eh_phe',
				'eh_sr_phe');
		}
	}

	inicializarCoresWhitelabel(){
    let hoverColor = this.adjustColor(this.workspace.primary_color, 21);
		let lightColor = this.adjustColor(this.workspace.primary_color, 170);
		let softColor = this.adjustColor(this.workspace.primary_color, 170);

		document.documentElement.style.setProperty('--primary', this.workspace.primary_color);
    document.documentElement.style.setProperty('--primary-hover', hoverColor);
		document.documentElement.style.setProperty('--primary-light', lightColor);
		document.documentElement.style.setProperty('--primary-soft', softColor);
		document.documentElement.style.setProperty('--primary-wave-opacity', `${lightColor}12`);
		document.documentElement.style.setProperty('--primary-alpha-radial', `${lightColor}66`);
	}
	
	adjustColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
	}
	
}