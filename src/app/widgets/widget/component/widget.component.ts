import { Observable, Subscription } from 'rxjs';
import { WidgetSettings } from 'src/app/shared/base-structures/widget-settings';

import {
    ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef,
    ViewChild, ViewEncapsulation
} from '@angular/core';
import { DialogPosition, MatDialog, MatDialogRef } from '@angular/material';

import { WidgetDefaultSettings } from '../../../shared/base-structures/widget-default-settings';
import { WidgetType } from '../../../shared/base-structures/widget-type';

import * as $ from "jquery";

@Component({
    selector: 'app-widget-full',
    template: '<ng-content></ng-content>',
})
export class WidgetFullComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }
}

@Component({
    selector: 'app-widget-icon',
    template: '<div class="app-widget-icon-wrapper"><ng-content></ng-content></div>',
    styles: [
        `.app-widget-icon-wrapper, .app-widget-icon-wrapper > * {
            width: 100%;
            height: 100%;
        }`,
    ],
    encapsulation: ViewEncapsulation.None,
})
export class WidgetIconComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }
}

@Component({
    selector: 'app-widget-settings-on-adding',
    template: `
        <div class="setting-item">
            <span class="setting-item-label">Widget Header</span>
            <mat-slide-toggle (change)="onHeaderToggle($event)" [checked]="settings.showHeader"></mat-slide-toggle>
        </div>
        <div class="setting-item">
            <span class="setting-item-label">Widget Name</span>
            <mat-form-field>
                <input matInput [(ngModel)]="settings.headerName" (keyup)="sync()"
                    autocomplete="off" spellcheck="false">
            </mat-form-field>
        </div>
        <ng-content></ng-content>
    `,
})
export class WidgetSettingsOnAddingComponent implements OnInit {
    @Input() settings: WidgetSettings;
    @Output() syncSettings: EventEmitter<WidgetSettings> = new EventEmitter<WidgetSettings>();

    constructor() { }

    ngOnInit() {
    }

    public onHeaderToggle(value): void {
        if (value.checked === false) {
            this.settings.showHeader = false;
        } else {
            this.settings.showHeader = true;
        }
        this.sync();
    }

    sync(): void {
        this.syncSettings.emit(this.settings);
    }
}

@Component({
    selector: 'app-widget-settings',
    template: '<ng-content></ng-content>',
})
export class WidgetSettingsComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }
}

@Component({
    selector: 'app-widget',
    templateUrl: './widget.component.html',
    styleUrls: ['./widget.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class WidgetComponent implements OnInit, OnDestroy {

    @Input() headerName: string;
    @Input() showHeader: boolean;
    @Input() frozen = false;
    @Input() open: Observable<any>;
    @Input() hide: Observable<any>;
    @Input() remove: Observable<any>;
    @Input() opened: () => any;
    @Input() type: WidgetType;
    @Input() settings: WidgetDefaultSettings;
    @Input() minimizedSubj: Observable<any>;

    @Output() reload: EventEmitter<any> = new EventEmitter();
    @Output() hideWidget: EventEmitter<any> = new EventEmitter();
    @Output() minimizedEmiter: EventEmitter<any> = new EventEmitter();
    @Output() save: EventEmitter<any> = new EventEmitter();

    @ViewChild('full') fullTpl: TemplateRef<any>;
    //private settingsDialogRef: MatDialogRef<any, any>;
    //@ViewChild('settings') settingsTpl: TemplateRef<any>;
    private matDialogRef: MatDialogRef<any, any>;
    private sub: Subscription = new Subscription();
    protected _ignoreHideMenu = false;
    openFullWindow: boolean = true;
    openSettings: boolean = false;
    openDeleteWindow: boolean = false;
    minimized: boolean = false;

    constructor(
        public dialog: MatDialog,
        private cdr: ChangeDetectorRef,
        public element: ElementRef
    ) {
    }

    ngOnInit() {
        if (this.type === WidgetType.icon && !this.frozen) {
            if (this.hide) {
                // TODO check if it's necessary to remove subscriber on destroy
                this.hide.subscribe(() => {
                    if (this._ignoreHideMenu) {
                        this._ignoreHideMenu = false;
                        return;
                    } else {
                        if (this.matDialogRef) {
                            this.matDialogRef.close();
                            this.matDialogRef = null;
                            this.cdr.markForCheck();
                        }
                    }
                });
            }
        }

        if (this.open) {
            this.open.subscribe(() => this.iconClick());
        }

        if (this.remove) {
            this.remove.subscribe(() => {
                this.openDeleteWindow = true;
                this.iconClick();
            })
        }

        if (this.minimizedSubj) {
            this.minimizedSubj.subscribe((result) => {
                this.minimized = !result;
                this.minimizeWidget(this.element.nativeElement);
            });
        }
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    public iconClick(): void {
        if (!this.frozen) {
            if (!this.matDialogRef) {
                this.opened();
                this.matDialogRef = this.dialog.open(this.fullTpl, {
                    hasBackdrop: false,
                    panelClass: 'app-widget-modal-overlay',
                    data: {
                        widgets: []
                    },
                    position: this.dialogPosition
                });
                this.sub.add(this.matDialogRef.afterOpen().subscribe(() => {
                    $('.app-widget-modal-overlay').css('overflow-y', 'auto');
                }));
                this.sub.add(this.matDialogRef.beforeClose().subscribe(() => {
                    $('.app-widget-modal-overlay').css('overflow-y', 'hidden');
                }));
            } else {
                this.matDialogRef.close();
                this.matDialogRef = null;
            }
        }
    }

    public onOpenSettings(): void {
        this.openDeleteWindow = false;
        this.openSettings = !this.openSettings;
    }

    public onHideWidget(): void {
        if (this.matDialogRef) {
            this.matDialogRef.close();
            this.matDialogRef = null;
        }
        this.hideWidget.emit();
    }

    public closeWidget(): void {
        this.openDeleteWindow = false;
        if (this.matDialogRef) {
            this.matDialogRef.close();
            this.matDialogRef = null;
        }
    }

    public saveSettings(): void {
        this.openSettings = !this.openSettings;
        this.save.emit();
    }

    public minimizeWidget(target) {
        if (this.minimized) {
            this.minimized = false;
            this.openFullWindow = true;
            this.minimizedEmiter.emit(false);
            $(target).closest('.column-layer').removeClass('widget-minimize');
        } else {
            this.minimized = true;
            this.openSettings = false;
            this.openDeleteWindow = false;
            this.openFullWindow = false;
            this.minimizedEmiter.emit(true);
            $(target).closest('.column-layer').addClass('widget-minimize');
        }
    }

    public declineDelete() {
        this.openDeleteWindow = false;
    }

    public askForDelete() {
        this.openDeleteWindow = !this.openDeleteWindow;
    }

    private get dialogPosition(): DialogPosition {
        if (this.settings && this.settings.widgetIconSettings &&
            this.settings.widgetIconSettings.dialogMarginBottom && this.settings.widgetIconSettings.dialogMarginLeft) {
            return {
                bottom: this.settings.widgetIconSettings.dialogMarginBottom + 'px',
                left: this.settings.widgetIconSettings.dialogMarginLeft + 'px'
            };
        }
        return {
            top: '70px',
            left: '70px'
        };
    }

}
