import { Component, Input, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { consoleLog } from '../../../../../globals';
import { ReservaModalService } from '../../reservas/reserva-modal/reserva-modal.service';
import { Subscription } from 'rxjs';
import { ModalService } from '../../modal/modal.service';
import { WebService } from '../../../../../_services/web.service';
import { WorkspaceService } from '../../../../../_services/workspace.service';

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./costumer-success.component.html",
  encapsulation: ViewEncapsulation.None,

})
export class CostumerSuccessComponent implements OnInit, OnDestroy {
  @Input() cssClasses = '';
  private subscriptions: Subscription = new Subscription();
  dados:any;

  constructor(public reservaModalService: ReservaModalService,
    public modalService: ModalService,
    public webService: WebService,
    public workspaceService: WorkspaceService) {
    }
    
  ngOnInit(){
    this.coletarRelatorioDeUso();
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }

  coletarRelatorioDeUso(){
    Helpers.setLoading(true);
    this.subscriptions.add(
      this.webService.get('relatorios/costumer_success')
        .subscribe( 
          dados => {      
            this.dados = dados;
            Helpers.setLoading(false);
          },
          (error: any) => {
            this.modalService.tratarError(error)
            Helpers.setLoading(false);
          }
        )
      )
  }
}
