import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReservaModalService } from '../../reservas/reserva-modal/reserva-modal.service';
import { WorkspaceService } from '../../../../../_services/workspace.service';

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./monitoramento.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class MonitoramentoComponent implements OnInit {

  constructor(
    public workspaceService: WorkspaceService) {
  }

  ngOnInit() {
  }

}
