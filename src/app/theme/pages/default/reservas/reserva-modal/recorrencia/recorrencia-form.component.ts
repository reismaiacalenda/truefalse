// import { Validators, FormGroup } from '@angular/forms';
import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';
import { FormArray, FormControl } from '@angular/forms';
import { ReservaModalService } from '../reserva-modal.service';
// import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
// import { Helpers } from '../../../../../../helpers';
import { consoleLog } from '../../../../../../globals';
import moment from 'moment';

@Component({
  selector: 'recorrencia-form',
  templateUrl: 'recorrencia-form.component.html'
})
export class RecorrenciaFormComponent extends TfFormBaseComponent implements OnInit {
  
  // entidade="espacos_reservas"
  formRecorrenciaLimpo;
  listDadosSelect = {
    // 'funcionarios': []
  }
  modalAdicional = true;
  reservaModalService:ReservaModalService;
  dias_da_semana = [
    {dia: 'Dom', valor: 0, tooltip: 'Domingo'},
    {dia: 'Seg', valor: 1, tooltip: 'Segunda-feira'},
    {dia: 'Ter', valor: 2, tooltip: 'Terça-feira'},
    {dia: 'Qua', valor: 3, tooltip: 'Quarta-feira'},
    {dia: 'Qui', valor: 4, tooltip: 'Quinta-feira'},
    {dia: 'Sex', valor: 5, tooltip: 'Sexta-feira'},
    {dia: 'Sáb', valor: 6, tooltip: 'Sábado'}
  ]

  recorrenciaMes = [
    {"label":"0 - Dia", "value":1}
  ]

  radioButtonEm = [
    {"label":"Em", "value":1}
  ]

  radioButtonApos = [
    {"label":"Após", "value":1}
  ]

  formulario = this.formBuilder.group({
  })

  

  // formulario = this.formBuilder.group({
  //   id: [null],
  //   data_inicio: [null],
  //   data_fim: [null],
  //   hr_inicio_previsto: [null],
  //   hr_fim_previsto: [null],
  //   dia_todo: [false],
  //   assunto: [null],
  //   observacao: [null],
  //   qtd_convidados: [null],
  //   periodo_indeterminado: [null],
  //   criador_id_substituto: [null],
  //   anfitriao_id_substituto: [null],
  //   convidados: this.initFormArrayName('convidados'),
  //   espacos_reserva_attributes: this.initFormArrayName('espacos_reserva_attributes'),
  //   recursos_reservas_attributes: this.initFormArrayName('recursos_reservas_attributes')
  // })

  // formulario = this.formBuilder.group({
  //   id: [null],
  //   espaco_id: [null],
  //   assunto: [null],
  //   data: [null], // this.data
  //   hr_inicio_previsto: [null], // [this.dateTime],
  //   hr_fim_previsto: [null],
  //   criador_id: [this.workspaceService.currentUser.id],
  //   anfitriao_id: [null],
  //   funcionarios_attributes: this.prepararFormArraySelectMultiploSemRequired(), //this.initFormArrayName('funcionarios_attributes'), // Inserido após bugs Sprint_2.23
  //   recursos_reservados_attributes: this.initFormArrayName('recursos_reservados_attributes'),
  //   quantidade_participantes: [null],
  //   observacao: [null],
  //   amenities: [null],
  //   // origem: [null],
  //   // recorrencia: this.formBuilder.array([]),
  //   // funcionarios_reservas_attributes: this.initFormArrayName('funcionarios_reservas_attributes'),
  // })
   
  // formulario = this.formBuilder.group({
  //   id: [null],
  //   espaco_id: [null],
  //   assunto: [null],
  //   qtd_convidados: [null], // espacos_reservas
  //   convidados_attributes: this.initFormArrayName('convidados_attributes'), // espacos_reservas
  //   recursos_reservados_attributes: this.initFormArrayName('recursos_reservados_attributes'),
  //   reserva_attributes: this.formBuilder.group({
  //     hr_inicio_previsto: [null],
	//     hr_fim_previsto: [null],
	//     data_inicio: [null],
	//     data_fim: [null],
	//     criador_id: [this.workspaceService.currentUser.id],
	//     anfitriao_id: [null],
	//     dia_todo: [null],
	//     observacao: [null],
	//     campos_customizados: this.initFormArrayName('campos_customizados')
  //   })
  // })
  
  childInit(){
    consoleLog("child init")
    consoleLog(this.formulario.value);
    this.formRecorrenciaLimpo = {
      "repeticao": null,
      "quando": null,
      "intervalo": 2,
      "dias": [],
      "termina_em": false,
      "termina_apos": false,
      "data_fim": null,
      "ocorrencia": null
    }
    if(this.formulario.get('recorrencia').get('intervalo').value === null) {
      this.formulario.get('recorrencia').get('intervalo').setValue(2)
    }
  }

  
  diaSelecionado(value){
    if (this.formulario.get('recorrencia').get('dias').value != undefined && 
    this.formulario.get('recorrencia').get('dias').value.includes(value)){
      return true;
    }
    return false;
  }

  adicionarRemoverDia(value){
    var arrayDias = this.formulario.get('recorrencia').get('dias').value;
    if (this.diaSelecionado(value)){
      var index = arrayDias.indexOf(value, 0);
      if (index > -1) {
        if(arrayDias.length > 1){
          arrayDias.splice(index, 1);
          this.formulario.get('recorrencia').get('dias').setValue(arrayDias);
        }
      }
    }else{
      arrayDias.push(value)
      arrayDias.sort();
      this.formulario.get('recorrencia').get('dias').setValue(arrayDias);
    }
  }

  onSubmit() {
    // consoleLog(this.formulario);
    this.activeModal.close(this.formulario);
  }

  limpar(){
    if(this.formulario.get('recorrencia').get('repeticao').value === 1) {
      this.formulario.get('recorrencia').patchValue(this.formRecorrenciaLimpo);
    } else {
      this.activeModal.close();
    }
  }

  controlarCheck(campo, event){
    if (campo == "em"){
      this.formulario.get('recorrencia').get('termina_apos').setValue(!event.target.value)
    }else{
      this.formulario.get('recorrencia').get('termina_em').setValue(!event.target.value)
    }
  }

  recorrenciaSelecao(){ 
    this.formulario.get('recorrencia').get('quando').setValue(1)
    //this.recorrenciaMes = [{this.formulario.get('data_inicio').value}]
    this.recorrenciaMes = [{"label":`Mensal no Dia: ${this.formulario.get('data_inicio').value.slice(0, 2)}`, "value":1}]
  }

  pegarDia() {
    let st = this.formulario.get('data_inicio').value
    let pattern = /(\d{2})\-(\d{2})\-(\d{4})/;
    let dt =  new Date(st.replace(pattern,'$3-$2-$1'));
    if(!this.diaSelecionado(dt.getDay()+1)){
      this.adicionarRemoverDia(dt.getDay()+1);
    }
  }

  marcarAutomaticamente() {
    this.recorrenciaSelecao()
    if((this.formulario.get('recorrencia').get('termina_em').value == false || this.formulario.get('recorrencia').get('termina_em').value == 0)
      && (this.formulario.get('recorrencia').get('termina_apos').value == false || this.formulario.get('recorrencia').get('termina_apos').value == 0)){
        this.formulario.get('recorrencia').get('termina_em').setValue(1)
    }
    if(this.formulario.get('recorrencia').get('data_fim').value == null || this.formulario.get('recorrencia').get('data_fim').value == '') {
      let st = this.formulario.get('data_inicio').value
      let pattern = /(\d{2})\-(\d{2})\-(\d{4})/;
      let dt =  new Date(st.replace(pattern,'$3-$2-$1'));
      let month = moment(dt).add(1, 'M').add(1, 'd');
      var res = moment(month).format('DD/MM/YYYY');
      this.formulario.get('recorrencia').get('data_fim').setValue(res)
    }
  }
}