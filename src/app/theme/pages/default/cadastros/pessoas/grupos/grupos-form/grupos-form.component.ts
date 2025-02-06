import { Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../../_andaime/tf-forms/tf-form-base.component';
import { ValidateEmailSelectMulti, isValidEmail } from '../../../../../../../_andaime/tf-validators/email.validators';
import { Select2OptionData } from 'ng-select2';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap, delay, map } from 'rxjs/operators';
import { Helpers } from '../../../../../../../helpers';
import { FormService } from '../../../../../../../_services/form.service';
import { consoleLog } from '../../../../../../../globals';

@Component({
  selector: 'grupos-form',
  templateUrl: 'grupos-form.component.html'
})
export class GruposFormComponent extends TfFormBaseComponent {

  public dadosSelect:Observable<Array<Select2OptionData>>;

  entidade = "grupos"
  listDadosSelect = {
    'servicos':[]
    // 'filtros':[]
  }
  funcao_clicada_atual: string = null;

  formulario = this.formBuilder.group({
    id: [null],
    nome: [null, Validators.required],
    funcionario_emails: [null],
    exibir_para_master: [false],
    funcionarios_attributes: [],
    servicos_attributes: this.prepararFormArraySelectMultiploSemRequired(),
    // filtros_attributes: this.prepararFormArraySelectMultiploSemRequired(),
    reserva_evento_visualizar_meu: [false],
    reserva_evento_visualizar_grupo: [false],
    reserva_evento_visualizar_unidade: [false],
    reserva_evento_criar_meu: [false],
    reserva_evento_criar_grupo: [false],
    reserva_evento_criar_unidade: [false],
    reserva_evento_editar_meu: [false],
    reserva_evento_editar_grupo: [false],
    reserva_evento_editar_unidade: [false],
    reserva_evento_excluir_meu: [false],
    reserva_evento_excluir_grupo: [false],
    reserva_evento_excluir_unidade: [false],
    reserva_evento_iniciar_meu: [false],
    reserva_evento_iniciar_grupo: [false],
    reserva_evento_iniciar_unidade: [false],
    reserva_evento_encerrar_meu: [false],
    reserva_evento_encerrar_grupo: [false],
    reserva_evento_encerrar_unidade: [false],
    reserva_evento_alocar_meu: [false],
    reserva_evento_alocar_grupo: [false],
    reserva_evento_alocar_unidade: [false],
    reserva_evento_recolher_meu: [false],
    reserva_evento_recolher_grupo: [false],
    reserva_evento_recolher_unidade: [false],
    reserva_evento_servir_meu: [false],
    reserva_evento_servir_grupo: [false],
    reserva_evento_servir_unidade: [false],
    reserva_emprestimo_visualizar_meu: [false],
    reserva_emprestimo_visualizar_grupo: [false],
    reserva_emprestimo_visualizar_unidade: [false],
    reserva_emprestimo_criar_meu: [false],
    reserva_emprestimo_criar_grupo: [false],
    reserva_emprestimo_criar_unidade: [false],
    reserva_emprestimo_editar_meu: [false],
    reserva_emprestimo_editar_grupo: [false],
    reserva_emprestimo_editar_unidade: [false],
    reserva_emprestimo_excluir_meu: [false],
    reserva_emprestimo_excluir_grupo: [false],
    reserva_emprestimo_excluir_unidade: [false],
    reserva_emprestimo_emprestar_meu: [false],
    reserva_emprestimo_emprestar_grupo: [false],
    reserva_emprestimo_emprestar_unidade: [false],
    reserva_emprestimo_devolver_meu: [false],
    reserva_emprestimo_devolver_grupo: [false],
    reserva_emprestimo_devolver_unidade: [false],
    reserva_instalacao_visualizar_meu: [false],
    reserva_instalacao_visualizar_grupo: [false],
    reserva_instalacao_visualizar_unidade: [false],
    reserva_instalacao_criar_meu: [false],
    reserva_instalacao_criar_grupo: [false],
    reserva_instalacao_criar_unidade: [false],
    reserva_instalacao_editar_meu: [false],
    reserva_instalacao_editar_grupo: [false],
    reserva_instalacao_editar_unidade: [false],
    reserva_instalacao_excluir_meu: [false],
    reserva_instalacao_excluir_grupo: [false],
    reserva_instalacao_excluir_unidade: [false],
    reserva_instalacao_instalar_meu: [false],
    reserva_instalacao_instalar_grupo: [false],
    reserva_instalacao_instalar_unidade: [false],
    reserva_instalacao_desinstalar_meu: [false],
    reserva_instalacao_desinstalar_grupo: [false],
    reserva_instalacao_desinstalar_unidade: [false],
    reserva_posto_de_trabalho_visualizar_meu: [false],
    reserva_posto_de_trabalho_visualizar_grupo: [false],
    reserva_posto_de_trabalho_visualizar_unidade: [false],
    reserva_posto_de_trabalho_criar_meu: [false],
    reserva_posto_de_trabalho_criar_grupo: [false],
    reserva_posto_de_trabalho_criar_unidade: [false],
    reserva_posto_de_trabalho_editar_meu: [false],
    reserva_posto_de_trabalho_editar_grupo: [false],
    reserva_posto_de_trabalho_editar_unidade: [false],
    reserva_posto_de_trabalho_excluir_meu: [false],
    reserva_posto_de_trabalho_excluir_grupo: [false],
    reserva_posto_de_trabalho_excluir_unidade: [false],
    reserva_posto_de_trabalho_definir_meu: [false],
    reserva_posto_de_trabalho_definir_grupo: [false],
    reserva_posto_de_trabalho_definir_unidade: [false],
    reserva_posto_de_trabalho_desvincular_meu: [false],
    reserva_posto_de_trabalho_desvincular_grupo: [false],
    reserva_posto_de_trabalho_desvincular_unidade: [false],
    reserva_estacao_flexivel_visualizar_meu: [false],
    reserva_estacao_flexivel_visualizar_grupo: [false],
    reserva_estacao_flexivel_visualizar_unidade: [false],
    reserva_estacao_flexivel_criar_meu: [false],
    reserva_estacao_flexivel_criar_grupo: [false],
    reserva_estacao_flexivel_criar_unidade: [false],
    reserva_estacao_flexivel_editar_meu: [false],
    reserva_estacao_flexivel_editar_grupo: [false],
    reserva_estacao_flexivel_editar_unidade: [false],
    reserva_estacao_flexivel_excluir_meu: [false],
    reserva_estacao_flexivel_excluir_grupo: [false],
    reserva_estacao_flexivel_excluir_unidade: [false],
    reserva_estacao_flexivel_iniciar_meu: [false],
    reserva_estacao_flexivel_iniciar_grupo: [false],
    reserva_estacao_flexivel_iniciar_unidade: [false],
    reserva_estacao_flexivel_encerrar_meu: [false],
    reserva_estacao_flexivel_encerrar_grupo: [false],
    reserva_estacao_flexivel_encerrar_unidade: [false],
    reserva_equipagem_visualizar_meu: [false],
    reserva_equipagem_visualizar_grupo: [false],
    reserva_equipagem_visualizar_unidade: [false],
    reserva_equipagem_criar_meu: [false],
    reserva_equipagem_criar_grupo: [false],
    reserva_equipagem_criar_unidade: [false],
    reserva_equipagem_editar_meu: [false],
    reserva_equipagem_editar_grupo: [false],
    reserva_equipagem_editar_unidade: [false],
    reserva_equipagem_excluir_meu: [false],
    reserva_equipagem_excluir_grupo: [false],
    reserva_equipagem_excluir_unidade: [false],
    reserva_equipagem_equipar_meu: [false],
    reserva_equipagem_equipar_grupo: [false],
    reserva_equipagem_equipar_unidade: [false],
    reserva_equipagem_desequipar_meu: [false],
    reserva_equipagem_desequipar_grupo: [false],
    reserva_equipagem_desequipar_unidade: [false],
    reserva_kit_estandes_visualizar_meu: [false],
    reserva_kit_estandes_visualizar_grupo: [false],
    reserva_kit_estandes_visualizar_unidade: [false],
    reserva_kit_estandes_criar_meu: [false],
    reserva_kit_estandes_criar_grupo: [false],
    reserva_kit_estandes_criar_unidade: [false],
    reserva_kit_estandes_editar_meu: [false],
    reserva_kit_estandes_editar_grupo: [false],
    reserva_kit_estandes_editar_unidade: [false],
    reserva_kit_estandes_excluir_meu: [false],
    reserva_kit_estandes_excluir_grupo: [false],
    reserva_kit_estandes_excluir_unidade: [false],
    reserva_kit_estandes_montar_meu: [false],
    reserva_kit_estandes_montar_grupo: [false],
    reserva_kit_estandes_montar_unidade: [false],
    reserva_kit_estandes_desmontar_meu: [false],
    reserva_kit_estandes_desmontar_grupo: [false],
    reserva_kit_estandes_desmontar_unidade: [false],
    reserva_estacionamento_visualizar_meu: [false],
    reserva_estacionamento_visualizar_grupo: [false],
    reserva_estacionamento_visualizar_unidade: [false],
    reserva_estacionamento_criar_meu: [false],
    reserva_estacionamento_criar_grupo: [false],
    reserva_estacionamento_criar_unidade: [false],
    reserva_estacionamento_editar_meu: [false],
    reserva_estacionamento_editar_grupo: [false],
    reserva_estacionamento_editar_unidade: [false],
    reserva_estacionamento_excluir_meu: [false],
    reserva_estacionamento_excluir_grupo: [false],
    reserva_estacionamento_excluir_unidade: [false],
    reserva_estacionamento_iniciar_meu: [false],
    reserva_estacionamento_iniciar_grupo: [false],
    reserva_estacionamento_iniciar_unidade: [false],
    reserva_estacionamento_encerrar_meu: [false],
    reserva_estacionamento_encerrar_grupo: [false],
    reserva_estacionamento_encerrar_unidade: [false],
    reserva_estacionamento_recorrencia: [false],
    reserva_fretado_visualizar_meu: [false],
    reserva_fretado_visualizar_grupo: [false],
    reserva_fretado_visualizar_unidade: [false],
    reserva_fretado_criar_meu: [false],
    reserva_fretado_criar_grupo: [false],
    reserva_fretado_criar_unidade: [false],
    reserva_fretado_editar_meu: [false],
    reserva_fretado_editar_grupo: [false],
    reserva_fretado_editar_unidade: [false],
    reserva_fretado_excluir_meu: [false],
    reserva_fretado_excluir_grupo: [false],
    reserva_fretado_excluir_unidade: [false],
    reserva_fretado_iniciar_meu: [false],
    reserva_fretado_iniciar_grupo: [false],
    reserva_fretado_iniciar_unidade: [false],
    reserva_fretado_encerrar_meu: [false],
    reserva_fretado_encerrar_grupo: [false],
    reserva_fretado_encerrar_unidade: [false],
    reserva_fretado_recorrencia: [false],
    reserva_desconto_grupo: [false],
    reserva_desconto_unidade: [false],
    reserva_gastos_meu: [false],
    reserva_gastos_grupo: [false],
    reserva_gastos_unidade: [false],
    reserva_vinculavel_unidade: [false],
    listagem_menu: [false],
    quadro_espaco_menu: [false],
    quadro_pessoa_menu: [false],
    quadro_recurso_menu: [false],
    recursos_alocados_menu: [false],
    customizacoes_menu: [false],
    campo_customizado_visualizar: [false],
    campo_customizado_criar: [false],
    campo_customizado_editar: [false],
    campo_customizado_excluir: [false],
    predefinido_editar: [false],
    parametro_editar: [false],
    regra_visualizar: [false],
    regra_criar: [false],
    regra_editar: [false],
    regra_excluir: [false],
    filtro_visualizar: [false],
    filtro_criar_meu: [false],
    filtro_criar_grupo: [false],
    filtro_criar_unidade: [false],
    filtro_editar_meu: [false],
    filtro_editar_grupo: [false],
    filtro_editar_unidade: [false],
    filtro_excluir_meu: [false],
    filtro_excluir_grupo: [false],
    filtro_excluir_unidade: [false],
    monitoramento_menu: [false],
    pessoas_menu: [false],
    pessoa_visualizar_meu: [false],
    pessoa_visualizar_grupo: [false],
    pessoa_visualizar_unidade: [false],
    pessoa_criar: [false],
    pessoa_editar_meu: [false],
    pessoa_editar_grupo: [false],
    pessoa_editar_unidade: [false],
    pessoa_excluir: [false],
    pessoa_convidar: [false],
    pessoa_ativar: [false],
    pessoa_integrar: [false],
    grupo_visualizar: [false],
    grupo_criar: [false],
    grupo_editar: [false],
    grupo_excluir: [false],
    espacos_menu: [false],
    espaco_visualizar: [false],
    espaco_criar: [false],
    espaco_editar: [false],
    espaco_excluir: [false],
    espaco_bloquear: [false],
    // espaco_abrir_fechar: [false],
    tipo_espaco_visualizar: [false],
    tipo_espaco_sala_criar: [false],
    tipo_espaco_sala_editar: [false],
    tipo_espaco_estacao_de_trabalho_criar: [false],
    tipo_espaco_estacao_de_trabalho_editar: [false],
    tipo_espaco_estacionamento_criar: [false],
    tipo_espaco_estacionamento_editar: [false],
    tipo_espaco_fretado_criar: [false],
    tipo_espaco_fretado_editar: [false],
    tipo_espaco_excluir: [false],
    localizacao_visualizar: [false],
    localizacao_criar: [false],
    localizacao_editar: [false],
    localizacao_excluir: [false],
    servico_visualizar: [false],
    servico_criar: [false],
    servico_editar: [false],
    servico_excluir: [false],
    modelo_visualizar: [false],
    modelo_criar: [false],
    modelo_editar: [false],
    modelo_excluir: [false],
    fiscal_visualizar: [false],
    fiscal_criar: [false],
    fiscal_editar: [false],
    fiscal_excluir: [false],
    recursos_menu: [false],
    recurso_visualizar_grupo: [false],
    recurso_visualizar_unidade: [false],
    recurso_criar_grupo: [false],
    recurso_criar_unidade: [false],
    recurso_editar_grupo: [false],
    recurso_editar_unidade: [false],
    recurso_excluir_grupo: [false],
    recurso_excluir_unidade: [false],
    gerar_qrcode: [false],
    workspace_menu: [false],
    unidade_visualizar: [false],
    unidade_criar: [false],
    unidade_editar: [false],
    unidade_excluir: [false],
    instituicao_visualizar: [false],
    instituicao_criar: [false],
    instituicao_editar: [false],
    instituicao_excluir: [false],
    cliente_visualizar: [false],
    cliente_criar: [false],
    cliente_editar: [false],
    cliente_excluir: [false],
    aprovador_visualizar: [false],
    aprovador_criar: [false],
    aprovador_editar: [false],
    aprovador_excluir: [false],
    outro_menu: [false],
    relatorio_menu: [false],
    display_visualizar: [false],
    display_criar: [false],
    display_editar: [false],
    display_excluir: [false],
    layout_visualizar: [false],
    layout_criar: [false],
    layout_editar: [false],
    layout_excluir: [false],
    painel_visualizar: [false],
    painel_criar: [false],
    painel_editar: [false],
    painel_excluir: [false],
    template_menu: [false],
    integracao_menu: [false],
    integracao_criar: [false],
    integracao_excluir: [false],
    calendario_menu: [false],
    calendario_visualizar_espacos: [false],
    calendario_visualizar_pessoas: [false],
    calendario_visualizar_recursos: [false],
    reserva_evento_reservar_espaco: [false],
    reserva_evento_recorrencia: [false],
    reserva_emprestimo_recorrencia: [false],
    reserva_estacao_flexivel_recorrencia: [false],
    reserva_evento_solicitar_recurso: [false],
    reserva_estacao_flexivel_solicitar_recurso: [false],
    pessoa_em_home_office: [false],
    mapa_interativo: [false],
    cabecalho_debug: [false]

    // [{"funcionario_id": 80, "nome": "zem", "name": "zem@calenda.com"}]
    // funcionarios_attributes: this.prepararFormArraySelectMultiploSemRequired()
  })

  aba1 = this.formBuilder.array([
    this.formulario.controls['nome'],
    this.formulario.controls['funcionario_emails']
  ])
  aba2 = this.formBuilder.array([
  ])
  aba3 = this.formBuilder.array([
  ])
  aba4 = this.formBuilder.array([
  ])
  
  abas = [
    { "icon": "flaticon-add", "formArray": this.aba1, },
    { "icon": "flaticon-network", "formArray": this.aba2, },
    { "icon": "flaticon-interface-2", "formArray": this.aba3, },
    { "icon": "flaticon-interface-1", "formArray": this.aba4, }
  ];

  childInit(){
    this.chamarNew();
    this.loadPeople();
  }
  
  radio(name){
    if(this.funcao_clicada_atual == name){
      this.formulario.get(name).setValue(this.formulario.get(name).value);
      return;
    }else{
      this.funcao_clicada_atual = name;
    }
    var i = name.lastIndexOf('_');
    var radical = name.substr(0, i);
    var sufixo = name.substr(i);    
    var valorDestino:boolean = this.formulario.get(name).value;
    var inverso:boolean = false;
    if (valorDestino == false){
      this.formulario.get(name).setValue(true);
      inverso = false;
    }    
    if (sufixo != "_meu" && this.formulario.get(`${radical}_meu`) != undefined){
      this.formulario.get(`${radical}_meu`).setValue(false)
    }
    if (sufixo != "_grupo" && this.formulario.get(`${radical}_grupo`) != undefined){
      this.formulario.get(`${radical}_grupo`).setValue(false)
    }
    if (sufixo != "_unidade" && this.formulario.get(`${radical}_unidade`) != undefined){
      this.formulario.get(`${radical}_unidade`).setValue(false)
    }
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

  chamarNew(){
    Helpers.setLoading(true);
    var body = {
    }
    consoleLog("rowId");
    consoleLog(this.rowId);
    if (this.rowId == null){
      this.webService.get(`grupos/new`, body)
        .subscribe(
          dados => {
            consoleLog("Resposta da new")
            consoleLog(dados)
            FormService.patchValueWithFormArray(this.formulario, dados)
            Helpers.setLoading(false);
          },
          (error: any) => {
            this.modalService.tratarError(error);
            Helpers.setLoading(false);
          }
        )
    }
  }

  ngAfterViewInit(): void {
    this.renderer.addClass(this.element.nativeElement.parentElement, 'animated-50')
    this.renderer.addClass(this.element.nativeElement.parentElement, 'fadeIn');
    // $('.ng-select.ng-select-multiple .ng-select-container')[0].style['min-height'] = '96px';
    $('.ng-select.ng-select-multiple .ng-select-container')[0].style['min-height'] = '288px';
    $('.ng-select.ng-select-multiple .ng-select-container .ng-value-container')[0].style['margin-top'] = '50px'
  }
}

// o if abaixo é para automatizar o tamanho da margin-top, mas não foi possível pegar a quantidade de elementos pois o this.formulario.get('funcionario_emails').value está vindo nulo não sei porque

// var elementsCount = $('.ng-value-container')[0].offsetHeight
// console.log(this.formulario.get('funcionario_emails'));
// console.log(this.formulario.get('funcionario_emails').value);
// var firstElementsByLine = 4
// console.log(elementsCount/firstElementsByLine);
// if (elementsCount <= firstElementsByLine){
//   var px = '50px'
// }else{
//   var probaleLines = elementsCount/firstElementsByLine
//   if (probaleLines <= firstElementsByLine){ 
//     px = '50px'
//   }else if(probaleLines <= 7){
//     px = '100px'
//   }else if(probaleLines <= 9){
//     px = '150px'
//   }else if(probaleLines <= 11){
//     px = '200px'
//   }else if(probaleLines <= 13){
//     px = '250px'
//   }else if(probaleLines <= 15){
//     px = '300px'
//   }else if(probaleLines <= 17){
//     px = '350px'
//   }else if(probaleLines <= 19){
//     px = '400px'
//   }else if(probaleLines <= 21){
//     px = '450px'
//   }else if(probaleLines <= 23){
//     px = '500px'
//   }else if(probaleLines <= 25){
//     px = '550px'
//   }
// }

// o padrão do else if segue abaixo, mas não consegui automatizar
// 8-7 = 1 --- 150 somar mais 2
// 9-7 = 2 --- 150 somar mais 1

// 10-7 = 3 --- 200 somar mais 1
// 11-7 = 4 --- 200 ele mesmo

// 12-7 = 5 --- 250 ele mesmo
// 13-7 = 6 --- 250 subtrair 1

// 14-7 = 7 --- 300 subtrair 1
// 15-7 = 8 --- 300 subtrair 2

// 16-7 = 9 --- 350 subtrair 2
// 17-7 = 10 --- 350 subtrair 3