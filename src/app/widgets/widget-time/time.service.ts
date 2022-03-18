import {Injectable, OnDestroy} from "@angular/core";
import {WidgetService} from "../widget/widget.service";
import {TimeSettings} from "./models/time-settings";
import {AppStorageService} from "../../shared/storage/services/app-storage.service";
import {WidgetDefaultSettings} from "../../shared/base-structures/widget-default-settings";

@Injectable()
export class TimeService extends WidgetService<TimeSettings> implements OnDestroy {
    public currentTime: number;
    private interval: number;
    constructor (protected appStorage: AppStorageService) {super(appStorage)}


    ngOnDestroy(): void {
        clearInterval(this.interval);
    }

    startWork(settings: WidgetDefaultSettings, key: any): Promise<any> {
        return new Promise<any>(resolve => {
            super.startWork(settings, key);
            this.currentTime = Date.now();
            this.interval = setInterval(() => this.currentTime = Date.now(), 1000);
            resolve();
        });
    }
}
