import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { consoleLog } from '../../../../../globals';
import { Subscription } from 'rxjs';
import { ModalService } from '../../modal/modal.service';
import { WebService } from '../../../../../_services/web.service';
import { WorkspaceService } from '../../../../../_services/workspace.service';

@Component({
  selector: 'engajamento',
  templateUrl: './engajamento.component.html'
})
export class EngajamentoComponent implements OnInit, OnDestroy {
  @Input() data:any;

  constructor(public modalService: ModalService,
    public webService: WebService,
    public workspaceService: WorkspaceService) {
  }

  ngOnInit(){
  }
  
  submit(opcao){
    Helpers.setLoading(true);
    let body = {
      questionario_id: this.data.id,
      anonimo: false,
      respostas_attributes: [
        {
          pergunta_id: this.data.perguntas_attributes[0].id,
          valor: opcao
        }
      ]
    };
    this.webService.post(`/exames`, body)
      .subscribe((response)=>{
        this.modalService.tratarSucesso(response);
        Helpers.setLoading(false);
      },
      (error) => {
        Helpers.setLoading(false);
        this.modalService.tratarError(error);
      }
    )
  }

  ngOnDestroy(){
    // this.subscriptions.unsubscribe();
  }
}
