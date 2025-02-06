import { Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../../_andaime/tf-forms/tf-form-base.component';
import { ValidateEmailSelectMulti, isValidEmail } from '../../../../../../../_andaime/tf-validators/email-validators';
import { Select2OptionData } from 'ng-select2';
import { Observable, Subject, concat, of } from 'rxjs';
import { distinctUntilChanged, debounceTime, tap, switchMap, catchError, map, delay } from 'rxjs/operators';

@Component({
  selector: 'aprovadores-form',
  templateUrl: 'aprovadores-form.component.html'
})

export class AprovadoresFormComponent extends TfFormBaseComponent {
  entidade= "aprovadores";
  listDadosSelect = {
    'grupos':[],
    'tipo_espacos': []
  }

  formulario = this.formBuilder.group({
    id: [null],
    funcionario_emails: [null],
    grupos_attributes: this.prepararFormArraySelectMultiploSemRequired(),
    tipo_espacos_attributes: this.prepararFormArraySelectMultiploSemRequired(),
  })

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