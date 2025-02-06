import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { WorkspaceService } from '../../../../../_services/workspace.service';

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./recursos-alocados.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class RecursosAlocadosComponent implements OnInit {

  constructor(public workspaceService: WorkspaceService) {
  }

  ngOnInit() {
  }

}
