import { Validators, FormGroup, Validator } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../../_andaime/tf-forms/tf-form-base.component';
import { consoleLog } from '../../../../../../../globals';

@Component({
  selector: 'servico-form',
  templateUrl:'servico-form.component.html'
})
export class ServicoFormComponent extends TfFormBaseComponent  {
  entidade= "servicos"
  listDadosSelect = {
    'funcionarios': [],
    'grupos': []
  }

  formulario= this.formBuilder.group({
    id: [null],
    nome: [null, Validators.required],
    grupos_attributes: this.prepararFormArraySelectMultiploSemRequired(),
    numero_serie: [null],
    condicao: [null],
    modelo: [null],
    nota_fiscal: [null],
    imei: [null],
    custo: [null],
    preco_recursos: [null],
    vinculavel_espaco: [null],
    vinculavel_grupo: [null],
    quantidade_recursos: [null],
    estoque_recursos: [null]
  })

  desabilitarCampos(){
    if (this.rowId != null){      
      consoleLog("Entrou no childInit do disable")
      consoleLog(this.formulario.get('id').value)
      consoleLog(this.rowId)
      this.formulario.get('preco_recursos').disable();
      this.formulario.get('vinculavel_espaco').disable();
      this.formulario.get('vinculavel_grupo').disable();
    }
  }

  childInit(){
  }

}