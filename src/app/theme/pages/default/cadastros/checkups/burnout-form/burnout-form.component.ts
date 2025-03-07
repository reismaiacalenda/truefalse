import { Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';
import { consoleLog } from '../../../../../../globals';
import { Helpers } from '../../../../../../helpers';

@Component({
  selector: 'burnout-form',
  templateUrl:'burnout-form.component.html'
})
export class BurnoutFormComponent extends TfFormBaseComponent  {
  entidade = "respostas"
  listDadosSelect = {
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
    conjugado_pai_id: [null],
    aaa: ["", Validators.required],
    aab: ["", Validators.required],
    aac: ["", Validators.required],
    aad: ["", Validators.required],
    aae: ["", Validators.required],
    aaf: ["", Validators.required],
  })

  aba1 = this.formBuilder.array([        
  ])

  aba2 = this.formBuilder.array([    
    this.formulario.get('aaa'),
  ])
  
  aba3 = this.formBuilder.array([      
    this.formulario.get('aac')
  ])

  aba4 = this.formBuilder.array([      
    this.formulario.get('aad')
  ])

  aba5 = this.formBuilder.array([      
    this.formulario.get('aae')
  ])

  aba6 = this.formBuilder.array([      
    this.formulario.get('aaf')
  ])

  aba7 = this.formBuilder.array([      
    this.formulario.get('aaf')
  ])

  aba8 = this.formBuilder.array([      
    this.formulario.get('aaf')
  ])

  aba9 = this.formBuilder.array([      
    this.formulario.get('aaf')
  ])

  aba10 = this.formBuilder.array([      
    this.formulario.get('aaf')
  ])


  
  abas = [
    {"icon":"", "formArray": this.aba1, },
    {"icon":"", "formArray": this.aba2, },
    {"icon":"", "formArray": this.aba3, },
    {"icon":"", "formArray": this.aba4, },
    {"icon":"", "formArray": this.aba5, },
    {"icon":"", "formArray": this.aba6, },
    {"icon":"", "formArray": this.aba7, },
    {"icon":"", "formArray": this.aba8, },
    {"icon":"", "formArray": this.aba9, },
    {"icon":"", "formArray": this.aba10, },
  ];

  initItemRows(){
    return this.formBuilder.group({
      recurso_id: [null],
      quantidade: [null]    
    })
  }

  childInit(){
  }

}