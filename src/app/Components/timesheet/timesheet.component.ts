import { Component, OnInit } from '@angular/core';
import {NgbDate, NgbCalendar, NgbDateParserFormatter, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { TimeSheetService } from '../../Services/time-sheet.service';
import { TimeSheetDTO } from '../../Models/time-sheet';
import * as moment from 'moment';
import { ToastService } from '../../Services/toast-service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { TimeType } from '../../Models/time-type';
import { BreakTimeSheetDTO } from '../../Models/break-time-sheet';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss']
})
export class TimesheetComponent implements OnInit {
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  timeSheetList: TimeSheetDTO[];
  loading = false;
  clockInPushed = false;
  clockOutPushed = false;
  disabledClockOut = false;
  amountBrake: number = 1;
  typeBreak:TimeType[]=[
    {id:1,type:"Minutes"},
    {id:2,type:"Hours"},
  ]
  typeBreakSelected:number=1;

  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter, private timeSheetSVC: TimeSheetService, private toastService: ToastService, private modalService: NgbModal) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 1);
  }

  ngOnInit() {
    this.load();
  }

  load(){
    this.loading = true;
    this.timeSheetSVC.GetTimeSheetByUserId().subscribe(result => {
      this.timeSheetList = result;
      this.loading = false;
      this.clockInStarted();
    });
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) &&
        date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) { return this.toDate && date.after(this.fromDate) && date.before(this.toDate); }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) ||
        this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    let result = parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
    return result;
  }

  getRangeTimeSheets(){
    if(this.fromDate==null || this.toDate==null){
      this.toastService.show('Must be select a correct range date !!!', {
        classname: 'bg-danger text-light',
        delay: 10000,
      });
      return;
    }

    let start = `${this.fromDate.year}-${this.fromDate.month}-${this.fromDate.day}`;
    let end = `${this.toDate.year}-${this.toDate.month}-${this.toDate.day}`;
    this.loading = true;
    this.timeSheetSVC.getTimeSheetByRangeDate(start,end).subscribe(resp=>{
      this.timeSheetList = resp;
      this.loading = false;
      this.clockInPushed=false;
      this.clockOutPushed=false;
    })
  }

  clear(){
    this.fromDate = null;
    this.toDate = null;
    this.load();
  }

  duration(start:Date,end:Date){
    let _start = moment(start);
    let _end = moment(end);
    if(end == null)
      _end = moment(new Date());
      
      let _duration = moment.duration(_end.diff(_start));
      return _duration.asHours() < 2 ? `${_duration.asHours().toFixed(2)} Hour` : `${_duration.asHours().toFixed(2)} Hours`;
    
  }

  clockInClockOutFormat(_date:Date){
    let _moment = moment(_date);
    return _moment.format('LT');
  }

  addClockIn(){
    this.timeSheetSVC.addClockIn().subscribe(resp =>{
      this.load();
      this.toastService.show('Clock-In Pushed. Welcome to job !!!', {
        classname: 'bg-success text-light',
        delay: 10000,
      });
    });
  }

  addClockOut(){
    this.timeSheetSVC.addClockOut().subscribe(resp =>{
      this.load();
      this.toastService.show('Clock-Out Pushed. Bye bye !!!', {
        classname: 'bg-danger text-light',
        delay: 10000,
      });
    });
  }

  clockInStarted(){
    if(this.timeSheetList.length > 0){
      var tsToday = this.timeSheetList[0];
      var _tsClockIn = new Date(tsToday.clockIn).toDateString();
      let now = new Date().toDateString();
      this.clockInPushed = _tsClockIn===now ? false : true;
      this.clockOutPushed = !this.clockInPushed;
      this.disabledClockOut = tsToday.clockOut != null ? true : false;
    }
    else
      this.clockInPushed = true;
  }

  addBreak(content,tsId) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      let bts:BreakTimeSheetDTO = {
        id: 0,
        amount: this.amountBrake,
        timeType: {id: this.typeBreakSelected, type: "" },
        timeSheetId: 0
      }
      this.timeSheetSVC.addBreak(bts).subscribe(result=>{
        console.log(result);
        this.toastService.show('Break Added :)', {
          classname: 'bg-success text-light',
          delay: 10000,
        });
        this.load();
      });
    }, (reason) => {
      console.log(`Dismissed ${this.getDismissReason(reason)}`);
    });    
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }  

}
