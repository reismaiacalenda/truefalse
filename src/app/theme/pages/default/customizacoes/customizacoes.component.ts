import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReservaModalService } from '../reservas/reserva-modal/reserva-modal.service';
import { WorkspaceService } from '../../../../_services/workspace.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { WhitelabelFormComponent } from './whitelabel-form/whitelabel-form.component';
import { DomainService } from '../../../../_services/domain.service';
import { Helpers } from '../../../../helpers';

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./customizacoes.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class CustomizacoesComponent implements OnInit {

  formulario = this.formBuilder.group({
    nome: [null, Validators.required],
    aspect_ratio: ["4:3"],
    orientacao: ["horizontal"],
    interacao: ["qrcalenda"],
    interacaoEnum: [1],
    carousel_fundo: [{}],
    carousel_publicidade: [{}],
    cor_fonte: ["rgba(255,255,255,1)"],
    cor_complementar_a: ["rgba(32,32,32,0.9)"],
    cor_complementar_b: ["rgba(70,70,70,0.85)"],
    cor_fechado: ["rgba(40,40,40,0.92)"],
    cor_livre: ["rgba(79,129,13,0.88)"],
    cor_espera: ["rgba(212,101,17,0.88)"],
    cor_ocupado: ["rgba(201,30,30,0.88)"],
    template_id: [null]
  });


  constructor(public reservaModalService: ReservaModalService,
    public workspaceService: WorkspaceService,
    public domainService: DomainService,
    public modalNgb: NgbModal,
    public formBuilder: FormBuilder) {
  }

  ngOnInit() {
  }

  predefinidos(){
    this.reservaModalService.predefinidos()
  }

  parametrizacoes(){
    this.reservaModalService.parametrizacoes()
  }
 
  abrirWhitelabelForm(){
    let ngbModalOptions: NgbModalOptions
    ngbModalOptions={
      backdrop: 'static',
      keyboard: true,
    }
    const modalRef = this.modalNgb.open(WhitelabelFormComponent, ngbModalOptions);
    modalRef.componentInstance.rowId = this.workspaceService.workspace.id;
    modalRef.result.then((responseSuccess) => {
      /*consoleLog("Entrou na modalRef!")*/
      if (responseSuccess) {
        Helpers.setLoading(true);
        /* this.carregarTable();
        consoleLog("Entrou na carregarTable dentro da responseSuccess!") */
        this.workspaceService.inicializarCoresWhitelabel();
        this.workspaceService.buscarWorkspace(this.domainService.subdominio)
				.subscribe(
					(response:any)=>{
						this.workspaceService.workspace = response;
            Helpers.setLoading(false);
        })

      }
    })
  }

  logoCustom(){
    if (this.workspaceService.workspace.carousel_logo != undefined &&
      this.workspaceService.workspace.carousel_logo.length > 0){
      return this.workspaceService.workspace.carousel_logo[0].url;
    }else{
      return '../../../../../assets/app/media/svg/logos/calenda_mh1a.svg';  
    }
  }
}
