import { Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../../_andaime/tf-forms/tf-form-base.component';

@Component({
  selector: 'tipo-form',
  templateUrl:'tipo-form.component.html'
})
export class TipoFormComponent extends TfFormBaseComponent  {
  entidade= "tipo_espacos"
  listDadosSelect = {
    'grupos': []
  }

  formulario= this.formBuilder.group({
    id: [null],
    nome: [null, Validators.required],
    grupos_attributes: this.prepararFormArraySelectMultiploSemRequired(),
    categoria: [null, Validators.required],
    intervalo_entre_reservas: [0, Validators.required],
    check_out: [true],
    check_in: [true],
    antecedence_check_in: [5],
    tolerance_check_in: [15],
    mandatory_check_in: [false],
    not_mandatory_groups_space_types_attributes: this.prepararFormArraySelectMultiploSemRequired(),
    estender_reserva: [false],
    time_before_end: [10]
  })
}
