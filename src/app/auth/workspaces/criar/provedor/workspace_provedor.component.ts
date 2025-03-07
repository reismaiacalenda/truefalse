import { Component, ElementRef, Renderer2, EventEmitter, Output, OnInit, AfterViewInit, AfterViewChecked, ViewChild, ViewContainerRef } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { Router } from '@angular/router';
import { Location } from '@angular/common'
import { WorkspaceService } from '../../../../_services/workspace.service';
import { DomainService } from '../../../../_services/domain.service';
import { WebService } from '../../../../_services/web.service';
import { AngularTokenService } from 'angular-token';
import { consoleLog } from '../../../../globals';
@Component({
	selector: "workspace-provedor",
	templateUrl: "./workspace_provedor.component.html"
})

export class WorkspaceProvedorComponent implements AfterViewInit{
	@ViewChild('workspace_input', { read: ViewContainerRef, static: false }) workspace_input: ElementRef;
	public loading:boolean = true;
	public output:string;
	public subdominio:string;

	constructor(public renderer: Renderer2,
		public element: ElementRef,
		public router: Router,
		private location: Location,
		public workspaceService: WorkspaceService,
		public webService: WebService,
		public ds: DomainService,
		public tokenService: AngularTokenService
		){
		this.recuperarLoginUrl()
	}

	ngOnInit(){
		this.loading = false;
		this.workspace_input.nativeElement.focus();
	}

	ngAfterViewInit(){
		this.renderer.addClass(this.element.nativeElement.children[0], 'flipInX');
		this.renderer.addClass(this.element.nativeElement.children[0], 'animated')
	}

	recuperarLoginUrl(){
		Helpers.setLoading(true);
		// this.webService.get("outlook/auth/login_url")
	}

	setarProvedor(provedor){
		if (!this.loading){
			Helpers.setLoading(true);
			this.loading = true;
			this.workspaceService.workspace.provider_login = provedor;
			switch (provedor) {
				case 'calenda':
					this.router.navigate(["/login/publico_signup"], {skipLocationChange: true})
					break;
				case 'google_oauth2':
					this.tokenService.signInOAuth("google_oauth2")
					.subscribe(
						res=>{
							consoleLog(res);
							// if (res.new_record){
								this.router.navigate(['/login/preparando']);
							// }else{
								// this.output = "Essa conta já se encontra em uso. Por favor acesse seu worskpace já criado anteriormente ou utilize uma nova conta."
							// }
							this.loading = false;
							Helpers.setLoading(false);
						},err=>{
							consoleLog(err);
							this.loading = false;
							Helpers.setLoading(false);
						})
					break;
				case 'microsoft_graph':
					this.tokenService.signInOAuth("microsoft_graph")
					.subscribe(
						res=>{
							consoleLog(res);
							if (res.new_record){
								this.router.navigate(['/login/preparando']);
							}else{
								this.output = "Essa conta já se encontra em uso. Por favor consulte seu worskpace já criado ou utilize nova conta."
							}
							this.loading = false;
							Helpers.setLoading(false);
						},err=>{
							consoleLog(err);
							this.loading = false;
							Helpers.setLoading(false);
						})
					break;
				default:
					break;
			}
		}
	}
}