import { Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';
import { consoleLog } from '../../../../../../globals';
import { Helpers } from '../../../../../../helpers';

@Component({
  selector: 'checkup-covid-form',
  templateUrl:'checkup-covid-form.component.html'
})
export class CheckupCovidFormComponent extends TfFormBaseComponent  {
  entidade = "respostas"
  listDadosSelect = {
  }

  listSelectEspacosNaoFilhos: any[];

  perguntas: any[] = [];

  formulario= this.formBuilder.group({
    id: [null],
    aaa: ["", Validators.required],
    bbb: ["", Validators.required],
  })

  initItemRows(){
    return this.formBuilder.group({
    })
  }

  childInit(){
    this.carregarQuestionario();
  }

  carregarQuestionario(){
    this.webService.get(`/questionarios/${1}/edit`)
      .subscribe((response)=>{
        this.perguntas = response.perguntas_attributes;
        this.criarFormPerguntas();
          // this.modalService.tratarSucesso(response)
          Helpers.setLoading(false);
        },
      (error) => {
        Helpers.setLoading(false);
        this.modalService.tratarError(error);
      }
    )
  }

  criarFormPerguntas(){

    // this.formulario.addControl()
  }

}