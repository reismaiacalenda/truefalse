import { Component } from '@angular/core';
import { AmenitiesInstalledFormComponent } from '../amenities-installed-form/amenities-installed-form.component';
import { TfDatatableBase } from '../../../../../../../_andaime/tf-datatable/tf-datatable-base';

@Component({
  selector: 'amenities-installed-data-table',
  templateUrl:'amenities-installed-data-table.component.html'
})
export class AmenitiesInstalledDataTableComponent extends TfDatatableBase {
  entidade= "amenities";
  contentFormModal = AmenitiesInstalledFormComponent;
}