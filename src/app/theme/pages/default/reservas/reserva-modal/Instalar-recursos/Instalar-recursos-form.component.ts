// import { Validators, FormGroup } from '@angular/forms';
import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';
import { ReservaModalService } from '../reserva-modal.service';
// import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
// import { Helpers } from '../../../../../../helpers';
import { consoleLog } from '../../../../../../globals';
import { Subject } from 'rxjs';

@Component({
  selector: 'Instalar-recursos-form',
  templateUrl: 'Instalar-recursos-form.component.html'
})
export class InstalarRecursoFormComponent extends TfFormBaseComponent {

  entidade="reservas"
  listDadosSelect = {
    'espacos': [],
    'recursos': []
  }

  reservaModalService:ReservaModalService;
  inputsDeCalculo : Subject<string> = new Subject();
  campoAlterado = "";
  vinculos_removidos:string;
  vinculos_removidos_array = [];
  
  formulario = this.formBuilder.group({
  }) 
  
  initItemRows(){
    return this.formBuilder.group({
      recurso_id: [null],
      quantidade: [null]    
    })
  }

  childInit(){
    this.inscricaoAlterarCampos();
  }

  inscricaoAlterarCampos(){
    this.subscriptions.add(
      this.inputsDeCalculo.debounceTime(600).distinctUntilChanged().subscribe(response=>{
      // consoleLog("deobounce");
      // consoleLog(response);
        var body = {
          espaco_id: this.formulario.get('espaco_id').value,      
          // pessoa_id: this.formulario.get('pessoa_id').value,      
          // recurso_id: this.formulario.get('recurso_id').value,      
          data: this.formulario.get('data_inicio').value,
          hr_inicio_previsto: this.formulario.get('hr_inicio_previsto').value,
          hr_fim_previsto: this.formulario.get('hr_fim_previsto').value,
          data_fim: this.formulario.get('data_fim').value,
          rr_attributes: JSON.stringify(this.formulario.get('recursos_reservas_attributes').value),
          recorrencia: this.formulario.get('recorrencia').value,
          desconto: this.formulario.get('desconto').value,
          tela: this.reservaModalService.tela,
          dia_todo: this.formulario.get('dia_todo').value,
          campo_alterado: this.campoAlterado,
          vinculos_removidos: this.vinculos_removidos,
          recalculando: true
        }
        this.reservaModalService.chamarNew(body);
      })
    )

    this.subscriptions.add(
      this.formulario.controls['data_inicio'].valueChanges.subscribe(
        response=>{
          // if (this.formulario.get('id').value == undefined){
            if (this.formulario.value['data_inicio'] != response && this.reservaModalService.flagNewSendoSetada == false){
              this.campoAlterado = 'data_inicio'
              this.inputsDeCalculo.next(response);
            }
          // }
      })
    )

    this.subscriptions.add(
      this.formulario.controls['espaco_id'].valueChanges.subscribe(
        response=>{
          // if (this.formulario.get('id').value == undefined){
            if (this.formulario.value['espaco_id'] != response && this.reservaModalService.flagNewSendoSetada == false){
              this.campoAlterado = 'espaco_id'
              this.inputsDeCalculo.next(response);
            }
          // }
      })
    )
  }

  removeItem(){
    this.reservaModalService.tratarCancelamentoReserva(this.rowId, this.activeModal);
  }

}