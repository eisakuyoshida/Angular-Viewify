import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WidgetCalendarComponent} from './component/calendar-widget/widget-calendar.component';
import {
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatCardModule,
    MatSlideToggleModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {WidgetModule} from "../widget/widget.module";

import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import {CalendarComponent} from './component/calendar/calendar.component'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModalModule,

        ReactiveFormsModule,
        MatMenuModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatSlideToggleModule,
        WidgetModule,
        
        FlatpickrModule.forRoot(),
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
          })        
    ],
    declarations: [
        WidgetCalendarComponent,CalendarComponent
    ],
    exports: [
        WidgetCalendarComponent,CalendarComponent
    ],
})
export class WidgetCalendarModule {
}
