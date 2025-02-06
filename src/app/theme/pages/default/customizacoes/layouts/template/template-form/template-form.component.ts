import { Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../../_andaime/tf-forms/tf-form-base.component';
@Component({
  selector: 'template-form',
  templateUrl: 'template-form.component.html'
})
export class TemplateFormComponent extends TfFormBaseComponent {
  entidade= "templates";
  listDadosSelect = {
  }
  formulario = this.formBuilder.group({
    id: [null],
    nome: [null, Validators.required],                     //tf-text-simples     :string
    tipo:[0, Validators.required],
    orientacao:[0,Validators.required],                            //tf-text-simples     :string
    carousel_fundo: [false],
    interacao:[false],
    prox_horarios:[0]
  })
}

