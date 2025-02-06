import { Component, AfterViewInit, ElementRef, Renderer2, OnInit } from '@angular/core';
import { WebService } from '../../../../app/_services/web.service';
import { WorkspaceService } from '../../../../app/_services/workspace.service';
import { Helpers } from '../../../../app/helpers';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DomainService } from '../../../../app/_services/domain.service';
import { Router } from '@angular/router';
import { consoleLog } from '../../../globals';

@Component({
	selector: "workspace-selecionar-unidade",
	templateUrl: "./workspace_selecionar_unidade.component.html"
})

export class WorkspaceSelecionarUnidadeComponent implements OnInit, AfterViewInit{
	public listUnidades:any[];
	public loading:boolean = true;
	public formulario:FormGroup;

	constructor(
		public ds:DomainService,
		public element:ElementRef,
		public formBuilder:FormBuilder,
		public renderer:Renderer2,
		public ws:WebService,
		private workspaceService: WorkspaceService,
		public router: Router){}

	ngOnInit(){
		this.formulario = this.formBuilder.group({
			unidades_attributes: this.formBuilder.array([])
		})
		this.ws.get(`unidades/list_workspace?workspace=${this.ds.subdominio}`)
		.subscribe(
			(response:any) => {
				consoleLog("andaaime");
				consoleLog(response);
				this.listUnidades = response.instituicoes;
				Helpers.setLoading(false);
				this.loading = false;
			},
			(error: any) => {
				// this.modalService.tratarError(error);
				this.loading = false;
				Helpers.setLoading(false);
			}
		);    
	}

	onSubmit(){
		consoleLog("this.formulario.value");
		consoleLog(this.formulario.value);

		Helpers.setLoading(true);
		this.loading=true;
		this.ws.put(`funcionarios/${this.workspaceService.currentUser.id}`, this.formulario.value)
			.subscribe(
				(response:any) =>{
					this.loading = false;
					Helpers.setLoading(false);
				// TODO: redirect to returnUrl
					this.router.navigate(['/'])
				},
				(error: any) => {
					// this.modalService.tratarError(error);
					this.loading = false;
					Helpers.setLoading(false);
				}
			)
	}

	ngAfterViewInit(){
		this.renderer.addClass(this.element.nativeElement.children[0], 'flipInX');
		this.renderer.addClass(this.element.nativeElement.children[0], 'animated')
	}
}