import { Component, Input, forwardRef, OnInit, AfterViewInit, OnChanges, SimpleChanges, SimpleChange, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { consoleLog, globals } from '../../../globals';
// import { Select2OptionData } from 'ng-select2';
import { map } from 'rxjs/operators';
import { WebService } from '../../../_services/web.service';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap, delay } from 'rxjs/operators';
// import { NgSelectConfig } from '@ng-select/ng-select';

// const TF_SELECT_EMAIL_VALUE_ACCESSOR: any = {
//   provide: NG_VALUE_ACCESSOR,
//   useExisting: forwardRef(() => TfSelectEmailComponent),
//   multi: true
// };
export interface Person {
  id: string;
  isActive: boolean;
  age: number;
  name: string;
  gender: string;
  company: string;
  email: string;
  phone: string;
  disabled?: boolean;
}
@Component({
  selector: 'tf-select-email',
  templateUrl: './tf-select-email.component.html',
  standalone: false
  //styleUrls: ['./input-field.component.css'],
  // providers: [TF_SELECT_MULTI_VALUE_ACCESSOR]
})

export class TfSelectEmailComponent implements OnInit, OnDestroy {
  @Input() control;
  @Input() id: string;
  @Input() label: string = "";
  @Input() placeholder: string = "";
  @Input() isReadOnly = false;
  @Input() desabilitar: boolean = false;
  @Input() options:any = {
    multiple: true,
    tags: true,
    width: '100%',
    language: 'pt-BR'
  }
  @Input() form:FormArray;
  @Input() data = [];
  @Input() tooltip: string;
  public model;
  private innerValue: any;
  private subscriptions: Subscription = new Subscription();
  private isValueChangeFromFormService:boolean = true;

  constructor(public formBuilder: FormBuilder,
    public webService:WebService){
    this.form = this.formBuilder.array([])
    // },private config: NgSelectConfig) {
    //     this.config.notFoundText = 'asdasdasd not found';
    //     this.config.appendTo = 'body';
    //     // set the bindValue to global config when you use the same 
    //     // bindValue in most of the place. 
    //     // You can also override bindValue for the specified template 
    //     // by defining `bindValue` as property
    //     // Eg : <ng-select bindValue="some-new-value"></ng-select>
    //     this.config.bindValue = 'value';
    //     this.loadPeople();
  }

  ngOnInit(){  
    this.subscriptions.add(
      this.form.valueChanges.subscribe(value=>{
      // consoleLog(value);
        if (this.isValueChangeFromFormService){
          this.model = this.formControlToStringArray(this.form);
        }
      })
    )
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }

  formControlToStringArray(form){
    var stringArray = [];


    consoleLog(form)
  
    // consoleLog("formControl to string array disparado:")
    // consoleLog(form);
    // if (form && form.controls && form.controls.length > 0){
      // consoleLog(form.controls.length);
      form.controls.forEach(f => {
        // consoleLog("each:");
        // consoleLog(f.value);
        if (f.value.email && !f.value._destroy){
          stringArray.push(f.value.email.toString())
        }
      });
      consoleLog("jesus amado");
      consoleLog(stringArray);
    // }

    // if (form && form.value){
    //   form.value.forEach(value => {
    //     if (value.email && !value._destroy){
    //       stringArray.push(value.email.toString())
    //     }
    //   });
    // }
    // consoleLog("olha o form:")
    // consoleLog(form);
    // consoleLog("olha o retorno do string array;:")
    // consoleLog(stringArray);
    // return stringArray
    return ["lucas.maia.verissimo@gmail.com"]
  }

  stringArrayToFormControl(stringArray:any[]){
    // consoleLog(stringArray)
    //TODO: varrer os emails no form.
    //1. se achar no string array, destroy é false. 
    //2. se nao achar no stringarray, mas existir nof orm, é destroy true
    //3. se nao achar no form, mas existir no string array, é novo item pro form, com destroy false
    //4. Tomar cuidado durante a edição. new record pode ajudar
    //5. Tomar cuidado ao deletar e depoir adicionar o mesmo item. new recor dpode ajudar
    
    if (this.form == null || this.form.value == null){
      // consoleLog("//Form veio vazio.");
      if (!stringArray || stringArray.length === 0){
        // consoleLog("// Usuario brincou de selecionar e desisitiu, ou simplesmente nao encostou.");
        // consoleLog("// nao faz nada, mantem o form nullinho da silva");
      }else{
        // consoleLog("// tem inserção nova:");
        this.form = this.formBuilder.array([]);
        stringArray.forEach(e=>{
          this.form.push(this.formBuilder.group({
            email: e,
            new_record: true
          }));
        })
        // _destroy: false
      }
    }else{

      stringArray.forEach(e=>{
        // consoleLog("//percorre os emails as seleções");
        // consoleLog(e);
        if (this.form.controls.find(f=>f.value.email==e) === undefined){
          // consoleLog("//se esse email não existir no form, trata-se de uma nova inserção (new_record: true)");
          this.form.push(this.formBuilder.group({
            email: e,
            new_record: true
          }))
        }else{
          // consoleLog("// caso o email já esteja salvo no form nada a fazer. o registro se mantem");
        }

      })

      this.form.controls.forEach((f, i) => {
        // consoleLog("// controlar deleções");
        // consoleLog(f);
        if (!stringArray.includes(f.value.email)){
          // consoleLog("//se o control não existir mais na seleção:");
          if (f.value.new_record){
            // consoleLog("// e se o registro for novo, remove ele do form, pra nem enviar pra api;");
            this.form.removeAt(i);

          }else{
            // consoleLog("// se o registro ja tiver sido salvo na base, então não podemos removê-lo,");
            // consoleLog("// mas sim flagar sua destruição para a api ficar ligada que tem removê-lo da base");
            f.value._destroy = true;
          }
        }
      });

      if (this.form.controls.length == 0){
        // consoleLog("caso o usuario só brincou de selecionar mas desistiu de todos, devemos anular o form");
        this.form = null;
      }
    }
  }

  valueChanged(event){
    this.isValueChangeFromFormService=false;
    this.stringArrayToFormControl(event.value);
  // consoleLog(event.value);
    // var query;
    // if (event.value != undefined && event.value != []){
    //   query = event.value[event.value.length-1]
    // }
    // this.pesquisar(query);
    // this.isValueChangeFromFormService=true;
    if(this.form){this.form.markAsTouched()}
  }
  oi(event){
  // consoleLog(event);
  }

  setDisabledState?(isDisabled: boolean): void {
    this.desabilitar = isDisabled;
  }

  debugGlobal = globals.debug;

  // pesquisar(queryParam){
  //   this.dados = this.webService.get('funcionarios/list', {q: queryParam})
  //     .pipe(
  //       map( r=>{
  //           return r.funcionarios;
  //         }
  //       )
  //     )
  // }


  people$: Observable<Person[]>;
  peopleLoading = false;
  peopleInput$ = new Subject<string>();
  selectedPersons: Person[] = <any>[{ name: 'Karyn Wright' }, { name: 'Other' }];

  trackByFn(item: Person) {
    return item.id;
  }

  
  private loadPeople() {
    this.people$ = concat(
        of([]), // default items
        this.peopleInput$.pipe(
            distinctUntilChanged(),
            tap(() => this.peopleLoading = true),
            switchMap(term => this.getPeople(term)//this.webService.get('funcionarios/list', {q: term})
            .pipe(
              catchError(() => of([])), // empty list on error
              tap(() => this.peopleLoading = false)
              // map(r=>{return r.funcionarios}),
                // delay(3000),
            ))
        )
    );
  }
  
  getPeople(term: string = null): Observable<Person[]> {
    let items = this.getMockPeople();
    if (term) {
        items = items.filter(x => x.name.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
    }
    return of(items).pipe(delay(500));
  }

  getMockPeople() {
    return [
        {
            'id': '5a15b13c36e7a7f00cf0d7cb',
            'index': 2,
            'isActive': true,
            'picture': 'http://placehold.it/32x32',
            'age': 23,
            'name': 'Karyn Wright',
            'gender': 'female',
            'company': 'ZOLAR',
            'email': 'karynwright@zolar.com',
            'phone': '+1 (851) 583-2547'
        },
        {
            'id': '5a15b13c2340978ec3d2c0ea',
            'index': 3,
            'isActive': false,
            'picture': 'http://placehold.it/32x32',
            'age': 35,
            'name': 'Rochelle Estes',
            'disabled': true,
            'gender': 'female',
            'company': 'EXTRAWEAR',
            'email': 'rochelleestes@extrawear.com',
            'phone': '+1 (849) 408-2029'
        },
        {
            'id': '5a15b13c663ea0af9ad0dae8',
            'index': 4,
            'isActive': false,
            'picture': 'http://placehold.it/32x32',
            'age': 25,
            'name': 'Mendoza Ruiz',
            'gender': 'male',
            'company': 'ZYTRAX',
            'email': 'mendozaruiz@zytrax.com',
            'phone': '+1 (904) 536-2020'
        },
        {
            'id': '5a15b13cc9eeb36511d65acf',
            'index': 5,
            'isActive': false,
            'picture': 'http://placehold.it/32x32',
            'age': 39,
            'name': 'Rosales Russell',
            'gender': 'male',
            'company': 'ELEMANTRA',
            'email': 'rosalesrussell@elemantra.com',
            'phone': '+1 (868) 473-3073'
        },
        {
            'id': '5a15b13c728cd3f43cc0fe8a',
            'index': 6,
            'isActive': true,
            'picture': 'http://placehold.it/32x32',
            'age': 32,
            'name': 'Marquez Nolan',
            'gender': 'male',
            'company': 'MIRACLIS',
            'disabled': true,
            'email': 'marqueznolan@miraclis.com',
            'phone': '+1 (853) 571-3921'
        },
        {
            'id': '5a15b13ca51b0aaf8a99c05a',
            'index': 7,
            'isActive': false,
            'picture': 'http://placehold.it/32x32',
            'age': 28,
            'name': 'Franklin James',
            'gender': 'male',
            'company': 'CAXT',
            'email': 'franklinjames@caxt.com',
            'phone': '+1 (868) 539-2984'
        },
        {
            'id': '5a15b13cc3b9381ffcb1d6f7',
            'index': 8,
            'isActive': false,
            'picture': 'http://placehold.it/32x32',
            'age': 24,
            'name': 'Elsa Bradley',
            'gender': 'female',
            'company': 'MATRIXITY',
            'email': 'elsabradley@matrixity.com',
            'phone': '+1 (994) 583-3850'
        },
        {
            'id': '5a15b13ce58cb6ff62c65164',
            'index': 9,
            'isActive': true,
            'picture': 'http://placehold.it/32x32',
            'age': 40,
            'name': 'Pearson Thompson',
            'gender': 'male',
            'company': 'EZENT',
            'email': 'pearsonthompson@ezent.com',
            'phone': '+1 (917) 537-2178'
        },
        {
            'id': '5a15b13c90b95eb68010c86e',
            'index': 10,
            'isActive': true,
            'picture': 'http://placehold.it/32x32',
            'age': 32,
            'name': 'Ina Pugh',
            'gender': 'female',
            'company': 'MANTRIX',
            'email': 'inapugh@mantrix.com',
            'phone': '+1 (917) 450-2372'
        },
        {
            'id': '5a15b13c2b1746e12788711f',
            'index': 11,
            'isActive': true,
            'picture': 'http://placehold.it/32x32',
            'age': 25,
            'name': 'Nguyen Elliott',
            'gender': 'male',
            'company': 'PORTALINE',
            'email': 'nguyenelliott@portaline.com',
            'phone': '+1 (905) 491-3377'
        },
        {
            'id': '5a15b13c605403381eec5019',
            'index': 12,
            'isActive': true,
            'picture': 'http://placehold.it/32x32',
            'age': 31,
            'name': 'Mills Barnett',
            'gender': 'male',
            'company': 'FARMEX',
            'email': 'millsbarnett@farmex.com',
            'phone': '+1 (882) 462-3986'
        },
        {
            'id': '5a15b13c67e2e6d1a3cd6ca5',
            'index': 13,
            'isActive': true,
            'picture': 'http://placehold.it/32x32',
            'age': 36,
            'name': 'Margaret Reynolds',
            'gender': 'female',
            'company': 'ROOFORIA',
            'email': 'margaretreynolds@rooforia.com',
            'phone': '+1 (935) 435-2345'
        },
        {
            'id': '5a15b13c947c836d177aa85c',
            'index': 14,
            'isActive': false,
            'picture': 'http://placehold.it/32x32',
            'age': 29,
            'name': 'Yvette Navarro',
            'gender': 'female',
            'company': 'KINETICA',
            'email': 'yvettenavarro@kinetica.com',
            'phone': '+1 (807) 485-3824'
        },
        {
            'id': '5a15b13c5dbbe61245c1fb73',
            'index': 15,
            'isActive': false,
            'picture': 'http://placehold.it/32x32',
            'age': 20,
            'name': 'Elisa Guzman',
            'gender': 'female',
            'company': 'KAGE',
            'email': 'elisaguzman@kage.com',
            'phone': '+1 (868) 594-2919'
        },
        {
            'id': '5a15b13c38fd49fefea8db80',
            'index': 16,
            'isActive': false,
            'picture': 'http://placehold.it/32x32',
            'age': 33,
            'name': 'Jodie Bowman',
            'gender': 'female',
            'company': 'EMTRAC',
            'email': 'jodiebowman@emtrac.com',
            'phone': '+1 (891) 565-2560'
        },
        {
            'id': '5a15b13c9680913c470eb8fd',
            'index': 17,
            'isActive': false,
            'picture': 'http://placehold.it/32x32',
            'age': 24,
            'name': 'Diann Booker',
            'gender': 'female',
            'company': 'LYRIA',
            'email': 'diannbooker@lyria.com',
            'phone': '+1 (830) 555-3209'
        }
    ]
}

}