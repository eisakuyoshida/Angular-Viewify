import { AppStorageService } from 'src/app/shared/storage/services/app-storage.service';

import {Component, OnDestroy} from '@angular/core';

import { WidgetBaseComponent } from '../../../shared/base-structures/widget-base.component';
import { TimeSettings } from '../models/time-settings';
import {TimeService} from "../time.service";

@Component({
    selector: 'app-widget-time',
    templateUrl: './widget-time.component.html',
    styleUrls: ['./widget-time.component.scss'],
})
export class WidgetTimeComponent extends WidgetBaseComponent<TimeSettings> implements OnDestroy {

    constructor(protected appStorage: AppStorageService,
                public timeSvc: TimeService) {
        super(appStorage);
    }

    widgetInit(): void {
        this.startWork(this.timeSvc);


    }

    public reload(): void {
        // Todo
    }

    saveSettings() {
        this.timeSvc.saveSettings();
    }

    public onMinimize(value): void {
        this.timeSvc.settings.minimized = value;
        this.appStorage.set<TimeSettings>(this.storageKey, this.timeSvc.settings);
    }

    ngOnDestroy(): void {
        this.saveSettings();
    }
}

