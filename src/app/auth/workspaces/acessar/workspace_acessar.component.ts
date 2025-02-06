import { Component, ElementRef, Renderer2, EventEmitter, Output, OnInit, AfterViewInit, AfterViewChecked, ViewChild, ViewContainerRef } from '@angular/core';
import { Helpers } from '../../../helpers';
import { Router } from '@angular/router';
import { Location } from '@angular/common'
import { WorkspaceService } from '../../../_services/workspace.service';
import { DomainService } from '../../../_services/domain.service';

@Component({
	selector: "workspace-acessar",
	templateUrl: "./workspace_acessar.component.html",
})

export class WorkspaceAcessarComponent implements OnInit, AfterViewInit{
	@ViewChild('workspace_input', { read: ViewContainerRef, static: false }) workspace_input: ElementRef;
	public loading:boolean = true;
	public output:string;
	public subdominio:string;

	constructor(public renderer: Renderer2,
		public element: ElementRef,
		public router: Router,
		private location: Location,
		public workspaceService: WorkspaceService,
		public ds: DomainService
		){
	}

	ngOnInit(){
		this.loading = false;
		this.workspace_input.nativeElement.focus();
	}

	ngAfterViewInit(){
		this.renderer.addClass(this.element.nativeElement.children[0], 'flipInX');
		this.renderer.addClass(this.element.nativeElement.children[0], 'animated')
	}

	redirecionar_rota(){
		Helpers.setLoading(true);
		this.loading = true;
		this.output = null;
		this.workspaceService.buscarWorkspace(this.subdominio)
		.subscribe(
			(response:any)=>{
				this.workspaceService.workspace = response;
				window.location.href = this.ds.montarRedirectSubdominio(response.subdominio);
			},
			(error)=>{
				this.output = error.error.errors;
				this.loading = false;
				Helpers.setLoading(false);
			}
		)	
	}
}
