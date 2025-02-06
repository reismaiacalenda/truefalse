import { Component, Output, EventEmitter, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { WebService } from '../../../../_services/web.service';

@Component({
	selector: "workspace-descobrir",
	templateUrl: "./workspace_descobrir.component.html"
})

export class WorkspaceDescobrirComponent implements AfterViewInit{
	loading:boolean = false;
	output;
	login;

	constructor(public element:ElementRef,
		public renderer:Renderer2,
		public webService:WebService){}

	ngAfterViewInit(){
		this.renderer.addClass(this.element.nativeElement.children[0], 'flipInX');
		this.renderer.addClass(this.element.nativeElement.children[0], 'animated')
	}

	descobrirWorkspace(){
		if (!this.loading == true){
			this.loading = true;
			this.webService.post('clientes/descobrir', {login: this.login})
				.subscribe(
					response=>{
						this.loading = false;
						this.output = response
					},
					error => {
						this.loading = false;
						this.output = error;
						// consoleLog("olha o loop")
						// consoleLog(this.output.error.errors)
						// consoleLog(this.output)
					}
				)
		}
	}
}