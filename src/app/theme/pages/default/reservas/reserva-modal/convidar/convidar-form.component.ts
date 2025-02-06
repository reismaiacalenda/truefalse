import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';
import { ReservaModalService } from '../reserva-modal.service';
import { consoleLog } from '../../../../../../globals';
import { ValidateEmailSelectMulti } from '../../../../../../_andaime/tf-validators/email.validators';
import { Observable, Subject, concat, of } from 'rxjs';
import { distinctUntilChanged, debounceTime, tap, switchMap, map, catchError } from 'rxjs/operators';
import { Helpers } from '../../../../../../helpers';

@Component({
  selector: 'convidar-form',
  templateUrl: 'convidar-form.component.html'
})
export class ConvidarFormComponent extends TfFormBaseComponent {

  entidade= "funcionarios";

  listDadosSelect = {
    'unidades':[]
  }

  formulario = this.formBuilder.group({
    id: [null],
    funcionario_emails: [null],
    unidades_attributes: this.prepararFormArraySelectMultiplo([Validators.required]),
  })

  onSubmit() {
    Helpers.setLoading(true);
  // consoleLog("Entrou no Salvar!")
    var body = {
      "funcionario_emails": this.formulario.get('funcionario_emails').value,
      "unidades_attributes": this.formulario.get('unidades_attributes').value
    }
  // consoleLog("Body:")
  // consoleLog(body)
    this.formulario.updateValueAndValidity();
    this.webService.post(`funcionarios/convidar`, body)
      .subscribe(
        response =>{
          Helpers.setLoading(false);
        // consoleLog("Entrou no response")
        // consoleLog(response)
          this.activeModal.close(true);
          // this.modalService.tratarMensagem(response.body.message, null)
          // this.refreshPortas.emit('');
        // consoleLog("Passou no emit!");
        },
        (error) => {
          Helpers.setLoading(false);
          this.modalService.tratarError(error);
        }
      )
  }  

  childInit(){
    this.loadPeople();
  }

  ngAfterViewInit(): void {
    this.renderer.addClass(this.element.nativeElement.parentElement, 'animated-50')
    this.renderer.addClass(this.element.nativeElement.parentElement, 'fadeIn');
    $('.ng-select.ng-select-multiple .ng-select-container')[0].style['min-height'] = '96px';
    $('.ng-select.ng-select-multiple .ng-select-container .ng-value-container')[0].style['margin-top'] = '50px'
  }

  validacao(){
    // if (value != undefined && value != [])
  // consoleLog(this.formulario.get('funcionario_emails').value);
    ValidateEmailSelectMulti(this.formulario.get('funcionario_emails'));
    this.formulario.updateValueAndValidity();
  }

  people$: Observable<any[]>;
  peopleLoading = false;
  peopleInput$ = new Subject<string>();

  trackByFn(item: any) {
    return item.id;
  }

  private loadPeople() {
    this.people$ = concat(
        of([]), // default items
        this.peopleInput$.pipe(
            distinctUntilChanged(),
            debounceTime(500),
            tap(() => this.peopleLoading = true),
            switchMap(term => this.webService.get('funcionarios/list', {q: term})
            .pipe(
                map(r=>{return r.funcionarios}),
                catchError(() => of([])), // empty list on error
                tap(() => this.peopleLoading = false)
            ))
        )
    );
  }

}