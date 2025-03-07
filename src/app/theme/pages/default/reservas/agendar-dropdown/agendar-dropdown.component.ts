import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { WorkspaceService } from '../../../../../_services/workspace.service';
import { consoleLog } from '../../../../../globals';
import { Helpers } from '../../../../../helpers';
import { ReservaModalService } from '../reserva-modal/reserva-modal.service';

@Component({
  selector: 'agendar-dropdown',
  templateUrl: "./agendar-dropdown.component.html",
	encapsulation: ViewEncapsulation.None
})
export class AgendarDropdownComponent implements OnInit {
  flagSegurarDropdown:boolean = false;

  @Input() placement = "bottom-right";
  @Input() body;
  @Output() refresh = new EventEmitter();

  constructor(public workspaceService: WorkspaceService,
    public reservaModalService: ReservaModalService) { }

  ngOnInit() {
  }
  
  openModalNew(tipoModal) {
    this.body.tela += tipoModal;
    this.reservaModalService.openFormModalNew(tipoModal, this.body)
      .subscribe(response=>{
        this.refresh.emit('');
      });
  }
}
