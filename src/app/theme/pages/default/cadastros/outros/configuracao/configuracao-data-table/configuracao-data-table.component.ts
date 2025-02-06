import { Component, ViewChild, OnInit } from '@angular/core';
import { TfDatatableBase } from '../../../../../../../_andaime/tf-datatable/tf-datatable-base';
import { ConfiguracaoFormComponent } from '../configuracao-form/configuracao-form.component';

@Component({
  selector: 'configuracao-data-table',
  templateUrl: './configuracao-data-table.component.html'
})
export class ConfiguracaoDataTableComponent extends TfDatatableBase {
  entidade = "configuracoes";
  contentFormModal = ConfiguracaoFormComponent;
}
