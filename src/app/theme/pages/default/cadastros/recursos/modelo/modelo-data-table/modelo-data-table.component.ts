import { Component } from '@angular/core';
import { ModeloFormComponent } from '../modelo-form/modelo-form.component';
import { TfDatatableBase } from '../../../../../../../_andaime/tf-datatable/tf-datatable-base';

@Component({
  selector: 'modelo-data-table',
  templateUrl:'modelo-data-table.component.html'
})
export class ModeloDataTableComponent extends TfDatatableBase {
  entidade= "modelos";
  contentFormModal = ModeloFormComponent;
  
}