import { Component } from '@angular/core';
import { ClientApiFormComponent } from '../client-api-form/client-api-form.component';
import { TfDatatableBase } from '../../../../../../../_andaime/tf-datatable/tf-datatable-base';
import { Helpers } from '../../../../../../../helpers';

@Component({
  selector: 'client-api-data-table',
  templateUrl: './client-api-data-table.component.html'
})
export class ClientApiDataTableComponent extends TfDatatableBase {
  ovo = Object.keys;
  entidade = "client_apis";
  contentFormModal = ClientApiFormComponent;

  verificarValidade(id){
    Helpers.setLoading(true);
    this.webService.get(`client_apis/${id}/expirado`)
      .subscribe(
        response =>{
          this.modalService.tratarMensagem("Verificar validade",response.message)
          Helpers.setLoading(false);
        },
        (error) => {
          Helpers.setLoading(false);
          this.modalService.tratarError(error);
        }
      )
  }
  
  refreshToken(id){
    Helpers.setLoading(true);
    this.webService.put(`client_apis/${id}/renovar`, {})
    .subscribe(
      response =>{
        this.modalService.tratarMensagem("Refresh token",response.body.message)
        Helpers.setLoading(false);
      },
      (error) =>{
        Helpers.setLoading(false);
        this.modalService.tratarError(error);
      }
    )
  }

}