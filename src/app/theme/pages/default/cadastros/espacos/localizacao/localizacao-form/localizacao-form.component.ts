import { Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../../_andaime/tf-forms/tf-form-base.component';
import { ValidateCnpj } from '../../../../../../../_andaime/tf-validators/cnpj.validators';

@Component({
  selector: 'localizacao-form',
  templateUrl: 'localizacao-form.component.html'
})
export class LocalizacaoFormComponent extends TfFormBaseComponent {
  entidade= "localizacoes";
  listDadosSelect = {
    'localizacoes': []
  }

  formulario = this.formBuilder.group({
    id: [null],                           
    predio: [null, Validators.required],                     
    localizacao_id: [null],                       
    ordem: [null]
  })
}

