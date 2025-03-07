// import { Validators, FormGroup } from '@angular/forms';
import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit, AfterViewChecked } from '@angular/core';
// import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WebService } from '../../../../../../_services/web.service';
import { Helpers } from '../../../../../../helpers';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { consoleLog } from '../../../../../../globals';
// import Picker from 'pickerjs';

declare function iniciarPicker(date): any;

@Component({
  selector: 'modal-selecionar-horario',
  templateUrl: 'modal-selecionar-horario.component.html'
})
export class ModalSelecionarHorarioComponent implements OnInit, AfterViewInit {
  constructor(public activeModal: NgbActiveModal,
    public webService: WebService,
    private _script: ScriptLoaderService){}

  public horarioOrigem;

  ngOnInit(){
    // var input = document.getElementById('pickerInput');
    // var picker = new Picker(input, {
    //   format: 'YYYY/MM/DD HH:mm',
    // });
    // consoleLog("terminou o load script")
    // consoleLog("chamando metodo oi()")
    // 
  }
  
  ngAfterViewInit(){
    // Helpers.setLoading(false);
    // this._script.load(
    //   'assets/app/js/picker.js'
    // ).then(result => {
      // consoleLog(result)
      // if (result != undefined){
       
      
      // }
    // })
    // .finally(()=>{consoleLog('finally')})
  }

  iniciarComponentPicker(horario){
    var hora = horario.split(':')[0];
    var minuto = horario.split(':')[1];
    if (minuto < 10 || minuto > 54){
      minuto = '00';
    }else if (minuto < 25){
      minuto = '15';
    }else if (minuto < 40){
      minuto = '30';
    }else if (minuto < 55){
      minuto = '45';
    }else{
      if (hora > 10){
        hora = '0' + (hora * 1) + 1;
        minuto = '00';
      }else if (hora == 23){
        minuto = '45';
      }else{
        hora = '' + hora * 1 + 1;
        minuto = '00';
      }
    }
  
    this.horarioOrigem = hora + ':' + minuto;
    iniciarPicker(this.horarioOrigem);
    Helpers.setLoading(false);
  };


  aplicarHorario(){
    Helpers.setLoading(true);
    var horarioPicker = (<HTMLInputElement>document.getElementById('pickerInput')).value;
    consoleLog("dentr do aplicar horario")
    consoleLog(horarioPicker)
    if (horarioPicker != undefined && horarioPicker != '' && horarioPicker != ' '){
      this.horarioOrigem = horarioPicker;
    }
    this.activeModal.close(this.horarioOrigem);
  }
  
  onSubmit() {
  }
}