import { Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../../_andaime/tf-forms/tf-form-base.component';

@Component({
  selector: 'amenities-form',
  templateUrl:'amenities-form.component.html'
})
export class AmenitiesFormComponent extends TfFormBaseComponent  {
  entidade= "recursos"
  listDadosSelect = {}

  formulario= this.formBuilder.group({
    id: [null],
    nome: [null],
    service_type: 'amenities'
  })
}