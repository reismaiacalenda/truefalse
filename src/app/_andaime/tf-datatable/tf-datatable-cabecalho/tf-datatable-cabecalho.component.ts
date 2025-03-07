import { Component, Input, OnInit, ElementRef, Output, AfterViewInit, ɵConsole } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Helpers } from '../../../../app/helpers';
import { printable } from '../../../globals';
import { ScriptLoaderService } from '.././../../_services/script-loader.service';

@Component({
  selector: 'tf-datatable-cabecalho',
  templateUrl: './tf-datatable-cabecalho.component.html',
  standalone: false
})

export class TfDatatableCabecalhoComponent implements OnInit {
  @Input()  habilitarForm: boolean = true;
  @Input()  habilitarButton: boolean = true;
  @Input()  labelFormButton: string;
  @Input()  labelButtonAdicional: string;
  @Input()  habilitarButtonAdicional: boolean = false;
  @Input()  habilitarConfiguracao: boolean = false;
  @Input()  habilitarconvidarPessoas: boolean = false;
  @Input()  enableFilter: boolean = true;
  @Input()  habilitarconvidarPessoasEmMassa: boolean = false;
  @Input()  readAllNotificationsButton: boolean = false;
  @Output() refreshTable = new EventEmitter();
  @Output() readAllNotifications = new EventEmitter();
  @Output() configuracao = new EventEmitter();
  @Output() convidarPessoas = new EventEmitter();
  @Output() reenviarConviteEmMassa = new EventEmitter();
  @Output() updateFilter = new EventEmitter();
  @Output() openFormModal = new EventEmitter();
  @Output() openModalAdicional = new EventEmitter();
  @Output() print = new EventEmitter();
  @Input() pesquisarPor: string;

  formulario;

  constructor(public _script: ScriptLoaderService,
    public formBuilder: FormBuilder
    ){
    this.formulario= this.formBuilder.group({
      data: [null]
    })

  }

  ngOnInit(){
    // this.refreshTable.emit('');
    // this._script.load('body',
    // 'assets/app/js/daterangepicker.js',)
    // .then(() => {
    //   // Helpers.setLoading(false);
    //   LoginCustom.init();
    // });
  }

  printable(){return printable()}

}