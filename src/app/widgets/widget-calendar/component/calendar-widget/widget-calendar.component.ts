import {Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import {CalendarSettings} from "../../model/calendar-settings";
import {CalendarService} from "../../calendar.service";
import {WidgetBaseComponent} from "../../../../shared/base-structures/widget-base.component";
import {AppStorageService} from "../../../../shared/storage/services/app-storage.service";
import {CalendarComponent} from '../../component/calendar/calendar.component';
@Component({
    selector: 'app-widget-calendar',
    templateUrl: './widget-calendar.component.html',
    styleUrls: ['./widget-calendar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class WidgetCalendarComponent extends WidgetBaseComponent<CalendarSettings> implements OnDestroy {

    view: string = "month";
    viewDate: Date = new Date();

    constructor(protected appStorage: AppStorageService,
                public calendarService: CalendarService) { super(appStorage); }

    public widgetInit(): void {
        this.startWork(this.calendarService);
    }

    ngOnDestroy(): void {
        this.saveSettings();
    }


    public reload(): void {
        // this.operation = '';
        // this.result = '';
        // view = "month";
        // viewDate = new Date();
    
    }

    saveSettings() {
        this.calendarService.saveSettings();
    }

    public onMinimize(value): void {
        this.calendarService.settings.minimized = value;
        this.appStorage.set<CalendarSettings>(this.storageKey, this.calendarService.settings);
    }
   
}
