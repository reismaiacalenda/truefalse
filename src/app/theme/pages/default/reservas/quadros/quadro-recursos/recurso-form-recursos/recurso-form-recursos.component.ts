import { Helpers } from '../../../../../../../helpers';
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../../_andaime/tf-forms/tf-form-base.component';
import { FileHolder } from 'angular2-image-upload';
// import { LayoutPortaFormComponent } from '../../../cadastro/layout/layout-porta/layout-porta-form/layout-porta-form.component';
import { consoleLog } from '../../../../../../../globals';

@Component({
  selector: 'recurso-form-recursos',
  templateUrl: 'recurso-form-recursos.component.html'
})

export class RecursoFormRecursosComponent extends TfFormBaseComponent implements OnInit {

  // @Output() refreshRecurso = new EventEmitter();
  // @Input() p: any;
  // corpo: any;
  // listSelectEspacos: any[];
  @ViewChild('selectRecursos', {static: false}) public selectRecursos: ElementRef;

  // entidade= "recursos"
  // listDadosSelect = {
  //   'recursos': []
  // }
  
  listRecursosInstalados() {
    this.webService.get(`recursos/list_instalados`)
    .subscribe(dados => {
      consoleLog(dados)
      this.listSelectRecursos = (<any>dados).servico
      consoleLog("listSelectRecursos no listRecursosInstalados")
      consoleLog(this.listSelectRecursos)
    });    
  }
  
  listSelectRecursos: any[];

  formulario= this.formBuilder.group({
    recursos_attributes: this.initFormArrayName('recursos_attributes'),
  })

  aplicarFiltroRecurso(){
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
    //   this.formulario.get('recursos_attributes')
    // ])
    
    // abas = [
    //   {"icon":"flaticon-add", "formArray": this.aba1, },
    //   {"icon":"flaticon-map-location", "formArray": this.aba2, },
    //   {"icon":"flaticon-calendar", "formArray": this.aba3, },
    //   {"icon":"flaticon-open-box", "formArray": this.aba4, }
    // ];
  
    initItemRows(){
      return this.formBuilder.group({
        recurso_id: [null],
        quantidade: [null]    
      })
    }
  
    childInit(){
      consoleLog("child init")
      // consoleLog(this.formArray.controls);
      // consoleLog(this.formulario);
      this.listRecursosInstalados();
    }
  
  }
