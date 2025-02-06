import { Component } from '@angular/core';
import { FiscalFormComponent } from '../fiscal-form/fiscal-form.component';
import { TfDatatableBase } from '../../../../../../../_andaime/tf-datatable/tf-datatable-base';

@Component({
  selector: 'fiscal-data-table',
  templateUrl:'fiscal-data-table.component.html'
})
export class FiscalDataTableComponent extends TfDatatableBase {
  entidade= "fiscais";
  contentFormModal = FiscalFormComponent;
}