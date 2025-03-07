import { Validators, FormGroup } from '@angular/forms';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';
import { NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Helpers } from '../../../../../../helpers';
import { ReservaModalService } from '../../reserva-modal/reserva-modal.service';
import { consoleLog } from '../../../../../../globals';
import { Observable, Subject, concat, of } from 'rxjs';
import { distinctUntilChanged, debounceTime, tap, switchMap, catchError, map } from 'rxjs/operators';
import { ValidateEmailSelectMulti, ValidateEmail } from '../../../../../../_andaime/tf-validators/email.validators';

@Component({
  selector: 'modal-mais-opcoes',
  templateUrl: 'modal-mais-opcoes.component.html'
})
export class ModalMaisOpcoesComponent extends TfFormBaseComponent {
  tipo_espaco;
  assunto;
  anfitriao_email;
  convidados_emails;
  observacao;
  entidade="reservas";
  reservaModalService:ReservaModalService;
  recorrencia;
  textRepeat = "Repetir reserva";
  textoParaQuemSera = "";

  formulario = this.formBuilder.group({
    assunto: [],
    convidados_emails: [],
    anfitriao_email: [],
    observacao: []
  })

  childInit(){
    this.loadConvidados();
    this.formulario.get('assunto').setValue(this.assunto);
    this.formulario.get('anfitriao_email').setValue(this.anfitriao_email);
    this.formulario.get('convidados_emails').setValue(this.convidados_emails);
    this.formulario.get('observacao').setValue(this.observacao);

    if(this.tipo_espaco == 'mesa'){
      this.textoParaQuemSera = 'Para quem será essa mesa?'
    }else if(this.tipo_espaco == 'estacionamento'){
      this.textoParaQuemSera = 'Para quem será essa vaga?'
    }else if(this.tipo_espaco == 'fretado'){
      this.textoParaQuemSera = 'Para quem será esse lugar?'
    }else{
      this.textoParaQuemSera = 'Para quem será esse evento?'
    }
  }

  convidados$: Observable<any[]>;
  convidadosLoading = false;
  convidadosInput$ = new Subject<string>();

  trackByFn(item: any) {
    return item.id;
  }

  validacao(){
    ValidateEmailSelectMulti(this.formulario.get('convidados_emails'));
    this.formulario.updateValueAndValidity();
  }

  validacaoAnfitriao(){
    ValidateEmail(this.formulario.get('anfitriao_email'))
  }

  onSubmit(){
    Helpers.setLoading(true);
    this.activeModal.close({
      assunto: this.formulario.get('assunto').value,
      anfitriao_email: this.formulario.get('anfitriao_email').value,
      convidados_emails: this.formulario.get('convidados_emails').value,
      observacao: this.formulario.get('observacao').value
    });
  }

  abrirModalRecorrencia(){
    Helpers.setLoading(true);
    // this.reservaModalService.formulario.get('data_inicio').setValue(this.data.format('DD/MMM/YYYY'));
    // console.log(this.reservaModalService.formulario.get('recorrencia').value);
    this.reservaModalService.abrirModalRecorrencia()
      .then((resultadoModal) => {
        console.log(this.reservaModalService.formulario);
        // this.inicializarFormService();
        this.recorrencia = this.reservaModalService.formulario.get('recorrencia').value
        Helpers.setLoading(false)
      })
  }

  ngAfterViewInit(): void {
    this.renderer.addClass(this.element.nativeElement.parentElement, 'animated-50')
    this.renderer.addClass(this.element.nativeElement.parentElement, 'fadeIn');
    $('.ng-select.ng-select-multiple .ng-select-container')[0].style['min-height'] = '96px';
    $('.ng-select.ng-select-multiple .ng-select-container .ng-value-container')[0].style['margin-top'] = '50px'
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  private loadConvidados() {
    console.log(this.convidados_emails);
    console.log(this.tipo_espaco);
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
}