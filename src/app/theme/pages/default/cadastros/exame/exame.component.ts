import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { WorkspaceService } from '../../../../../_services/workspace.service';
import { Helpers } from '../../../../../helpers';

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./exame.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class ExameComponent implements OnInit {

  constructor(public workspaceService: WorkspaceService) {
  }

  ngOnInit() {
  }

}
