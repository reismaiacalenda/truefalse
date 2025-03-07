import { Component, Output, EventEmitter, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { consoleLog } from '../../../../../globals';
import { AngularTokenService, ResetPasswordData } from 'angular-token';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: "workspace-reset-password-sent",
	templateUrl: "./workspace_reset_password_sent.component.html"
})

export class WorkspaceResetPasswordSentComponent implements AfterViewInit{
	@Output() cancelarEsqueceuSenha = new EventEmitter();
	loading:boolean = false;
	resetData: ResetPasswordData = <ResetPasswordData>{};
	output;
	
	constructor(public element:ElementRef,
		public renderer:Renderer2,
		public tokenService: AngularTokenService,
		private route: ActivatedRoute
	){
		if (this.route.snapshot.paramMap.has('email')){
			this.resetData.login = this.route.snapshot.paramMap.get('email');
		}
	}

	ovo(){
		consoleLog("asdas")
		this.cancelarEsqueceuSenha.emit('')
	}

	ngAfterViewInit(){
		this.renderer.addClass(this.element.nativeElement.children[0], 'flipInX');
		this.renderer.addClass(this.element.nativeElement.children[0], 'animated')
	}

	resetar(){
		this.loading = true;
		// consoleLog("restando...")
		// consoleLog(this.resetData)
		// consoleLog(this.resetData.login)
		// Helpers.setLoading(true);
		this.tokenService.resetPassword(this.resetData).subscribe(
			res => {
				// if 
				// this.showAlert('alertSignin');
				// this._alertService.success('Beleza! As instruções para nova senha foram enviadas a seu e-mail.', true);
				this.loading = false;
				// consoleLog(res);
				this.output = res;
				// Helpers.setLoading(false);
				// this.outputForgetPassword = res;
				// LoginCustom.displaySignInForm();
				// this.model = {};
			}, error => {
				// consoleLog(error);
				// Helpers.setLoading(false);
				// this.showAlert('alertForgetPass');
				// this._alertService.error(error);
				// this.outputForgetPassword = error;
				this.output = error;
				this.loading = false;
			}
		);
	}

}