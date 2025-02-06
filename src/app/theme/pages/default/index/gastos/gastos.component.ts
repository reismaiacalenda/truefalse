import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { consoleLog } from '../../../../../../app/globals';
import { ReservaModalService } from '../../reservas/reserva-modal/reserva-modal.service';
import { Subscription } from 'rxjs';
import { ModalService } from '../../modal/modal.service';
import { WebService } from '../../../../../_services/web.service';
import { WorkspaceService } from '../../../../../_services/workspace.service';

@Component({
  selector: 'gastos',
  templateUrl: './gastos.component.html'
})
export class GastosComponent implements OnInit, OnDestroy {
  @Input() cssClasses = '';
  private subscriptions: Subscription = new Subscription();
  gastos:any;

  constructor(public reservaModalService: ReservaModalService,
    public modalService: ModalService,
    public webService: WebService,
    public workspaceService: WorkspaceService) {
    }
    
  ngOnInit(){
    this.coletarGastos();
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }

  coletarGastos(){
    Helpers.setLoading(true);
    this.subscriptions.add(
    this.webService.get('reservas/gastos')
      .subscribe( dados => {      
          this.gastos = dados;
        Helpers.setLoading(false)
        },
        (error: any) => {
          this.modalService.tratarError(error)
          Helpers.setLoading(false);
        }
      )
    )
  }
}
