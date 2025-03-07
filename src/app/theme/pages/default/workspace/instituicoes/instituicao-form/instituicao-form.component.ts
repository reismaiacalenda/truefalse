import { Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';
import { ValidateCnpj } from '../../../../../../_andaime/tf-validators/cnpj.validators';

@Component({
  selector: 'instituicao-form',
  templateUrl: 'instituicao-form.component.html'
})
export class InstituicaoFormComponent extends TfFormBaseComponent {
  entidade= "instituicoes";
  listDadosSelect = {
		'clientes': []
  }
  formulario = this.formBuilder.group({
    id: [null],
    nome: [null,Validators.required],                                          //tf-text-simples     :string
    //nome: [null, Validators.required],                     //tf-text-simples     :string
    codigo_base_cliente:[null]                            //tf-text-simples     :string
    // cliente_id: [null,Validators.required]                 //tf-select-simples    :string
  })

}

