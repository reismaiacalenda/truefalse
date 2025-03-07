import { Component, OnInit } from '@angular/core';
import { AmenitiesFormComponent } from '../amenities-form/amenities-form.component';
import { TfDatatableBase } from '../../../../../../../_andaime/tf-datatable/tf-datatable-base';
@Component({
  selector: 'amenities-data-table',
  templateUrl:'amenities-data-table.component.html'
})

export class AmenitiesDataTableComponent extends TfDatatableBase{
  entidade= "recursos";
  defautlQuery="service_amenities"
  contentFormModal = AmenitiesFormComponent; 
}