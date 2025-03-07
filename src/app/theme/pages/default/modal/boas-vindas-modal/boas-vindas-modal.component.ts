import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WorkspaceService } from '../../../../../_services/workspace.service';

@Component({
  selector: 'boas-vindas-modal',
  templateUrl: 'boas-vindas-modal.html'
})
export class BoasVindasModalComponent implements OnInit {
  private currentUser = this.workspaceService.currentUser;

  constructor(
    public activeModal: NgbActiveModal,
    public workspaceService: WorkspaceService
  ) { }

  ngOnInit() {
    console.log(this.currentUser);
  }

}
