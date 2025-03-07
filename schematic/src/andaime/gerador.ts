class Input{
    tipo:string;
    snake:string;
    humanize:string;
    plural:string;
  }

  export function gerarListEntidades(camposInput:string) :string{
    var stringzona="";
    var camposSplitado = camposInput.split(",");
    var camposSelect:Input[] = [];
    
    camposSplitado.forEach((item:string) => {
      var input:Input = montarInput(item)
      if(input.tipo == "tf-select-simple" || input.tipo == "tf-select-multi"){
        camposSelect.push(input);
      }
    })
    
    
    camposSelect.forEach((input:Input,index) => {
      if(index < (camposSelect.length -1)){
        stringzona+=insertEntidades(input);
      }
      else{
        stringzona+=`'${(input.plural)}': []`
      }
    })
    return stringzona
  }
  
  export function gerarCampos(campos:string,tipoForm:string, nomeHumanizado:string) : string {
    console.log(campos);
    var stringzona="";
    var vetor = campos.split(",");
    if(tipoForm == "form-abas"){
      stringzona+=htmlAbas();
      vetor.forEach((item:string,index) => {
        var input:Input = montarInput(item)
        if(vetor.length>2){
          if(index<(vetor.length - 2)){
            switch (input.tipo) {
              case 'tf-check-box':
                stringzona+=inputCheckBox(input);
                break;
              case 'tf-check-list':
                  stringzona+=inputCheckList(input);
                break;
              case 'tf-date':
                stringzona+=inputDate(input);
                break;
              case 'tf-float':
                stringzona+=inputFloat(input);
                break;
              case 'tf-integer':
                stringzona+=inputInteger(input);
                break;
              case 'tf-money':
                stringzona+=inputMoney(input);
                break;
              case 'tf-radio-button':
                stringzona+=inputRadioButton(input);
                break;
              case 'tf-select-email':
                stringzona+=inputSelectEmail(input);
                break;
              case 'tf-select-multi':
                stringzona+=inputSelectMulti(input);
                break;
              case 'tf-select-simple':
                stringzona+=inputSelectSimple(input);
                break;
              case 'tf-text-area':
                stringzona+=inputTextArea(input);
                break;
              case 'tf-text-simple':
                stringzona+=inputTextSimple(input);
                break;
              case 'tf-time':
                stringzona+=inputTime(input);
                break;
              case 'tf-upload-image':
                stringzona+=inputUploadImage(input);
                break;
              default:
                break;
            }
          }
          if(index == (vetor.length-2)){
            stringzona+=insertSegundaAba();
            switch (input.tipo) {
              case 'tf-check-box':
                stringzona+=inputCheckBox(input);
                break;
              case 'tf-check-list':
                  stringzona+=inputCheckList(input);
                break;
              case 'tf-date':
                stringzona+=inputDate(input);
                break;
              case 'tf-float':
                stringzona+=inputFloat(input);
                break;
              case 'tf-integer':
                stringzona+=inputInteger(input);
                break;
              case 'tf-money':
                stringzona+=inputMoney(input);
                break;
              case 'tf-radio-button':
                stringzona+=inputRadioButton(input);
                break;
              case 'tf-select-email':
                stringzona+=inputSelectEmail(input);
                break;
              case 'tf-select-multi':
                stringzona+=inputSelectMulti(input);
                break;
              case 'tf-select-simple':
                stringzona+=inputSelectSimple(input);
                break;
              case 'tf-text-area':
                stringzona+=inputTextArea(input);
                break;
              case 'tf-text-simple':
                stringzona+=inputTextSimple(input);
                break;
              case 'tf-time':
                stringzona+=inputTime(input);
                break;
              case 'tf-upload-image':
                stringzona+=inputUploadImage(input);
                break;
              default:
                break;
            }
          }
          if(index == (vetor.length-1)){
            stringzona+=insertTerceiraAba();
            switch (input.tipo) {
              case 'tf-check-box':
                stringzona+=inputCheckBox(input);
                break;
              case 'tf-check-list':
                  stringzona+=inputCheckList(input);
                break;
              case 'tf-date':
                stringzona+=inputDate(input);
                break;
              case 'tf-float':
                stringzona+=inputFloat(input);
                break;
              case 'tf-integer':
                stringzona+=inputInteger(input);
                break;
              case 'tf-money':
                stringzona+=inputMoney(input);
                break;
              case 'tf-radio-button':
                stringzona+=inputRadioButton(input);
                break;
              case 'tf-select-email':
                stringzona+=inputSelectEmail(input);
                break;
              case 'tf-select-multi':
                stringzona+=inputSelectMulti(input);
                break;
              case 'tf-select-simple':
                stringzona+=inputSelectSimple(input);
                break;
              case 'tf-text-area':
                stringzona+=inputTextArea(input);
                break;
              case 'tf-text-simple':
                stringzona+=inputTextSimple(input);
                break;
              case 'tf-time':
                stringzona+=inputTime(input);
                break;
              case 'tf-upload-image':
                stringzona+=inputUploadImage(input);
                break;
              default:
                break;
            }
            stringzona+=`	</div>`
          }
        }
        if(vetor.length==2){
          if(index==(vetor.length - 2)){
            switch (input.tipo) {
              case 'tf-check-box':
                stringzona+=inputCheckBox(input);
                break;
              case 'tf-check-list':
                  stringzona+=inputCheckList(input);
                break;
              case 'tf-date':
                stringzona+=inputDate(input);
                break;
              case 'tf-float':
                stringzona+=inputFloat(input);
                break;
              case 'tf-integer':
                stringzona+=inputInteger(input);
                break;
              case 'tf-money':
                stringzona+=inputMoney(input);
                break;
              case 'tf-radio-button':
                stringzona+=inputRadioButton(input);
                break;
              case 'tf-select-email':
                stringzona+=inputSelectEmail(input);
                break;
              case 'tf-select-multi':
                stringzona+=inputSelectMulti(input);
                break;
              case 'tf-select-simple':
                stringzona+=inputSelectSimple(input);
                break;
              case 'tf-text-area':
                stringzona+=inputTextArea(input);
                break;
              case 'tf-text-simple':
                stringzona+=inputTextSimple(input);
                break;
              case 'tf-time':
                stringzona+=inputTime(input);
                break;
              case 'tf-upload-image':
                stringzona+=inputUploadImage(input);
                break;
              default:
                break;
            }
          }
          if(index == vetor.length-1){
            stringzona+=insertSegundaAba();
            switch (input.tipo) {
              case 'tf-check-box':
                stringzona+=inputCheckBox(input);
                break;
              case 'tf-check-list':
                  stringzona+=inputCheckList(input);
                break;
              case 'tf-date':
                stringzona+=inputDate(input);
                break;
              case 'tf-float':
                stringzona+=inputFloat(input);
                break;
              case 'tf-integer':
                stringzona+=inputInteger(input);
                break;
              case 'tf-money':
                stringzona+=inputMoney(input);
                break;
              case 'tf-radio-button':
                stringzona+=inputRadioButton(input);
                break;
              case 'tf-select-email':
                stringzona+=inputSelectEmail(input);
                break;
              case 'tf-select-multi':
                stringzona+=inputSelectMulti(input);
                break;
              case 'tf-select-simple':
                stringzona+=inputSelectSimple(input);
                break;
              case 'tf-text-area':
                stringzona+=inputTextArea(input);
                break;
              case 'tf-text-simple':
                stringzona+=inputTextSimple(input);
                break;
              case 'tf-time':
                stringzona+=inputTime(input);
                break;
              case 'tf-upload-image':
                stringzona+=inputUploadImage(input);
                break;
              default:
                break;
            }
          }
          stringzona+=`
          </div>`
        }
        else{
  
        }
      });
      stringzona+=`
      </tf-form-abas>
      `
    }
    if(tipoForm == "form-simples"){
      stringzona+=htmlSimples(nomeHumanizado);
      vetor.forEach((item:string) => {
        var input:Input = montarInput(item)
        switch (input.tipo) {
          case 'tf-check-box':
            stringzona+=inputCheckBox(input);
            break;
          case 'tf-check-list':
              stringzona+=inputCheckList(input);
            break;
          case 'tf-date':
            stringzona+=inputDate(input);
            break;
          case 'tf-float':
            stringzona+=inputFloat(input);
            break;
          case 'tf-integer':
            stringzona+=inputInteger(input);
            break;
          case 'tf-money':
            stringzona+=inputMoney(input);
            break;
          case 'tf-radio-button':
            stringzona+=inputRadioButton(input);
            break;
          case 'tf-select-email':
            stringzona+=inputSelectEmail(input);
            break;
          case 'tf-select-multi':
            stringzona+=inputSelectMulti(input);
            break;
          case 'tf-select-simple':
            stringzona+=inputSelectSimple(input);
            break;
          case 'tf-text-area':
            stringzona+=inputTextArea(input);
            break;
          case 'tf-text-simple':
            stringzona+=inputTextSimple(input);
            break;
          case 'tf-time':
            stringzona+=inputTime(input);
            break;
          case 'tf-upload-image':
            stringzona+=inputUploadImage(input);
            break;
          default:
            break;
        }
      });
      stringzona+=`
      </tf-form-simples>
      `
    }
    return stringzona;
  }
  
  function insertEntidades(input:Input){
    return `'${(input.plural)}': [],
    `
  }

  function htmlAbas(){
    return `<tf-form-abas
      [abas]="abas"
      [activeModal]="activeModal"
      [formGroup]="formulario"
      (submeter)="onSubmit()"
      (excluir)="removeItem()"
    >
  
        <div class="tab-pane active" id="m_tabs_6_1" role="tabpanel">
        
    `
  }
  
  function htmlSimples(nome:string){
    return `<tf-form-simples
        [formGroup]="formulario"
        [activeModal]="activeModal"
        title="${(nome)}"
      (submeter)="onSubmit()"
      >
      `
  }
  
  function insertSegundaAba(){
    return `
        </div>
  
        <div class="tab-pane" id="m_tabs_6_2" role="tabpanel">
    `
  }
  
  function insertTerceiraAba(){
    return `
      </div>
  
        <div class="tab-pane" id="m_tabs_6_3" role="tabpanel">
    `
  }
  
  function montarInput(item:string){
    var input:Input = new Input()
    var itemSplitado = item.split("|");
    input.tipo = itemSplitado[0];
    input.snake = itemSplitado[1];
    input.humanize = itemSplitado[2];
    if (itemSplitado.length> 3){
     input.plural = itemSplitado[3];
    }
    return input;
  }
  
  function inputCheckBox(input:Input){
    return `
    <div class="form-group m-form__group">
      <tf-check-box
          formControlName="${(input.snake)}"
          label="${(input.humanize)}">
      </tf-check-box>
    </div>  
    `
  }
  
  function inputCheckList(input:Input){
    return `
    <div class="form-group m-form__group">
      <tf-check-list
        [data]='[
          {"label":"Opção A", "value":"Opção_A"},
          {"label":"Opção B", "value":"Opção_B"},
          {"label":"Opção C", "value":"Opção_C"}
          ]'
          formControlName="${(input.snake)}"
          label="${(input.humanize)}">
      </tf-check-list>	
    </div>
    `
  }
  
  function inputDate(input:Input){
    return `
    <div class="form-group m-form__group">
      <tf-date
        formControlName="${(input.snake)}"
          label="${(input.humanize)}">
      </tf-date>
    </div>
    `
  }
  
  function inputFloat(input:Input){
    return `
    <div class="form-group m-form__group">
      <tf-float
        formControlName="${(input.snake)}"
          label="${(input.humanize)}"
          placeholder="99,99%"
          mask="dot_separator.2"
          suffix="%"
          separatorLimit = "10">
      </tf-float>
    </div> 
    `
  }
  
  function inputInteger(input:Input){
    return `
    <div class="form-group m-form__group"  
      [ngClass]="aplicaCss('${(input.snake)}')">
      <div class="col-lg-5 col-md-9 col-sm-12" style="padding-left: 0px;">
          <tf-integer
          formControlName="${(input.snake)}"
          label="${(input.humanize)}">
        </tf-integer>
      </div>
    </div>
    `
  }
  
  function inputMoney(input:Input){
    return `
    <div class="form-group m-form__group">
      <tf-money
        formControlName="${(input.snake)}"
        label="${(input.humanize)}">
      </tf-money>
    </div>
    `
  }
  
  function inputRadioButton(input:Input){
    return `
    <div class="form-group m-form__group">
      <tf-radio-button
        [data]='[
          {"label":"Opção A", "value":0},
          {"label":"Opção B", "value":1, "stateColor": "danger"},
          {"label":"Opção C", "value":2}
        ]'
          formControlName="${(input.snake)}"
          label="${(input.humanize)}">
      </tf-radio-button>	
    </div>
    `
  }
  
  function inputSelectEmail(input:Input){
    return `
    <div class="col-md-4"
      [ngClass]="aplicaCssItemRow('${(input.snake)}', itemrow, i)">
      <tf-select-email
        [form]="itemrow.get('${(input.snake)}')"
          label="${(input.humanize)}"
          placeholder="${(input.humanize)}">
      </tf-select-email>
    </div>
    `
  }
  
  function inputSelectMulti(input:Input){
    return `
    <div class="form-group m-form__group" >
      <tf-select-multi
          [form]="formulario.get('${(input.snake)}')"
        [data]="listDadosSelect['${(input.plural)}']"
        label="${(input.humanize)}"
          placeholder="selecione um ou mais ${(input.humanize.toLowerCase())}">
      </tf-select-multi>			
   </div>
    `
  }
  
  function inputSelectSimple(input:Input){
    return `
    <div class="form-group m-form__group" >
      <tf-select-simple
          [formControl]="formulario.get('${(input.snake)}')"
          [data]="listDadosSelect['${(input.plural)}']"
          label="${(input.humanize)}"
          placeholder="selecione um ${(input.humanize.toLowerCase())}">
      </tf-select-simple>
    </div> 
    `
  }
  
  function inputTextArea(input:Input){
    return `
    <div class="form-group m-form__group"
      [ngClass]="aplicaCss('${(input.snake)}')">
      <tf-text-area
          formControlName="${(input.snake)}"
          label="${(input.humanize)}"
          placeholder="${(input.humanize)}">
      </tf-text-area>
    </div>
    `
  }
  
  function inputTextSimple(input:Input){
    return `
    <div class="form-group m-form__group"
      [ngClass]="aplicaCss('${(input.snake)}')"
      >
      <tf-text-simple
        formControlName="${(input.snake)}"
        label="${input.humanize}"
        placeholder="${input.humanize}"
      >
      </tf-text-simple>
    </div>
    `
  }
  
  function inputTime(input:Input){
    return `
    <div class="form-group m-form__group">
      <tf-time
        formControlName="${(input.snake)}"
        label="${input.humanize}">
      </tf-time>
    </div>
    `
  }
  
  function inputUploadImage(input:Input){
    return `
    <div class="form-group m-form__group">
      <tf-upload-image
          formControlName="${(input.snake)}"
          label="Carregar imagem"
          [extensions]="['jpeg','png']">
      </tf-upload-image>
    </div>
    `
  }
  
  export function alimentarFormulario(campos:string,tipoForm:string): string{
    var stringzona="";
    console.log(tipoForm);
    var vetor = campos.split(",");
    vetor.forEach((item:string) => {
        var input:Input = montarInput(item)
        switch (input.tipo) {
          case 'tf-select-multi':
            stringzona+=formSelectMulti(input);
            break;
          default:
            stringzona+=formInputDefault(input);
            break;
        }
      });
      stringzona+=`
        })`
    if(tipoForm=="form-abas")
    {
      stringzona+=`
      aba1 = this.formBuilder.array([
        `
        vetor.forEach((item:string,index)=>{
        var input:Input=montarInput(item)
        if(vetor.length>2)
        {
          switch (input.tipo){
            case 'tf-select-multi':
              if(index < (vetor.length - 2)){
                stringzona+=formInputAbasSelectMult(input)
            }
              if(index == (vetor.length -2)){
                stringzona+=`
    ])
    aba2 = this.formBuilder.array([
    `
                stringzona+=formInputAbasSelectMult(input)
              }
              if(index==(vetor.length-2)){
                stringzona+=`
    ])
    aba3 = this.formBuilder.array([
      `
                stringzona+=formInputAbasSelectMult(input)
              }
              break;
            default:
              if(index < (vetor.length - 2)){
                stringzona+=formInputAbasDefault(input)
            }
              if(index == (vetor.length -2)){
                stringzona+=`
    ])
    aba2 = this.formBuilder.array([
    `
                stringzona+=formInputAbasDefault(input)
              }
              if(index == (vetor.length-1)){
                stringzona+=`
    ])
    aba3 = this.formBuilder.array([
      `
                stringzona+=formInputAbasDefault(input)
              }
              break;
          }
        }
        if(vetor.length == 2)
        {
          switch (input.tipo){
            case 'tf-select-multi':
              if(index == (vetor.length - 2)){
                stringzona+=formInputAbasSelectMult(input)
            }
              if(index == (vetor.length -1)){
                stringzona+=`
    ])
    aba2 = this.formBuilder.array([
    `
                stringzona+=formInputAbasSelectMult(input)
              }
              break;
            default:
              if(index == (vetor.length - 2)){
                stringzona+=formInputAbasDefault(input)
            }
              if(index == (vetor.length -1)){
                stringzona+=`
    ])
    aba2 = this.formBuilder.array([
    `
                stringzona+=formInputAbasDefault(input)
              }
              break;
          }
        }
        else{
  
        }
      })
      stringzona+= `
        ])
        abas = [
          {"icon":"flaticon-add", "formArray": this.aba1, },
          {"icon":"flaticon-network", "formArray": this.aba2, },
          {"icon":"flaticon-interface-2", "formArray": this.aba3, }
        ];`
    }
     return stringzona;
  }
  
  function formInputAbasDefault(input:Input){
    return `
    this.formulario.controls['${(input.snake)}'],`
  }
  
  function formInputAbasSelectMult(input:Input){
    return `
    this.formulario.controls['${(input.snake)}'],`
  }
  
  function formSelectMulti(input:Input){
    return `, 
     ${(input.snake)}: this.prepararFormArraySelectMultiplo([])`  
  }
  
  function formInputDefault(input:Input){
    return `,
     ${(input.snake)}: [null]`
  }
  
  export function showDataTable(campos:string) : string{
    var stringzona="";
    var vetor = campos.split(",");
    vetor.forEach((item:string) => {
  
      var input:Input = montarInput(item)
  
      switch (input.tipo) {
        case 'tf-select-multi':
          stringzona+=showSelectMulti(input);
          break;
        default:
          stringzona+=showDefault(input);
      }
    }
   )
   return stringzona;
  }
  
  function showSelectMulti(input:Input){
    return `
            <div>${(input.humanize)}: {{row.${(input.snake)}.nome}}</div>`
  }
  
  function showDefault(input:Input){
    return `
            <div>${(input.humanize)}: {{row.${(input.snake)}}}</div>`
  }
  
  export function showColunasDataTable(campos:string) : string{
    var vetor = campos.split(",");
    var input:Input = new Input()
    var itemSplitado = vetor[0].split("|");
    input.tipo = itemSplitado[0];
    input.snake = itemSplitado[1];
    input.humanize = itemSplitado[2];
    return `<ngx-datatable-column [flexGrow]="2" name="${(input.humanize)}" prop="${(input.snake)}">
    </ngx-datatable-column>`;
  }