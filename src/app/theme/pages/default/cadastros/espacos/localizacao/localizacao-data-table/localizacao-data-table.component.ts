import { Component, ViewChild, OnInit } from '@angular/core';
import { TfDatatableBase } from '../../../../../../../_andaime/tf-datatable/tf-datatable-base';
import { LocalizacaoFormComponent } from '../localizacao-form/localizacao-form.component';

@Component({
  selector: 'localizacao-data-table',
  templateUrl: './localizacao-data-table.component.html'
})
export class LocalizacaoDataTableComponent extends TfDatatableBase {
  entidade = "localizacoes";
  contentFormModal = LocalizacaoFormComponent;

}
