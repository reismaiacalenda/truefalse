import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';
import { Helpers } from '../../../../../../helpers';
import { consoleLog, globals } from '../../../../../../globals';
import { FormService } from '../../../../../../_services/form.service';

@Component({
  selector: 'adicionar-calendario-mesa',
  templateUrl: './adicionar-calendario-mesa.component.html',
  styles: []
})
export class AdicionarCalendarioMesaComponent extends TfFormBaseComponent  {
  entidade = "funcionario"
  listMesas: any[];
  
  formulario = this.formBuilder.group({
    id: this.workspaceService.currentUser.id,
    agendas_attributes: this.prepararFormArraySelectMultiploSemRequired()//this.prepararFormArraySelectMultiplo([Validators.required])
  })

  childInit(){
    this.rowId = this.workspaceService.currentUser.id;
    this.preencherListMesa();
  }

  preencherListMesa(){
    this.webService.get(`espacos/list_andaime`, {tipo_espaco: 'mesa'})
    .subscribe(dados => {
      consoleLog(dados)
      this.listMesas = (<any>dados).espacos
      consoleLog("listSelectEspacos")
      consoleLog(this.listMesas)
    });
  }

  editForm() {
    let params = {
      agrupamento: "mesa"
    }
    this.webService.get(`funcionarios/${this.workspaceService.currentUser.id}/edit_agenda`, params)
    .subscribe(
      (response) => {
        FormService.patchValueWithFormArray(this.formulario, response);
        Helpers.setLoading(false);
        if (globals.debug){
          this.modalService.debugService("Form", "Edit", response);
        }
      },
      (error: any) => {
        this.modalService.tratarError(error);
        Helpers.setLoading(false);
      }
    );

  }
  
  onSubmit(){
    var body = {
      agrupamento: 'mesa',
      agendas_attributes: this.formulario.get('agendas_attributes').value
    }
    this.webService.put(`funcionarios/${this.workspaceService.currentUser.id}/update_agenda`, body)
    .subscribe(
      response =>{
        this.modalService.tratarSucesso(response, this.activeModal)
        consoleLog(response)
        Helpers.setLoading(false);
      },
      (error) => {
        Helpers.setLoading(false);
        this.modalService.tratarError(error);
      }
    )
    consoleLog(this.formulario)
  }

}