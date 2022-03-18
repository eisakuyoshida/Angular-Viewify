import { AppStorageService } from 'src/app/shared/storage/services/app-storage.service';

import {
    ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { WidgetIframeComponent } from '../../widget-iframe/component/widget-iframe.component';
import {IframeService} from "../../widget-iframe/iframe.service";

@Component({
    selector: 'app-widget-iframe-custom',
    templateUrl: './widget-iframe-custom.component.html',
    styleUrls: ['./widget-iframe-custom.component.scss']
})
export class WidgetIframeCustomComponent extends WidgetIframeComponent {
    @Input()
    userData: string;

    @Output()
    userDataChanged = new EventEmitter<string>();

    public inputUrl: string;

    constructor(
        protected sanitizer: DomSanitizer,
        protected appStorage: AppStorageService,
        protected cdr: ChangeDetectorRef,
        protected element: ElementRef,
        public iframeSvc: IframeService
    ) {
        super(sanitizer, appStorage, cdr, element, iframeSvc);
    }

    public submitUrl(): void {
        if (this.inputUrl.indexOf('http://') === -1) {
            this.inputUrl = 'http://' + this.inputUrl;
        }
        this.settings.url = this.inputUrl;
        this.userData = this.inputUrl;
        this.userDataChanged.emit(this.inputUrl);
    }

    public get iframeUrl(): SafeResourceUrl {
        return this.userData ? this.sanitizer.bypassSecurityTrustResourceUrl(this.userData) : '';
    }
}
