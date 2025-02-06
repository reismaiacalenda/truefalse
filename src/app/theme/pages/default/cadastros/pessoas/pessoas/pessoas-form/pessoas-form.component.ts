import { Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../../_andaime/tf-forms/tf-form-base.component';
import { ValidateEmail } from '../../../../../../../_andaime/tf-validators/email.validators';
@Component({
  selector: 'pessoas-form',
  templateUrl: 'pessoas-form.component.html'
})
export class PessoaFormComponent extends TfFormBaseComponent {
  entidade= "funcionarios";
  listDadosSelect = {
    'unidades':[],
    'grupos':[]
  }
  formulario = this.formBuilder.group({
    id: [null],
    name:[null,Validators.required],
    ativo: [null],
    email: [null],
    rfid:[null],
    unidades_attributes: this.prepararFormArraySelectMultiplo([Validators.required]),
    grupos_attributes: this.prepararFormArraySelectMultiplo([Validators.required]),
    role: [1],
    password:[123456]
    // ValidateEmail: [null],
  })
}

