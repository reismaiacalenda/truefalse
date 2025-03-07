import { Component, Output, EventEmitter, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';

@Component({
	selector: "workspace-nao-encontrado",
	templateUrl: "./workspace_nao_encontrado.component.html"
})

export class WorkspaceNaoEncontradoComponent implements AfterViewInit{
	constructor(public element:ElementRef,
		public renderer:Renderer2){}

	ngAfterViewInit(){
		this.renderer.addClass(this.element.nativeElement.children[0], 'flipInX');
		this.renderer.addClass(this.element.nativeElement.children[0], 'animated')
	}
}