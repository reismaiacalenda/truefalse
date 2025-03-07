import { Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';
import { consoleLog } from '../../../../../../globals';

@Component({
  selector: 'parametrizacao-form',
  templateUrl:'parametrizacao-form.component.html'
})

export class ParametrizacaoFormComponent extends TfFormBaseComponent  {

  entidade= "parametrizacoes"
  listSelectPeriodos: any[];

  formulario= this.formBuilder.group({
    id: [null],
    confirmacao_antecipada: [null],
    hr_inicio_janela_confirmacao: [null],
    medida_de_tempo_inicio_janela_confirmacao: [null],
    hr_fim_janela_confirmacao: [null],
    medida_de_tempo_fim_janela_confirmacao: [null],
    varias_mesas_anfitriao_mesmo_horario: [null],
    varias_salas_anfitriao_mesmo_horario: [null],
    varias_vagas_estacionamentos_anfitriao_mesmo_horario: [null],
    varios_lugares_fretados_anfitriao_mesmo_horario: [null]
  })
  
  aba1 = this.formBuilder.array([    
    this.formulario.controls['varias_mesas_anfitriao_mesmo_horario'],
    this.formulario.controls['varias_salas_anfitriao_mesmo_horario'],
    this.formulario.controls['varias_vagas_estacionamentos_anfitriao_mesmo_horario'],
    this.formulario.controls['varios_lugares_fretados_anfitriao_mesmo_horario'],
  ])
  aba2 = this.formBuilder.array([
    this.formulario.controls['confirmacao_antecipada'],
    this.formulario.controls['hr_inicio_janela_confirmacao'],
    this.formulario.controls['medida_de_tempo_inicio_janela_confirmacao'],
    this.formulario.controls['hr_fim_janela_confirmacao'],
    this.formulario.controls['medida_de_tempo_fim_janela_confirmacao'],
  ])

  abas = [
    {"icon":"flaticon-add", "formArray": this.aba1, },
    {"icon":"flaticon-network", "formArray": this.aba2, }
  ];

  listPeriodos() {
    this.webService.get(`parametrizacoes/listar_periodos`)
    .subscribe(dados => {
      consoleLog(dados);
      this.listSelectPeriodos = (<any>dados).listar_periodos
      consoleLog(this.listSelectPeriodos);
    });    
  }

  InicializarParametrizacoes() {
    this.webService.get(`parametrizacoes/edit_sem_param`)
    .subscribe(dados => {
      consoleLog(dados);
      this.formulario.patchValue(<any>dados)
      consoleLog(this.formulario);
    });
  }

  childInit(){
    this.listPeriodos();
    this.InicializarParametrizacoes();
   }


  montarTextSelectPerido(inicio_fim){
    if (inicio_fim == 'inicio'){
      if (this.formulario.value.medida_de_tempo_inicio_janela_confirmacao != undefined){
        return this.listSelectPeriodos[parseInt(this.formulario.value.medida_de_tempo_inicio_janela_confirmacao)-1].text
      }
    }else if (inicio_fim == 'fim'){
      if (this.formulario.value.medida_de_tempo_fim_janela_confirmacao != undefined){
        return this.listSelectPeriodos[parseInt(this.formulario.value.medida_de_tempo_fim_janela_confirmacao)-1].text
      }
    }
  }
}
