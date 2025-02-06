import { Component } from '@angular/core';
import { PerguntaFormComponent } from '../pergunta-form/pergunta-form.component';
import { TfDatatableBase } from '../../../../../../_andaime/tf-datatable/tf-datatable-base';

@Component({
  selector: 'pergunta-data-table',
  templateUrl:'pergunta-data-table.component.html'
})
export class PerguntaDataTableComponent extends TfDatatableBase {
  entidade= "perguntas";
  contentFormModal = PerguntaFormComponent;
  }