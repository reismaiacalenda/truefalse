
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ReservaModalService } from '../../reservas/reserva-modal/reserva-modal.service';
import { Subscription } from 'rxjs';
import { ModalService } from '../../modal/modal.service';
import { WebService } from '../../../../../_services/web.service';
import { WorkspaceService } from '../../../../../_services/workspace.service';

@Component({
  selector: 'citacao',
  templateUrl: './citacao.component.html'
})
export class CitacaoComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  constructor(public reservaModalService: ReservaModalService,
    public modalService: ModalService,
    public webService: WebService,
    public workspaceService: WorkspaceService) {
    }
    
  ngOnInit(){
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }

}
