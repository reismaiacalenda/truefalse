import { Component } from '@angular/core';
import { PlanoFormComponent } from '../plano-form/plano-form.component';
import { TfDatatableBase } from '../../../../../../_andaime/tf-datatable/tf-datatable-base';

@Component({
  selector: 'plano-data-table',
  templateUrl: './plano-data-table.component.html'
})
export class PlanoDataTableComponent extends TfDatatableBase {
  entidade = "planos";
  contentFormModal = PlanoFormComponent;
}