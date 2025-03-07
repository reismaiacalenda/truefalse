import { Validators, FormGroup, FormArray } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../../_andaime/tf-forms/tf-form-base.component';
import { consoleLog } from '../../../../../../../globals';
import { Helpers } from '../../../../../../../helpers';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AmenitiesInstalledFormComponent } from '../../amenities-installed/amenities-installed-form/amenities-installed-form.component';

@Component({
  selector: 'espaco-form',
  templateUrl:'espaco-form.component.html'
})
export class EspacoFormComponent extends TfFormBaseComponent  {
  entidade= "espacos"
  listDadosSelect = {
    'tipo_espacos': [],
    'localizacoes': [],
    'calendarios': []
  }

  listSelectEspacosNaoFilhos: any[];

  formulario= this.formBuilder.group({
    id: [null],
    nome: [null, Validators.required],
    tipo_espaco_id: [null, Validators.required],
    localizacao_id: [null],//, Validators.required
    calendario_id: [null],
    unidade_id: [this.currentUser.unidade_selecionada.id],
    espaco_conjugado: [null],
    bloqueado: [null],
    conjugado_pai_id: [null],
    capacidade_pessoas: [0],
    amenities_attributes: this.initFormArrayName('amenities_attributes')

  })
  
  aba1 = this.formBuilder.array([        
    this.formulario.get('nome'),
    this.formulario.get('tipo_espaco_id'),
    this.formulario.get('capacidade_pessoas'),
    this.formulario.get('bloqueado')
  ])

  aba2 = this.formBuilder.array([    
    this.formulario.get('localizacao_id'),
    this.formulario.get('espaco_conjugado'),
    this.formulario.get('conjugado_pai_id')
  ])
  
  aba3 = this.formBuilder.array([      
    this.formulario.controls['amenities_attributes']
  ])

  aba4 = this.formBuilder.array([      
    this.formulario.get('calendario_id')
  ])
  
  abas = [
    {"icon":"flaticon-add", "formArray": this.aba1, },
    {"icon":"flaticon-map-location", "formArray": this.aba2, },
    {"icon":"flaticon-open-box", "formArray": this.aba3, },
    {"icon":"flaticon-calendar", "formArray": this.aba4, }
  ];

  initItemRows(){
    return this.formBuilder.group({
      recurso_id: [null],
      quantidade: [null]    
    })
  }

  childInit(){
    // consoleLog(this.formArray.controls);
    consoleLog(this.formulario);
    this.montarListEspacosNaoFilhos()
    this.initItemRows();
  }
  

  montarListEspacosNaoFilhos(){
    Helpers.setLoading(true);
    consoleLog("Entrou no editForm!")
    consoleLog(this.rowId)
    this.webService.get(`espacos/list_nao_filhos`)
      .subscribe(
        dados =>{
          Helpers.setLoading(false);
          this.listSelectEspacosNaoFilhos = dados.espacos;
         },
        (error) => {
          Helpers.setLoading(false);
          this.modalService.tratarError(error);
        }
      )
  }
  abrirModalFilha(itemrow=undefined){
    let ngbModalOptions: NgbModalOptions={
      backdrop: 'static',
      keyboard: false,
      // size: 'sm'
    }
    let modalSimples = this.modalNgb.open(AmenitiesInstalledFormComponent, ngbModalOptions);
    modalSimples.componentInstance.definirComoModalAdicional(itemrow);
    modalSimples.result.then((form:FormGroup)=>{
      if (itemrow == undefined){
        form.addControl("new_record", this.formBuilder.control(true));
        form.addControl("_destroy", this.formBuilder.control(false));
        (<FormArray>this.formulario.get('amenities_attributes')).controls.push(form);
        (<FormArray>this.formulario.get('amenities_attributes')).updateValueAndValidity();
        this.formulario.updateValueAndValidity();
      }
      console.log("fechou a parad. olha como tá item row e formulario")
      console.log(form);
      console.log(itemrow)
      console.log(this.formulario);
      // this
      console.log("zoou o entidadE?")
      console.log(this.entidade);
    })
    // modalSimples.componentInstance.reservaModalService = this;
    // if (itemrow){
    //   modalSimples.componentInstance.formulario = itemrow;
    //   modalSimples.componentInstance.rowId
    // }
    // modalSimples.componentInstance.rowId = this.formulario.get('id').value;
    // modalSimples.componentInstance.formArrayName = 'recursos_reservas_attributes';
  }

  getControls(){
    return (<FormArray>this.formulario.get('amenities_attributes')).controls;
  }
}