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
  selector: 'reserva-posto-trabalho-form',
  templateUrl: 'reserva-posto-trabalho-form.component.html'
})
export class ReservaPostoTrabalhoFormComponent extends TfFormBaseComponent {
  listMesas: any[];
  entidade="reservas";
  reservaModalService:ReservaModalService;
    
  formulario = this.formBuilder.group({
  })

  childInit(){
    // this.formulario.get('criador_id').setValue(this.workspaceService.currentUser.id);
    // consoleLog(this.formulario.get('criador_id'));
    this.inscricaoAlterarCampos();
    this.preencherListMesa();
    this.loadPessoas();
  }

  //Observable para acompanhar se o campo data tá de fato sendo alterado pelo usuário ou só atualizando via patchValue
  inscricaoAlterarCampos(){
    consoleLog("Alterou data início!");
    this.formulario.controls['data_inicio'].valueChanges.subscribe(
      response=>{
        if (this.formulario.get('id').value == undefined){
          if (this.formulario.value['data_inicio'] != response){
            // this.reservaModalService.chamarNew();
          }
        }
    })
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

  preencherListMesa(){
    this.webService.get(`espacos/list_andaime`, {tipo_espaco: 'mesa'})
    .subscribe(dados => {
      consoleLog(dados)
      this.listMesas = (<any>dados).espacos
      consoleLog("listSelectEspacos")
      consoleLog(this.listMesas)
    });
  }

  removeItem(lote){
    if(lote) {
      this.formService.remove(this.rowId, true)
    } else {
      this.reservaModalService.tratarCancelamentoReserva(this.rowId, this.activeModal);
    }
  }

}