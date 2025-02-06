// import { Validators, FormGroup } from '@angular/forms';
import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';
import { FormArray, FormControl } from '@angular/forms';
import { ReservaModalService } from '../reserva-modal.service';
// import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
// import { Helpers } from '../../../../../../helpers';
import { consoleLog } from '../../../../../../globals';

@Component({
  selector: 'convidados-form',
  templateUrl: 'convidados-form.component.html'
})
export class ConvidadoFormComponent extends TfFormBaseComponent implements OnInit {

  entidade="espacos_reservas"
  listDadosSelect = {
    'funcionarios': []
  }
  modalAdicional = true;
  reservaModalService:ReservaModalService;

  formulario = this.formBuilder.group({
    id: [null],
    data_inicio: [null],
    data_fim: [null],
    hr_inicio_previsto: [null],
    hr_fim_previsto: [null],
    dia_todo: [false],
    assunto: [null],
    observacao: [null],
    qtd_convidados: [null],
    periodo_indeterminado: [null],
    criador_id_substituto: [null],
    anfitriao_id_substituto: [null],
    convidados: this.initFormArrayName('convidados'),
    espacos_reserva_attributes: this.initFormArrayName('espacos_reserva_attributes'),
    recursos_reservas_attributes: this.initFormArrayName('recursos_reservas_attributes')
  })

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
    
    if ((<FormArray>this.formulario.get('funcionarios_attributes')).length > 0){
      consoleLog("ntrou aqui")
      consoleLog((<FormArray>this.formulario.get('funcionarios_attributes')).length);
      let formArrayClone = Object.assign({}, (<FormArray>this.formulario.get('funcionarios_attributes')));
      consoleLog("lenghg"+formArrayClone.controls.length);
      (<FormArray>this.formulario.get('funcionarios_attributes')).clear();
      formArrayClone.value.forEach(c=>{
        consoleLog("value C:");
        consoleLog(c);
        (<FormArray>this.formulario.get('funcionarios_attributes')).push(
          new FormControl(c)
          );
        })
      consoleLog("length final:" + (<FormArray>this.formulario.get('funcionarios_attributes')).length);
      // this.formulario.updateValueAndValidity();
    }
    // // this.formulario.get('funcionarios_attributes').setValue([{id: 3, new_record:true}]);
  }
  
  onSubmit() {
    // consoleLog(this.formulario);
    this.activeModal.close(this.formulario);
  }

}