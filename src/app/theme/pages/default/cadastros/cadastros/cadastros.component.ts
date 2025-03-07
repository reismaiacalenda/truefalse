import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReservaModalService } from './../../reservas/reserva-modal/reserva-modal.service';
import { WorkspaceService } from '../../../../../_services/workspace.service';

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./cadastros.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class CadastrosComponent implements OnInit {

  constructor(public reservaModalService: ReservaModalService,
    public workspaceService: WorkspaceService) {
  }

  ngOnInit() {
  }

  convidarPessoas() {
    this.reservaModalService.abrirModalConvidarPessoas()
  }

}
