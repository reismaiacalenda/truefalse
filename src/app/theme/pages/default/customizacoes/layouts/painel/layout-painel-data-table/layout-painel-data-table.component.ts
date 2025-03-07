import { Component, ViewChild, OnInit } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ModalDismissReasons, NgbDateStruct, NgbModal, NgbActiveModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { LayoutPainelFormComponent } from '../layout-painel-form/layout-painel-form.component';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../../../../../auth/_models';
import { Helpers } from '../../../../../../../helpers';
import { ModalService } from '../../../../modal/modal.service';
import { DomainService } from '../../../../../../../_services/domain.service';
import { WorkspaceService } from '../../../../../../../_services/workspace.service';
import { consoleLog } from '../../../../../../../globals';

@Component({
  selector: 'layout-painel-data-table',
  templateUrl: './layout-painel-data-table.html'
})
export class LayoutPainelDataTableComponent implements OnInit {
  @ViewChild(DatatableComponent, {static: false}) minhaTable: DatatableComponent;
  currentUser: User;
  dados: any[];
  rows: any[];
  private apiUrl: string;

  constructor(private modalNgb: NgbModal,
    private http: HttpClient,
    private modalService: ModalService,
    public workspaceService: WorkspaceService,
    private domainService: DomainService) {
    this.currentUser = this.workspaceService.currentUser;
    this.apiUrl = `${domainService.getApiUrl()}/layout_paineis`;
  }

  ngOnInit() {
    Helpers.setLoading(true);
    this.carregarTable();
  }

  carregarTable() {
    Helpers.setLoading(true);
    this.http.get(`${this.apiUrl}.json`)
  // FIX
      .subscribe(
      dados => this.rows = this.dados = (<any>dados).layout_paineis
      )
      .add(()=>Helpers.setLoading(false));
   }

  openFormModal(rowId?: string) {
    let ngbModalOptions: NgbModalOptions={
          backdrop: 'static',
          keyboard: false,
          size: 'lg'
          
      }
    const modalRef = this.modalNgb.open(LayoutPainelFormComponent, ngbModalOptions);
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
          this.http.delete(`${this.apiUrl}/${rowId}.json`,
          {observe: 'response'})
            .subscribe((response) => {
              this.modalService.tratarSucesso(response);
              // FIX
              if ((<any>response).status == 200) {
                var index = this.rows.findIndex(i => i.id == rowId);
                this.rows.splice(index, 1);
                this.carregarTable();
              }
            },
            (error: any) => this.modalService.tratarError(error)
            );
        }
      }
    );
  }

  updateFilter(event) {
    const busca = event.target.value.toLowerCase();
    const temp = this.dados.filter(
      r => String(r.nome).toLowerCase().indexOf(busca) !== -1
        || String(r.bg_color).toLowerCase().indexOf(busca) !== -1
        || !busca
    );
    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.minhaTable.offset = 0;
  }

  toggleExpandRow(row) {
    consoleLog('Toggled Expand Row!');
    consoleLog(row);
    this.minhaTable.rowDetail.toggleExpandRow(row);
  }

  toggleExpandAllRow() {
    // this.minhaTable.rowDetail.expandAllRows();
    this.minhaTable.rowDetail.collapseAllRows();
  }
}
