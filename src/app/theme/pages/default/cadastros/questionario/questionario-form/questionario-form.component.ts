import { Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { PerguntaFormComponent } from '../../pergunta/pergunta-form/pergunta-form.component';
import { consoleLog } from '../../../../../../globals';

@Component({
  selector: 'questionario-form',
  templateUrl:'questionario-form.component.html'
})
export class QuestionarioFormComponent extends TfFormBaseComponent  {
  entidade= "questionarios"
  listDadosSelect = {
  }

  formulario= this.formBuilder.group({
    id: [null],
    titulo: [null],
    instrucoes: [null],
    feedback_headline: [null],
    feedback_body: [null],
    ativo: [null],
    interno: [null],
    quantas_reservas: [null],
    tipo_espaco_disparo_id: [null],
    template: [null],
    perguntas_attributes: this.initFormArrayName('perguntas_attributes')
  })
  
  aba1 = this.formBuilder.array([      
    this.formulario.controls['titulo'],
    this.formulario.controls['instrucoes'],
    this.formulario.controls['feedback_headline'],
    this.formulario.controls['feedback_body'],
    this.formulario.controls['ativo'],
    this.formulario.controls['interno'],
    this.formulario.controls['quantas_reservas'],
    this.formulario.controls['tipo_espaco_disparo_id'],
    this.formulario.controls['interno'],
    this.formulario.controls['template']
    ])

  aba2 = this.formBuilder.array([
    this.formulario.controls['perguntas_attributes']
  ])
  
  abas = [
    {"icon":"flaticon-add", "formArray": this.aba1, },
    {"icon":"flaticon-network", "formArray": this.aba2, }
  ];

  childInit(){
    this.initItemRows();
    // this.addNewRow();
    consoleLog(this.formulario.controls['perguntas_attributes']);
    consoleLog((<FormArray>this.formulario.get('perguntas_attributes')).controls);
  }

  initItemRows(){
    return this.formBuilder.group({
      id: [null],
      questao: [null],
      resposta_correta: [null],
      opcoes: [null],
      // opcoes_string: [null],
      tipo: [null],
      ordem: [null]
      // tipo: [null],
      // ordem: [null],
      // opcoes: [null],
      // opcoes: this.formBuilder.group({
      //   categoria: [null],
      //   multiplo: this.prepararFormArraySelectMultiplo([Validators.required]),
      //   simples: [null],
      //   data: [null],
      //   hora: ['00:00'],
      //   as: [false],
      //   data_inicio: [null],
      //   data_fim: [null],
      //   numero: [null],
      //   periodo: [null],
      //   email: [null]
      // }),
    })
  }

  abrirModalFilha(itemrow=undefined){
    let ngbModalOptions: NgbModalOptions={
      backdrop: 'static',
      keyboard: false,
      // size: 'sm'
    }
    let modalSimples = this.modalNgb.open(PerguntaFormComponent, ngbModalOptions);
    modalSimples.componentInstance.definirComoModalAdicional(itemrow);
    modalSimples.result.then((form:FormGroup)=>{
      if (itemrow == undefined){
        form.addControl("new_record", this.formBuilder.control(true));
        form.addControl("_destroy", this.formBuilder.control(false));
        (<FormArray>this.formulario.get('perguntas_attributes')).controls.push(form);
        (<FormArray>this.formulario.get('perguntas_attributes')).updateValueAndValidity();
        this.formulario.updateValueAndValidity();
      }
      consoleLog("fechou a parad. olha como tá item row e formulario")
      consoleLog(form);
      consoleLog(itemrow)
      consoleLog(this.formulario);
      // this
      consoleLog("zoou o entidadE?")
      consoleLog(this.entidade);
    })
    // modalSimples.componentInstance.reservaModalService = this;
    // if (itemrow){
    //   modalSimples.componentInstance.formulario = itemrow;
    //   modalSimples.componentInstance.rowId
    // }
    // modalSimples.componentInstance.rowId = this.formulario.get('id').value;
    // modalSimples.componentInstance.formArrayName = 'recursos_reservas_attributes';
  }

  getControls(){
    return (<FormArray>this.formulario.get('perguntas_attributes')).controls;
  }
}