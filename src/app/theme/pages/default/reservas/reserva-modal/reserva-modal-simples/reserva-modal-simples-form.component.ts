import { Validators, FormGroup } from '@angular/forms';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';
import { NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Helpers } from '../../../../../../helpers';
import { ReservaModalAvancadaFormComponent } from '../reserva-modal-avançada/reserva-modal-avancada-form.component';
import { ReservaModalService } from '../reserva-modal.service';
import { consoleLog } from '../../../../../../globals';

@Component({
  selector: 'reserva-modal-simples-form',
  templateUrl: 'reserva-modal-simples-form.component.html'
})
export class ReservaModalSimplesFormComponent extends TfFormBaseComponent {
  
  entidade="reservas";
  reservaModalService:ReservaModalService;
    
  formulario = this.formBuilder.group({
  })

  childInit(){
    this.inscricaoAlterarCampos();
    // consoleLog(this.formulario.get('titulo_reserva').value);
  }

  //Observable para acompanhar se o campo data tá de fato sendo alterado pelo usuário ou só atualizando via patchValue
  inscricaoAlterarCampos(){
    consoleLog("Alterou data início!");
    this.subscriptions.add(
      this.formulario.controls['data_inicio'].valueChanges.subscribe(
        response=>{
          if (this.formulario.get('id').value == undefined){
            if (this.formulario.value['data_inicio'] != response && this.reservaModalService.flagNewSendoSetada == false){
              this.reservaModalService.chamarNew(null);
            }
          }
      })
    )
  }

  maisOpcoes(){
    Helpers.setLoading(true);
    this.activeModal.close("reservaAvancada");
  }

}