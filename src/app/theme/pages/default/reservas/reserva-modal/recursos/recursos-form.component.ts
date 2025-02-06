// import { Validators, FormGroup } from '@angular/forms';
import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';
import { ReservaModalService } from '../reserva-modal.service';
// import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
// import { Helpers } from '../../../../../../helpers';
import { consoleLog } from '../../../../../../globals';

@Component({
  selector: 'recursos-form',
  templateUrl: 'recursos-form.component.html'
})
export class RecursoFormComponent extends TfFormBaseComponent {

  entidade="espacos_reservas"
  listDadosSelect = {
    'recursos': []
  }
  modalAdicional = true;
  reservaModalService:ReservaModalService;
  
  // @ViewChild('selectRecursos', {static: false}) public selectRecursos: ElementRef;

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
  
  initItemRows(){
    return this.formBuilder.group({
      recurso_id: [null],
      quantidade: [null]    
    })
  }

  childInit(){
    // consoleLog("child init")
    // consoleLog(this.formulario.value);
    // consoleLog(this.formulario.get('recursos_reservados_attributes').value);
  }

  onSubmit() {
    this.activeModal.close(true);
    // this.activeModal.close(this.formulario.get('recursos_reservados_attributes'));
    // this.reservaModalService.modalRecursos.close(true);
  }

}