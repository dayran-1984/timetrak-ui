import { TimeType } from './time-type';
export class BreakTimeSheetDTO{
    id?: number;
    amount?: number;
    timeSheetId?: number;
    timeType: TimeType;
}