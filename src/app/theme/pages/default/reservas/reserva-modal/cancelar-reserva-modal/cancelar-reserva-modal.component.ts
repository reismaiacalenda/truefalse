import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { TfFormBaseComponent } from '../../../../../_andaime/tf-forms/tf-form-base.component';
// import { FormControl } from '@angular/forms';
import { Helpers } from '../../../../../../helpers';
import { WebService } from '../../../../../../_services/web.service';
import { ModalService } from '../../../modal/modal.service';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';

@Component({
  selector: 'cancelar-reserva-modal',
  templateUrl: 'cancelar-reserva-modal.html'
})
export class CancelarReservaModalComponent extends TfFormBaseComponent implements OnInit { //extends TfFormBaseComponent
  @Input() id: any;
  loading: boolean = false;
  motivo_cancelamento: string;
  modalExterna: NgbActiveModal;


  // constructor(public activeModal: NgbActiveModal,
  //   public webService: WebService,
  //   public modalService: ModalService) { }

  formulario = this.formBuilder.group({
    motivo_cancelamento: [null]
  });

  ngOnInit() {
    Helpers.setLoading(false);
  }

  cancelarReserva(){
    this.loading = true;
    Helpers.setLoading(true);
    var params
    // consoleLog("params")
    // consoleLog(params)
    // consoleLog("motivo_cancelamento")
    // consoleLog(this.formulario.get('motivo_cancelamento').value)
    // if (this.formulario.get('motivo_cancelamento').value != undefined || this.formulario.get('motivo_cancelamento').value != "" || this.formulario.get('motivo_cancelamento').value != null){
    if (this.formulario.get('motivo_cancelamento').value != null){
      // consoleLog("entrou no if null")
      // consoleLog(params)
      params = {motivo_cancelamento: this.formulario.get('motivo_cancelamento').value}
      // consoleLog("params")
      // consoleLog(params)
    } else if (this.formulario.get('motivo_cancelamento').value == null){
      // consoleLog("entrou no else null")
      // consoleLog(params)
      params = {motivo_cancelamento: undefined}
      // consoleLog("params")
      // consoleLog(params)
    }
    this.webService.delete(`reservas`, this.id, params)
      .subscribe(
        (response) => {
          // consoleLog("response")
          // consoleLog(response)
          this.modalService.tratarSucesso(response, this.activeModal);
          if (this.modalExterna){
            this.modalExterna.close(true);
          }
          // this.activeModal.close(true)
          Helpers.setLoading(false);
          this.loading = false;
        },
        (error: any) => {
          Helpers.setLoading(false);
          this.loading = false;
          this.modalService.tratarError(error)
          this.activeModal.close(false);
        }
      )
  }

}
