import { Component, ViewChild, OnInit } from '@angular/core';
import {UnidadeFormComponent} from '../unidade-form/unidade-form.component';
import { TfDatatableBase } from '../../../../../../_andaime/tf-datatable/tf-datatable-base';
import { consoleLog } from '../../../../../../globals';

@Component({
  selector: 'unidade-data-table',
  templateUrl: './unidade-data-table.component.html'
})
export class UnidadeDataTableComponent extends TfDatatableBase {
  entidade = "unidades";
  contentFormModal = UnidadeFormComponent;

  abrirQrCode(id, titulo){
    consoleLog("id na espaco");
    consoleLog(id);
    this.gerarQrCodeService.tratarQrCode(`unidade_id=${id}`, titulo);
  }
}