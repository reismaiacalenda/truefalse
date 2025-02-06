import { Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../../_andaime/tf-forms/tf-form-base.component';

@Component({
  selector: 'vinculo-espaco-form',
  templateUrl:'vinculo-espaco-form.component.html'
})
export class VinculoEspacoFormComponent extends TfFormBaseComponent  {
  localizacao_id;
  entidade= "tipo_espacos"
  listSelectEspacos: any[];
  titulo = "Vincular espaço";
  placeholder = "Selecione um espaço";
  categoria = 0;

  formulario= this.formBuilder.group({
    id: [null],
    nome: [null]
  })

  childInit(){
    // this.listEspacos();
  }
    
  listEspacos() {
    let params = {
      localizacao_id: this.localizacao_id,
      categoria: this.categoria
    }
    this.webService.get(`espacos/list_vinculo_planta`, params)
    .subscribe(dados => {
      // consoleLog(dados)
      this.listSelectEspacos = (<any>dados).espacos
      // consoleLog("listSelectTipoEspaco")
      // consoleLog(this.listSelectTipoEspacos)
    });    
  }  

  onSubmit(){
    this.listSelectEspacos.forEach(element => {
      if (element.id == this.formulario.get('id').value){
        this.formulario.get('nome').setValue(element.text);
      }
    });
    this.activeModal.close(this.formulario.value) 
  }


  
}