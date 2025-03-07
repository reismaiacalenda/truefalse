import { Validators, FormGroup, FormControl, FormArray, Form } from '@angular/forms';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { TfFormBaseComponent } from '../../../../../../_andaime/tf-forms/tf-form-base.component';
import { consoleLog } from '../../../../../../globals';
import { TfFormAbasComponent } from '../../../../../../_andaime/tf-forms/tf-form-abas/tf-form-abas.component';
import { FormService } from '../../../../../../_services/form.service';
import { ValidateEmailSelectMulti } from '../../../../../../_andaime/tf-validators/email.validators';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap, delay, map } from 'rxjs/operators';

@Component({
  selector: 'filtro-form',
  templateUrl:'filtro-form.component.html'
})
export class FiltroFormComponent extends TfFormBaseComponent  {

  @ViewChild('selectTipos', {static: false}) public selectTipos: ElementRef;
  @ViewChild(TfFormAbasComponent, {static: false}) tfFormAbas:TfFormAbasComponent; 

  style;
  botaoAdd= false;
  entidade= "filtros"

  listDadosSelect = {
    'grupos':[]
  }

  formulario= this.formBuilder.group({
    id: [null],
    nome: [null, Validators.required],
    agenda_simples: [null],
    eventos: [null],
    instalacoes: [null],
    equipagens: [null],
    emprestimos: [null],
    postos_de_trabalho: [null],
    estacoes_flexiveis: [null],
    kit_estandes: [null],
    estacionamentos: [null],
    fretados: [null],
    compartilhado_com:[0,Validators.required],
    estagio:[0,Validators.required],
    agrupamento: ["-1", Validators.required],
    // grupos_attributes: this.prepararFormArraySelectMultiplo([Validators.required]),
    sentencas_attributes: this.initFormArrayName('sentencas_attributes')
  })

  initItemRows(){
    return this.formBuilder.group({
      atributo: [null],
      operador: [null],
      simbolo: [null],
      campo: [null],
      condicional: this.formBuilder.group({
        categoria: [null],
        multiplo: this.prepararFormArraySelectMultiplo([Validators.required]),
        simples: [null],
        data: [null],
        data_inicio: [null],
        data_fim: [null],
        hora: ['00:00'],  
        as: [false],
        numero: [null],
        periodo: [null],
        multiplo_customizado_text: [null],
        email: [null]
      }),
      customizado: [null],
      operador_logico_prox_item: [null]
    })
  }

  aba1 = this.formBuilder.array([        
    this.formulario.controls['nome'],
    this.formulario.controls['estagio'],
    this.formulario.controls['pessoas'],
    this.formulario.controls['espacos'],
    this.formulario.controls['recursos'],
    this.formulario.controls['agrupamento'],
    this.formulario.controls['compartilhado_com']
    // this.formulario.controls['grupos_attributes'],
  ])
  aba2 = this.formBuilder.array([
    this.formulario.controls['sentencas_attributes'],
  ])
  abas = [
    {"icon":"flaticon-open-box", "formArray": this.aba1, },
    {"icon":"flaticon-user-settings", "formArray": this.aba2, }
  ];

  childInit(){
    this.montarArvoreAPI();
    this.listAgrupamentos();
    // this.listGrupos();
    this.listDias();
    this.listMeses();
    this.listEspacos();
    this.listTipoEspacos();
    this.listLocalizacoes();
    this.listRecursos();
    this.listServicos();
    this.listTipoServicos();
    this.listDataFiltro();
    this.listTipoCapacidade();
    this.listPeriodos();
    this.listCategorias();
    this.listarCamposCustomizados();
    this.formulario.get('entidade');
    this.loadPeople();
    consoleLog("Formulário:");
    consoleLog(this.formulario);
   }

  montarArvoreAPI() {
    this.webService.get(`filtros/arvore`)
    .subscribe(dados => {
      consoleLog(dados)
      this.arvore = (<any>dados)
      consoleLog("arvore")
      consoleLog(this.arvore)
      this.initItemRows();
      this.addNewRow();
      this.listarCamposCustomizados();
    });
  }
  arvore: any;

  montarSelectAtributos(){
    var arrayDataSelect:any[]=[];
    var arrayDataSelectCamposPreDefinidos:any[]=[];
    var arrayDataSelectCamposCustomizados:any[]=[];
    Object.keys(this.arvore.atributos).forEach(atributo => {
      // consoleLog(atributo)
      var itemSelect = {
        id: atributo,
        text: this.arvore.atributos[atributo].text
      }
      if (this.arvore.atributos[atributo].customizado != undefined &&
        this.arvore.atributos[atributo].customizado == true){
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
    Object.keys(this.arvore.atributos[itemrow.get('atributo').value].operadores).forEach(operador => {
      var itemSelect = {
        id: operador,
        text: this.arvore.atributos[itemrow.get('atributo').value].operadores[operador].text,
      }
      arrayDataSelect.push(itemSelect)
    });
    return arrayDataSelect;
  }

  descobrirCondicional(itemrow:FormGroup, index){
    var categoria;
    if(this.rowId == null){
      categoria = this.arvore
      .atributos[itemrow.get('atributo').value]
      .operadores[itemrow.get('operador').value]
      .condicional
      .categoria;

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

  definirSimboloECampo(itemrow:FormGroup){
    let operador = this.arvore
      .atributos[itemrow.get('atributo').value]
      .operadores[itemrow.get('operador').value]
    itemrow.get('simbolo').setValue(operador.simbolo);
    itemrow.get('campo').setValue(operador.campo);

    if (this.arvore.atributos[itemrow.get('atributo').value].customizado != undefined &&
    this.arvore.atributos[itemrow.get('atributo').value].customizado == true){
      itemrow.get('customizado').setValue(true);
    }else{
      itemrow.get('customizado').setValue(false);
    }
  }

  listAgrupamentos() {
    this.webService.get(`filtros/listar_agrupamentos`)
      .subscribe(dados => {
        consoleLog(dados)
        this.listSelectAgrupamentos = (<any>dados).listar_agrupamentos
        consoleLog("listSelectAgrupamentos")
        consoleLog(this.listSelectAgrupamentos)
      });    
  }
  listSelectAgrupamentos: any[];

  listGrupos() {
    this.webService.get(`regras/listar_grupos`)
    .subscribe(dados => {
      consoleLog(dados)
      this.listSelectGrupos = (<any>dados).listar_grupos
    // consoleLog("listSelectGrupos")
    // consoleLog(this.listSelectGrupos)
    });    
  }  
  listSelectGrupos: any[];

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
  
  listEspacos() {
    this.webService.get(`regras/listar_espacos`)
    .subscribe(dados => {
      consoleLog(dados)
      this.listSelectEspacos = (<any>dados).localizacoes
      consoleLog("listSelectEspacos")
      consoleLog(this.listSelectEspacos)
    });
  }
  listSelectEspacos: any[];

  listTipoEspacos() {
    this.webService.get(`regras/listar_tipo_espacos`)
    .subscribe(dados => {
      consoleLog(dados)
      this.listSelectTipoEspacos = (<any>dados).tipo_espacos
      consoleLog("listSelectTipoEspacos")
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

  listDataFiltro() {
    this.webService.get(`regras/listar_data_filtro`)
    .subscribe(dados => {
      consoleLog(dados)
      this.listSelectDataFiltro = (<any>dados).listar_data_filtro
      consoleLog("listSelectDataFiltro")
      consoleLog(this.listSelectDataFiltro)
    });
  }
  listSelectDataFiltro: any[];

  listTipoCapacidade(){
    this.webService.get(`regras/listar_tipo_capacidade`)
    .subscribe(dados => {
      this.listSelectTipoCapacidade = (<any>dados).listar_tipo_capacidade
    });
  }

  listSelectTipoCapacidade: any[];

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

  listarCamposCustomizados(){
    this.webService.get(`regras/listar_selects_campos_customizados`)
    .subscribe(dados => {
      consoleLog(dados)
      this.listSelectCamposCustomizados = (<any>dados).listar_selects_campos_customizados
      consoleLog("listSelectCamposCustomizados")
      consoleLog(this.listSelectCamposCustomizados)
    });
  }
  listSelectCamposCustomizados: any[];

  // setCategoriaParams(condicional){
  //   consoleLog(condicional);
  //   this.setCategoriaForm = condicional;
  //   consoleLog(this.setCategoriaForm);
  //   this.setCategoria();
  // }

  definirMultiploCustomizadoText(itemrow, event){
    consoleLog(event);
  }

  valorExcluir = false;
  novoExcluir(valor){
    this.valorExcluir = valor;
    return this.valorExcluir;
  }

  loggar(itemrow){
    consoleLog("change")
    consoleLog(itemrow);
  }

  // setCategoria(){
  //   let condicionalSelecionada;
  //   // let condicional = this.setCategoriaForm;
  //   // consoleLog(condicional);
  //   consoleLog(this.setCategoriaForm);
  //   switch(this.setCategoriaForm) { 
  //     case 0:
  //       condicionalSelecionada = "multiplo";
  //       consoleLog(condicionalSelecionada);
  //       break;
  //     case 1:
  //       condicionalSelecionada = "data";
  //       consoleLog(condicionalSelecionada);
  //       break;
  //     case 2:
  //       condicionalSelecionada = "hora";
  //       consoleLog(condicionalSelecionada);
  //       break;
  //     case 3:
  //       condicionalSelecionada = "data_hora";
  //       consoleLog(condicionalSelecionada);
  //       break;
  //     case 4:
  //       condicionalSelecionada = "intervalo_data";
  //       consoleLog(condicionalSelecionada);
  //       break;
  //     case 5:
  //       condicionalSelecionada = "antecedencia";
  //       consoleLog(condicionalSelecionada);
  //       break;
  //     case 6:
  //       condicionalSelecionada = "simples";
  //       consoleLog(condicionalSelecionada);
  //       break;
  //     default:
  //       condicionalSelecionada = "Vazio!!!";
  //       consoleLog(condicionalSelecionada);
  //       break;
  //   }
  //   consoleLog(condicionalSelecionada);
  //   return condicionalSelecionada;    
  // }
  // setCategoriaForm:any;

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