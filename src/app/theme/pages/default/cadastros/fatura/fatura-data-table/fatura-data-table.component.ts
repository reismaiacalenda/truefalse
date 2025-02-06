import { Component } from '@angular/core';
import { FaturaFormComponent } from '../fatura-form/fatura-form.component';
import { Helpers } from '../../../../../../helpers';
import { TfDatatableBase } from '../../../../../../_andaime/tf-datatable/tf-datatable-base';
import { consoleLog } from '../../../../../../globals';

@Component({
  selector: 'fatura-data-table',
  templateUrl: './fatura-data-table.component.html'
})
export class FaturaDataTableComponent extends TfDatatableBase {
  pagables:any[];
  selectedPagable:any=null;
  entidade = "faturas"
  contentFormModal = FaturaFormComponent
  childInit(){
    this.inicializarListEmpresas();
  }
  
  inicializarListEmpresas(){
    Helpers.setLoading(true);
      this.webService.get(`pagables/list_andaime`)
      .subscribe(
        (response:any) => {
          consoleLog("andaaime");
          consoleLog(response);
          this.pagables = response.pagables;
          Helpers.setLoading(false);
        },
        (error: any) => {
          this.modalService.tratarError(error);
          Helpers.setLoading(false);
        }
      );    

  }

  filtrarFaturasPorPagable(event){
    this.selectedPagable = event;
    var queryParam = `pagable_id=${event.value}&pagable_type=${event.optgroup}`
    this.datatableService.index(queryParam);
  }
}