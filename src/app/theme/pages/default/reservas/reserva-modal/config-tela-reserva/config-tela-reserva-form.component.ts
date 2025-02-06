import { Validators, FormGroup, FormArray } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Helpers } from '../../../../../../helpers';
import { consoleLog } from '../../../../../../globals';

@Component({
  selector: 'config-tela-reserva-form',
  templateUrl: 'config-tela-reserva-form.component.html'
})
export class ConfigTelaReservaFormComponent extends TfFormBaseComponent {
  entidade="espacos_reservas"  
  listDadosSelect = {
  }

  titulo;
  localizacao;
  formularioReserva: any;
  atual_reserva_id;

  formulario = this.formBuilder.group({
    id: [null],
    grade: true,
    assunto: true,
    finalidade: true,
    observacao: true,
    add_recursos: false,
    add_convidados: true,
    campos_customizados: this.initFormArrayName('campos_customizados'),
  })

  aba1 = this.formBuilder.array([
    this.formulario.get('grade'),
    this.formulario.get('assunto'),
    this.formulario.get['finalidade'],
    this.formulario.get['observacao'],
    this.formulario.get['add_recursos'],
    this.formulario.get['add_convidados']
  ])

  aba2 = this.formBuilder.array([
    this.formulario.get('campos_customizados')
  ])
  
  abas = [
    {"icon":"flaticon-list-3", "formArray": this.aba1, },
    {"icon":"flaticon-add", "formArray": this.aba2, }
   ];

  chamarNew(){
    Helpers.setLoading(true);
    var body = {
      espaco_id: this.formulario.get('espaco_id').value,      
      data: this.formulario.get('data').value
    }
    this.webService.get(`reservas/new`, body)
      .subscribe(
        dados => {
          this.formularioReserva = dados
          consoleLog("dados");
          consoleLog(dados);
          let ngbModalOptions: NgbModalOptions={
            backdrop: 'static',
            keyboard: false,
            size: 'lg'
          }
          Helpers.setLoading(false)
         },
         (error: any) => {
           this.modalService.tratarError(error)
           Helpers.setLoading(false);
         }
       )
  }

  adicionarRecursos(){
  //   Helpers.setLoading(true);
  //   consoleLog("Entrou no adicionarRecursos()");
  //         let ngbModalOptions: NgbModalOptions={
  //           backdrop: 'static',
  //           keyboard: false,
  //         }
  }

  adicionarConvidados(){
  }

  // descobrirCampo(itemrow:FormGroup){
  //   return this.formulario[itemrow.get('id').value].atributos[itemrow.get('atributo').value].operadores[itemrow.get('operador').value].condicional.categoria;
  // }
}