import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';
import { Helpers } from '../../../../../../helpers';
import { consoleLog, globals } from '../../../../../../globals';
import { FormService } from '../../../../../../_services/form.service';

@Component({
  selector: 'adicionar-calendario-pessoa',
  templateUrl: './adicionar-calendario-pessoa.component.html',
  styles: []
})
export class AdicionarCalendarioPessoaComponent extends TfFormBaseComponent  {
  entidade= "funcionario"
  listDadosSelect = {
    'funcionarios': []
  }
  
  
  formulario = this.formBuilder.group({
    id: this.workspaceService.currentUser.id,
    agendas_attributes: this.prepararFormArraySelectMultiploSemRequired()//this.prepararFormArraySelectMultiplo([Validators.required])
  })


  childInit(){
    //TODO  'salas': [], custom de salas/mesas
    // Helpers.setLoading(false);
    this.rowId = this.workspaceService.currentUser.id;
  }


  editForm() {
    // ou entao 4 endpoints ou só parametriza
    let params = {
      agrupamento: "pessoa"
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

    // {
    //   id: 
    //   agendable_id:
    //   agendable_type:
    //   agrupamento:
    //   _newrecord:
    //   _destroy:
    // }
  }
  
  onSubmit(){
    var body = {
      agrupamento: 'pessoa',
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