import { Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';

@Component({
  selector: 'pergunta-form',
  templateUrl:'pergunta-form.component.html'
})
export class PerguntaFormComponent extends TfFormBaseComponent  {
  entidade= "perguntas"
    listDadosSelect = {
    
  }
  formulario= this.formBuilder.group({
    id: [null],
    questao: [null],
    resposta_correta: [null],
    opcoes: [null],
    // opcoes_string: [null],
    tipo: [null],
    ordem: [null]
  })

  // onSubmit() {
  //   this.opcoesToArray();
  //   // this.formulario.updateValueAndValidity();
  //   if(this.modalAdicional == false){
  //     consoleLog("form service zuado né?")
  //     consoleLog(this.formService.entidade_nome);
  //     this.formService.save();
  //   }else{
  //     this.activeModal.close(this.formulario);
  //   }
  // }

  // opcoesToArray(){
  //   var opcoes_array = this.formulario.get('opcoes_string').value.split(';');
  //   this.formulario.get('opcoes').setValue(opcoes_array);
  // }
}