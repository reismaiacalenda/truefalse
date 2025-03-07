import { Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { consoleLog } from '../../../../../../../globals';
import { Helpers } from '../../../../../../../helpers';
import { TfFormBaseComponent } from '../../../../../../../_andaime/tf-forms/tf-form-base.component';

@Component({
  selector: 'espaco-form-lote',
  templateUrl:'espaco-form-lote.component.html'
})
export class EspacoFormLoteComponent extends TfFormBaseComponent  {
  entidade= "espacos"
  listDadosSelect = {
    'tipo_espacos': [],
    'localizacoes': [],
    'calendarios': []
  }

  listSelectEspacosNaoFilhos: any[];

  formulario= this.formBuilder.group({
    id: [null],
    nome: [null, Validators.required],
    tipo_espaco_id: [null, Validators.required],
    localizacao_id: [null],//, Validators.required
    espaco_conjugado: [null],
    conjugado_pai_id: [null],
    capacidade_pessoas: [0],
    quantidade_lote: [2],
    em_lote: [true]
  })

  childInit(){
    // consoleLog(this.formArray.controls);
    consoleLog(this.formulario);
    this.montarListEspacosNaoFilhos()
  }

  montarListEspacosNaoFilhos(){
    Helpers.setLoading(true);
    consoleLog("Entrou no editForm!")
    consoleLog(this.rowId)
    this.webService.get(`espacos/list_nao_filhos`)
      .subscribe(
        dados =>{
          Helpers.setLoading(false);
          this.listSelectEspacosNaoFilhos = dados.espacos;
         },
        (error) => {
          Helpers.setLoading(false);
          this.modalService.tratarError(error);
        }
      )
  }

}