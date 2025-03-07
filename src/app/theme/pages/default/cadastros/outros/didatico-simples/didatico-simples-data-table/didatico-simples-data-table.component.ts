import { Component } from '@angular/core';
import { DidaticoSimplesFormComponent } from '../didatico-simples-form/didatico-simples-form.component';
import { TfDatatableBase } from '../../../../../../../_andaime/tf-datatable/tf-datatable-base';

@Component({
  selector: 'didatico-simples-data-table',
  templateUrl: './didatico-simples-data-table.component.html'
})
export class DidaticoSimplesDataTableComponent extends TfDatatableBase {
  entidade = "andaimes";
  contentFormModal = DidaticoSimplesFormComponent;
}
