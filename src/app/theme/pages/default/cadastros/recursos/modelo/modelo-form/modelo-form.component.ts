import { Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../../_andaime/tf-forms/tf-form-base.component';

@Component({
  selector: 'modelo-form',
  templateUrl:'modelo-form.component.html'
})
export class ModeloFormComponent extends TfFormBaseComponent  {
  entidade= "modelos"
  
  listDadosSelect = {
    'modelos/list_modelos': [],
    'modelos/list_categorias': [],
    'modelos/list_fabricantes': []
  }

  formulario= this.formBuilder.group({
    id: [null],
    nome: [null],
    categoria: [null],
    fabricante: [null],
    descricao: [null]
  })
}