import { Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';
import { consoleLog } from '../../../../../../globals';
import { Helpers } from '../../../../../../helpers';

@Component({
  selector: 'vacinado-form',
  templateUrl:'vacinado-form.component.html'
})
export class VacinadoFormComponent extends TfFormBaseComponent  {
  entidade = "respostas"
  listDadosSelect = {
  }

  listSelectEspacosNaoFilhos: any[];

  formulario= this.formBuilder.group({
    id: [null],
    nome: [null, Validators.required],
    tipo_espaco_id: [null, Validators.required],
    localizacao_id: [null],//, Validators.required
    calendario_id: [null],
    unidade_id: [this.currentUser.unidade_selecionada.id],
    espaco_conjugado: [null],
    conjugado_pai_id: [null],
    aaa: [null],
    bbb: [null],
  })

  initItemRows(){
    return this.formBuilder.group({
      recurso_id: [null],
      quantidade: [null]    
    })
  }

  childInit(){
  }

}