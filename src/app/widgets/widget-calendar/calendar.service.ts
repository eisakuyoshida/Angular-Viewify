import {Injectable, OnDestroy} from "@angular/core";
import {CalendarSettings} from "./model/calendar-settings";
import {AppStorageService} from "../../shared/storage/services/app-storage.service";
import {WidgetService} from "../widget/widget.service";

@Injectable()
export class CalendarService extends WidgetService<CalendarSettings> implements OnDestroy{
    public settings : CalendarSettings = new CalendarSettings();
    constructor (protected appStorage: AppStorageService) {super(appStorage)}
    ngOnDestroy(): void {
        this.saveSettings();
    }
    saveSettings() {
        this.settings.CalendarUpdatedAt = new Date().toString();
        //this.appStorage.set<WeatherSettings>(this.storageKey, this.settings);
        super.saveSettings();
    }

}


