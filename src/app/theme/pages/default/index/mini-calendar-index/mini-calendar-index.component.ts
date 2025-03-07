import { Component, Input, OnInit, OnDestroy, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { Subscription } from 'rxjs';
import moment from 'moment';
import { WorkspaceService } from '../../../../../_services/workspace.service';
import { consoleLog } from '../../../.././../globals';

@Component({
  selector: 'mini-calendar-index',
  templateUrl: './mini-calendar-index.component.html',
  styleUrls: ['./mini-calendar-index.component.scss']
})
export class MiniCalendarIndexComponent implements OnInit, AfterViewInit {
  @Input() cssClasses = '';
  private subscriptions: Subscription = new Subscription();
  @Input() jornal: any;
  @Output() diaSelecionado = new EventEmitter();

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
  
  constructor(public workspaceService: WorkspaceService) {
    consoleLog("oooi")
      this.monthDiv = document.querySelector('.mini-cal-month__current')
      this.headDivs = document.querySelectorAll('.mini-cal-head__day')
      this.bodyDivs = document.querySelectorAll('.mini-cal-body__day')
      this.nextDiv = document.querySelector('.mini-cal-month__next')
      this.prevDiv = document.querySelector('.mini-cal-month__previous')
  }

  ngOnInit(){
    this.inicializarCalendario();
  }

  inicializarCalendario(){
    moment.locale('pt-BR');
    // moment.locale(window.navigator.language);

    this.month = moment()
    this.today = this.selected = this.month.clone()
    // this.diaSelecionado.emit(this.today.day());
    this.weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']//moment.weekdaysShort(true)
    
    this.bodyDivs.forEach(day => {
      day.addEventListener('click', e => {

        //tratamento pra adicionar 0 na frente dos numeros menor q 10
        const date = +e.target.innerHTML < 10 ? `0${e.target.innerHTML}` : e.target.innerHTML

        // tratamento relacionado a dias q nao são do mês em questão. e definir quem é o selected.
        if (e.target.classList.contains('mini-calday__month--next')) {
          this.selected = moment(`${this.month.add(1, 'month').format('YYYY-MM')}-${date}`)
        } else if (e.target.classList.contains('mini-calday__month--previous')) {
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
    let w = $('.mini-cal-body__day').width();
    document.documentElement.style.setProperty("--mini-calendar-index-height", `${w}px`);
  }

  selectDate(d){
    //tratamento pra adicionar 0 na frente dos numeros menor q 10
    const date = +d.day < 10 ? `0${d.day}` : d.day;
    var monthChanged = false;

    // tratamento relacionado a dias q nao são do mês em questão. e definir quem é o selected.
    if (d.mes == "proximo") {
      this.selected = moment(`${this.month.add(1, 'month').format('YYYY-MM')}-${date}`)
      monthChanged = true;
    } else if (d.mes == "anterior") {
      this.selected = moment(`${this.month.subtract(1, 'month').format('YYYY-MM')}-${date}`)
      monthChanged = true;
    } else {
      this.selected = moment(`${this.month.format('YYYY-MM')}-${date}`)
    }

    this.update();
    this.diaSelecionado.emit({date: this.selected.format("DD/MM/YYYY"), day: d.day - 1, monthChanged: monthChanged});
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
  
  addMonth() {
    // this.month.add(1, 'month')
    this.selected = moment(`${this.month.add(1, 'month').format('YYYY-MM')}-${'01'}`)
    this.diaSelecionado.emit({date: this.selected.format("DD/MM/YYYY"), day: 1 - 1, monthChanged: true});
    this.update()
  }
  
  removeMonth () {
    // this.month.subtract(1, 'month')
    this.selected = moment(`${this.month.subtract(1, 'month').format('YYYY-MM')}-${'01'}`)
    this.diaSelecionado.emit({date: this.selected.format("DD/MM/YYYY"), day: 1 - 1, monthChanged: true});
    this.update()
  }
  
  draw () {
    let index = 0
    this.weeksArray = [];
    this.daysArray = [];

    let currentWeek = [];
    let currentDay = {};

    consoleLog("draw. como tá o jornal")
    consoleLog(this.jornal);

    if (this.calendarDays.first > 1) {
      for (let day = this.calendarDays.first; day <= this.monthDays.lastPrevious; index ++) {
        // this.bodyDivs[index].innerText = day++
        // this.daysArray.push({
        //   day: day++,
        //   classe: 'mini-calday__month--previous'
        // })

        currentDay = {
          day: day++,
          classe: 'mini-cal-day__month--previous',
          mes: 'anterior',
          selecionado: false
        };
        currentWeek.push(currentDay);

        if (currentWeek.length % 7 == 0){
          this.weeksArray.push(currentWeek);
          currentWeek = [];
        }
        //this.cleanCssClasses(false, index)

        //this.bodyDivs[index].classList.add('mini-calday__month--previous')
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

      // this.cleanCssClasses(true, index)

      if (!isNextMonth) {
        classe = ' mini-cal-day__month--current'

        if (day === this.today.date() && this.today.isSame(this.month, 'day')) {
          // this.bodyDivs[index].classList.add('mini-calday__day--today') 
          classe += ' mini-cal-day__day--today'
        }

        if (day === this.selected.date() && this.selected.isSame(this.month, 'month')) {
          // this.bodyDivs[index].classList.add('mini-calday__day--selected') 
          classe += ' mini-cal-day__day--selected'
          selected = true;
        }else if(this.jornal != undefined && this.jornal.dias[day-1].reservas_present == true){
          consoleLog("opa, to metendo reservable sim")
          classe += ' mini-cal-day__day--reservable'
          reservable = true;
        }

        // this.bodyDivs[index].classList.add('mini-calday__month--current')
        
        mes = "atual";
      } else {
        // this.bodyDivs[index].classList.add('mini-calday__month--next')
        classe = ' mini-calday__month--next'
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
    this.bodyDivs[index].classList.contains('mini-calday__month--next') && 
      this.bodyDivs[index].classList.remove('mini-calday__month--next')
    this.bodyDivs[index].classList.contains('mini-calday__month--previous') && 
      this.bodyDivs[index].classList.remove('mini-calday__month--previous')
    this.bodyDivs[index].classList.contains('mini-calday__month--current') &&
      this.bodyDivs[index].classList.remove('mini-calday__month--current')
    this.bodyDivs[index].classList.contains('mini-calday__day--today') && 
      this.bodyDivs[index].classList.remove('mini-calday__day--today')
    if (selected) {
      this.bodyDivs[index].classList.contains('mini-calday__day--selected') && 
        this.bodyDivs[index].classList.remove('mini-calday__day--selected') 
    }
  }
 
  isMobile(){
    return Helpers.isMobile();
  }

}