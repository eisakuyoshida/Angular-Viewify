import {Component, OnDestroy} from '@angular/core';
import { WidgetBaseComponent } from '../../../shared/base-structures/widget-base.component';
import { WhatsappSettings } from '../models/whatsapp-settings'
import { AppStorageService } from 'src/app/shared/storage/services/app-storage.service';
import {WhatsappService} from "../whatsapp.service";

@Component({
    selector: 'app-widget-whatsapp',
    templateUrl: './widget-whatsapp.component.html',
    styleUrls: ['./widget-whatsapp.component.scss'],
})
export class WidgetWhatsappComponent extends WidgetBaseComponent<WhatsappSettings> implements OnDestroy {
    doubleWidth: boolean = false;

    constructor(protected appStorage: AppStorageService,
                public whatsappSvc: WhatsappService) {
        super(appStorage);
    }

    public widgetInit() {
        this.startWork(this.whatsappSvc);
    }

    public reload() {
    }

    saveSettings() {
        this.whatsappSvc.saveSettings();
    }

    public onMinimize(value): void {
        this.whatsappSvc.settings.minimized = value;
        this.appStorage.set<WhatsappSettings>(this.storageKey, this.whatsappSvc.settings);
    }

    ngOnDestroy(): void {
        this.saveSettings();
    }

    stretchWindow(target) {
        this.doubleWidth = !this.doubleWidth;

        if (this.doubleWidth) {
            $(target).closest('.column-layer').addClass('widget-doubleWidth');
        } else $(target).closest('.column-layer').removeClass('widget-doubleWidth');
    }

}
