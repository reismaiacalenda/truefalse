import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReservaModalService } from '../reserva-modal/reserva-modal.service';
import { WorkspaceService } from '../../../../../_services/workspace.service';

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./quadros.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class QuadrosComponent implements OnInit {

  constructor(public workspaceService: WorkspaceService,
    public reservaModalService: ReservaModalService) {
  }

  ngOnInit() {
  }

  convidarPessoas() {
    this.reservaModalService.abrirModalConvidarPessoas();
  }

}
