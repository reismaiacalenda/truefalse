import { Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../../_andaime/tf-forms/tf-form-base.component';
import { ValidateCnpj } from '../../../../../../../_andaime/tf-validators/cnpj.validators';

@Component({
  selector: 'configuracao-form',
  templateUrl: 'configuracao-form.component.html'
})
export class ConfiguracaoFormComponent extends TfFormBaseComponent {
  entidade= "configuracoes";
  listDadosSelect = {
  }
  formulario = this.formBuilder.group({
    id: [null],
    key:[null],
    value:[null,Validators.required]
  })

  childInit(){
    if (!this.formulario.get('id').value){
      //this.formulario.disable();
      this.formulario.get('key').disable();
    }
  }

}

