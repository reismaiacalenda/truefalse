import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { WorkspaceService } from '../../../../_services/workspace.service';
import { Router } from '@angular/router';

declare function abrirChat(): any;

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./workspace.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class WorkspaceComponent implements OnInit {
  primaryColor = this.workspaceService.workspace.primary_color;

  constructor(public workspaceService: WorkspaceService,
    private _router: Router) {
  }

  ngOnInit() {
  }

  boasVindas(){
    this._router.navigate(['/'], {queryParams: {boasvindas: true}})
  }

  tour(){
    this._router.navigate(['/'], {queryParams: {tour: true}})
  }

  onAbrirChat(){
		abrirChat()
	}

}
