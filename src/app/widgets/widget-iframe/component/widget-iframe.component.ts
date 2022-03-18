import { AppStorageService } from 'src/app/shared/storage/services/app-storage.service';

import {
    ChangeDetectorRef, Component, ElementRef, Input, OnDestroy
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { WidgetBaseComponent } from '../../../shared/base-structures/widget-base.component';
import { IframeSettings } from '../models/iframe-settings';
import { WidgetIframeSettings } from '../widget-iframe-settings';
import {IframeService} from "../iframe.service";

@Component({
    selector: 'app-widget-iframe',
    templateUrl: './widget-iframe.component.html',
    styleUrls: ['./widget-iframe.component.scss']
})
export class WidgetIframeComponent extends WidgetBaseComponent<IframeSettings> implements OnDestroy {
    @Input() settings: WidgetIframeSettings;
    url: SafeResourceUrl;

    constructor(
        protected sanitizer: DomSanitizer,
        protected appStorage: AppStorageService,
        protected cdr: ChangeDetectorRef,
        protected element: ElementRef,
        public iframeSvc: IframeService
    ) {
        super(appStorage);
    }

    widgetInit() {
        this.startWork(this.iframeSvc);
        this.showIframe();
    }

    protected showIframe(): void {
        if (this.settings.url) {
            this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.settings.url);
            this.cdr.markForCheck();
        }
    }

    public reload(): void {
        const iframe = this.element.nativeElement.querySelector('iframe');
        if (iframe) {
            iframe.src = iframe.src;
        }
    }

    public onMinimize(value): void {
        this.iframeSvc.settings.minimized = value;
        this.appStorage.set<IframeSettings>(this.storageKey, this.iframeSvc.settings);
    }

    saveSettings() {
        this.iframeSvc.saveSettings();
    }

    ngOnDestroy(): void {
        this.saveSettings();
    }
}
