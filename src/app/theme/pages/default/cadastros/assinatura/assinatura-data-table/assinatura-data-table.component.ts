import { Component } from '@angular/core';
import { AssinaturaFormComponent } from '../assinatura-form/assinatura-form.component';
import { TfDatatableBase } from '../../../../../../_andaime/tf-datatable/tf-datatable-base';

@Component({
  selector: 'assinatura-data-table',
  templateUrl: './assinatura-data-table.component.html'
})
export class AssinaturaDataTableComponent extends TfDatatableBase {
  entidade = "assinaturas";
  contentFormModal = AssinaturaFormComponent;
}