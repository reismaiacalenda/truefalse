import { Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';
import { ValidateCnpj } from '../../../../../../_andaime/tf-validators/cnpj.validators';

@Component({
  selector: 'cliente-form',
  templateUrl: 'cliente-form.component.html'
})
export class ClienteFormComponent extends TfFormBaseComponent {
  entidade="clientes"

  public CELLPHONE = '(00) 0 0000-0000';
	public LANDLINE= '(00) 0000-0000';
	phoneMask = this.LANDLINE;
	previusLength = 0;

  formulario = this.formBuilder.group({
    id: [null],                           
    // razao_social: [null],                        //tf-text-simples     :string
    nome: [null, Validators.required],           //tf-text-simples     :string
    // cnpj: [null],                                //tf-text-simples     :string
    subdominio: [null],
    telefone: [null],
    convite_obrigatorio: [null],
    allowed_email_domains: [null]
  });

  onPhoneChanged() {
		if (this.formulario.value.telefone.length <= 10 && this.phoneMask === this.CELLPHONE) {
			this.phoneMask = this.LANDLINE;
		}
		else if (this.formulario.value.telefone.length === 10 && this.phoneMask === this.LANDLINE && this.previusLength === 10) {
			this.phoneMask = this.CELLPHONE;
		}
 
		this.previusLength = this.formulario.value.telefone.length;
	}
}