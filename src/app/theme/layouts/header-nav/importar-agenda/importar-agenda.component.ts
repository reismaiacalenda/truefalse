import { Component, ViewEncapsulation } from "@angular/core";
import { WorkspaceService } from "../../../../_services/workspace.service";
import { User } from "../../../../auth/_models";
import { Helpers } from "../../../../helpers";
import { ModalService } from "../../../../theme/pages/default/modal/modal.service";
import { WebService } from "../../../../_services/web.service";
import { ImportarAgendaService } from "../../../../_services/importar-agenda.service";

@Component({
	selector: "importar-agenda",
	templateUrl: "./importar-agenda.component.html",
	encapsulation: ViewEncapsulation.None
})
export class ImportarAgendaComponent {
	currentUser: User;

	constructor(public webService: WebService,
		public modalService: ModalService,
		public workspaceService: WorkspaceService,
		public importarAgendaService: ImportarAgendaService){
		this.currentUser = this.workspaceService.currentUser;
	}

	importarAgenda(){
		this.importarAgendaService.baixarAgenda();
	}
}