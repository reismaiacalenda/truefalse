import { Component } from '@angular/core';
import { TfDatatableBase } from '../../../../../_andaime/tf-datatable/tf-datatable-base';
import { Helpers } from '../../../../../helpers';
import { consoleLog } from '../../../../../globals';

@Component({
  selector: 'notifications-data-table',
  templateUrl:'notifications-data-table.component.html'
})
export class NotificationsDataTableComponent extends TfDatatableBase {
  entidade= "notifications";
  contentFormModal = null;

  readNotification(id, read) {
		if (read === false) {
			this.webService.put(`notifications/${id}/read`, {})
      .subscribe(
        response =>{
					this.carregarTable();
          consoleLog(response)
          Helpers.setLoading(false);
        },
        (error) => {
          Helpers.setLoading(false);
          this.modalService.tratarError(error);
        }
      )
		}
	}

	readAllNotifications() {
    this.webService.post(`notifications/read_all`, {})
    .subscribe(
      response =>{
        this.carregarTable();
        consoleLog(response)
        Helpers.setLoading(false);
      },
      (error) => {
        Helpers.setLoading(false);
        this.modalService.tratarError(error);
      }
    )
	}
}