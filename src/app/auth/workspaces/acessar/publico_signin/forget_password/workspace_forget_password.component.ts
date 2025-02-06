import { Component, Output, EventEmitter, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { consoleLog } from '../../../../../globals';
import { AngularTokenService, ResetPasswordData } from 'angular-token';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: "workspace-forget-password",
	templateUrl: "./workspace_forget_password.component.html"
})

export class WorkspaceForgetPasswordComponent implements AfterViewInit{
	@Output() cancelarEsqueceuSenha = new EventEmitter();
	loading:boolean = false;
	resetData: ResetPasswordData = <ResetPasswordData>{};
	output;
	
	constructor(public element:ElementRef,
		public renderer:Renderer2,
		public tokenService: AngularTokenService,
		private route: ActivatedRoute,
		private router: Router
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
		if (this.loading == true){return false};
		this.loading = true;
		// consoleLog("restando...")
		// consoleLog(this.resetData)
		// consoleLog(this.resetData.login)
		// Helpers.setLoading(true);
		this.tokenService.resetPassword(this.resetData).subscribe(
			res => {
				// this.loading = false;
				// this.output = res;
				this.router.navigate(['/login/reset_password_sent', {email: this.resetData.login}]
					, {skipLocationChange: true})
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