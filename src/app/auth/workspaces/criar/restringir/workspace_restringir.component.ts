import { Component, ElementRef, Renderer2, AfterViewInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { Router } from '@angular/router';
import { Location } from '@angular/common'
import { WorkspaceService } from '../../../../_services/workspace.service';
import { DomainService } from '../../../../_services/domain.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { consoleLog } from '../../../../globals';
import { AngularTokenService } from 'angular-token';
@Component({
	selector: "workspace-restringir",
	templateUrl: "./workspace_restringir.component.html"
})

export class WorkspaceRestringirComponent implements AfterViewInit{
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
		public tokenService: AngularTokenService
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

	setarProvedor(provedor){
		if (!this.loading){
			Helpers.setLoading(true);
			this.loading = true;
			this.workspaceService.workspace.provider_login = provedor;
			// this.router.navigate(['/login/convite'], {skipLocationChange: true})
			// this.loading = false;
			// Helpers.setLoading(false);

			switch (provedor) {
				case 'calenda':
					this.router.navigate(["/login/convite"], {skipLocationChange: true})
					break;
				case 'google_oauth2':
					this.tokenService.signInOAuth("google_oauth2")
					.subscribe(
						res=>{
							consoleLog(res);
							// if (res.new_record){
								this.workspaceService.workspace.convite_obrigatorio = false;
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
								this.workspaceService.workspace.convite_obrigatorio = false;
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
				this.router.navigate(['/login/convite'], {skipLocationChange: true})
				this.loading = false;
				Helpers.setLoading(false);
			}
		)
	}
}