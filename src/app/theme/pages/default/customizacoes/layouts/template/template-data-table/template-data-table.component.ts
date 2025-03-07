import { Component, ViewChild, OnInit } from '@angular/core';
import {TemplateFormComponent} from '../template-form/template-form.component';
import { TfDatatableBase } from '../../../../../../../_andaime/tf-datatable/tf-datatable-base';

@Component({
  selector: 'template-data-table',
  templateUrl: './template-data-table.component.html'
})
export class TemplateDataTableComponent extends TfDatatableBase {
  entidade = "templates";
  contentFormModal = TemplateFormComponent;
}