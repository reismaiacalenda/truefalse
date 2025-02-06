import { Component, ViewChild, OnInit } from '@angular/core';
import { TfDatatableBase } from '../../../../../../_andaime/tf-datatable/tf-datatable-base';
import { InstituicaoFormComponent } from '../instituicao-form/instituicao-form.component';

@Component({
  selector: 'instituicao-data-table',
  templateUrl: './instituicao-data-table.component.html'
})
export class InstituicaoDataTableComponent extends TfDatatableBase {
  entidade = "instituicoes";
  contentFormModal = InstituicaoFormComponent;
}
