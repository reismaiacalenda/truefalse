import { Validators, FormGroup, FormArray } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';
import { consoleLog } from '../../../../../../globals';
import { Helpers } from '../../../../../../helpers';

@Component({
  selector: 'checkup-form',
  templateUrl:'checkup-form.component.html'
})
export class CheckupFormComponent extends TfFormBaseComponent  {
  entidade = "exames"
  listDadosSelect = {
  }

  questionario: any;

  formulario= this.formBuilder.group({
    id: [null],
    questionario_id: [null],
    anonimo: [true],
    respostas_attributes: this.initFormArrayName('respostas_attributes')
    // aaa: ["", Validators.required],
    // bbb: ["", Validators.required],
  })

  aba1 = this.formBuilder.array([
    this.formulario.controls['id'],
    this.formulario.controls['questionario_id']
  ])
  aba2 = this.formBuilder.array([
    this.formulario.controls['respostas_attributes'],
    this.formulario.controls['anonimo']
  ])
 
  abas=[
    {"icon":"flaticon-add", "formArray": this.aba1},
    {"icon":"flaticon-map-location", "formArray": this.aba2}
  ];


  initItemRows(){
    return this.formBuilder.group({
      id: [null],
      pergunta_id: [null],
      valor: [null]
    })
  }

  childInit(){
    Helpers.setLoading(true);
  }

  receberParametros(param){
    Helpers.setLoading(true);
    this.carregarQuestionario(param.id);

  }
  

  carregarQuestionario(id){
    this.webService.get(`questionarios/${id}/checkup`)
      .subscribe((response)=>{
        this.formulario.get('questionario_id').setValue(response.id);
        this.questionario = response;
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
    this.questionario.perguntas_attributes.forEach(pergunta => {
      let novaPerguntaFormGroup:FormGroup = this.initItemRows();
      novaPerguntaFormGroup.get('pergunta_id').setValue(pergunta.id);
      // this.novaPerguntaFormGroup
      (<FormArray>this.formulario.get('respostas_attributes')).push(novaPerguntaFormGroup);
      // (<FormArray>this.formulario.get('respostas_attributes')).control
    });

    
    // this.formulario.addControl()
  }

}