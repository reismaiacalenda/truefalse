import { Component } from '@angular/core';
import { ServicoFormComponent } from '../servico-form/servico-form.component';
import { TfDatatableBase } from '../../../../../../../_andaime/tf-datatable/tf-datatable-base';

@Component({
  selector: 'servico-data-table',
  templateUrl:'servico-data-table.component.html'
})
export class ServicoDataTableComponent extends TfDatatableBase {
  entidade= "servicos";
  contentFormModal = ServicoFormComponent;
  }