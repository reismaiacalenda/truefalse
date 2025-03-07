import { Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../../_andaime/tf-forms/tf-form-base.component';
import { Observable, of } from 'rxjs';
import { FileHolder } from 'angular2-image-upload';
import { consoleLog } from '../../../../../../../globals';

@Component({
  selector: 'didatico-form',
  templateUrl: 'didatico-form.component.html'
})
export class DidaticoFormComponent extends TfFormBaseComponent implements OnInit {
  public ovo:FormArray;
  public montarOrcamento: Observable<any> = this.createMontarOrcamento();
  public jesus = {"epa": 1}
  formulario = this.formBuilder.group({
    id: [null],
    // nome: [null],
    nome: [null, Validators.required],
    codigo: [null],
    observacao: [null],
    flag: [null],
    item_a: [true],
    item_b: [true],
    quantidade: [null],
    //quantidade: [null, Validators.required],
    enumeracao: [null],
    dinheiro: [null],
    //dinheiro: [null, Validators.required],
    porcentagem: [null],
    imagem: [null],
    dia: [(new Date).toLocaleDateString("PT")],
    //dia: [(new Date).toLocaleDateString("PT"), [Validators.required]],
    horario: [null],
    data_completa: [null],
    value: [null],
    mestre_id: [null],
    //mestre_id: [null, Validators.required],
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

  // childInit(){
  //   if (!this.formulario.get('id').value){
  //     //this.formulario.disable();
  //     this.formulario.get('detalhes').disable();
  //   }
  // }

  onUploadFinished(file: FileHolder) {
    consoleLog(file);
  }

  onRemoved(file: FileHolder) {
    consoleLog(file);
  }

  onUploadStateChanged(state: boolean) {
    consoleLog(state);
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

/*
  id: [null],
  nome: [null],    //tf-text-simples     :string
  //nome: [null, Validators.required],    //tf-text-simples     :string
  codigo: [null],                       //tf-text-simples     :string
  observacao: [null],                   //tf-text-area        :string
  flag: [null],                         //tf-check-box        :boolean
  item_a: [true],                       //tf-check-list       :boolean
  item_b: [true],                       //tf-check-list       :boolean
  quantidade: [null],//tf-integer       :integer
  //quantidade: [null, Validators.required],//tf-integer       :integer
  enumeracao: [null],                   //tf-radio-button     :integer
  //dinheiro: [null],                     //tf-money            :float
  dinheiro: [null, Validators.required],                     //tf-money            :float
  porcentagem: [null],                  //tf-float            :float
  imagem: [null],                       //tf-upload-image     :
  dia: [(new Date).toLocaleDateString("PT")], //tf-date :datetime
  //dia: [(new Date).toLocaleDateString("PT"), [Validators.required]], //tf-date :datetime
  horario: [null],                      //tf-time             :datetime
  data_completa: [null],                //tf-datetime         :datetime
  value: [null],
  mestre_id: [null],                    //tf-select-simple
  //mestre_id: [null, Validators.required],                    //tf-select-simple
  detalhes_attributes: this.formBuilder.array([]),
  nprans_attributes: null
*/

}
