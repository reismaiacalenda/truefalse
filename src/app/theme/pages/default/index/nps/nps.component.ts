import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { consoleLog } from '../../../../../globals';
import { Subscription } from 'rxjs';
import { ModalService } from '../../modal/modal.service';
import { WebService } from '../../../../../_services/web.service';
import { WorkspaceService } from '../../../../../_services/workspace.service';
import { User } from '../../../../../auth/_models';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'nps',
  templateUrl: './nps.component.html'
})
export class NPSComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  currentUser: User;
  notas:number[] = [];
  pagina = 1;
  @Input() data;
  questionario_id;
  formulario = this.formBuilder.group({
    opiniao: [null]
  })


  constructor(public modalService: ModalService,
    public formBuilder: FormBuilder,
    public webService: WebService,
    public workspaceService: WorkspaceService) {
    this.currentUser = this.workspaceService.currentUser;
    this.notas = new Array<number>(11);
  }

  ngOnInit(){
  }

  ngOnDestroy(){
    // this.subscriptions.unsubscribe();
  }

  submitNota(nota){
    Helpers.setLoading(true);
    let body = {
      questionario_id: this.data.id,
      anonimo: false,
      respostas_attributes: [
        {
          pergunta_id: this.data.perguntas_attributes[0].id,
          valor: nota
        }
      ]
    };
    this.webService.post(`/exames`, body)
      .subscribe((response)=>{
        this.modalService.tratarSucesso(response);
        Helpers.setLoading(false);
        this.pagina = 2;
        this.questionario_id = response.body.id;
      },
      (error) => {
        Helpers.setLoading(false);
        this.modalService.tratarError(error);
      }
    )
  }

  submitOpiniao(){
    Helpers.setLoading(true);
    let body = {
      // questionario_id: this.data.id,
      // anonimo: false,
      respostas_attributes: [
        {
          pergunta_id: this.data.perguntas_attributes[1].id,
          valor: this.formulario.get('opiniao').value
        }
      ]
    }
    this.webService.put(`/exames/${this.questionario_id}`, body)
      .subscribe((response)=>{
        this.modalService.tratarSucesso(response);
        Helpers.setLoading(false);
        this.pagina = 3;
      },
      (error) => {
        Helpers.setLoading(false);
        this.modalService.tratarError(error);
      }
    )

  }

  encerrarEngajamento(){
    this.pagina = 0;
  }

  comentario(){
    this.pagina = 0;
  }
}
