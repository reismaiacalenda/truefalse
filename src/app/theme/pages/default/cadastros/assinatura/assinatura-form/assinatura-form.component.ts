import { Validators, FormArray } from '@angular/forms';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';
import { Observable, Subject } from 'rxjs';
import { Helpers } from '../../../../../../helpers';
// import { ValidateEspacoSaldosUnico } from '../../../../../../_andaime/tf-validators/espacos_saldos.validators';
import { consoleLog } from '../../../../../../globals';

@Component({
  selector: 'assinatura-form',
  templateUrl: 'assinatura-form.component.html'
})
// changeDetection: ChangeDetectionStrategy.OnPush

export class AssinaturaFormComponent extends TfFormBaseComponent {
  entidade="assinaturas";
  listDadosSelect = {
		'empresas': [],
		'planos': [],
		'espacos': []
  }
  notificarDataEspacoSelect:Subject<any> = new Subject<any>();

  formulario = this.formBuilder.group({
    id: [null],
    empresa_id: [null],
    vigencia_inicio: [(new Date).toLocaleDateString("PT"), Validators.required], //tf-datetime         :datetime
    vigencia_fim: [null],                         //tf-datetime         :datetime
    intervalo_fatura: [1,Validators.required],                     //tf-radio-button     :integer
    renovacao_automatica: [null],                 //tf-check-box        :boolean
    plano_id: [null],
    nome_plano: [null],                                 //tf-text-simples     :string
    preco_plano: [null],                                //tf-money            :float
    duracao_plano: [4,Validators.required],                              //tf-radio-button     :integer
    vencimento_fatura: [null, [Validators.min(1), Validators.max(28)]],                    //tf-integer          :integer
    descricao_plano: [null],                            //tf-text-simples     :string
    saldos_attributes: this.initFormArrayName('saldos_attributes'),
  }); //, ValidateEspacoSaldosUnico

  aba1 = this.formBuilder.array([
    this.formulario.controls['empresa_id'],
    this.formulario.controls['vigencia_inicio'],
    this.formulario.controls['vigencia_fim'],
    this.formulario.controls['intervalo_fatura'],
    this.formulario.controls['renovacao_automatica']
  ])
  aba2 = this.formBuilder.array([
    this.formulario.controls['plano_id'],
    this.formulario.controls['nome_plano'],
    this.formulario.controls['preco_plano'],
    this.formulario.controls['duracao_plano'],
    this.formulario.controls['vencimento_fatura'],
    this.formulario.controls['descricao_plano']
  ])
  aba3 = this.formBuilder.array([
    this.formulario.controls['saldos_attributes']
  ])
  abas=[
    {"icon":"flaticon-add", "formArray": this.aba1},
    {"icon":"flaticon-map-location", "formArray": this.aba2},
    {"icon":"flaticon-time", "formArray": this.aba3}
  ];

  recuperarPlanoSelecionado(){
    Helpers.setLoading(true);
      this.webService.get(`planos/${this.formulario.get('plano_id').value}`)
      .subscribe(
        (response:any) => {
          consoleLog(response.nome)
          this.formulario.patchValue({
            nome_plano: response.nome,
            preco_plano: response.preco,
            duracao_plano: response.duracao,
            descricao_plano: response.descricao,
          });

          // this.formulario.get('nome_plano').patchValue(response.nome);
          // this.formulario.get('preco_plano').patchValue(response.preco);
          consoleLog(this.formulario.get('nome_plano').value)
          consoleLog(this.formulario.value.nome_plano)
          this.formulario.updateValueAndValidity();
          consoleLog(this.formulario.value.nome_plano)
          // this.formulario.get('preco_plano').setValue(response.preco)
          // this.formulario.get('duracao_plano').setValue(response.duracao)
          // this.formulario.get('descricao_plano').setValue(response.descricao)

          // this.formulario.setValue({})
          Helpers.setLoading(false);
      },
      // (error: any) => this.modalService.tratarError(error)
      );
  }

  initItemRows(){
    return this.formBuilder.group({
      plano_horas: [null, Validators.required],
      espacos_attributes: this.formBuilder.array([])
    })
  }

  childInit(){
  }

  limparCampo(){

    if (this.formulario.get('duracao_plano').value == 'Quinzenal' || this.formulario.get('duracao_plano').value == 'Mensal')
    {
      this.formulario.get('vencimento_fatura').setValue(null);
      // this.formulario.controls['nome_plano'].enable()
      return false
    }else{
      // this.formulario.disable();
      // this.formulario.controls['nome_plano'].disable()
      return true;
    }
  }

  // iniciarValor(){
  //   this.formulario.get('vencimento_fatura').setValue;
  // }

//   {
//     "assinaturas": [
//         {
//             "id": 25,
//             "vigencia_inicio": "08-10-2019",/
//             "vigencia_fim": "07-11-2019",/
//             "intervalo_fatura": "mes",/
//             "renovacao_automatica": true,/
//             "empresa_id": 120,/
//             "nome_plano": "Estação Dedicada",
//             "descricao_plano": "Armário Privado; Água e café; Espaço de Convivência; Espacos de Reuniões; Acesso cadeirante; WIFI; 4 horas (mês) Serviços de Recepção",
//             "preco_plano": 600,
//             "horas_plano": 60,
//             "duracao_plano": "mensal",
//             "postos_trabalho_plano": 2,
//             "saldo_attributes": [
//                 {
//                     "plano_horas": 20,
//                     "espacos_attributes": [
//                         { id: 3, _destroy: true}
//                         2,
//                         3
//                     ]
//                 },
//                 {
//                     "plano_horas": 10,
//                     "espaco_ids": [
//                         4,
//                         5
//                     ]
//                 }
//             ]
//         }
//     ]
// }
//
  //initFormaArr
  // plano horas
  // espaco_attributes = this.formBuilder.array([])
  // initialize(){
  // [Validators.required, Validators.maxLength(8), Validators.minLength(8)]
  //
  // nome: [null],
  // porcentagem: [null]                   //tf-float            :float
  // this.superInitialize("assinaturas", ["empresas"]);
  // }

  removerEspacoSelecionadaDoSelect(event){
    // if (!this.listEspacosBackup){
    //   this.listEspacosBackup = this.listDadosSelect['espacos'].slice();
    // // }
    // consoleLog("evento:");
    // consoleLog(event);
    // consoleLog("list entidades:");
    // consoleLog(this.listDadosSelect['espacos']);
    // if (event && event.value && event.value[0]){
    //   consoleLog("entrou no primeiro if:");
    //   var index;
    //   this.listDadosSelect['espacos'].forEach((espaco, i)=>{
    //     if (espaco.id == event.value[0]){
    //       consoleLog("index:"+i);
    //       index = i;
    //     }
    //   })
    //   if (index){
    //     consoleLog("slice:");
    //     this.listDadosSelect['espacos'].splice(index, 1);
    //   }
    // }
    // this.notificarDataEspacoSelect.next(this.listDadosSelect['espacos']);
    // consoleLog(this.listDadosSelect['espacos']);

    // (this.formulario.get('saldos_attributes') as FormArray).controls.forEach(element => {


    // });
  }

}
