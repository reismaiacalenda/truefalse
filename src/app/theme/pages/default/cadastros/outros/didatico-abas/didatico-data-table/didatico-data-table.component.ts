import { Component } from '@angular/core';
import { DidaticoFormComponent } from '../didatico-form/didatico-form.component';
import { TfDatatableBase } from '../../../../../../../_andaime/tf-datatable/tf-datatable-base';

@Component({
  selector: 'didatico-data-table',
  templateUrl: './didatico-data-table.component.html'
})
export class DidaticoDataTableComponent extends TfDatatableBase {
  entidade = "andaimes";
  contentFormModal = DidaticoFormComponent;
}