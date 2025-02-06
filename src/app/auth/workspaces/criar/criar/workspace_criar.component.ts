import { Component, ElementRef, Renderer2, AfterViewInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'
import { WorkspaceService } from '../../../../_services/workspace.service';
import { DomainService } from '../../../../_services/domain.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
	selector: "workspace-criar",
	templateUrl: "./workspace_criar.component.html"
})

export class WorkspaceCriarComponent implements AfterViewInit{
	@ViewChild('subdominio', { read: ViewContainerRef, static: false }) subdominio_input: ElementRef;
	public loading:boolean = true;
	public output:string;
	public subdominio:string;
	public CELLPHONE = '(00) 0 0000-0000';
	public LANDLINE= '(00) 0000-0000';
	public agree:boolean = false;
	phoneMask = this.LANDLINE;
	previusLength = 0;

	public formulario:FormGroup = this.formBuilder.group({
		nome: [null, Validators.required],
		subdominio: [null, Validators.required],
		provider: [null],
		telefone: [null],
		faixa_colaboradores: [null],
		plano: [null],
		periodo: [null]
	});

	constructor(public renderer: Renderer2,
		public element: ElementRef,
		public router: Router,
		private _route: ActivatedRoute,
		private location: Location,
		public workspaceService: WorkspaceService,
		public ds: DomainService,
		public formBuilder: FormBuilder,
		){
	}

	ngOnInit(){
		// consoleLog("chegamos no criar")


		var start = localStorage.getItem('start') || '/'; //this._route.queryParams['plano'] ||

		var plano = atob(start);
		var periodo = 'anual';//localStorage.getItem('periodo') || '/'; //this._route.queryParams['periodo'] || 
		if (start != '/'){
			this.formulario.get('plano').setValue(plano);
			this.formulario.get('periodo').setValue(periodo);

			localStorage.removeItem('start')
			localStorage.removeItem('periodo')
			// consoleLog("plano foi setado, veja como está o fomruario:")
			// consoleLog(this.formulario.value);
		}
		this.workspaceService.workspace = this.formulario.value;
		if (this.workspaceService.workspace.plano == undefined){
			this.workspaceService.workspace.plano = 'inicial';
			this.workspaceService.workspace.periodo = 'mensal';
		}


		this.loading = false;
	}

	ngAfterViewInit(){
		this.renderer.addClass(this.element.nativeElement.children[0], 'flipInX');
		this.renderer.addClass(this.element.nativeElement.children[0], 'animated')
		this.subdominio_input.nativeElement.focus();
	}

	redirecionar_rota(){

		if (this.agree == false){
			var output:any = "Por favor aceite os Termos de serviço.";
			this.output = output;
			return;
		}

		this.output = "";
		Helpers.setLoading(true);
		this.loading = true;
		this.output = null;
		
		this.workspaceService.workspace.nome = this.formulario.get("nome").value;
		this.workspaceService.workspace.subdominio = this.formulario.get("subdominio").value;
		this.workspaceService.workspace.faixa_colaboradores = 9
		this.workspaceService.workspace.telefone = "9"
		// consoleLog("ooo")
		// consoleLog(this.workspaceService.workspace);
		this.workspaceService.buscarWorkspace(this.formulario.get('subdominio').value)
		.subscribe(
			(response:any)=>{
				this.output = "Workspace já existente.";
				Helpers.setLoading(false);
				this.loading = false;
			},
			(error)=>{
				this.router.navigate(['/login/restringir'], {skipLocationChange: true})
				this.loading = false;
				Helpers.setLoading(false);
			}
		)	
	}

	onPhoneChanged() {
		if (this.formulario.value.telefone.length <= 10 && this.phoneMask === this.CELLPHONE) {
			this.phoneMask = this.LANDLINE;
		}
		else if (this.formulario.value.telefone.length === 10 && this.phoneMask === this.LANDLINE && this.previusLength === 10) {
			this.phoneMask = this.CELLPHONE;
		}
 
		this.previusLength = this.formulario.value.telefone.length;
	}

	selectFaixa(event){
		this.formulario.get('faixa_colaboradores').setValue(event.target.value);
	}

	checkAgree(){
		this.agree = !this.agree;
	}
}