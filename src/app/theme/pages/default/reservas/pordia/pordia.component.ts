import { OnInit, AfterViewInit, ViewEncapsulation, Component, OnDestroy } from '@angular/core';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalService } from '../../modal/modal.service';
import { DomainService } from '../../../../../_services/domain.service';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import { Helpers } from '../../../../../helpers';
import { globals, consoleLog } from '../../../../../globals';

@Component({
	selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",//app-calendar-basic
	templateUrl: "./pordia.component.html",
	encapsulation: ViewEncapsulation.None
})

export class PordiaComponent implements OnInit, OnDestroy {
	public apiUrl;
	public espacos: any[];
	public dataCalendario = new Date();
	public dataExibicao;
	public padPrint = "0.75rem 1.25rem";

	constructor(private _script: ScriptLoaderService,
		private modalNgb: NgbModal,
		private http: HttpClient,
		// private _router: Router,
		// private route: ActivatedRoute,
		private modalService: ModalService,
		private domainService: DomainService) {
		this.apiUrl = `${domainService.getApiUrl()}/reservas`
		this.tratarExibicao();
	}

	ngOnInit() {
		this.getDadosCalendario();
	}

	ngOnDestroy(){
		globals.printable = false;
	}

	getDadosCalendario() {
		Helpers.setLoading(true);
		let h = new HttpHeaders({
			// 'unidade': Helpers.getUnidade().id.toString()
		});
		this.http.get(`${this.apiUrl}/pordia.json?data=${this.dataCalendario}`, {headers: h})
			.subscribe(dados => {
				;
				this.espacos = (<any>dados).espacos;
			})
			.add(() => { Helpers.setLoading(false) });
	}

	nextDay() {
		this.dataCalendario.setDate(this.dataCalendario.getDate() + 1);
		this.tratarExibicao();
		this.getDadosCalendario();
	}

	lastDay() {
		this.dataCalendario.setDate(this.dataCalendario.getDate() - 1);
		this.tratarExibicao();
		this.getDadosCalendario();
	}

	nextWeek() {
		this.dataCalendario.setDate(this.dataCalendario.getDate() + 7);
		this.tratarExibicao();
		this.getDadosCalendario();
	}

	lastWeek() {
		this.dataCalendario.setDate(this.dataCalendario.getDate() - 7);
		this.tratarExibicao();
		this.getDadosCalendario();
	}

	today() {
		this.dataCalendario = new Date();
		this.tratarExibicao();
	}

	isToday() {
		return this.dataCalendario == new Date();
	}

	tratarExibicao() {
		this.dataExibicao = this.dataCalendario.toLocaleDateString("PT");
	}

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

	printable(){
		if (globals == undefined && globals.printable == undefined){
			return false;
		}else{
			return !globals.printable;
		}
	}

	async print() {
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


}