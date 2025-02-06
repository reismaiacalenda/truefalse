import { Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../../_andaime/tf-forms/tf-form-base.component';

@Component({
  selector: 'fiscal-form',
  templateUrl:'fiscal-form.component.html'
})
export class FiscalFormComponent extends TfFormBaseComponent  {
  entidade= "fiscais"
  listDadosSelect = {
    'fiscais/list_fornecedores': []
  }
  listCarousel = {
    'carousel_nota_fiscal': {
      'fileList': {},
      'fileHolder': {}
    }
  }

  formulario= this.formBuilder.group({
    id: [null],
    numero_nota_fiscal: [null],
    custo: [null],
    data_compra: [(new Date).toLocaleDateString("PT")],
    hora_compra: ["09:00"],
    fornecedor: [null],
    carousel_nota_fiscal: [null]
  })
}