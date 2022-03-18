import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material';

@Component({
    selector: 'app-date-picker',
    template: `
        <mat-form-field>
            <input matInput [matDatepicker]="picker" [value]="date" (dateChange)="onDateChanged($event)">
            <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
        <!--<mat-datepicker-toggle [for]="picker"></mat-datepicker-toggle>-->
        <i class="far fa-calendar-alt" (click)="picker.open()"></i>

    `,
    styles: [`
        mat-form-field {
            width: 0 !important;
            height: 0 !important;
            margin: 0 !important;
        }
    `]
})
export class DatePickerComponent {
    @Input() date: Date;
    @Output() dateChange = new EventEmitter<Date>();
    @Output() openCalendar = new EventEmitter<void>();

    public onDateChanged(event: MatDatepickerInputEvent<Date>): void {
        this.dateChange.emit(event.target.value);
    }
}
