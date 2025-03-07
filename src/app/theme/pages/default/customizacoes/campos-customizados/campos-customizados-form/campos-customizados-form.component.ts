import { Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';
import { consoleLog } from '../../../../../../globals';

@Component({
  selector: 'campos-customizados-form',
  templateUrl:'campos-customizados-form.component.html'
})
export class CamposCustomizadosFormComponent extends TfFormBaseComponent  {

  entidade= "campos_customizados"
  istDadosSelect = {
    'listar_tipo_campo': []
  }
  listSelectTipoCampo: any[];

  formulario= this.formBuilder.group({
     id: [null],
     nome: [null, Validators.required],
     tipo_campo_id: [null, Validators.required],
     opcoes: [null],
     default: [null],
     obrigatorio: [null],
     min_caracteres: [0],
     max_caracteres: [0]
    })


    listTipoCampo() {
      this.webService.get(`campos_customizados/listar_tipo_campo`)
        .subscribe(dados => {
          consoleLog(dados)
          this.listSelectTipoCampo = (<any>dados).listar_tipo_campo
          consoleLog("listSelectTipoCampo")
          consoleLog(this.listSelectTipoCampo)
        });    
    }

    habilitarCampoValoresEscolher(tipo_campo_id){
      if(tipo_campo_id == '6'){
        return true;
      } else {
        return false;
      }
    }

    habilitarCampoDefault(tipo_campo_id){
      if(tipo_campo_id == '1' || tipo_campo_id == '3' || tipo_campo_id == '4' || tipo_campo_id == '5' || tipo_campo_id == '9'){
        return true;
      } else {
        return false;
      }
    }

    habilitarCamposQuantidades(tipo_campo_id){
      if(tipo_campo_id > '0' && tipo_campo_id < '4'){
        return true;
      } else {
        return false;
      }
    }

    childInit(){
      this.listTipoCampo();
    }
    
}