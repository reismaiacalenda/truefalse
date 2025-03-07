import { Helpers } from '../../../../../../../helpers';
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../../_andaime/tf-forms/tf-form-base.component';
import { FileHolder } from 'angular2-image-upload';
// import { LayoutPortaFormComponent } from '../../../cadastro/layout/layout-porta/layout-porta-form/layout-porta-form.component';
import { consoleLog } from '../../../../../../../globals';

@Component({
  selector: 'pessoa-form-pessoas',
  templateUrl: 'pessoa-form-pessoas.component.html'
})

export class PessoaFormPessoasComponent extends TfFormBaseComponent implements OnInit {

  // @Output() refreshPessoa = new EventEmitter();
  // @Input() p: any;
  // corpo: any;
  // listSelectEspacos: any[];
  @ViewChild('selectPessoas', {static: false}) public selectPessoas: ElementRef;

  // entidade= "pessoas"
  // listDadosSelect = {
  //   'pessoas': []
  // }
  
  listPessoasInstalados() {
    this.webService.get(`pessoas/list_instalados`)
    .subscribe(dados => {
      consoleLog(dados)
      this.listSelectPessoas = (<any>dados).servico
      consoleLog("listSelectPessoas no listPessoasInstalados")
      consoleLog(this.listSelectPessoas)
    });    
  }
  
  listSelectPessoas: any[];

  formulario= this.formBuilder.group({
    pessoas_attributes: this.initFormArrayName('pessoas_attributes'),
  })

  aplicarFiltroPessoa(){
    this.activeModal.close(this.formulario);
  }
    
    // aba1 = this.formBuilder.array([        
    //   this.formulario.get('nome'),
    //   this.formulario.get('tipo_espaco_id'),
    //   this.formulario.get('licenciada')
    // ])
  
    // aba2 = this.formBuilder.array([    
    //   this.formulario.get('localizacao_id')
    // ])
    
    // aba3 = this.formBuilder.array([      
    //   this.formulario.get('calendario_id')
    // ])
  
    // aba4 = this.formBuilder.array([
    //   this.formulario.get('pessoas_attributes')
    // ])
    
    // abas = [
    //   {"icon":"flaticon-add", "formArray": this.aba1, },
    //   {"icon":"flaticon-map-location", "formArray": this.aba2, },
    //   {"icon":"flaticon-calendar", "formArray": this.aba3, },
    //   {"icon":"flaticon-open-box", "formArray": this.aba4, }
    // ];
  
    initItemRows(){
      return this.formBuilder.group({
        pessoa_id: [null],
        quantidade: [null]    
      })
    }
  
    childInit(){
      consoleLog("child init")
      // consoleLog(this.formArray.controls);
      // consoleLog(this.formulario);
      this.listPessoasInstalados();
    }
  
  }
