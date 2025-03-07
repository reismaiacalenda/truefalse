import { Validators, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../../_andaime/tf-forms/tf-form-base.component';
import { Observable, of } from 'rxjs';
import { Helpers } from '../../../../../../../helpers';
import { consoleLog } from '../../../../../../../globals';

@Component({
  selector: 'recurso-form',
  templateUrl:'recurso-form.component.html'
})
export class RecursoFormComponent extends TfFormBaseComponent  {
  incrementarDecrementar = true;
  quantidadeFlag = true;
  precoFlag = true;
  fornecedorFlag = true;
  vinculavelFlag = true;
  montarTelaPropriedade:any;
  public verificarCampos: Observable<any> = this.getCamposRecursos();
  entidade= "recursos";
  listDadosSelect = {
    'espacos': [],
    'grupos': [],
    'fiscais': [],
    'servicos': [],
    'modelos': []
  }

  formulario= this.formBuilder.group({
    id: [null],
    condicao: [null],
    custo: [null],
    espacos_attributes: this.prepararFormArraySelectMultiploSemRequired(),
    em_lote: [null],
    fiscal_id: [null],
    grupos_attributes: this.prepararFormArraySelectMultiploSemRequired(),
    imei: [null],
    imei2: [null],
    modelo_id: [null],
    modelo_precificacao: [null],
    nome: [null, Validators.required],
    numero_lote: [null],
    numero_serie: [null],
    preco: [null],
    quantidade_lote: [2],
    reservavel: [null],
    servico_id: [null, Validators.required],
    quantidade: [null]
  })

  aba1 = this.formBuilder.array([        
    this.formulario.get('servico_id'),
    this.formulario.get('em_lote'),
    this.formulario.get('quantidade_lote'),
  ])

  aba2 = this.formBuilder.array([
    this.formulario.get('nome'),
    this.formulario.get('numero_serie'),
    this.formulario.get('condicao'),
    this.formulario.get('modelo_id'),
    this.formulario.get('fiscal_id'),
    this.formulario.get('custo'),
    this.formulario.get('imei'),
    this.formulario.get('imei2')
  ])

  aba3 = this.formBuilder.array([
    this.formulario.get('reservavel'),  
    this.formulario.get('preco'),
    this.formulario.get('modelo_precificacao'),
    this.formulario.get('espacos_attributes'),
    this.formulario.get('grupos_attributes'),
    // this.formulario.get('fornecedor')
    // this.formulario.get('reservavel')
  ]);

  abas = [
        {"icon":"flaticon-user-settings", "formArray": this.aba1,},
        {"icon":"m-menu__link-icon fa flaticon-open-box", "formArray": this.aba2 },
        {"icon":"m-menu__link-icon fa flaticon-open-box", "formArray": this.aba3 },
    ];

    // "requisicaoTabulada": this.verificarCampos 
  
  childInit(){
    this.inscreverChangesServicoId();
  }

  inscreverChangesServicoId(){
    this.subscriptions.add(
      this.formulario.controls['servico_id'].valueChanges.subscribe(
        response=>{
          this.montarTelaPorServico();
          // if (this.formulario.get('id').value == undefined){
            // if (this.formulario.value['espaco_id'] != response && this.reservaModalService.flagNewSendoSetada == false){
            //   this.campoAlterado = 'espaco_id'
            //   this.inputsDeCalculo.next(response);
            // }
          // }
      })
    )
  }

  montarTelaPorServico(){
    //TODO: só chamar esse cara, se servico_id diferente de nule 
    Helpers.setLoading(true);
    if (this.formulario.get('servico_id').value == undefined){return;}
    this.webService.get(`recursos/${this.formulario.get('servico_id').value}/montar_tela`)
      .subscribe(
      (response) => {
        Helpers.setLoading(false);
        consoleLog(response)
        this.montarTelaPropriedade = response;
        consoleLog(this.formulario.get('servico_id').value)
        consoleLog(this.montarTelaPropriedade);
      },
      (error: any) => {
        Helpers.setLoading(false);
        consoleLog(this.formulario.get('servico_id').value)
        consoleLog("Erro:")
        consoleLog(error)
        this.modalService.tratarError(error);
        // observer.next(error);
        // observer.complete();
      },
      () => Helpers.setLoading(false))
  }

  // onSubmit() {
    // this.limparPropriedadesInuteis()
    // this.formulario.updateValueAndValidity();
    // if(this.modalAdicional == false){
    //   consoleLog("form service zuado né?")
    //   consoleLog(this.formService.entidade_nome);
    //   this.formService.save(this.listCarousel);
    // }else{
    //   this.activeModal.close(this.formulario);
    // }
  // }

  // limparPropriedadesInuteis(){
    // if (this.montarPropriedade.preco == false)
      //  this.fomrulario.preco.value = null

  // }

  getCamposRecursos(){
    return Observable.create(observer=>{
    Helpers.setLoading(true);
      this.webService.get(`recursos/${this.formulario.get('servico_id').value}/montar_tela`)
        .subscribe(
        (response) => {
          Helpers.setLoading(false);
          consoleLog(response)
          consoleLog(this.formulario.get('servico_id').value)
          // let formValueClone = Object.assign({}, this.formulario.value);
          // this.aba2.reset();

          // this.formulario.get('nome').enable();
          // this.formulario.get('nome').setValue(formValueClone.nome)   

          // if (response.quantidade){
          //   this.formulario.get('quantidade').enable();
          //   this.quantidadeFlag = true;
          //   if (formValueClone.quantidade){
          //     this.formulario.get('quantidade').setValue(formValueClone.quantidade)
          //   }else{
          //     this.formulario.get('quantidade').setValue(1);
          //   }
          //   this.incrementarDecrementar = true;
          // } else {
          //   // this.formulario.get('quantidade').
          //   // this.formulario.get('quantidade').disable({onlySelf: true, emitEvent: false});
          //   this.quantidadeFlag = false;
          //   this.formulario.get('quantidade').setValue(null);
          //   this.incrementarDecrementar = false;
          // }

          // if (response.preco){
          //   this.formulario.get('preco').enable();
          //   this.precoFlag = true;
          //   this.formulario.get('preco').setValue(formValueClone.preco)
          // } else {
          //   // this.formulario.get('preco').disable();
          //   this.precoFlag = false;
          //   this.formulario.get('preco').setValue(null)
          // }

          // if (response.fornecedor){
          //   this.formulario.get('fornecedor').enable();
          //   this.fornecedorFlag = true;
          //   this.formulario.get('fornecedor').setValue(formValueClone.fornecedor)
          // } else {
          //   // this.formulario.get('fornecedor').disable();
          //   this.fornecedorFlag = false;
          //   this.formulario.get('fornecedor').setValue(null)
          // }

          // if (response.vinculavel_espaco){
          //   // this.formulario.get('')
          //   this.vinculavelFlag = true;
          // }else{
          //   this.vinculavelFlag = false;
          // }
          // if (response.reservavel){
          //   this.formulario.get('reservavel').enable();
          //   this.formulario.get('reservavel').setValue(formValueClone.reservavel)
          // } else {
          //   this.formulario.get('reservavel').disable();
          //   this.formulario.get('reservavel').setValue(null)
          // }
          // this.aba2.patchValue(aba2Clone);
          // consoleLog("termino tratamnto")
          // consoleLog(this.formulario.value);
          // this.aba2.markAsUntouched();
          // this.aba2.markAsPristine();
          // // this.formulario.patchValue(formValueClone);
          // observer.next(this.formulario.value);
          // observer.complete();
        },
        (error: any) => {
          Helpers.setLoading(false);
          consoleLog(this.formulario.get('servico_id').value)
          consoleLog("Erro:")
          consoleLog(error)
          this.modalService.tratarError(error);
          observer.next(error);
          observer.complete();
        },
        () => Helpers.setLoading(false))
    })
  }

}