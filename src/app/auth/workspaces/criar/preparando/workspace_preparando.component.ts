import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { WebService } from '../../../../_services/web.service';
import { Helpers } from '../../../../../app/helpers';
import { WorkspaceService } from '../../../../_services/workspace.service';
import { Router } from '@angular/router';
import { DomainService } from '../../../../_services/domain.service';

@Component({
	selector: "workspace-preparando",
	templateUrl: "./workspace_preparando.component.html"
})

export class WorkspacePreparandoComponent implements OnInit {
	public nome = this.workspaceService.workspace.nome;
	public output;
	public loading=true;
	public redirectUrl = "/";

	constructor(
		public domainService: DomainService,
		public router: Router,
		public webService:WebService,
		public workspaceService:WorkspaceService					
	){
	}

	ngOnInit(){
		// Helpers.setLoading(true);
		// consoleLog("preparando...")
		this.loading = true;
		this.output = null;
		if (this.workspaceService.workspace != undefined && this.workspaceService.workspace.preparando == false){
			// consoleLog("opa, caiu no preparando de um jeito mei errado. já com false.")
		}
		this.workspaceService.workspace.preparando = false;
		this.webService.post("clientes", this.workspaceService.workspace)
		.subscribe(
			(response:any) =>{
				Helpers.setLoading(false);
				if (this.domainService.isClienteSubdominio()){
					this.router.navigate(['/']);
				}else{
					this.redirectUrl = this.domainService.montarRedirectSubdominio(this.workspaceService.workspace.subdominio);
					// setTimeout(()=>{
					// 	window.location.href = redirectUrl;
					// }, 3000)
				}
			},
			(error: any) => {
				// this.modalService.tratarError(error);
				Helpers.setLoading(false);
				this.loading = false;
				this.output = error;
			}
		)
	}
}