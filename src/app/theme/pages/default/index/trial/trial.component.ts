import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { consoleLog } from '../../../../../../app/globals';
import { ReservaModalService } from '../../reservas/reserva-modal/reserva-modal.service';
import { Subscription } from 'rxjs';
import { ModalService } from '../../modal/modal.service';
import { WebService } from '../../../../../_services/web.service';
import { WorkspaceService } from '../../../../../_services/workspace.service';

@Component({
  selector: 'trial',
  templateUrl: './trial.component.html'
})
export class TrialComponent implements OnInit, OnDestroy {
  @Input() cssClasses = '';
  private subscriptions: Subscription = new Subscription();

  constructor(public reservaModalService: ReservaModalService,
    public modalService: ModalService,
    public webService: WebService,
    public workspaceService: WorkspaceService) {
  }

  ngOnInit(){
  }

  consultarTrial(situacao){
    if (this.workspaceService.workspace == undefined){
      return false;
    }
    switch (situacao){
      case "pro_lite":
        return this.workspaceService.workspace.plano == "pro_lite" && 
        this.workspaceService.workspace.experimentado == true;
      case "pro_trial":
        return this.workspaceService.workspace.plano == "pro_lite" &&
          this.workspaceService.workspace.trial == true;
      case "pro_expirado":
        return (this.workspaceService.workspace.plano == "pro_lite" &&
          this.workspaceService.workspace.trial == false) || 
          this.workspaceService.workspace.experimentado == true;
      case "enterprise":
        return this.workspaceService.workspace.plano == "enterprise";
    }
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }
}
