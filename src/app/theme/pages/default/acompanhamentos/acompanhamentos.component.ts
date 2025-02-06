import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReservaModalService } from '../reservas/reserva-modal/reserva-modal.service';
import { WorkspaceService } from '../../../../_services/workspace.service';

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./acompanhamentos.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class AcompanhamentosComponent implements OnInit {
  primaryColor = this.workspaceService.workspace.primary_color;

  constructor(public reservaModalService: ReservaModalService,
    public workspaceService: WorkspaceService) {
  }

  ngOnInit() {
  }

  predefinidos(){
    this.reservaModalService.predefinidos()
  }

  parametrizacoes(){
    this.reservaModalService.parametrizacoes()
  }

}
