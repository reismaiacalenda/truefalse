import { OnInit, ViewChild, Component, OnDestroy, AfterViewChecked, DoCheck } from '@angular/core';
import { DatatableService } from '../../_services/datatable.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { User } from '../../auth/_models';
import { Helpers } from '../../helpers';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { WebService } from '../../_services/web.service';
import { ModalService } from '../../theme/pages/default/modal/modal.service';
import { WorkspaceService } from '../../_services/workspace.service';
import { consoleLog, globals, printable } from '../../globals';
import { Datatable } from './datatable.model';
import { ActivatedRoute } from '@angular/router';
import { GerarQrCodeModalService } from '../../theme/pages/default/gerar-qrcode/gerar-qrcode.service';
import { Subscription } from 'rxjs';
import { LoadingService } from '../../_services/loading.service';

@Component({
  template: '',
  standalone: false
})
export abstract class TfDatatableBase implements OnInit, OnDestroy {
  @ViewChild(DatatableComponent, {static: false}) minhaTable: DatatableComponent;
  currentUser: User;
  abstract entidade: String;
  abstract contentFormModal: any;
  contentModalAdicional: any;
  datatableMultipla: boolean = false;
  query;
  defautlQuery;
  filtro_id;
  subscriptions:Subscription = new Subscription();
  public page = {
    totalElements: 0,
    pageNumber: 0,
    size: 25
  }
  datatable = {
    rows: null,
    local_copy: null
  };
  public editingFlag = {
    index: -1,
    property: null 
  }

  // datatables:Datatable[] = [];
  datatables:any[] = [];

  constructor(public datatableService: DatatableService,
    public modalNgb: NgbModal,
    public webService: WebService,
    public modalService: ModalService,
    public workspaceService: WorkspaceService,
    public gerarQrCodeService: GerarQrCodeModalService,
    public route: ActivatedRoute,
    public loadingService: LoadingService) {
      this.currentUser = this.workspaceService.currentUser;
      this.loadingService.addRequest();
  }

  childInit(){}

  ngOnInit() {
    this.childInit();
    this.datatableService.inicializar(this.entidade, this.defautlQuery, this.query, this.page, this.datatable, this)
    this.carregarTable();
    this.loadingService.removeRequest();
  }

  carregarTable() {
    var params = "";
    var snapshotParams = this.route.snapshot.queryParams
    // snapshotParams != undefined && snapshotParams != {}
    if (snapshotParams !== undefined && Object.keys(snapshotParams).length > 0) {
      Object.keys(snapshotParams).forEach(key => {
      params += `&${key}=${snapshotParams[key]}`
      })
    }
    this.datatableService.index(params);
  }

  refreshTable(){
    this.page.pageNumber = 0;
    this.carregarTable();
  }

  toggleExpandRow(row, expanded, dt) {
    if (expanded == false){
      this.datatableService.show(row, this.minhaTable)
    }else{
      this.minhaTable.rowDetail.toggleExpandRow(row)
    }
  }

  toggleExpandAllRow() {
    this.minhaTable.rowDetail.collapseAllRows();
  }

  // updateFilter(event) {
  //   this.datatableService.filterDataTable(event);
  //   this.minhaTable.offset = 0;
  // }

  updateFilter(event) {
    this.query = event.target.value.toLowerCase();
    this.page.pageNumber = 0;
    this.datatableService.inicializar(this.entidade, this.defautlQuery, this.query, this.page, this.datatable, this)
    this.carregarTable();
    this.loadingService.removeRequest();
  }

  inlineEdit(index, property){
    console.log("to aqui no inline edit")
    console.log(index);
    console.log(property);
    this.editingFlag.index = index;
    this.editingFlag.property = property;
    console.log("o editint flag ficou asism:")
    console.log(this.editingFlag);
    console.log('O Lucas está maluco');
    setTimeout(()=>{
      $(`#input_row_${this.editingFlag.property}`).focus()
    }, 100)
  }

  inlineUpdate(event, rowId){
    console.log('diana');
    var body = {};
    body['id'] = rowId;
    body[this.editingFlag.property] = event.target.value;
    this.datatableService.update(body);
    this.uneditInline(); 
  }

  uneditInline(){
    this.editingFlag.index = -1;
    this.editingFlag.property = null;
  }

  removeItem(rowId, emLote?) {
    consoleLog("remove item")
    consoleLog(rowId);
    this.datatableService.remove(rowId, emLote);
  }

  openFormModal(rowId?: string, modalSize: 'sm' | 'lg' | 'xxl' | 'xl' = 'xl') {
    let ngbModalOptions: NgbModalOptions
    if (modalSize == 'xxl'){
      ngbModalOptions={
        backdrop: 'static',
        keyboard: true,
        windowClass: 'tf-modal-extra-large'
      }
    } else {
      consoleLog("Roooow id");
      consoleLog(rowId)
      ngbModalOptions={
        backdrop: 'static',
        keyboard: true
        // size: 'md'
      }
      
    }
    const modalRef = this.modalNgb.open(this.contentFormModal, ngbModalOptions);
    modalRef.componentInstance.rowId = rowId;
    modalRef.result.then((responseSuccess) => {
      consoleLog("Entrou na modalRef!")
      if (responseSuccess) {
        this.carregarTable();
        consoleLog("Entrou na carregarTable dentro da responseSuccess!")
      }
    })
  }

  openModalAdicional(rowId?: string, modalSize: 'sm' | 'lg' | 'xxl' | 'xl'='xl') {
    alert("Eu sou o pai")
  }

  setPage(pageInfo, dtIndex?) {
    consoleLog("set paging");
    consoleLog(dtIndex)
    if (dtIndex != undefined){
      consoleLog("temos dtIndex?")
      this.datatables[dtIndex].page.pageNumber = pageInfo.offset
    }else{
      this.page.pageNumber = pageInfo.offset;
    }
    this.carregarTable();
    // this.serverResultsService.getResults(this.page).subscribe(pagedData => {
    //   this.page = pagedData.page;
    //   this.rows = pagedData.data;
    // });
  }

  childDestroy(){}
  
  ngOnDestroy(){
    globals.printable = false;
    this.subscriptions.unsubscribe();
    this.childDestroy();
  }

  printable(){return printable()}

  paddingPrint() {
		consoleLog("ta no padding....");
		if (globals.printable) {
			return '0.2rem';
			// return {'padding':'0.2rem'};
		} else {
			return '0.75rem 1.25rem';
			// return {'padding':'0.75rem 1.25rem'};
		}
	}
  
  delay(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

  public padPrint = "0.75rem 1.25rem";
  async print() {
    consoleLog("ntrando no print");
		Helpers.setLoading(true);
		globals.printable = !globals.printable;
		this.padPrint = this.paddingPrint();
		await this.delay(250);
		Helpers.setLoading(false);
		window.print();
		//TODO: preparar melhor o file do print, com nome bunitim. "Calenda - Relatório de Agendamento por dia - 12-09-2019"
		globals.printable = !globals.printable;
    this.padPrint = this.paddingPrint();
    


		// this.globals.printable= !this.globals.printable;
		// this.padPrint = this.paddingPrint();

		// this.printable=!this.printable;
		// this.padPrint = this.paddingPrint();
		// var prtContent = document.getElementById("calendar");
		// // var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
		// // WinPrint.document.write(prtContent.innerHTML);
		// var WinPrint = window.open('', 'new div', 'height=400,width=600');
		// WinPrint.document.write('<html><head><title></title>');

		// // WinPrint.document.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.6.1/fullcalendar.min.css">');
		// WinPrint.document.write('<link href="./assets/vendors/base/vendors.bundle.css" rel="stylesheet" type="text/css" media="print"/>');
		// WinPrint.document.write('<link href="./assets/demo/default/base/style.bundle.css" rel="stylesheet" type="text/css" media="print"/>');

		// WinPrint.document.write('</head><body >');
		// WinPrint.document.write(prtContent.innerHTML);
		// WinPrint.document.write('</body></html>');

		// WinPrint.document.close();
		// WinPrint.focus();

		// setTimeout(function () {WinPrint.print();  }, 1000);
		// WinPrint.close();
	}

  // abstract submit();

  // onSubmit() {
  //   if (this.formulario.valid) {
  //     this.submit();
  //   } else {
  //     consoleLog('formulario invalido');
  //     this.verificaValidacoesForm(this.formulario);
  //   }
  // }

  // verificaValidacoesForm(formGroup: FormGroup | FormArray) {
  //   Object.keys(formGroup.controls).forEach(campo => {
  //     consoleLog(campo);
  //     const controle = formGroup.get(campo);
  //     controle.markAsDirty();
  //     controle.markAsTouched();
  //     if (controle instanceof FormGroup || controle instanceof FormArray) {
  //       this.verificaValidacoesForm(controle);
  //     }
  //   });
  // }

  // resetar() {
  //   this.formulario.reset();
  // }

  // verificaValidTouched(campo: string) {
  //   return (
  //     !this.formulario.get(campo).valid &&
  //     (this.formulario.get(campo).touched || this.formulario.get(campo).dirty)
  //   );
  // }

  // verificaRequired(campo: string) {
  //   return (
  //     this.formulario.get(campo).hasError('required') &&
  //     (this.formulario.get(campo).touched || this.formulario.get(campo).dirty)
  //   );
  // }

  // verificaEmailInvalido() {
  //   const campoEmail = this.formulario.get('email');
  //   if (campoEmail.errors) {
  //     return campoEmail.errors['email'] && campoEmail.touched;
  //   }
  // }

  // aplicaCssErro(campo: string) {
  //   return {
  //     'has-error': this.verificaValidTouched(campo),
  //     'has-feedback': this.verificaValidTouched(campo)
  //   };
  // }

}