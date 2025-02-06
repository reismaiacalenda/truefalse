import { Component } from '@angular/core';
import { QuestionarioFormComponent } from '../questionario-form/questionario-form.component';
import { TfDatatableBase } from '../../../../../../_andaime/tf-datatable/tf-datatable-base';

@Component({
  selector: 'questionario-data-table',
  templateUrl:'questionario-data-table.component.html'
})
export class QuestionarioDataTableComponent extends TfDatatableBase {
  entidade= "questionarios";
  contentFormModal = QuestionarioFormComponent;
  }