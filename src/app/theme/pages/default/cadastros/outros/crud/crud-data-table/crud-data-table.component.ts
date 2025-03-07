import { Component } from '@angular/core';
import { CrudFormComponent } from '../crud-form/crud-form.component';
import { TfDatatableBase } from '../../../../../../../_andaime/tf-datatable/tf-datatable-base';

@Component({
  selector: 'crud-data-table',
  templateUrl: './crud-data-table.component.html'
})
export class CrudDataTableComponent extends TfDatatableBase {
  entidade = "cruds";
  contentFormModal = CrudFormComponent;
}
