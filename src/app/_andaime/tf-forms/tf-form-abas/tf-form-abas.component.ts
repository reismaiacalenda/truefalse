import { Component, Input, OnInit, ElementRef, Output, AfterViewInit, ɵConsole, OnChanges } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { TfFormModalBaseComponent } from '../tf-form-modal-base.component';
import { Observable } from 'rxjs';
import { Helpers } from '../../../../app/helpers';
import { consoleLog, globals } from '../../../globals';

@Component({
  selector: 'tf-form-abas',
  templateUrl: './tf-form-abas.component.html',
  standalone: false
})

export class TfFormAbasComponent extends TfFormModalBaseComponent implements OnInit{
  @Input() abas: any[];
  @Input() botaoExcluir = true;
  @Input() declare activeModal: NgbActiveModal;
  @Input() declare formGroup: FormGroup;
  @Input() cancelar: boolean = true;
  @Input() autorizar_excluir: any[];
  @Input() habilitarExcluir: boolean = true;
  @Input() habilitarSalvar: boolean = true;
  @Input() textoBotaoAlternativo: string = "";
  @Output() submeter = new EventEmitter();
  @Output() excluir = new EventEmitter();
  @Output() botaoAlternativo = new EventEmitter();
  // @Output() recuo = new EventEmitter();

  public tabIndex:number = 1;
  public situacaoAba;

  // recuar: boolean;
 
  ngOnInit(){
    this.changeDetectorRef.detectChanges();
    this.prepararAttrsPorTab();
  }

  mudarTab(i){
    //TODO: navegar com as tabs, mas com muuuuito cuidado pra nao estragar o wizard
  }

  prepararAttrsPorTab(){
    for (let i = 0; i < this.abas.length; i++) {
      let attrs:any[] = [];
      var attr= "";
      // this.abas[i]['controls']= [];
      $(`#m_tabs_6_${i+1}`).children().each(function(i, e){
        consoleLog(e);
        attr = $(e).children().first().attr('formControlName');
        if (attr){
          attrs.push(attr);
        }
      });
      $(`#m_tabs_6_${i+1} [formControlName]`).attr('formControlName')

      this.abas[i]['controls'] = attrs;
      this.abas[i]['valid'] = false;
      consoleLog(this.abas[i]['controls'])
      // this.isTabValid(i);      
    }
  }

  ativarTab(i){
    $(`#tabs_6_${i}`).addClass('active');
    $(`#m_tabs_6_${i}`).addClass('active');
    // $(`.nav-tabs li:eq(${i+2}) a`).addClass('active');
    // $(`.tab-pane:eq(${i+2})`).addClass('active');
  }

  desativarTab(i){
    // $(`.nav-tabs li:eq(${i+2}) a`).removeClass('active');
    $(`#tabs_6_${i}`).removeClass('active');
    $(`#m_tabs_6_${i}`).removeClass('active');
    // $(`.tab-pane:eq(${i+2})`).removeClass('active');
  }

  // recuoAtivado(flag){
  //   if (flag == true) {
  //     this.recuar = true;
  //   } else {
  //     this.recuar = false;
  //   }
  // }

  avancarTab(){
    // this.tabAvancada.emit(this.tabIndex)
    Helpers.setLoading(true);

    consoleLog(this.tabIndex);
    var aba = this.abas[this.tabIndex-1]
    consoleLog(aba)
    consoleLog(("requisicaoTabulada" in aba))
    if ("requisicaoTabulada" in aba){
      (aba.requisicaoTabulada as Observable<any>).subscribe(
        response=>{
          consoleLog("subscribe requisição");
          consoleLog(response)
          this.desativarTab(this.tabIndex);
          this.tabIndex++;
          this.ativarTab(this.tabIndex);
          Helpers.setLoading(false);
        },
        (error:any)=>{
          Helpers.setLoading(false);
          consoleLog("DEU ERRO COROI")
          consoleLog(error);
        }
      )
    }else{
      this.desativarTab(this.tabIndex);
      this.tabIndex++;
      this.ativarTab(this.tabIndex);
      Helpers.setLoading(false);
    }
  }

  // recuarTab(){
  //   // this.tabAvancada.emit(this.tabIndex)
  //   Helpers.setLoading(true);

  //   consoleLog(this.tabIndex);
  //   var aba = this.abas[this.tabIndex-1]
  //   consoleLog(aba)
  //   consoleLog(("requisicaoTabulada" in aba))
  //   if ("requisicaoTabulada" in aba){
  //     (aba.requisicaoTabulada as Observable<any>).subscribe(
  //       response=>{
  //         consoleLog("subscribe requisição");
  //         consoleLog(response)
  //         this.desativarTab(this.tabIndex);
  //         this.tabIndex--;
  //         this.ativarTab(this.tabIndex);
  //         Helpers.setLoading(false);
  //       },
  //       (error:any)=>{
  //         Helpers.setLoading(false);
  //         consoleLog("DEU ERRO COROI")
  //         consoleLog(error);
  //       }
  //     )
  //   }else{
  //     this.desativarTab(this.tabIndex);
  //     this.tabIndex--;
  //     this.ativarTab(this.tabIndex);
  //     Helpers.setLoading(false);
  //   }
  // }

  recuarTab(){
    this.desativarTab(this.tabIndex);
    this.tabIndex--;
    this.ativarTab(this.tabIndex);
  }

  isTabValid(indexTab:number){
    // freio da recursividade
    if (indexTab < 0){return true};

    // this.abas[indexTab].valid = true;
    // this.abas[indexTab].controls.forEach(attr=>{
    //   // consoleLog()
    //   // if (this.formGroup.controls[attr] instanceof FormArray){
    //     // if (!this.formGroup.controls[attr] || (this.formGroup.controls[attr] && this.formGroup.controls[attr].invalid)){
    //       // this.abas[indexTab].valid = false;
    //     // }
    //   // }else
    //   if (!this.formGroup.controls[attr]){
    //     consoleLog("quem é vc undfeind?")
    //     consoleLog(attr);
    //   }
    //   if(this.formGroup.controls[attr].invalid){
    //     this.abas[indexTab].valid = false;
    //   }
    // })
    var abaValid = false;
    if (this.abas[indexTab].formArray){
      this.formGroup.updateValueAndValidity();

      // consoleLog("nome valid and value:");
      // consoleLog(this.formGroup.get('nome').valid)
      // consoleLog(this.formGroup.get('nome').value)
      // consoleLog("formgrupo valid and value");
      // consoleLog(this.formGroup.valid)
      // consoleLog(this.formGroup.value)
      // // this.formGroup.get('nome').updateValueAndValidity();
      // consoleLog("nome valid and value: após update");
      // consoleLog(this.formGroup.get('nome').valid)
      // consoleLog(this.formGroup.get('nome').value)
      // consoleLog("formgrupo valid and value: após update");
      // consoleLog(this.formGroup.valid)
      // consoleLog(this.formGroup.value)

      // this.abas[indexTab].formArray.updateValueAndValidity();
      abaValid = this.abas[indexTab].formArray.valid;
    }
    this.situacaoAba = abaValid && this.isTabValid(indexTab - 1);
    //recusrividade para garantir que as abas anteriores também estejam válidas.
    return abaValid && this.isTabValid(indexTab - 1);
  }

  isTabLast(){
    if (this.abas.length == this.tabIndex){
      this.formGroup.updateValueAndValidity();
      return true;
    }else{
      return false;
    }
  }

  isTabFirst(){
    return this.tabIndex == 1;
  }

  // ngOnChanges(){
  //   consoleLog("caiu no changes");
  // }

  autorizarExcluir(){
    var flagRetorno:boolean = false;
    if (this.autorizar_excluir != undefined){
      (<any[]>this.autorizar_excluir).forEach(pf => {
        if (this.workspaceService.autorizar(pf) == true){
          flagRetorno = true;
        }
      })
    }
    return flagRetorno;
  }

  debugGlobal = globals.debug;

}
