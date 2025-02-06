import { Component } from '@angular/core';
import { CamposCustomizadosFormComponent } from '../campos-customizados-form/campos-customizados-form.component';
import { TfDatatableBase } from '../../../../../../_andaime/tf-datatable/tf-datatable-base';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'campos-customizados-data-table',
  templateUrl:'campos-customizados-data-table.component.html'
})
export class CamposCustomizadosDataTableComponent extends TfDatatableBase {
  entidade= "campos_customizados";
  contentFormModal = CamposCustomizadosFormComponent;
  // contentModalAdicional = CamposCustomizadosPreDefinidosComponent;

    // openModalAdicional(rowId?: string, modalSize: 'sm' | 'lg' | 'xxl' | 'xl'='xl') {
    //   let ngbModalOptions: NgbModalOptions
    //   if (modalSize == 'xxl'){
    //     ngbModalOptions={
    //       backdrop: 'static',
    //       keyboard: true,
    //       windowClass: 'tf-modal-extra-large'
    //     }
    //   } else {
    //     ngbModalOptions={
    //       backdrop: 'static',
    //       keyboard: true,
    //       size: modalSize
    //     }
    //   }
    //   const modalRef = this.modalNgb.open(CamposCustomizadosPreDefinidosComponent, ngbModalOptions);
    //   modalRef.componentInstance.rowId = rowId;
    // }

  }