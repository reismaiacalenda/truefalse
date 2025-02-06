import { Component, Output, EventEmitter, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { consoleLog } from '../../../../../globals';
import { AngularTokenService, ResetPasswordData } from 'angular-token';

@Component({
	selector: "workspace-password-changed",
	templateUrl: "./workspace_password_changed.component.html"
})

export class WorkspacePasswordChangedComponent implements AfterViewInit{
	@Output() cancelarEsqueceuSenha = new EventEmitter();
	loading:boolean = false;
	resetData: ResetPasswordData = <ResetPasswordData>{};
	output;
	
	constructor(public element:ElementRef,
		public renderer:Renderer2,
		public tokenService: AngularTokenService
	){
	}

	ngAfterViewInit(){
		this.renderer.addClass(this.element.nativeElement.children[0], 'flipInX');
		this.renderer.addClass(this.element.nativeElement.children[0], 'animated')
	}

}