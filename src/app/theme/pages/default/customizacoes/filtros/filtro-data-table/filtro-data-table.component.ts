import { Component } from '@angular/core';
import { FiltroFormComponent } from '../filtro-form/filtro-form.component';
import { TfDatatableBase } from '../../../../../../_andaime/tf-datatable/tf-datatable-base';

@Component({
  selector: 'filtro-data-table',
  templateUrl:'filtro-data-table.component.html'
})
export class FiltroDataTableComponent extends TfDatatableBase {
  entidade= "filtros";
  contentFormModal = FiltroFormComponent;
  editingFlagIndex = -1;
  editingFlagSerie = -1;
  }