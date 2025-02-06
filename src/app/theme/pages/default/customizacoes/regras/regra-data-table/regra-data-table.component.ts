import { Component } from '@angular/core';
import { RegraFormComponent } from '../regra-form/regra-form.component';
import { TfDatatableBase } from '../../../../../../_andaime/tf-datatable/tf-datatable-base';
import { Helpers } from '../../../../../../helpers';
import { consoleLog } from '../../../../../../globals';

@Component({
  selector: 'regra-data-table',
  templateUrl:'regra-data-table.component.html'
})
export class RegraDataTableComponent extends TfDatatableBase {
  entidade= "regras";
  contentFormModal = RegraFormComponent;
  editingFlagIndex = -1;
  editingFlagSerie = -1;

  alterarPrioridade(rowId, sentidoPrioridade) {
    Helpers.setLoading(true);
    let descendo;
    let subindo;
    let posicaoAlterar;
    consoleLog(rowId);
    consoleLog(sentidoPrioridade);
    for (let i = 0; i < this.datatable.rows.length ; i++) {
      let row = this.datatable.rows[i];
      consoleLog(i);
      consoleLog(row);
      if (row.id == rowId && sentidoPrioridade == "subindo_id") {
        try{  
          row = this.datatable.rows[i-1];
          posicaoAlterar = row.id;
        } catch (Error)
        {
          Helpers.setLoading(false)
        }
        consoleLog(posicaoAlterar);
      }
      try{  
        if (row.id == rowId && sentidoPrioridade == "descendo_id") {
          row = this.datatable.rows[i+1];
          posicaoAlterar = row.id;
          consoleLog(row.id);
          consoleLog(posicaoAlterar);
        }
      } catch (Error)
      { 
        Helpers.setLoading(false)
      }
    }
    // });
    if (sentidoPrioridade == "subindo_id") {
      descendo = posicaoAlterar; // PEGAR ID DE CIMA, ANTERIOR
      subindo = rowId;
      consoleLog(descendo);
      consoleLog(subindo);
    }
    if (sentidoPrioridade == "descendo_id") {
      subindo = posicaoAlterar; // PEGAR ID DE BAIXO, POSTERIOR
      descendo = rowId;
      consoleLog(subindo);
      consoleLog(descendo);
    }
    consoleLog(descendo);
    consoleLog(subindo);
    if(descendo != undefined && subindo != undefined){
      this.webService.put(`regras/alterar_prioridade?descendo_id=${descendo}&subindo_id=${subindo}`, {})
        .subscribe(
          dados => {
            consoleLog(dados)
            Helpers.setLoading(false)
            this.refreshTable();
          },
            (error: any) => {
              this.modalService.tratarError(error)
              Helpers.setLoading(false);
              this.refreshTable();
          }
        )
    }
  }

}