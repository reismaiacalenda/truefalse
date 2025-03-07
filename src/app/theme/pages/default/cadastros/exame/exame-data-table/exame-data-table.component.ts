import { Component } from '@angular/core';
import { ExameFormComponent } from '../exame-form/exame-form.component';
import { TfDatatableBase } from '../../../../../../_andaime/tf-datatable/tf-datatable-base';

@Component({
  selector: 'exame-data-table',
  templateUrl:'exame-data-table.component.html'
})
export class ExameDataTableComponent extends TfDatatableBase {
  entidade= "exames";
  contentFormModal = ExameFormComponent;
  }