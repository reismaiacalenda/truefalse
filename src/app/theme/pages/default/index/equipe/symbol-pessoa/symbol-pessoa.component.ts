import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Subscription } from "rxjs";
import { consoleLog } from "../../../../../../globals";

@Component({
  selector: 'symbol-pessoa',
  templateUrl: './symbol-pessoa.component.html'
})
export class SymbolPessoaComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  flagSegurarDropdown:boolean = false;
  @Input() pessoa: any;

  constructor(){

  }

  ngOnInit(){

  }

  ngOnDestroy(){

  }

  abrirDropdown(t){
    consoleLog("abrirDorpdown")
    this.flagSegurarDropdown = true;
    if (t == undefined){return};
    t.open();
    setTimeout(() => {
      consoleLog("timeout do abrir. flag segurar = " + this.flagSegurarDropdown)
      if (this.flagSegurarDropdown == false){
        consoleLog("abrirDorpdown.close")
        t.close();
      }
    }, 1000) 
  }

  fecharDropdown(t){
    consoleLog("fecharDropdown")
    this.flagSegurarDropdown = false;
    setTimeout(() => {
      //tratamento de tooltip pra retomada não travar.
      consoleLog("timeout do fechar. flag segurar = " + this.flagSegurarDropdown)
      if (this.flagSegurarDropdown == false){
        consoleLog("fecharDropdown.close")
        t.close();
        this.flagSegurarDropdown = false;
      }
    }, 750)
  }

  segurarDropdown(){
    this.flagSegurarDropdown = true;
  }

}