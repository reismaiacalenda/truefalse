import { Component, Output, EventEmitter, AfterViewInit, ElementRef, Renderer2, OnInit } from '@angular/core';
import { AngularTokenService, UpdatePasswordData } from 'angular-token';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkspaceService } from '../../../../../_services/workspace.service';

@Component({
	selector: "workspace-change-password",
	templateUrl: "./workspace_change_password.component.html"
})

export class WorkspaceChangePasswordComponent implements OnInit, AfterViewInit{
	updatePasswordData: UpdatePasswordData = <UpdatePasswordData>{};
	loading:boolean = false;
	output;

	constructor(public element:ElementRef,
		public renderer:Renderer2,
		public route:ActivatedRoute,
		public router:Router,
		public tokenService: AngularTokenService,
		public workspaceService: WorkspaceService){}

	ngOnInit(){
		// 'a53f529bccb9e5aed90c3ba7f2c6e7e02ebc8cc2c43d30786e2e83eaac475aed';
		this.updatePasswordData.resetPasswordToken = this.route.snapshot.queryParams['reset_password_token'] || '/';
		// consoleLog("recebeu o resetpassword senha:")
		// consoleLog(this.updatePasswordData);
	}

	trocarSenha(){
		if (this.loading == true){return false};
		this.loading = true;
		// consoleLog("oia o q tem nos headers")
		// consoleLog(this.tokenService.currentAuthData);
		// consoleLog(this.tokenService.currentUserData);
		// consoleLog(this.tokenService.tokenOptions);
		// this.updatePasswordData.passwordCurrent = "123456"
		this.tokenService.updatePassword(this.updatePasswordData)
			.subscribe(
				res => {
					this.output = res;
					// this.loading = false;

					// if (this.output.status == "success") {
						// localStorage.setItem('currentUser', JSON.stringify(this.output.data));
						// this.workspaceService.currentUser = this.output.data;
						// this.tokenService.userSignedIn();
						// this.tokenService.processOAuthCallback();
						// this.tokenService
						// consoleLog(localStorage.getItem("currentUser"));
						// this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
						// consoleLog("return url:::");
						// consoleLog(this.returnUrl);
						// this.router.navigate(['/login']);
					// }

					this.router.navigate(['login/password_changed'])
				}, error => {
					// consoleLog(error);
					this.output = error.error;
					// consoleLog(this.output);
					// Helpers.setLoading(false);
					// this.showAlert('alertForgetPass');
					// this._alertService.error(error);
					// this.outputForgetPassword = error;
					// this.output = error;
					this.loading = false;
				}
			)
	}	

	ngAfterViewInit(){
		this.renderer.addClass(this.element.nativeElement.children[0], 'flipInX');
		this.renderer.addClass(this.element.nativeElement.children[0], 'animated')
	}
}