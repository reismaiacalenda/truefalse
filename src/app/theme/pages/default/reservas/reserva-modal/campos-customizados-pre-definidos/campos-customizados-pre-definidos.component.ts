import { Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';
import { consoleLog } from '../../../../../../globals';
import { Helpers } from '../../../../../../helpers';

@Component({
  selector: 'campos-customizados-pre-definidos',
  templateUrl:'campos-customizados-pre-definidos.component.html'
})
export class CamposCustomizadosPreDefinidosComponent extends TfFormBaseComponent  {

  entidade= "telas_reservas"

  formulario= this.formBuilder.group({
     id: [null],
     anfitriao: false,
     convidados: true,
     dia_todo: true,
     assunto: true,
     observacao: false
    })
    
    childInit(){
      Helpers.setLoading(true);
      this.webService.get(`telas_reservas/edit_sem_param/`, {})
        .subscribe(
          response =>{
            this.formulario.patchValue(response);
            consoleLog(response)
            Helpers.setLoading(false);
          },
          (error) => {
            Helpers.setLoading(false);
            this.modalService.tratarError(error);
          }
        )
    }

}