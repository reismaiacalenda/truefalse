import { Component, ElementRef, Renderer2, AfterViewInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { Router } from '@angular/router';
import { Location } from '@angular/common'
import { WorkspaceService } from '../../../../_services/workspace.service';
import { DomainService } from '../../../../_services/domain.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
	selector: "workspace-convite",
	templateUrl: "./workspace_convite.component.html"
})

export class WorkspaceConviteComponent implements AfterViewInit{
	@ViewChild('subdominio', { read: ViewContainerRef, static: false }) subdominio_input: ElementRef;
	public loading:boolean = true;
	public output:string;
	public subdominio:string;
	public formulario:FormGroup = this.formBuilder.group({
		nome: [null, Validators.required],
		subdominio: [null, Validators.required],
		provider: [null]
	});

	constructor(public renderer: Renderer2,
		public element: ElementRef,
		public router: Router,
		private location: Location,
		public workspaceService: WorkspaceService,
		public ds: DomainService,
		public formBuilder: FormBuilder,
		){
	}

	ngOnInit(){
		this.loading = false;
	}

	ngAfterViewInit(){
		this.renderer.addClass(this.element.nativeElement.children[0], 'flipInX');
		this.renderer.addClass(this.element.nativeElement.children[0], 'animated')
		this.subdominio_input.nativeElement.focus();
	}

	setarConvite(convite_obrigatorio){
		if (!this.loading){
			this.loading = true;
			Helpers.setLoading(true);
			this.workspaceService.workspace.convite_obrigatorio = convite_obrigatorio
			this.router.navigate(["/login/publico_signup"], {skipLocationChange: true})
		}
	}

	redirecionar_rota(){
		this.output = "";
		Helpers.setLoading(true);
		this.loading = true;
		this.output = null;
		this.workspaceService.workspace = this.formulario.value;
		this.workspaceService.buscarWorkspace(this.formulario.get('subdominio').value)
		.subscribe(
			(response:any)=>{
				this.output = "Workspace já existente.";
				Helpers.setLoading(false);
				this.loading = false;
			},
			(error)=>{
				this.router.navigate(['/login/provedor'], {skipLocationChange: true})
				this.loading = false;
				Helpers.setLoading(false);
			}
		)	
	}
}