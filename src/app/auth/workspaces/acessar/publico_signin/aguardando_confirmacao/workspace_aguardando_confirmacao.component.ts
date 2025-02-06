import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { WebService } from '../../../../../_services/web.service';
import { Helpers } from '../../../../../../app/helpers';
import { WorkspaceService } from '../../../../../_services/workspace.service';
import { Router } from '@angular/router';
import { DomainService } from '../../../../../_services/domain.service';

@Component({
	selector: "workspace-aguardando-confirmacao",
	templateUrl: "./workspace_aguardando_confirmacao.component.html"
})

export class WorkspaceAguardandoConfirmacaoComponent implements OnInit {
	public nome = this.workspaceService.workspace.nome;
	public output;
	public loading=true;

	constructor(
		public domainService: DomainService,
		public router: Router,
		public webService:WebService,
		public workspaceService:WorkspaceService					
	){
	}

	ngOnInit(){
	}
	
}