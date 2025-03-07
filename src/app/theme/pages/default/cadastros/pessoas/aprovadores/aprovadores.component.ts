import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Helpers } from '../../../../../../helpers';
import { NgSelectConfig } from '@ng-select/ng-select';
import { WorkspaceService } from '../../../../../../_services/workspace.service';

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./aprovadores.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class AprovadoresComponent implements OnInit {

  constructor(public workspaceService: WorkspaceService){}

  ngOnInit() {
  }

}
