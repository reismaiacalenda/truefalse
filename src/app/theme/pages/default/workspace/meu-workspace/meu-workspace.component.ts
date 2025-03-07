import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { consoleLog } from '../../../../../globals';
import { ReservaModalService } from '../../reservas/reserva-modal/reserva-modal.service';
import { Subscription } from 'rxjs';
import { ModalService } from '../../modal/modal.service';
import { WebService } from '../../../../../_services/web.service';
import { WorkspaceService } from '../../../../../_services/workspace.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DomainService } from '../../../../../_services/domain.service';
import { ClienteFormComponent } from './cliente-form/cliente-form.component';

@Component({
  selector: 'meu-workspace',
  templateUrl: './meu-workspace.component.html'
})
export class MeuWorkspaceComponent implements OnInit, OnDestroy {
  @Input() cssClasses = '';
  private subscriptions: Subscription = new Subscription();
  // meu-workspace:any;

  constructor(public reservaModalService: ReservaModalService,
    public modalService: ModalService,
    public webService: WebService,
    public modalNgb: NgbModal,
    public domainService: DomainService,
    public workspaceService: WorkspaceService) {
    }
    
  ngOnInit(){
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }

  coletarDegustacao(){
    // Helpers.setLoading(true);
    // this.subscriptions.add(
    // this.webService.get('reservas/meu-workspace')
    //   .subscribe( dados => {      
    //       this.meu-workspace = dados;
    //     Helpers.setLoading(false)
    //     },
    //     (error: any) => {
    //       this.modalService.tratarError(error)
    //       Helpers.setLoading(false);
    //     }
    //   )
    // )
  }

  openFormEdit(){
    let ngbModalOptions: NgbModalOptions
    ngbModalOptions={
      backdrop: 'static',
      keyboard: true
      // size: 'md'
    }
    const modalRef = this.modalNgb.open(ClienteFormComponent, ngbModalOptions);
    modalRef.componentInstance.rowId = this.workspaceService.workspace.id;
    modalRef.result.then((responseSuccess) => {
      consoleLog("Entrou na modalRef!")
      if (responseSuccess == true) {
        window.location.reload();
        // this.carregarTable();
        consoleLog("Entrou na carregarTable dentro da responseSuccess!")
      }
    })
  }

  badgeOnOff(positivo, negativo, boolean){
    if (boolean == true){
      return `<span class="m-badge m-badge--primary m-badge--wide m--font-boldest">${positivo}</span>`;
    }else{
      return `<span class="m-badge m-badge--dark m-badge--wide m--font-boldest">${negativo}</span>`;
    }
  }
}
