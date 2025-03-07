import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { ReservaModalService } from '../reserva-modal/reserva-modal.service';
import { WorkspaceService } from '../../../../../_services/workspace.service';
import { Subscription } from 'rxjs';
import moment from 'moment';
import { ModalService } from '../../modal/modal.service';
import { consoleLog } from '../../../../../globals';

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./agendador.component.html",
  styleUrls: ['./agendador.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AgendadorComponent implements OnInit, AfterViewInit {
  public currentUser = this.workspaceService.currentUser;
  @Input() cssClasses = '';
  @ViewChild('anfitriao', {static: false}) public anfitriao: ElementRef;
  @ViewChild('calendario', {static: false}) public calendario: ElementRef;
  @ViewChild('horarios', {static: false}) public horarios: ElementRef;
  @ViewChild('ribbon', {static: false}) public ribbon: ElementRef;
  private subscriptions: Subscription = new Subscription();
  jornal: any;

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
  
  constructor(public workspaceService: WorkspaceService,
    public renderer:Renderer2,
    public modalService: ModalService) {
      this.monthDiv = document.querySelector('.cal-month__current')
      this.headDivs = document.querySelectorAll('.cal-head__day')
      this.bodyDivs = document.querySelectorAll('.cal-body__day')
      this.nextDiv = document.querySelector('.cal-month__next')
      this.prevDiv = document.querySelector('.cal-month__previous')
  }

  ngOnInit(){
    moment.locale('pt-BR');

    this.month = moment()
    this.today = this.selected = this.month.clone()
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
    consoleLog("ovo")
    this.renderer.removeClass(this.calendario.nativeElement, 'hidden');
    setTimeout(()=>{
      this.renderer.removeClass(this.anfitriao.nativeElement, 'hidden');

      this.renderer.removeClass(this.ribbon.nativeElement, 'hidden');
      setTimeout(()=>{
        this.renderer.removeClass(this.horarios.nativeElement, 'hidden');
        this.renderer.setStyle(this.horarios.nativeElement, 'display', 'flex');
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

    this.renderer.addClass(this.horarios.nativeElement, 'slideInLeft90'); 
    this.renderer.addClass(this.horarios.nativeElement, 'animated-75');
    //tratamento pra adicionar 0 na frente dos numeros menor q 10
    const date = +d.day < 10 ? `0${d.day}` : d.day;

    // tratamento relacionado a dias q nao são do mês em questão. e definir quem é o selected.
    if (d.mes == "proximo") {
      this.selected = moment(`${this.month.add(1, 'month').format('YYYY-MM')}-${date}`)
    } else if (d.mes == "anterior") {
      this.selected = moment(`${this.month.subtract(1, 'month').format('YYYY-MM')}-${date}`)
    } else {
      this.selected = moment(`${this.month.format('YYYY-MM')}-${date}`)
    }

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
    
    this.update()
  }
  
  removeMonth () {
    this.month.subtract(1, 'month')
    
    this.update()
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
          selecionado: false
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
    let selected = false;

    for (let day = 1; index <= 6*7 - 1; index ++) {
      if (day > this.monthDays.lastCurrent) {
        day = 1
        isNextMonth = true
      }

      // this.cleanCssClasses(true, index)

      if (!isNextMonth) {
        classe = ' cal-day__month--current'

        if (day === this.today.date() && this.today.isSame(this.month, 'day')) {
          // this.bodyDivs[index].classList.add('cal-day__day--today') 
          classe += ' cal-day__day--today'
        }

        if (day === this.selected.date() && this.selected.isSame(this.month, 'month')) {
          // this.bodyDivs[index].classList.add('cal-day__day--selected') 
          classe += ' cal-day__day--selected'
          selected = true;
        }else if (day > 6 && day < 20){
          classe += ' cal-day__day--reservable'
        }

        // this.bodyDivs[index].classList.add('cal-day__month--current')
        
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
        selecionado: selected
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

  abrirTrial(){
    this.modalService.abrirTrialAgendador();
  }
}
