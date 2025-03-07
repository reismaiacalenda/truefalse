import { Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';
import { Helpers } from '../../../../../../helpers';
import { style } from '@angular/animations';
import { consoleLog } from '../../../../../../globals';
import { FormService } from '../../../../../../_services/form.service';
import { TfFormAbasComponent } from '../../../../../../_andaime/tf-forms/tf-form-abas/tf-form-abas.component';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap, delay, map } from 'rxjs/operators';
import { ValidateEmailSelectMulti } from '../../../../../../_andaime/tf-validators/email.validators';

@Component({
  selector: 'regra-form',
  templateUrl:'regra-form.component.html'
})
export class RegraFormComponent extends TfFormBaseComponent  {

  @ViewChild('selectTipos', {static: false}) public selectTipos: ElementRef;
  @ViewChild(TfFormAbasComponent, {static: false}) tfFormAbas:TfFormAbasComponent; 

  style;
  botaoAdd= false;

  entidade= "regras"
  listDadosSelect = {
    'unidades': [],
    'espacos': [],
    'grupos':[]
  }

  formulario= this.formBuilder.group({
    id: [null],
    emprestimos: [null],
    equipagens: [null],
    eventos: [null],
    instalacoes: [null],
    postos_de_trabalho: [null],
    estacoes_flexiveis: [null],
    kit_estandes: [null],
    estacionamentos: [null],
    fretados: [null],
    prioridade: [null],
    entidades_selecionadas: this.prepararFormArraySelectMultiploSemRequired(),
    sentencas_attributes: this.initFormArrayName('sentencas_attributes'),
    mensagem: [null]
  })

  aba1 = this.formBuilder.array([        
    this.formulario.get('entidade'),
    this.formulario.controls['entidades_selecionadas'],
  ])
  aba2 = this.formBuilder.array([      
    this.formulario.controls['sentencas_attributes'],
  ])
  aba3 = this.formBuilder.array([      
    this.formulario.controls['mensagem'],
  ])
  
  abas = [
    {"icon":"flaticon-map", "formArray": this.aba1, },
    {"icon":"flaticon-list-1", "formArray": this.aba2, },
    {"icon":"flaticon-add", "formArray": this.aba3, }
    ];

  initItemRows(){
    return this.formBuilder.group({
      acao: [null],
      atributo: [null],
      operador: [null],
      simbolo: [null],
      campo: [null],
      condicional: this.formBuilder.group({
        categoria: [null],
        multiplo: this.prepararFormArraySelectMultiplo([Validators.required]),
        simples: [null],
        data: [null],
        hora: ['00:00'],
        as: [false],
        data_inicio: [null],
        data_fim: [null],
        numero: [null],
        periodo: [null],
        email: [null]
      }),
      customizado: [null],
      operador_logico_prox_item: [null]
    })
  }

  childInit(){
    consoleLog("child init")
    this.montarArvoreAPI();
    this.listTipoEspacos();
    this.listLocalizacoes();
    this.listRecursos();
    this.listServicos();
    this.listTipoServicos();
    // this.listGrupos()
    this.listCategorias()
    this.listDias();
    this.listMeses();
    this.listPeriodos();
    this.listTempos();
    this.listDataRegra();
    this.listTipoCapacidade();
    this.formulario.get('entidade');
    consoleLog("Formulário:");
    consoleLog(this.formulario);
    this.loadPeople();
    }


  montarArvoreAPI() {
    this.webService.get(`regras/arvore`)
    .subscribe(dados => {
      consoleLog("Dados do subscribe:")
      consoleLog(dados)
      this.arvore = (<any>dados)
      consoleLog("Árvore:")
      consoleLog(this.arvore)
      this.initItemRows();
      this.addNewRow();
    });
  }
  arvore: any;

  montarSelectAcoes(){
    var arrayDataSelect:any[]=[];
    Object.keys(this.arvore.acoes).forEach(acao => {
      var itemSelect = {
        id: acao,
        text: this.arvore.acoes[acao].text
      }
      arrayDataSelect.push(itemSelect)
    });
    return arrayDataSelect;
  }

  montarSelectAtributos(itemrow:FormGroup){
    var arrayDataSelect:any[]=[];
    var arrayDataSelectCamposPreDefinidos:any[]=[];
    var arrayDataSelectCamposCustomizados:any[]=[];
    Object.keys(this.arvore.acoes[itemrow.get('acao').value].atributos).forEach(atributo => {
    // consoleLog(atributo)
      var itemSelect = {
        id: atributo,
        text: this.arvore.acoes[itemrow.get('acao').value].atributos[atributo].text
      }
      if (this.arvore.acoes[itemrow.get('acao').value].atributos[atributo].customizado != undefined &&
      this.arvore.acoes[itemrow.get('acao').value].atributos[atributo].customizado == true){
        arrayDataSelectCamposCustomizados.push(itemSelect);
      }else{
        arrayDataSelectCamposPreDefinidos.push(itemSelect)
      }
    });

    arrayDataSelect.push({
      id: -1,
      text: "Campos pré-definidos",
      children: arrayDataSelectCamposPreDefinidos
    });

    if (arrayDataSelectCamposCustomizados != []){
      arrayDataSelect.push({
        id: -2,
        text: "Campos customizados",
        children: arrayDataSelectCamposCustomizados
      });
    }

    return arrayDataSelect;
  }

  montarSelectOperadores(itemrow:FormGroup){
    var arrayDataSelect:any[]=[];
    Object.keys(this.arvore.acoes[itemrow.get('acao').value].atributos[itemrow.get('atributo').value].operadores).forEach(operador => {
      var itemSelect = {
        id: operador,
        text: this.arvore.acoes[itemrow.get('acao').value].atributos[itemrow.get('atributo').value].operadores[operador].text,
      }
      arrayDataSelect.push(itemSelect)
    });
    return arrayDataSelect;
  }

  definirSimboloECampo(itemrow:FormGroup){
    consoleLog("definir simbol")
    consoleLog(itemrow);
    consoleLog(this.arvore);
    let operador = this.arvore
      .acoes[itemrow.get('acao').value]
      .atributos[itemrow.get('atributo').value]
      .operadores[itemrow.get('operador').value]
    consoleLog(operador);
    itemrow.get('simbolo').setValue(operador.simbolo);
    itemrow.get('campo').setValue(operador.campo);

    if (this.arvore.acoes[itemrow.get('acao').value].atributos[itemrow.get('atributo').value].customizado != undefined &&
    this.arvore.acoes[itemrow.get('acao').value].atributos[itemrow.get('atributo').value].customizado == true){
      itemrow.get('customizado').setValue(true);
    }else{
      itemrow.get('customizado').setValue(false);
    }
  }

  descobrirCondicional(itemrow:FormGroup){
    var categoria;
    if(this.rowId == null){
      categoria = this.arvore
      .acoes[itemrow.get('acao').value]
      .atributos[itemrow.get('atributo').value]
      .operadores[itemrow.get('operador').value]
      .condicional
      .categoria;
      consoleLog("catoegira do descobrir docnidonal")
      consoleLog(categoria);
      itemrow.get('condicional').patchValue({'categoria': categoria})      
    }else{
      var valueCondicionalBackup = itemrow.value.condicional;
      categoria = valueCondicionalBackup.categoria
      if (itemrow.get('condicional') instanceof FormControl){
        if (categoria == "multiplo"){
          consoleLog("como está o item row, antes de mais nada:")
          consoleLog(itemrow) ;

          var novoCondicional = this.formBuilder.group({
            categoria: ["multiplo"],
            multiplo: this.formBuilder.array([]),
            simples: [null],
            data: [null],
            data_inicio: [null],
            data_fim: [null],
            hora: ['00:00'],  
            as: [false],
            numero: [null],
            periodo: [null],
            multiplo_customizado_text: [null]
          });

          itemrow.controls['condicional'] = novoCondicional;

          FormService.patchValueWithFormArray(itemrow.get('condicional'), valueCondicionalBackup);
        }else{
          itemrow.removeControl('condicional');

          var novoCondicional = this.formBuilder.group({
            categoria: [null],
            multiplo: [null],
            simples: [null],
            data: [null],
            data_inicio: [null],
            data_fim: [null],
            hora: ['00:00'],  
            as: [false],
            numero: [null],
            periodo: [null],
            multiplo_customizado_text: [null]
          });

          novoCondicional.patchValue(valueCondicionalBackup);

          itemrow.addControl('condicional', novoCondicional);
        }
      } 
    }
    return categoria;
  }

  atualizarCondicional(index){
    (this.formulario.get('sentencas_attributes') as FormArray).at(index).updateValueAndValidity()
    this.formulario.updateValueAndValidity();
  }

  listTipoEspacos() {
    this.webService.get(`regras/listar_tipo_espacos`)
    .subscribe(dados => {
      consoleLog(dados)
      this.listSelectTipoEspacos = (<any>dados).tipo_espacos
      consoleLog("listSelectTipoEspaco")
      consoleLog(this.listSelectTipoEspacos)
    });    
  }  
  listSelectTipoEspacos: any[];

  listLocalizacoes() {
    this.webService.get(`regras/listar_localizacoes`)
    .subscribe(dados => {
      consoleLog(dados)
      this.listSelectLocalizacoes = (<any>dados).localizacoes
      consoleLog("listSelectLocalizacoes")
      consoleLog(this.listSelectLocalizacoes)
    });    
  }  
  listSelectLocalizacoes: any[];

  listRecursos() {
    this.webService.get(`regras/listar_recursos`)
    .subscribe(dados => {
      consoleLog(dados)
      this.listSelectRecursos = (<any>dados).servicos
      consoleLog("listSelectRecursos")
      consoleLog(this.listSelectRecursos)
    });
  }
  listSelectRecursos: any[];

  listServicos() {
    this.webService.get(`regras/listar_servicos`)
    .subscribe(dados => {
      consoleLog(dados)
      this.listSelectServicos = (<any>dados).servicos
      consoleLog("listSelectServicos")
      consoleLog(this.listSelectServicos)
    });
  }
  listSelectServicos: any[];

  listTipoServicos() {
    this.webService.get(`regras/listar_tipo_servicos`)
    .subscribe(dados => {
      consoleLog(dados)
      this.listSelectTipoServicos = (<any>dados).tipo_servicos
      consoleLog("listSelectTipoServicos")
      consoleLog(this.listSelectTipoServicos)
    });
  }
  listSelectTipoServicos: any[];

  listGrupos() {
    this.webService.get(`regras/listar_grupos`)
    .subscribe(dados => {
      consoleLog(dados)
      this.listSelectGrupos = (<any>dados).listar_grupos
      consoleLog("listSelectGrupos")
      consoleLog(this.listSelectGrupos)
    });    
  }  
  listSelectGrupos: any[];

  listCategorias() {
    this.webService.get(`regras/listar_categorias`)
    .subscribe(dados => {
      consoleLog(dados)
      this.listSelectCategorias = (<any>dados).listar_categorias
      consoleLog("listSelectCategorias")
      consoleLog(this.listSelectCategorias)
    });    
  }  
  listSelectCategorias: any[];

  listOrigens() {
    this.webService.get(`regras/listar_origens`)
    .subscribe(dados => {
      consoleLog(dados)
      this.listSelectOrigens = (<any>dados).listar_origens
      consoleLog("listSelectOrigens")
      consoleLog(this.listSelectOrigens)
    });    
  }  
  listSelectOrigens: any[];

  listDias() {
    this.webService.get(`regras/listar_dias`)
    .subscribe(dados => {
      consoleLog(dados)
      this.listSelectDias = (<any>dados).listar_dias
      consoleLog("listSelectDias")
      consoleLog(this.listSelectDias)
    });    
  }  
  listSelectDias: any[];

  listMeses() {
    this.webService.get(`regras/listar_meses`)
    .subscribe(dados => {
      consoleLog(dados)
      this.listSelectMeses = (<any>dados).listar_meses
      consoleLog("listSelectMeses")
      consoleLog(this.listSelectMeses)
    });
  }
  listSelectMeses: any[];

  listPeriodos() {
    this.webService.get(`regras/listar_periodos`)
    .subscribe(dados => {
      consoleLog(dados)
      this.listSelectPeriodos = (<any>dados).listar_periodos
      consoleLog("listSelectPeriodos")
      consoleLog(this.listSelectPeriodos)
    });    
  }  
  listSelectPeriodos: any[];

  listTempos() {
    this.webService.get(`regras/listar_tempos`)
    .subscribe(dados => {
      consoleLog(dados)
      this.listSelectTempos = (<any>dados).listar_tempos
      consoleLog("listSelectTempos")
      consoleLog(this.listSelectTempos)
    });    
  }  
  listSelectTempos: any[];

  listDataRegra(){
    this.webService.get(`regras/listar_data_regra`)
    .subscribe(dados => {
      consoleLog(dados)
      this.listSelectDataRegra = (<any>dados).listar_data_regra
      consoleLog("listSelectDataFiltro")
      consoleLog(this.listSelectDataRegra)
    });
  }

  listSelectDataRegra: any[];
  
  listTipoCapacidade(){
    this.webService.get(`regras/listar_tipo_capacidade`)
    .subscribe(dados => {
      this.listSelectTipoCapacidade = (<any>dados).listar_tipo_capacidade
    });
  }

  listSelectTipoCapacidade: any[];
  
  valorExcluir = false;
  novoExcluir(valor){
    this.valorExcluir = valor;
    return this.valorExcluir;
  }

  loggar(itemrow){
    consoleLog("change")
    consoleLog(itemrow);
  }  


  validacao(itemrow){
    ValidateEmailSelectMulti(itemrow.get('condicional').get('email'));
    // itemrow.get('condicional').get('email').updateValueAndValidity();
    // itemrow.get('condicional').updateValueAndValidity();
    // itemrow.updateValueAndValidity();
    // this.formulario.updateValueAndValidity();
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