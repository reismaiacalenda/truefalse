import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { consoleLog } from '../../../../../globals';
import { ReservaModalService } from '../../reservas/reserva-modal/reserva-modal.service';
import { Subscription } from 'rxjs';
import { ModalService } from '../../modal/modal.service';
import { WebService } from '../../../../../_services/web.service';
import { WorkspaceService } from '../../../../../_services/workspace.service';

@Component({
  selector: 'licenca',
  templateUrl: './licenca.component.html'
})
export class LicencaComponent implements OnInit, OnDestroy {
  @Input() cssClasses = '';
  private subscriptions: Subscription = new Subscription();
  licenca:any;

  constructor(public reservaModalService: ReservaModalService,
    public modalService: ModalService,
    public webService: WebService,
    public workspaceService: WorkspaceService) {
    }
    
  ngOnInit(){
    this.coletarLicenca();
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }

  coletarLicenca(){
    // Helpers.setLoading(true);
    // this.subscriptions.add(
    // this.webService.get('reservas/licenca')
    //   .subscribe( dados => {      
    //       this.licenca = dados;
    //     Helpers.setLoading(false)
    //     },
    //     (error: any) => {
    //       this.modalService.tratarError(error)
    //       Helpers.setLoading(false);
    //     }
    //   )
    // )
  }
  badgeOnOff(positivo, negativo, boolean){
    if (boolean == true){
      return `<span class="m-badge m-badge--primary m-badge--wide m--font-boldest">${positivo}</span>`;
    }else{
      return `<span class="m-badge m-badge--dark m-badge--wide m--font-boldest">${negativo}</span>`;
    }
  }
}
