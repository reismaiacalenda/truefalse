import { Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';

@Component({
  selector: 'exame-form',
  templateUrl:'exame-form.component.html'
})
export class ExameFormComponent extends TfFormBaseComponent  {
  entidade= "exames"
    listDadosSelect = {
    
  }
   formulario= this.formBuilder.group({
     id: [null],
     pontuacao: [null],
     anonimo: [null]
        })
}