import { Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';
@Component({
  selector: 'unidade-form',
  templateUrl: 'unidade-form.component.html'
})
export class UnidadeFormComponent extends TfFormBaseComponent {
  entidade= "unidades";
  listDadosSelect = {
    'instituicoes': [],
    'client_apis': []
  }
  formulario = this.formBuilder.group({
    id: [null],
    nome: [null, Validators.required],                     //tf-text-simples     :string
    sigla:[null, [Validators.required, Validators.minLength(2), Validators.maxLength(3)]],
    codigo_base_cliente:[null],                            //tf-text-simples     :string
    ativada:[true],
    send_invitation:[true]
    // instituicao_id:[null, Validators.required],
    // client_api_id:[null]
  })
}

