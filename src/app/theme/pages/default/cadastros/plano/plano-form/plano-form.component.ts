import { Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';

@Component({
  selector: 'plano-form',
  templateUrl: 'plano-form.component.html'
})
export class PlanoFormComponent extends TfFormBaseComponent {
  entidade="planos" 
  formulario = this.formBuilder.group({
    id: [null],                           
    nome: [null, Validators.required],                    //tf-text-simples     :string
    preco: [null],                                        //tf-money            :float
    intervalo_fatura: [4,Validators.required],                                      //tf-radio-button     :integer 
    descricao: [null],                                    //tf-text-simples     :string
    unidade_id: [this.currentUser.unidade_selecionada.id] //Passar no body: unidade_id
  });
}