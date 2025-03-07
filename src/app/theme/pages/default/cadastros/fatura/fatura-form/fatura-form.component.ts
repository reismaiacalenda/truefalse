import { Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'fatura-form',
  templateUrl: 'fatura-form.component.html'
})
export class FaturaFormComponent extends TfFormBaseComponent implements OnInit {
  public ovo:FormArray;
  public montarOrcamento: Observable<any> = this.createMontarOrcamento();
  public jesus = {"epa": 1}
  formulario = this.formBuilder.group({
    id: [null],
    nome: [null, Validators.required],    //tf-text-simples     :string
    codigo: [null],                       //tf-text-simples     :string
    observacao: [null],                   //tf-text-area        :string
    flag: [null],                         //tf-check-box        :boolean
    item_a: [true],                       //tf-check-list       :boolean
    item_b: [true],                       //tf-check-list       :boolean
    quantidade: [null, Validators.required],                   //tf-integer          :integer
    enumeracao: [null],                   //tf-radio-button     :integer
    dinheiro: [null],                     //tf-money            :float
    porcentagem: [null],                  //tf-float            :float
    dia: [(new Date).toLocaleDateString("PT"), [Validators.required]],                          //tf-date             :datetime
    horario: [null],                      //tf-time             :datetime
    data_completa: [null],                //tf-datetime         :datetime
    value: [null],
    mestre_id: [null],
    detalhes_attributes: this.formBuilder.array([]),
    nprans_attributes: null
  });
  aba1 = this.formBuilder.array([
    this.formulario.controls['mestre_id'],
    this.formulario.controls['detalhes']
  ])
  aba2 = this.formBuilder.array([


  ])
  aba3 = this.formBuilder.array([

  ])
  abas = [
    {"icon":"flaticon-add", "formArray": this.aba1, "requisicaoTabulada": this.montarOrcamento },
    {"icon":"flaticon-map-location", "formArray": this.aba2, },
    {"icon":"flaticon-time", "formArray": this.aba3, }
  ];
  entidade= "andaimes";
  listDadosSelect = {
		'detalhes': [],
		'nprans': [],
		'mestres': []
	}

  childInit(){
  }

  getJesus():Observable<any>{
    return of(this.jesus);
  }

  createMontarOrcamento(){
    return Observable.create(observer=>{
      // this.webService.get('orcar').subscribe(r=>{
      this.getJesus().subscribe(r=>{
        observer.next(r);
        // observer.error(new Error("OVOOOO"))
        observer.complete();
      });
      // return of(this.jesus);
    })
  }



  // initialize(){
    // this.ovo = this.formBuilder.array([
    //     this.formBuilder.group({
    //   id: [null],
    //   new_record: [null],
    //   _destroy: [null]
    // })
    // ]),

    // [Validators.required, Validators.maxLength(8), Validators.minLength(8)]

    // nome: [null],
    // porcentagem: [null]                   //tf-float            :float
    // this.formBuilder.group({
    //   id: [null],
    //   new_record: [null],
    //   _destroy: [null]
    // })
    // this.formBuilder.array([
    // this.formBuilder.group({
    //   id: [null],
    //   new_record: [false],
    //   _destroy: [null]
    // })
    // ])

    // this.formBuilder.array([
      // this.formBuilder.group({
      //       id: [8],
      //       new_record: [false],
      //       _destroy: [null]
      //     })
    // ]),
    // this.formBuilder.array([
    //   this.formBuilder.group({
    //     id: [4],
    //     new_record: [false],
    //     _destroy: [null]
    //   })
    // ]),
    // this.superInitialize(");
  // }

  // detalhes_attributes(){

  // }
}
