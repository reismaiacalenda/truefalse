import { Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../../_andaime/tf-forms/tf-form-base.component';
import { Observable, of } from 'rxjs';
import { FileHolder } from 'angular2-image-upload';
import { ValidateSite } from '../../../../../../../_andaime/tf-validators/site.validators';
import { consoleLog } from '../../../../../../../globals';

@Component({
  selector: 'client-api-form',
  templateUrl: 'client-api-form.component.html'
})
export class ClientApiFormComponent extends TfFormBaseComponent implements OnInit {
  formulario = this.formBuilder.group({
    id: [null],
    // nome: [null, Validators.required],    //tf-text-simples     :string
    nome: [null, Validators.required],    //tf-text-simples     :string
    fornecedor: [0],                      //tf-radio-button     :integer
    retroalimentada: [false],             //tf-check-box        :boolean
    site: [null, ],                         //tf-text-simples     :string
    link_documentacao: [null, ],
    link_portal: [null, ],
    redirect_uri: [null, Validators.required],
    // redirect_uri: [null],
    token_url: [null, Validators.required],
    // token_url: [null],
    scope: this.formBuilder.array([]),
    // scope:[null],
    client_secret: [null, Validators.required],
    // client_secret: [null],
    client_id: [null],
    authorize_url: [null]
  });
  aba1 = this.formBuilder.array([
    this.formulario.get('nome'),
    this.formulario.get('fornecedor'),
    this.formulario.get('retroalimentada')
    // this.formulario.controls['nome'],
    // this.formulario.controls['fornecedor'],
    // this.formulario.controls['retroalimentada']
  ])
  aba2 = this.formBuilder.array([
    this.formulario.get('site'),
    this.formulario.get('link_documentacao'),
    this.formulario.get('link_portal')
    // this.formulario.controls['site'],
    // this.formulario.controls['link_documentacao'],
    // this.formulario.controls['link_portal']
  ])
  aba3 = this.formBuilder.array([
    this.formulario.get('redirect_uri'),
    this.formulario.get('token_url'),
    this.formulario.get('scope'),
    this.formulario.get('client_secret'),
    this.formulario.get('client_id'),
    this.formulario.get('authorize_url') 
    // this.formulario.controls['redirect_uri'],
    // this.formulario.controls['token_url'],
    // this.formulario.controls['scope'],
    // this.formulario.controls['client_secret'],
    // this.formulario.controls['client_id'],
    // this.formulario.controls['authorize_url']
  ])
  abas = [
    {"icon":"flaticon-add", "formArray": this.aba1, },
    {"icon":"flaticon-network", "formArray": this.aba2, },
    {"icon":"flaticon-interface-2", "formArray": this.aba3, }
  ];
  entidade= "client_apis";
  // listDadosSelect = {
	// 	'detalhes': [],
	// 	'nprans': [],
	// 	'mestres': []
  // }

  onUploadFinished(file: FileHolder) {
    consoleLog(file);
  }

  onRemoved(file: FileHolder) {
    consoleLog(file);
  }

  onUploadStateChanged(state: boolean) {
    consoleLog(state);
  }
  }
