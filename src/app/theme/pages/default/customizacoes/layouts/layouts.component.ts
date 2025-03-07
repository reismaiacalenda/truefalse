import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { WorkspaceService } from '../../../../../_services/workspace.service';

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./layouts.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class LayoutsComponent implements OnInit {

  constructor(
    public workspaceService: WorkspaceService) {
  }

  ngOnInit() {
  }

}
