import { Helpers } from '../../../../../../../helpers';
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../../_andaime/tf-forms/tf-form-base.component';
import { FileHolder } from 'angular2-image-upload';
import { consoleLog } from '../../../../../../../globals';

@Component({
  selector: 'portas-form',
  templateUrl: 'portas-form.component.html'
})

export class PortasFormComponent extends TfFormBaseComponent implements OnInit {

  @Output() refreshPortas = new EventEmitter();
  @Input() p: any;
  corpo: any;
  // listSelectEspacos: any[];
  // @ViewChild('selectEspacos', {static: false}) public selectEspacos: ElementRef;


  formulario = this.formBuilder.group({
    id: [null],
    chave_vinculo_licenca: [null],
    espaco_id: [null],
    layout_id: [null]
  });

  aba1 = this.formBuilder.array([
  ])
  aba2 = this.formBuilder.array([
    this.formulario.get('espaco_id')
  ])
  aba3 = this.formBuilder.array([
    this.formulario.get('layout_id')
  ])

  abas = [
    {"icon":"flaticon-add", "formArray": this.aba1, },
    {"icon":"la la-chain", "formArray": this.aba2, },
    {"icon":"la la-picture-o", "formArray": this.aba3, }
  ];

  entidade= "displays";
  listDadosSelect = {
    'layouts': [],
    'espacos': [],
  }

  chamarEspacoFormComponent(){}

  chamarLayoutPortaFormComponent(){}

  onUploadFinished(file: FileHolder) {
    consoleLog(file);
  }

  onRemoved(file: FileHolder) {
    consoleLog(file);
  }

  onUploadStateChanged(state: boolean) {
    consoleLog(state);
  }

  editForm(){
    Helpers.setLoading(true);
    consoleLog("Entrou no editForm!")
    consoleLog(this.rowId)
    this.webService.get(`displays/${this.rowId}/editar_vinculo_porta`)
      .subscribe(
        response =>{
          Helpers.setLoading(false);
          this.webService.get(`espacos/list_vinculo_display`)
          .subscribe(dados =>{
          });
          this.formulario.patchValue(response)       
         },
        (error) => {
          Helpers.setLoading(false);
          this.modalService.tratarError(error);
        }
      )
  }

  onSubmit() {
    Helpers.setLoading(true);
    consoleLog("Entrou no Salvar!")
    consoleLog(this.rowId)
    var body = {
      "chave_vinculo_licenca": this.formulario.get('chave_vinculo_licenca').value,
      "espaco_id": this.formulario.get('espaco_id').value,
      "layout_id": this.formulario.get('layout_id').value
    }
    consoleLog("Body:")
    consoleLog(body)
    this.corpo = this.formulario.value;
    this.formulario.updateValueAndValidity();
    this.webService.post(`displays/vincular_porta`, body)
      .subscribe(
        response =>{
          Helpers.setLoading(false);
          consoleLog("Entrou no response do onSubmit!")
          consoleLog(response)
          this.activeModal.close(true);
          this.modalService.tratarMensagem(response.body.message, null)
          this.refreshPortas.emit('');
          consoleLog("Passou no emit!");
        },
        (error) => {
          Helpers.setLoading(false);
          this.modalService.tratarError(error);
        }
      )
  }

  childInit(){
    if (this.rowId){
      consoleLog("Entrou no childInit!")
      this.formulario.get('chave_vinculo_licenca').disable();
    }
  }

}