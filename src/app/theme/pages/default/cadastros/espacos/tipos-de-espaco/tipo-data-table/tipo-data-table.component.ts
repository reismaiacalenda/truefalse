import { Component } from '@angular/core';
import { TipoFormComponent } from '../tipo-form/tipo-form.component';
import { TfDatatableBase } from '../../../../../../../_andaime/tf-datatable/tf-datatable-base';

@Component({
  selector: 'tipo-data-table',
  templateUrl:'tipo-data-table.component.html'
})
export class TipoDataTableComponent extends TfDatatableBase {
  entidade= "tipo_espacos";
  contentFormModal = TipoFormComponent;
}