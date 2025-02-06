import { Component, Output, EventEmitter, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { animation } from '@angular/animations';
import { Helpers } from '../../../../app/helpers';

@Component({
	selector: "workspace-indefinido",
	templateUrl: "./workspace_indefinido.component.html",
})

export class WorkspaceIndefinidoComponent implements AfterViewInit{
	constructor(public element:ElementRef,
		public renderer:Renderer2){
		}
		
	ngAfterViewInit(){
		this.renderer.addClass(this.element.nativeElement.children[0], 'flipInX');
		this.renderer.addClass(this.element.nativeElement.children[0], 'animated')
		Helpers.setLoading(false);
	}

	criarWorkspace(subdomain){
		// this.aws_cli.amplify.create-domain-association(subdomain);
	}
}