import { Component } from '@angular/core';
import { EspacoFormComponent } from '../espaco-form/espaco-form.component';
import { TfDatatableBase } from '../../../../../../../_andaime/tf-datatable/tf-datatable-base';
import { Helpers } from '../../../../../../../helpers';
import { consoleLog } from '../../../../../../../globals';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { EspacoFormLoteComponent } from '../espaco-form-lote/espaco-form-lote.component';

@Component({
  selector: 'espaco-data-table',
  templateUrl:'espaco-data-table.component.html'
})
export class EspacoDataTableComponent extends TfDatatableBase {
  entidade= "espacos";
  contentFormModal = EspacoFormComponent;

  abrirFecharEspaco(id){
    Helpers.setLoading(true);
    this.webService.put(`espacos/${id}/abrir_fechar_espaco`, {})
      .subscribe(
        response =>{
          this.modalService.tratarMensagem("Abrir/Fechar Espaço", response.body.message)
          consoleLog(response)
          Helpers.setLoading(false);
        },
        (error) => {
          Helpers.setLoading(false);
          this.modalService.tratarError(error);
        }
      )
  }

  bloquearDesbloquear(id){
    Helpers.setLoading(true);
    this.webService.put(`espacos/${id}/bloquear_desbloquear_espaco`, {})
      .subscribe(
        response =>{
          this.modalService.tratarMensagem("Bloquear/Desbloquear Espaço", response.body.message);
          this.carregarTable();
          consoleLog(response)
          Helpers.setLoading(false);
        },
        (error) => {
          Helpers.setLoading(false);
          this.modalService.tratarError(error);
        }
      )
  }


  abrirQrCode(id, titulo){
    consoleLog("id na espaco");
    consoleLog(id);
    this.gerarQrCodeService.tratarQrCode(`espaco_id=${id}`, titulo);
  }

  openModalAdicional(){
    let ngbModalOptions: NgbModalOptions
    ngbModalOptions={
      backdrop: 'static',
      keyboard: true
      // size: 'md'
    }
      
    const modalRef = this.modalNgb.open(EspacoFormLoteComponent, ngbModalOptions);
    // modalRef.componentInstance.rowId = rowId;
    modalRef.result.then((responseSuccess) => {
      consoleLog("Entrou na modalRef!")
      if (responseSuccess) {
        this.carregarTable();
        consoleLog("Entrou na carregarTable dentro da responseSuccess!")
      }
    })
  }
}