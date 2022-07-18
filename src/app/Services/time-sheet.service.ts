import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { TimeSheetDTO } from '../Models/time-sheet';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { TimeType } from '../Models/time-type';
import { BreakTimeSheetDTO } from '../Models/break-time-sheet';

const routes = {
  getTimeSheetByUserId: () => `${environment.apiUrl}/TimeSheet/getTimeSheetByUserId`,
  addClockIn: () => `${environment.apiUrl}/TimeSheet/AddClockIn`,
  addClockOut: () => `${environment.apiUrl}/TimeSheet/AddClockOut`,
  getTimeSheetByRangeDate: (start:string, end:string) => `${environment.apiUrl}/TimeSheet/GetTimeSheetByRangeDate/${start}/${end}`,
  addBreak: `${environment.apiUrl}/TimeSheet/AddBreake`,
};

@Injectable({
  providedIn: 'root'
})
export class TimeSheetService {
  
  constructor(private http: HttpClient,) { }

  GetTimeSheetByUserId(){
    return this.http.get<TimeSheetDTO[]>(`${routes.getTimeSheetByUserId()}`, {}).pipe(
      map(
        (ts) => {
          ts.forEach(t=>{       
            let myMoment: moment.Moment = moment(new Date(t.clockIn));
            t.dateFormated = myMoment.format("ddd, MMM DD");
          });
          return ts;
          }
      )
      );
  }

  getTimeSheetByRangeDate(start:string, end:string){
    return this.http.get<TimeSheetDTO[]>(`${routes.getTimeSheetByRangeDate(start, end)}`, {}).pipe(
      map(
        (ts) => {
          ts.forEach(t=>{       
            let myMoment: moment.Moment = moment(new Date(t.clockIn));
            t.dateFormated = myMoment.format("ddd, MMM DD");
          });
          return ts;
          }
      )
      );
  }

  addClockIn(){
    return this.http.post<TimeSheetDTO>(`${routes.addClockIn()}`, {});
  }

  addClockOut(){
    return this.http.post<TimeSheetDTO>(`${routes.addClockOut()}`, {});
  }

  addBreak(bts:BreakTimeSheetDTO){
    return this.http.post<TimeType>(`${routes.addBreak}`,bts);
  }
}
