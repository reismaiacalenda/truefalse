import { Component } from '@angular/core';
// import { IntegracaoFormComponent } from '../integracao-form/integracao-form.component';
import { TfDatatableBase } from '../../../../../../../_andaime/tf-datatable/tf-datatable-base';
import { Helpers } from '../../../../../../../helpers';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { consoleLog } from '../../../../../../../globals';

@Component({
  selector: 'integracao-data-table',
  templateUrl:'integracao-data-table.component.html'
})
export class IntegracaoDataTableComponent extends TfDatatableBase {
  entidade= "calendarios";
  contentFormModal = null; // contentFormModal = IntegracaoFormComponent;

  integrarCalendarios() { // rowId?: string
    let titulo: string = "Dados processados!";
    Helpers.setLoading(true);
    // this.webService.patch('integracaos/integrar_integracaos?unidade_id=3', {})
    this.webService.patch(`calendarios/integrar_calendarios`, {})
      .subscribe(
      (response) => {
        Helpers.setLoading(false);
        this.carregarTable();
        this.modalService.tratarMensagem(titulo, response.body.message);
        consoleLog("Passou pelo modalService.tratarSucesso")
        consoleLog(response);
        // consoleLog(response.body.message);
      },
      (error: any) => {
        Helpers.setLoading(false);
        // consoleLog(error)
        this.modalService.tratarError(error)
      },
      () => Helpers.setLoading(false))
  }

  // montarMensagemIntegracao(response) {
  //   let titulo: string = "Integração processada!";
  //   let corpo: string = "";
  //   if (response.count > 0) {
  //     titulo = `Calendários integrados: ${response.count}`
  //     response.calendarios.forEach(e => {
  //       corpo += `${e.email} `
  //     });
  //   } else {
  //     corpo = "Nenhum novo calendário foi integrado. Certifique-se que o calendário compartilhado foi adicionado no Outlook.";
  //   }
  //   this.modalService.tratarMensagem(titulo, corpo);
  // }

    openFormModal() { // rowId?: string
      consoleLog("Entrou no openFormModal, antes do integrarCalendarios")
      // consoleLog(rowId)
      this.integrarCalendarios();
    }

  }