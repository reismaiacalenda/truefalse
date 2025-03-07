import { Validators, FormGroup } from '@angular/forms';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';
import { NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Helpers } from '../../../../../../helpers';
import { ReservaModalAvancadaFormComponent } from '../reserva-modal-avançada/reserva-modal-avancada-form.component';
import { ReservaModalService } from '../reserva-modal.service';
import { consoleLog } from '../../../../../../globals';
import { ValidateEmailSelectMulti, ValidateEmail } from '../../../../../../_andaime/tf-validators/email.validators';
import { Observable, Subject, concat, of } from 'rxjs';
import { distinctUntilChanged, debounceTime, tap, switchMap, catchError, map } from 'rxjs/operators';

@Component({
  selector: 'reserva-estacionamento-form',
  templateUrl: 'reserva-estacionamento-form.component.html'
})
export class ReservaEstacionamentoFormComponent extends TfFormBaseComponent {
  listEstacionamentos: any[];
  entidade="reservas";
  reservaModalService:ReservaModalService;
  campoAlterado = "";
  data_fim_bkp;
  hr_fim_bkp;
  vinculos_removidos:string;
  vinculos_removidos_array = [];
  inputsDeCalculo : Subject<string> = new Subject();
    
  formulario = this.formBuilder.group({
  })

  childInit(){
    // this.formulario.get('criador_id').setValue(this.workspaceService.currentUser.id);
    // consoleLog(this.formulario.get('criador_id'));
    this.inscricaoAlterarCampos();
    this.preencherListEstacionamento();
    this.loadConvidados();
    this.definirObrigatoriedade();
  }

  ngAfterViewInit(): void {
    this.renderer.addClass(this.element.nativeElement.parentElement, 'animated-50')
    this.renderer.addClass(this.element.nativeElement.parentElement, 'fadeIn');
    $('.ng-select.ng-select-multiple .ng-select-container')[0].style['min-height'] = '96px';
    $('.ng-select.ng-select-multiple .ng-select-container .ng-value-container')[0].style['margin-top'] = '50px'
  }
  
  definirObrigatoriedade(){
    this.formulario.get('espaco_id').setValidators([Validators.required])
    this.formulario.get('espaco_id').updateValueAndValidity();
    this.formulario.get('anfitriao_email').setValidators([Validators.required])
    this.formulario.get('anfitriao_email').updateValueAndValidity();
  }

  //Observable para acompanhar se o campo data tá de fato sendo alterado pelo usuário ou só atualizando via patchValue
  inscricaoAlterarCampos(){
    this.subscriptions.add(
      this.inputsDeCalculo.debounceTime(600).distinctUntilChanged().subscribe(response=>{
      // consoleLog("deobounce");
      // consoleLog(response);
        var body = {
          espaco_id: this.formulario.get('espaco_id').value,      
          // pessoa_id: this.formulario.get('pessoa_id').value,      
          // recurso_id: this.formulario.get('recurso_id').value,      
          data: this.formulario.get('data_inicio').value,
          hr_inicio_previsto: this.formulario.get('hr_inicio_previsto').value,
          hr_fim_previsto: this.formulario.get('hr_fim_previsto').value,
          data_fim: this.formulario.get('data_fim').value,
          rr_attributes: JSON.stringify(this.formulario.get('recursos_reservas_attributes').value),
          recorrencia: this.formulario.get('recorrencia').value,
          desconto: this.formulario.get('desconto').value,
          tela: this.reservaModalService.tela,
          dia_todo: this.formulario.get('dia_todo').value,
          campo_alterado: this.campoAlterado,
          vinculos_removidos: this.vinculos_removidos,
          recalculando: true
        }
        this.reservaModalService.chamarNew(body);
      })
    )

    this.subscriptions.add(
      this.formulario.controls['espaco_id'].valueChanges.subscribe(
        response=>{
          // if (this.formulario.get('id').value == undefined){
            if (this.formulario.value['espaco_id'] != response && this.reservaModalService.flagNewSendoSetada == false){
              this.campoAlterado = 'espaco_id'
              this.inputsDeCalculo.next(response);
            }
          // }
      })
    )
    this.subscriptions.add(
      this.formulario.controls['data_inicio'].valueChanges.subscribe(
        response=>{
          // if (this.formulario.get('id').value == undefined){
            if (this.formulario.value['data_inicio'] != response && this.reservaModalService.flagNewSendoSetada == false){
              this.campoAlterado = 'data_inicio'
              this.inputsDeCalculo.next(response);
            }
          // }
      })
    )
    this.subscriptions.add(
      this.formulario.controls['hr_inicio_previsto'].valueChanges.subscribe(
        response=>{
          // if (this.formulario.get('id').value == undefined){
            if (this.formulario.value['hr_inicio_previsto'] != response && this.reservaModalService.flagNewSendoSetada == false){
              this.campoAlterado = 'hr_inicio_previsto'
              this.inputsDeCalculo.next(response);
            }
          // }
      })
    )
    this.subscriptions.add(
      this.formulario.controls['data_fim'].valueChanges.subscribe(
        response=>{
          // if (this.formulario.get('id').value == undefined){
            if (this.formulario.value['data_fim'] != response && this.reservaModalService.flagNewSendoSetada == false){
              this.campoAlterado = 'data_fim'
              this.inputsDeCalculo.next(response);
            }
          // }
      })
    )
    this.subscriptions.add(
      this.formulario.controls['hr_fim_previsto'].valueChanges.subscribe(
        response=>{
          // if (this.formulario.get('id').value == undefined){
            if (this.formulario.value['hr_fim_previsto'] != response && this.reservaModalService.flagNewSendoSetada == false){
              this.campoAlterado = 'hr_fim_previsto'
              this.inputsDeCalculo.next(response);
            }
          // }
      })
    )
    this.subscriptions.add(
      this.formulario.controls['dia_todo'].valueChanges.pipe().subscribe(
        response=>{
          // if (this.formulario.get('id').value == undefined){
            if (this.formulario.value['dia_todo'] != response && this.reservaModalService.flagNewSendoSetada == false){
              this.campoAlterado = 'dia_todo'
              this.inputsDeCalculo.next(response);
            }
          // }
      })
    )

  }

  validacao(){
    // if (value != undefined && value != [])
  // consoleLog(this.formulario.get('convidados_emails').value);
    ValidateEmailSelectMulti(this.formulario.get('convidados_emails'));
    this.formulario.updateValueAndValidity();
  }

  convidados$: Observable<any[]>;
  convidadosLoading = false;
  convidadosInput$ = new Subject<string>();

  private loadConvidados() {
    this.convidados$ = concat(
        of([]), // default items
        this.convidadosInput$.pipe(
            distinctUntilChanged(),
            debounceTime(500),
            tap(() => this.convidadosLoading = true),
            switchMap(term => this.webService.get('funcionarios/list', {q: term})
            .pipe(
                map(r=>{return r.funcionarios}),
                catchError(() => of([])), // empty list on error
                tap(() => this.convidadosLoading = false)
            ))
        )
    );
  }

  validacaoAnfitriao(){
    ValidateEmail(this.formulario.get('anfitriao_email'))
  }

  pessoas$: Observable<any[]>;
  pessoasLoading = false;
  pessoasInput$ = new Subject<string>();

  trackByFn(item: any) {
    return item.id;
  }

  preencherListEstacionamento(){
    this.webService.get(`espacos/list_andaime`, {tipo_espaco: 'estacionamento'})
    .subscribe(dados => {
      consoleLog(dados)
      this.listEstacionamentos = (<any>dados).espacos
      consoleLog("listSelectEspacos")
      consoleLog(this.listEstacionamentos)
    });
  }

  removeItem(lote){
    if(lote) {
      this.formService.remove(this.rowId, true)
    } else {
      this.reservaModalService.tratarCancelamentoReserva(this.rowId, this.activeModal);
    }
  }

  setarDiaTodo(){
    if (this.formulario.get('dia_todo').value == true){
      this.formulario.get('dia_todo').setValue(false);
      // this.formulario.get('hr_fim_previsto').setValue(this.hr_fim_bkp);
      // this.formulario.get('data_fim').setValue(this.data_fim_bkp);
    }else{
      this.formulario.get('dia_todo').setValue(true);
      // this.data_fim_bkp = this.formulario.get('data_fim').value;
      // this.hr_fim_bkp = this.formulario.get('hr_fim_previsto').value;
      // this.formulario.get('data_fim').setValue(this.formulario.get('data_inicio').value);
      // this.formulario.get('hr_fim_previsto').setValue('23:59');
    }
  }

  adicionarRecorrencia(){
    Helpers.setLoading(true);
    this.reservaModalService.abrirModalRecorrencia()
      .then((resultadoModal) => {
        this.inicializarFormService();
        Helpers.setLoading(false)
      })
  }

}