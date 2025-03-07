import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { printable } from '../../../../../globals';
import { ReservaModalService } from '../reserva-modal/reserva-modal.service';
import { WorkspaceService } from '../../../../../_services/workspace.service';

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./listagem.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class ListagemComponent implements OnInit {

  constructor(public workspaceService: WorkspaceService) {
  }

  public reservaModalService: ReservaModalService;

  parametrizacoes(){
    this.reservaModalService.parametrizacoes();
  }

  ngOnInit() {
    //alterçaão ficticia para dfemonstrar gitflow.
    //algum codigo legal de reserva
  }

  printable(){return printable()}

}
