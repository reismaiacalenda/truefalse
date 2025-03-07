import { Injectable } from '@angular/core';
import { User } from '../auth/_models';
import { Helpers } from '../helpers';
import { ModalService } from '../theme/pages/default/modal/modal.service';
import { WebService } from './web.service';
import { WorkspaceService } from './workspace.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImportarAgendaService {
  currentUser: User;
  private notificarImportacao = new BehaviorSubject<number>(0);
  observarImportacao$ = this.notificarImportacao.asObservable();
  
  constructor(public webService: WebService,
		public modalService: ModalService,
		public workspaceService: WorkspaceService) { 
      this.currentUser = this.workspaceService.currentUser;
    }

  baixarAgenda(){
    Helpers.setLoading(true);
    this.webService.get(`funcionarios/${this.currentUser.id}/baixar_agenda`, {})
      .subscribe(
        response =>{
          Helpers.setLoading(false);
          this.modalService.tratarMensagem(response.title, response.message)
          // this.notificarImportacao.next(2);
        },
        (error) => {
          Helpers.setLoading(false);
          this.modalService.tratarError(error);
        }
      )
  }

}
