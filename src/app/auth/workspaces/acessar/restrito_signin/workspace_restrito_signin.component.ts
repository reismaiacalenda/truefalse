import { Component, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { WorkspaceService } from '../../../../_services/workspace.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularTokenService } from 'angular-token';
import { Helpers } from '../../../../helpers';
import { WebService } from '../../../../_services/web.service';
import { HttpClient } from '@angular/common/http';
import { consoleLog } from '../../../../globals';
import { DomainService } from '../../../../_services/domain.service';

@Component({
	selector: "workspace-restrito-signin",
	templateUrl: "./workspace_restrito_signin.component.html"
})

export class WorkspaceRestritoSigninComponent implements AfterViewInit{
	workspace;
	loading:boolean = false;
	output:string = "";

	constructor(public element:ElementRef,
		public renderer:Renderer2,
		public router:Router,
		public webService:WebService,
		public http:HttpClient,
		public workspaceService: WorkspaceService,
		public tokenService:AngularTokenService,
		public domainService:DomainService){
		this.workspace = this.workspaceService.workspace;
	}

	ngAfterViewInit(){
		this.renderer.addClass(this.element.nativeElement.children[0], 'flipInX');
		this.renderer.addClass(this.element.nativeElement.children[0], 'animated')
	}

	loginUrl(){
		if (!this.loading){
			this.output = "";
			Helpers.setLoading(true);
			this.loading = true;
			if (this.workspaceService.workspace.provider_login == "google_oauth2"){
				this.tokenService.signInOAuth("google_oauth2")
				.subscribe(
					res=>{
						consoleLog(res);
						this.router.navigate(['/index']);
						this.loading = false;
						Helpers.setLoading(false);
					},err=>{
						consoleLog(err);
						this.output = "Não foi possível efetuar o login Google";
						this.loading = false;
						Helpers.setLoading(false);
					})
			}else{
				// favor ler comentário nahttps://app.clickup.com/t/5xbryf

				// cliente/get_authorize_url
				// this.http.get('http://localhost:3000/outlook/auth/login_url').subscribe(
				// 	res=>{
				// 		consoleLog(res);
				// 		location.href = (<any>res).url;
				// 	}
				// )
				this.tokenService.signInOAuth("microsoft_graph")
				.subscribe(
					res=>{
						consoleLog(res);
						this.router.navigate(['/index']);
						this.loading = false;
						Helpers.setLoading(false);
					},err=>{
						consoleLog(err);
						this.output = "Não foi possível efetuar o login Microsoft";
						this.loading = false;
						Helpers.setLoading(false);
					})

			}
		}
	}
}