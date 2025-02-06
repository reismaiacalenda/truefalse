import { Validators, FormGroup } from '@angular/forms';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';
import { NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Helpers } from '../../../../../../helpers';
import { ReservaModalAvancadaFormComponent } from '../reserva-modal-avançada/reserva-modal-avancada-form.component';
import { ReservaModalService } from '../reserva-modal.service';
import { consoleLog } from '../../../../../../globals';
import { Observable, Subject, concat, of } from 'rxjs';
import { distinctUntilChanged, debounceTime, tap, switchMap, catchError, map } from 'rxjs/operators';
import { ValidateEmail } from '../../../../../../_andaime/tf-validators/email.validators';

@Component({
  selector: 'emprestimo-form',
  templateUrl: 'emprestimo-form.component.html'
})
export class EmprestimoFormComponent extends TfFormBaseComponent {
  
  listDadosSelect = {
    // 'funcionarios': [],
    'recursos': []
  }

  entidade="reservas";
  reservaModalService:ReservaModalService;
  data_fim_bkp;
  hr_fim_bkp;
  campoAlterado = "";
  inputsDeCalculo : Subject<string> = new Subject();
    
  formulario = this.formBuilder.group({
  })

  childInit(){
    this.inscricaoAlterarCampos();
    this.loadPessoas();
  }

  //Observable para acompanhar se o campo data tá de fato sendo alterado pelo usuário ou só atualizando via patchValue
  inscricaoAlterarCampos(){
    this.subscriptions.add(
      this.inputsDeCalculo.debounceTime(600).distinctUntilChanged().subscribe(response=>{
      // consoleLog("deobounce");
      // consoleLog(response);
        var body = {
          espaco_id: this.formulario.get('espaco_id').value,      
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
    // this.subscriptions.add(
    //   // this.formulario.controls['recorrencia'].valueChanges.pipe().subscribe(
    //   //   response=>{
    //   //     // if (this.formulario.get('id').value == undefined){
    //   //       if (this.formulario.value['recorrencia'] != response && this.reservaModalService.flagNewSendoSetada == false){
    //   //         this.campoAlterado = 'recorrencia'
    //   //         this.inputsDeCalculo.next(response);
    //   //       }
    //   //     // }
    //   // })
    // )
    this.subscriptions.add(
      this.formulario.controls['desconto'].valueChanges.subscribe(
        response=>{
        // consoleLog("value changed")
          // if (this.formulario.get('id').value == undefined){
          // consoleLog("rowId null")
            if (this.formulario.value['desconto'] != response && this.reservaModalService.flagNewSendoSetada == false){
            // consoleLog("valor realmente mudou, chamando new")
              this.campoAlterado = 'desconto';
              this.inputsDeCalculo.next(response);
            }
          // }
      })
    )
    // this.subscriptions.add(
    // this.formulario.controls['data_inicio'].valueChanges.subscribe(
    //   response=>{
    //     if (this.formulario.get('id').value == undefined){
    //       if (this.formulario.value['data_inicio'] != response){
    //         this.reservaModalService.chamarNew();
    //       }
    //     }
    // )

  }

  initItemRows(){
    return this.formBuilder.group({
      recurso_id: [null],
      quantidade: [null]    
    })
  }
  
  adicionarRecorrencia(){
    Helpers.setLoading(true);
    this.reservaModalService.abrirModalRecorrencia()
      .then((resultadoModal) => {
        this.inicializarFormService();
        Helpers.setLoading(false)
      })
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

  validacaoAnfitriao(){
    ValidateEmail(this.formulario.get('anfitriao_email'))
  }

  pessoas$: Observable<any[]>;
  pessoasLoading = false;
  pessoasInput$ = new Subject<string>();

  trackByFn(item: any) {
    return item.id;
  }

  private loadPessoas() {
    this.pessoas$ = concat(
        of([]), // default items
        this.pessoasInput$.pipe(
            distinctUntilChanged(),
            debounceTime(500),
            tap(() => this.pessoasLoading = true),
            switchMap(term => this.webService.get('funcionarios/list', {q: term})
            .pipe(
                map(r=>{return r.funcionarios}),
                catchError(() => of([])), // empty list on error
                tap(() => this.pessoasLoading = false)
            ))
        )
    );
  }

  selecaoRecurso(event,i){
    if (this.reservaModalService.flagNewSendoSetada == false){
      this.campoAlterado = `recurso.id=#${event}`
      this.inputsDeCalculo.next(event+i);
    }
  }

  alterarQuantidade(event, i){
    if (this.reservaModalService.flagNewSendoSetada == false){
      this.campoAlterado = 'recurso.quantidade'
      this.inputsDeCalculo.next(event+i);
    }
  }

  deleteRow(itemrow, index){
    if (this.reservaModalService.flagNewSendoSetada == false){
      this.campoAlterado = `recurso.delecao=#${index}`
      super.deleteRow(itemrow, index);
      this.inputsDeCalculo.next(itemrow.value.recurso_id+index);
    }
  }

  removeItem(lote){
    if(lote) {
      this.formService.remove(this.rowId, true)
    } else {
      this.reservaModalService.tratarCancelamentoReserva(this.rowId, this.activeModal);
    }
  }

}