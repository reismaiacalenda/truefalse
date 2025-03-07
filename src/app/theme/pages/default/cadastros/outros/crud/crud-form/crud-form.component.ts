import { Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../../_andaime/tf-forms/tf-form-base.component';

@Component({
  selector: 'crud-form',
  templateUrl: 'crud-form.component.html'
})
export class CrudFormComponent extends TfFormBaseComponent {
  entidade="cruds"
    formulario = this.formBuilder.group({
      id: [null],
      nome: [null, Validators.required],
      cpf: [null],
      valor_radio: [null],
      opcao_checkBox: [false],
      valor_checkList: [null],
      valor_float: [null],         
      valor_integer: [1],
      valor_data: ["22/11/1993"],      
      valor_time: [], //2
      observacao: [null],
      valor_float_2: [null]
    });

  childInit(){
    if (!this.formulario.get('id').value){
      //this.formulario.disable();
      this.formulario.get('valor_float').disable();
    }
  }
}