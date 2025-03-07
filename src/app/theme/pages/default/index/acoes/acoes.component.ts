import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { consoleLog } from '../../../../../globals';
import { Subscription } from 'rxjs';
import { ModalService } from '../../modal/modal.service';
import { WebService } from '../../../../../_services/web.service';
import { WorkspaceService } from '../../../../../_services/workspace.service';
import { ReservaModalService } from '../../reservas/reserva-modal/reserva-modal.service';
import { CheckupsService } from '../../cadastros/checkups/checkups.service';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { MapaModalFormComponent } from '../../reservas/mapa/mapa-modal/mapa-modal-form.component';

@Component({
  selector: 'acoes',
  templateUrl: './acoes.component.html'
})
export class AcoesComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  constructor(public modalService: ModalService,
    public webService: WebService,
    public workspaceService: WorkspaceService,
    public reservaModalService: ReservaModalService,
    public checkupsModalService: CheckupsService,
    private _router: Router,
    private modalNgb: NgbModal) {
  }

  ngOnInit(){
  }

  ngOnDestroy(){
    // this.subscriptions.unsubscribe();
  }

  pegarEquipamento(){
    this.reservaModalService.abrirModalPegarEquipamento();
  }

  selecionarMapaQuadros(){
    this.reservaModalService.abrirModalSelecionarMapaQuadros();
  }

  mapaModal(){

    // this.reservaModalService.abrirModalMapaForm();
      // this.construirFormulario();
    // Helpers.setLoading(true);
    // let ngbModalOptions: NgbModalOptions={
    //   // backdrop: 'static',
    //   // keyboard: false,
    //   centered: true
    // }
    // let modal = this.modalNgb.open(MapaModalFormComponent, ngbModalOptions);
  }

  checkups(){
    this.checkupsModalService.abrirModalCheckups();
  }

  abrirMapa(categoria){
    if (Helpers.isMobile()){
      this._router.navigate(['reservas/mapa'], { queryParams: {categoria: categoria} })
    }else{
      this._router.navigate(['reservas/mapa-desktop'], { queryParams: {categoria: categoria} })
    }
    // this.reservaModalService.abrirTrabalharEscritorio();
  }
}
