import { Component, OnInit, Input, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WebService } from '../../../../../_services/web.service';
import { Helpers } from '../../../../../helpers';
import { ModalService } from '../modal.service';

@Component({
  selector: 'trial-expirado-modal',
  templateUrl: 'trial-expirado-modal.html'
})
export class TrialExpiradoModalComponent implements OnInit {
  flagNotificado:boolean = false;
  loading: boolean = false;

  constructor(public activeModal: NgbActiveModal,
    private injector: Injector) { }

  ngOnInit() {
  }

  notificarEquipe(){
    Helpers.setLoading(true);
    this.loading = true;
    const webService = this.injector.get(WebService);
    webService.put('clientes/requentar', {})
    .subscribe(
      dados => {
        this.flagNotificado = true;
        Helpers.setLoading(false);
        this.loading = false;
      },
      (error: any) => {
        const modalService = this.injector.get(ModalService);
        modalService.tratarError(error)
        Helpers.setLoading(false);
        this.loading = false;
      }
    )

    Helpers.setLoading(false);
  }

}
