import { User } from '../../../../../../auth/_models/user';
import { Helpers } from '../../../../../../helpers';
import { Component, ViewChild, OnInit } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ModalDismissReasons, NgbDateStruct, NgbModal, NgbActiveModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { PainelFormComponent } from '../painel-form/painel-form.component';
import { Http } from '@angular/http';
import { ModalService } from '../../../modal/modal.service';
import { DomainService } from '../../../../../../_services/domain.service';
import { HttpClient } from '@angular/common/http';
import { WorkspaceService } from '../../../../../../_services/workspace.service';
import { consoleLog } from '../../../../../../globals';

@Component({
  selector: 'painel-data-table',
  templateUrl: './painel-data-table.html'
})
export class PainelDataTableComponent implements OnInit {
  @ViewChild(DatatableComponent, {static: false}) minhaTable: DatatableComponent;
  currentUser: User;
  dados: any[];
  rows: any[];
  private apiUrl: string;

  constructor(private modalNgb: NgbModal,
    private http: HttpClient,
    public workspaceService: WorkspaceService,
    private modalService: ModalService,
    private domainService: DomainService) {
    this.currentUser = this.workspaceService.currentUser;
    this.apiUrl = `${domainService.getApiUrl()}/paineis`;
  }

  ngOnInit() {
    Helpers.setLoading(true);
    this.carregarTable();
    consoleLog("eesse usuario aquI:");
    consoleLog(this.currentUser);
  }

  carregarTable() {

    //  FIX
    this.http.get(`${this.apiUrl}.json`)
      .subscribe(
      dados => this.rows = this.dados = (<any>dados).paineis
      ).add(()=>{Helpers.setLoading(false);});
  }

  openFormModal(rowId?: string) {
    let ngbModalOptions: NgbModalOptions={
          backdrop: 'static',
          keyboard: false
      }
    const modalRef = this.modalNgb.open(PainelFormComponent, ngbModalOptions);
    modalRef.componentInstance.rowId = rowId;
    modalRef.result.then((responseSuccess) => {
      if (responseSuccess) {
        this.carregarTable();
      }
    })
  }

  removeItem(rowId) {
    this.modalService.tratarExclusao().then(
      r => {
        if (r) {
          // FIXthis.http.delete(`${this.apiUrl}/${rowId}.json`)
          //   .subscribe(resp => {
          //     this.modalService.tratarSucesso(response);
          //     const keys = resp.headers.keys();
          //     if (response.status == 200) {
          //       this.carregarTable();
          //     }
          //   },
          //   (error: any) => this.modalService.tratarError(error)
          //   );
        }
      }
    );
  }

  updateFilter(event) {
    const busca = event.target.value.toLowerCase();
    const temp = this.dados.filter(
      r => String(r.nome).toLowerCase().indexOf(busca) !== -1
        || !busca
    );
    // || String(r.ip).toLowerCase().indexOf(busca) !== -1
    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.minhaTable.offset = 0;
  }

  toggleExpandRow(row) {
    // consoleLog('Toggled Expand Row!', row);
    this.minhaTable.rowDetail.toggleExpandRow(row);
  }

  toggleExpandAllRow() {
    // this.minhaTable.rowDetail.expandAllRows();
    this.minhaTable.rowDetail.collapseAllRows();
  }
}
