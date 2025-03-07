import { Component, AfterViewInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { RegisterData, AngularTokenService } from 'angular-token';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DomainService } from '../../../../../_services/domain.service';
import { consoleLog } from '../../../../../globals';
import { WorkspaceService } from '../../../../../_services/workspace.service';
import { WebService } from '../../../../../_services/web.service';
import { ModalService } from '../../../../../theme/pages/default/modal/modal.service';

@Component({
	selector: "workspace-publico-signup",
	templateUrl: "./workspace_publico_signup.component.html"
})

export class WorkspacePublicoSignupComponent implements AfterViewInit{
	@ViewChild('registerForm', { static: false }) registerForm: NgForm;
	public loading:boolean=false;
	public loadingCalenda: boolean = false;
	public loadingGoogle: boolean = false;
	public loadingMicrosoft: boolean = false;
	public registerData: RegisterData = <RegisterData>{};
	public output;
	public agree:boolean = false;

	constructor(public element:ElementRef,
		public renderer:Renderer2,
		public router:Router,
		public activatedRoute:ActivatedRoute,
		private tokenService: AngularTokenService,
		public domainService: DomainService,
		public workspaceService: WorkspaceService,
		public webService: WebService,
		public modalService: ModalService){}

	ngAfterViewInit(){
		this.renderer.addClass(this.element.nativeElement.children[0], 'flipInX');
		this.renderer.addClass(this.element.nativeElement.children[0], 'animated')
	}

	signup(provedor) {
		if (!this.loading){

			if (this.agree == false){
				var output:any = { error: {errors: [ "Por favor aceite os Termos de uso." ]}};
				this.output = output;
				return;
			}

			this.loading = true;
			this.registerData.passwordConfirmation = this.registerData.password;

			switch (provedor) {
				case 'calenda':
					this.loadingCalenda = true;
					// var body =
					if (!this.domainService.isClienteSubdominio()){
						this.registerData['workspace_nome'] = this.workspaceService.workspace.nome
						this.registerData['workspace_subdominio'] = this.workspaceService.workspace.subdominio
						this.registerData['workspace_telefone'] = this.workspaceService.workspace.telefone
						// this.registerData['workspace_provider'] = this.workspaceService.workspace.provider
						this.registerData['workspace_convite_obrigatorio'] = this.workspaceService.workspace.convite_obrigatorio
						this.registerData['workspace_faixa_colaboradores'] = this.workspaceService.workspace.faixa_colaboradores
						this.registerData['workspace_plano'] = this.workspaceService.workspace.plano
						this.registerData['workspace_periodo'] = this.workspaceService.workspace.periodo
						consoleLog("registerData o workpsace inteiro:")
						consoleLog(this.workspaceService.workspace);
					}
					// this.webService.post('auth', body)
					this.tokenService.registerAccount(this.registerData)
						.subscribe(
							res => {
								this.output = res;
								if (this.output.status == "success") {

									this.router.navigate(["/login/aguardando_confirmacao"])
									// 	var returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
									// 	consoleLog("return url:::");
									// 	consoleLog(returnUrl);

									// 	// if (this.workspaceService.workspace.convite_obrigatorio == true){
									// 	if (this.workspaceService.userPossuiUnidade()){
									// 		this.router.navigate(['/']);
									// 	}else{
									// 		this.router.navigate(["/login/selecionar_unidade"], {skipLocationChange: true});
									// 	}
									// }else{
									// 	this.router.navigate(["/login/preparando"], {skipLocationChange: true});
									// }
								}
							}, error => {
								this.output = error;
								// consoleLog(this.output);
								// this.registerForm.resetForm();
							}
						).add(() => { this.loading = false; this.loadingCalenda = false; })
					break;
				case 'google_oauth2':
					this.loadingGoogle = true;
					this.tokenService.signInOAuth("google_oauth2")
					.subscribe(
						res=>{
							consoleLog(res);
							if (this.domainService.isClienteSubdominio()){
								var returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
								this.router.navigate(["/login/selecionar_unidade"], {skipLocationChange: true});
							}else{
								this.router.navigate(["/login/preparando"], {skipLocationChange: true});
							}
							this.loading = false;
							this.loadingGoogle = false;
						},err=>{
							this.loading = false;
							this.loadingGoogle = false;
						})
					break;
				case 'microsoft_graph':
					this.loadingMicrosoft = true;
					this.tokenService.signInOAuth("microsoft_graph")
					.subscribe(
						res=>{
							consoleLog(res);
							if (this.domainService.isClienteSubdominio()){
								var returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
								this.router.navigate(["/login/selecionar_unidade"], {skipLocationChange: true});
							}else{
								this.router.navigate(["/login/preparando"], {skipLocationChange: true});
							}
							this.loading = false;
							this.loadingMicrosoft = false;
						},err=>{
							consoleLog(err);
							this.loading = false;
							this.loadingMicrosoft = false;
							// Helpers.setLoading(false);
						})
					break;
				default:
					break;
			}
		}
	}

	cancelar(){
		if (this.domainService.isClienteSubdominio()){
			this.router.navigate(["/login/publico_signin"], {skipLocationChange: true})
		}else{
			this.router.navigate(["/login/provider"], {skipLocationChange: true})
		}
	}

	termosDeUso(){
		this.modalService.tratarMensagem("teste", "oi")
	}

	checkAgree(){
		this.agree = !this.agree;
	}

}