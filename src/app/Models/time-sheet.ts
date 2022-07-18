import { User } from "./user";
import { BreakTimeSheetDTO } from './break-time-sheet';

export class TimeSheetDTO
    {
         id: number;
         clockIn: Date;
         clockOut: Date;
         user: User;
         breakTimeSheets: BreakTimeSheetDTO[];
         dateFormated: string;
    }