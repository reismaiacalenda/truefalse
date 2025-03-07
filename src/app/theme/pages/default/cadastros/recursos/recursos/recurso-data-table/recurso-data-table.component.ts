import { Component, Directive } from '@angular/core';
import { RecursoFormComponent } from '../recurso-form/recurso-form.component';
import { TfDatatableBase } from '../../../../../../../_andaime/tf-datatable/tf-datatable-base';
import { GerarQrCodeModalService } from '../../../../gerar-qrcode/gerar-qrcode.service';
import { consoleLog } from '../../../../../../../globals';

@Component({
  selector: 'recurso-data-table', 
  templateUrl:'recurso-data-table.component.html'
})
export class RecursoDataTableComponent extends TfDatatableBase {

  // public gerarQrCodeService:GerarQrCodeModalService;

  entidade= "recursos";
  contentFormModal = RecursoFormComponent;
  editingFlagIndex = -1;
  editingFlagSerie = -1;

  abrirQrCode(id, titulo){
    consoleLog("id na recurso");
    consoleLog(id);
    this.gerarQrCodeService.tratarQrCode(`recurso_id=${id}`, titulo);
  
  }

  // removeItemLote(rowId, numero_lote){
  //   if (numero_lote != undefined){
  //     // 'Exclusão em lote', "Apenas este recurso", "Todos recursos"
  //     this.modalService.tratarLote().then(
  //       r => {
  //       }
  //     )
  //   }else{
  //     this.datatableService.remove(rowId);
  //   }
  // }

}