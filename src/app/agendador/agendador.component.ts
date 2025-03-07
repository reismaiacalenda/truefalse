import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import moment from 'moment';
import { WorkspaceService } from '../_services/workspace.service';
import { WebService } from '../_services/web.service';
import { ActivatedRoute } from '@angular/router';
import { Helpers } from '../helpers';
import { User } from '../auth/_models';
import { FormBuilder, FormGroup } from '@angular/forms';
import { consoleLog } from '../globals';

@Component({
  selector: "agendador",
  templateUrl: "./agendador.component.html",
  styleUrls: ['./agendador.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AgendadorComponent implements OnInit, AfterViewInit {
  @Input() cssClasses = '';
  @ViewChild('anfitriao', {static: false}) public anfitriao: ElementRef;
  @ViewChild('maisinfo', {static: false}) public maisinfo: ElementRef;
  @ViewChild('calendario', {static: false}) public calendario: ElementRef;
  @ViewChild('horarios', {static: false}) public horarios: ElementRef;
  @ViewChild('ribbon', {static: false}) public ribbon: ElementRef;
  @ViewChild('madeIn', {static: false}) public madeIn: ElementRef;
  @ViewChild('setaRecuoHorarios', {static: false}) public setaRecuoHorarios: ElementRef;
  @ViewChild('opcoes', {static: false}) public opcoes: ElementRef;
  
  private subscriptions: Subscription = new Subscription();
  jornal: any;

  public currentUser: User;
  habilitarCalendario: boolean = true;
  habilitarContactForm: boolean = false;
  habilitarItsAMatch: boolean = false;

  formulario:FormGroup = this.formBuilder.group({
    nome: [null],
    email: [null],
    telefone: [null],
    empresa: [null],
    desafio: [null]
  })
  

  monthDiv;
  headDivs;
  bodyDivs;
  nextDiv;
  prevDiv;
  month;
  today;
  selected;
  weekDays;
  calendarDays: { first: any; last: any; };
  monthDays: { lastPrevious: any; lastCurrent: any; };
  monthString: any;
  
  weeksArray: any[] = [];
  daysArray: any[] = [];
  
  dataCalendario: any;
  horariosDisponiveis: any = [];
  
  constructor(public workspaceService: WorkspaceService,
    public webService: WebService,
    public renderer:Renderer2,
    private _route: ActivatedRoute,
    public formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute) {
      this.currentUser = this.workspaceService.currentUser;
      this.monthDiv = document.querySelector('.cal-month__current')
      this.headDivs = document.querySelectorAll('.cal-head__day')
      this.bodyDivs = document.querySelectorAll('.cal-body__day')
      this.nextDiv = document.querySelector('.cal-month__next')
      this.prevDiv = document.querySelector('.cal-month__previous')
  }

  ngOnInit(){
    this.activatedRoute.params.subscribe(paramsId => {
      let agendador_key = paramsId.id;
      consoleLog(agendador_key);
      this.inicializarCalendario(agendador_key);
  });
  }

  inicializarCalendario(agendador_key){
    Helpers.setLoading(true);

    let teste = this._route//.queryParams['i'] || '/';
    consoleLog("query params")
    consoleLog(teste);

    // this.webService.get(`/agendador/${agendador_key}`)
    //   .subscribe(response=>{
    //     this.dataCalendario = response;
        this.dataCalendario = {
          assunto: "Feedback 360º",
          slot: "30 min",
          anfitriao: {
            name: "Lucas Maia",
            email: "lucas@reismaia.com",
            avatar_hair: 16,
            avatar_clothes: 5,
            avatar_extra: 5,
            avatar_body: 5,
            situacao: "espera"
          },
          dias: [
            {
              date: "01/12/2021",
              horarios_present: true,
              horarios: [
                {
                  horario: "09:00",
                  status: "disponivel"
                },
                {
                  horario: "10:00",
                  status: "ocupado"
                },
                {
                  horario: "11:00",
                  status: "disponivel"
                },
                {
                  horario: "12:00",
                  status: "disponivel"
                },
                {
                  horario: "09:00",
                  status: "disponivel"
                },
                {
                  horario: "10:00",
                  status: "ocupado"
                },
                {
                  horario: "11:00",
                  status: "disponivel"
                },
                {
                  horario: "12:00",
                  status: "disponivel"
                }
              ]
            },
            {

              date: "02/12/2021",
              horarios_present: false,
              horarios: []
            },
            {
              date: "03/12/2021",
              horarios_present: true,
              horarios: [
                {
                  horario: "09:00",
                  status: "disponivel"
                },
                {
                  horario: "10:00",
                  status: "ocupado"
                },
                {
                  horario: "09:00",
                  status: "disponivel"
                },
              ]
            }
          ]
        }
        this.montarInterfaceCalendario();
      // })

  }

  montarInterfaceCalendario(){

    moment.locale('pt-BR');

    this.month = moment()
    // this.selected
    this.today = this.month.clone()
    this.weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']//moment.weekdaysShort(true)
    
    this.bodyDivs.forEach(day => {
      day.addEventListener('click', e => {

        //tratamento pra adicionar 0 na frente dos numeros menor q 10
        const date = +e.target.innerHTML < 10 ? `0${e.target.innerHTML}` : e.target.innerHTML

        // tratamento relacionado a dias q nao são do mês em questão. e definir quem é o selected.
        if (e.target.classList.contains('cal-day__month--next')) {
          this.selected = moment(`${this.month.add(1, 'month').format('YYYY-MM')}-${date}`)
        } else if (e.target.classList.contains('cal-day__month--previous')) {
          this.selected = moment(`${this.month.subtract(1, 'month').format('YYYY-MM')}-${date}`)
        } else {
          this.selected = moment(`${this.month.format('YYYY-MM')}-${date}`)
        }

        this.update()
      })
    })
    
    this.update()
  }

  ngAfterViewInit(): void {

    this.centralizarAgendador();
    this.rodarEfeitosAnimacao()
  }

  centralizarAgendador(){
    this.renderer.addClass($('agendador')[0], 'h-100');
  }

  rodarEfeitosAnimacao(){
    consoleLog("ovo")
    this.renderer.removeClass(this.calendario.nativeElement, 'hidden');
    setTimeout(()=>{
      this.renderer.removeClass(this.anfitriao.nativeElement, 'hidden');

      this.renderer.removeClass(this.ribbon.nativeElement, 'hidden');
      setTimeout(()=>{
        this.renderer.removeClass(this.horarios.nativeElement, 'hidden');
        this.renderer.setStyle(this.horarios.nativeElement, 'display', 'flex');

        setTimeout(()=>{
          this.renderer.removeClass(this.madeIn.nativeElement, 'invisible');
          this.renderer.addClass(this.madeIn.nativeElement, 'fadeInDown');
          this.renderer.addClass(this.madeIn.nativeElement, 'animated');
          Helpers.setLoading(false);
        }, 500);

      },750);
      // setTimeout(()=>{
        // this.renderer.removeClass(this.horarios.nativeElement, 'fadeIn');
        // this.renderer.removeClass(this.horarios.nativeElement, 'animated');
      // })
//TODO: ensaiar uma andada com um bounce, um tada, ou pulse na lateral de horarios, antes de ser de fato.
    }, 1150)
    

    setTimeout(()=>{
      consoleLog("1");
      setTimeout(()=>{
        consoleLog("2");
      },500)
    },500)
  }

  selectDate(d){

    consoleLog("d");
    consoleLog(d);
 
    //tratamento pra adicionar 0 na frente dos numeros menor q 10
    const date = +d.day < 10 ? `0${d.day}` : d.day;

    // tratamento relacionado a dias q nao são do mês em questão. e definir quem é o selected.
    if (d.mes == "proximo") {
      // this.selected = moment(`${
        this.month.add(1, 'month')
        this.selected = undefined;
        this.recuarHorarios();
        
        // .format('YYYY-MM')}-${date}`)
    } else if (d.mes == "anterior") {
      // this.selected = moment(`${
        this.month.subtract(1, 'month')
        this.selected = undefined;
        this.recuarHorarios();
        // .format('YYYY-MM')}-${date}`)
    } else if (d.reservable == true){
      this.selected = moment(`${this.month.format('YYYY-MM')}-${date}`)
      if (d.day < 4){
        consoleLog("slected");
        consoleLog(d.day);
        consoleLog(this.dataCalendario);
        this.horariosDisponiveis = this.dataCalendario.dias[d.day-1].horarios;
      }
      this.abrirHorarios();
    }else{
      return;
    }
    


    consoleLog("this.selected")
    consoleLog(this.selected);

    this.update()
  }

  update () {
    this.calendarDays = {
      first: this.month.clone().startOf('month').startOf('week').date(),
      last: this.month.clone().endOf('month').date()
    }

  // consoleLog("this.calendarDays");
  // consoleLog(this.calendarDays)
    
    this.monthDays = {
      lastPrevious: this.month.clone().subtract(1,'months').endOf('month').date(),
      lastCurrent: this.month.clone().endOf('month').date()
    }

  // consoleLog("this.monthDays");
  // consoleLog(this.monthDays)
    
    this.monthString = this.month.clone().format('MMMM YYYY')
    
    this.draw()
  }
  
  addMonth () {
    this.month.add(1, 'month')
    this.renderer.addClass($('.calendar__body')[0], 'animated-50');
    this.renderer.addClass($('.calendar__body')[0], 'pulse');
    this.update()
    setTimeout(()=>{
      this.renderer.removeClass($('.calendar__body')[0], 'animated-50');
      this.renderer.removeClass($('.calendar__body')[0], 'pulse');
      // this.renderer.addClass($('.calendar__body')[0], 'animated-50');
      // this.renderer.addClass($('.calendar__body')[0], 'slideInRight');
      setTimeout(()=>{
      }, 500);
    },500)
  }
  
  removeMonth () {
    this.month.subtract(1, 'month')
    this.renderer.addClass($('.calendar__body')[0], 'animated-50');
    this.renderer.addClass($('.calendar__body')[0], 'pulse');
    this.update()
    setTimeout(()=>{
      this.renderer.removeClass($('.calendar__body')[0], 'animated-50');
      this.renderer.removeClass($('.calendar__body')[0], 'pulse');
      // this.renderer.addClass($('.calendar__body')[0], 'animated-50');
      // this.renderer.addClass($('.calendar__body')[0], 'slideInRight');
      setTimeout(()=>{
      }, 500);
    },500)
  }
  
  draw () {
    let index = 0
    this.weeksArray = [];
    this.daysArray = [];

    let currentWeek = [];
    let currentDay = {};

    if (this.calendarDays.first > 1) {
      for (let day = this.calendarDays.first; day <= this.monthDays.lastPrevious; index ++) {
        // this.bodyDivs[index].innerText = day++
        // this.daysArray.push({
        //   day: day++,
        //   classe: 'cal-day__month--previous'
        // })

        currentDay = {
          day: day++,
          classe: 'cal-day__month--previous',
          mes: 'anterior',
          selecionado: false,

        };
        currentWeek.push(currentDay);

        if (currentWeek.length % 7 == 0){
          this.weeksArray.push(currentWeek);
          currentWeek = [];
        }
        //this.cleanCssClasses(false, index)

        //this.bodyDivs[index].classList.add('cal-day__month--previous')
      } 
    }

    let isNextMonth = false
    // this.bodyDivs.length
    let classe, mes;
    let reservable = false;
    let selected = false;

    for (let day = 1; index <= 6*7 - 1; index ++) {
      if (day > this.monthDays.lastCurrent) {
        day = 1
        isNextMonth = true
      }

      reservable = false;

      // this.cleanCssClasses(true, index)

      if (!isNextMonth) {
        classe = ' cal-day__month--current'

        if (day === this.today.date() && this.today.isSame(this.month, 'day')) {
          // this.bodyDivs[index].classList.add('cal-day__day--today') 
          classe += ' cal-day__day--today'
        }

        if (this.selected != undefined && day === this.selected.date() && this.selected.isSame(this.month, 'month')) {
          // this.bodyDivs[index].classList.add('cal-day__day--selected') 
          classe += ' cal-day__day--selected'
          selected = true;
        }else if (day < 4 && this.dataCalendario.dias[day-1].horarios_present == true){
          classe += ' cal-day__day--reservable'
          reservable = true;
        }
        
        // this.bodyDivs[index].classList.add('cal-day__month--current')
        // consoleLog("tô ndia do mês corrente");
        // consoleLog(day)
        
        mes = "atual";
      } else {
        // this.bodyDivs[index].classList.add('cal-day__month--next')
        classe = ' cal-day__month--next'
        mes = "proximo"

      }

      currentDay = {
        day: day++,
        classe: classe,
        mes: mes,
        selecionado: selected,
        reservable: reservable
      };
      currentWeek.push(currentDay);

      if (currentWeek.length % 7 == 0){
        this.weeksArray.push(currentWeek);
        currentWeek = [];
      }

      // this.daysArray.push({
      //   day: day++,
      //   classe: classe
      // })
      // this.bodyDivs[index].innerText = day++
    }

  // consoleLog("this.daysArray");
  // consoleLog(this.daysArray);
  }
  
  cleanCssClasses (selected, index) {
    this.bodyDivs[index].classList.contains('cal-day__month--next') && 
      this.bodyDivs[index].classList.remove('cal-day__month--next')
    this.bodyDivs[index].classList.contains('cal-day__month--previous') && 
      this.bodyDivs[index].classList.remove('cal-day__month--previous')
    this.bodyDivs[index].classList.contains('cal-day__month--current') &&
      this.bodyDivs[index].classList.remove('cal-day__month--current')
    this.bodyDivs[index].classList.contains('cal-day__day--today') && 
      this.bodyDivs[index].classList.remove('cal-day__day--today')
    if (selected) {
      this.bodyDivs[index].classList.contains('cal-day__day--selected') && 
        this.bodyDivs[index].classList.remove('cal-day__day--selected') 
    }
  }

  abrirHorarios(){
    this.renderer.removeClass(this.setaRecuoHorarios.nativeElement, 'rotateOutDownRight');
    this.renderer.addClass(this.setaRecuoHorarios.nativeElement, 'rotateInUpRight');
    this.renderer.removeClass(this.setaRecuoHorarios.nativeElement, 'hidden');
    this.renderer.removeClass(this.horarios.nativeElement, 'slideOutLeft90'); 
    this.renderer.addClass(this.horarios.nativeElement, 'slideInLeft90'); 

    //mobile
    // this.renderer.addClass(this.anfitriao.nativeElement.parentElement, 'd-none');
    this.renderer.addClass(this.calendario.nativeElement.parentElement, 'd-none');
    this.renderer.removeClass(this.horarios.nativeElement.parentElement.parentElement.parentElement, 'd-none');
    // this.renderer.addClass(this.calendario.nativeElement, 'd-none');

    setTimeout(()=>{
      // this.renderer.removeClass(this.opcoes.nativeElement, 'hidden');
    },500)
  }

  recuarHorarios(){
    // Helpers.setLoading(true);
    this.renderer.addClass(this.horarios.nativeElement, 'slideOutLeft90'); 
    this.renderer.removeClass(this.horarios.nativeElement, 'slideInLeft90'); 
    this.renderer.addClass(this.setaRecuoHorarios.nativeElement, 'rotateOutDownRight');

    //mobile
    // this.renderer.removeClass(this.anfitriao.nativeElement.parentElement, 'd-none');
    this.renderer.removeClass(this.calendario.nativeElement.parentElement, 'd-none');
    this.renderer.addClass(this.horarios.nativeElement.parentElement.parentElement.parentElement, 'd-none');
    setTimeout(()=>{
      this.horariosDisponiveis = [];
      this.selected = undefined;
      this.update();
      // this.renderer.addClass(this.opcoes.nativeElement, 'hidden');
      // Helpers.setLoading(false);
    },1000)
    // this.renderer.addClass(this.setaRecuoHorarios.nativeElement, 'hidden');
  }

  recuarAnfitriao(){
    this.renderer.addClass(this.anfitriao.nativeElement, 'slideOutRight90'); 
    this.renderer.removeClass(this.anfitriao.nativeElement, 'slideInRight'); 
    setTimeout(()=>{
      // this.horariosDisponiveis = [];
      // this.selected = undefined;
      this.renderer.addClass(this.maisinfo.nativeElement, 'd-none');
      // this.update();
      // this.renderer.addClass(this.opcoes.nativeElement, 'hidden');
      // Helpers.setLoading(false);
    },1000)
    // this.renderer.addClass(this.setaRecuoHorarios.nativeElement, 'hidden');
  }

  selecionarHorario(h){
    // document.location.href = "http://calenda.com.br/obrigado-agenda"
    this.habilitarCalendario = false;
    this.recuarHorarios();
    this.habilitarContactForm = true;
  }

  send(){
    // this.router(['https://calenda.copm/dashboard'])
  }

  submitContactForm(){
    Helpers.setLoading(true);
    this.renderer.addClass(this.anfitriao.nativeElement.parentElement, 'd-none');
    this.habilitarContactForm = false;
    this.habilitarItsAMatch = true;
    this.recuarAnfitriao();
    Helpers.setLoading(false);
    this.renderer.addClass(this.anfitriao.nativeElement.parentElement.parentElement, 'h-100');
  }

  
}
