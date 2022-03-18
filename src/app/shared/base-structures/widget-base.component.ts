import {Observable, Subject} from 'rxjs';

import { EventEmitter, Input, OnInit, Output } from '@angular/core';

import { AppStorageKey } from '../storage/models/app-storage-key';
import { AppStorageService } from '../storage/services/app-storage.service';
import { WidgetDefaultSettings } from './widget-default-settings';
import { WidgetSettings } from './widget-settings';
import { WidgetType } from './widget-type';
import {WidgetService} from "../../widgets/widget/widget.service";

export abstract class WidgetBaseComponent<Settings extends WidgetSettings> implements OnInit {
    @Input() key: string;
    @Input() type: WidgetType;
    @Input() settings: WidgetDefaultSettings;
    @Input() frozen = false;
    @Input() hide: Observable<any>;
    @Input() remove: Observable<any>;
    @Input() open: Observable<any>;
    @Input() opened: () => any;

    @Output() hideWidget = new EventEmitter<void>();
    //uses only on creating widget component
    minimizedOnStart: Subject<any> = new Subject<any>();

    public settingsStorage: Settings = <Settings>{ headerName: '', showHeader: false, minimized: false };

    protected storageKey: AppStorageKey<Settings>;

    constructor(protected appStorage: AppStorageService) { }

    ngOnInit(): void {
        if (!this.key) {
            throw Error('Widget key is missing!');
        }
        this.storageKey = new AppStorageKey<Settings>(`widget-${this.key}-settings`);

        this.beboreGetSettingsFromStorage();

        this.loadSettingsFromStorage().then(() => {
            this.widgetInit();
        });
    }

    public abstract widgetInit(): void;
    public abstract reload(): void;
    public abstract saveSettings(): void;
    public abstract onMinimize(value: boolean): void;

    public syncSettingsStorage(): void {
        this.appStorage.setSync<Settings>(this.storageKey, this.settingsStorage);
    }

    public onOpened(): () => void {
        return () => {
            this.loadSettingsFromStorage();
            this.opened();
        };
    }

    protected startWork(service: WidgetService<Settings>) {
        if (!service.isWorking) {
            service.isWorking = true;
            service.startWork(this.settings, this.storageKey)
                .then(() => {
                    this.minimizedOnStart.next(service.settings.minimized);
                });
        } else {
            this.minimizedOnStart.next(service.settings.minimized);
        }
    }

    protected beboreGetSettingsFromStorage(): void {
        // Override if needed in actual widgets
    }

    protected getSettingsObject(settings: Settings): Settings {
        // need override in widget where Settings is a typed object!
        return Object.assign(<Settings>{}, settings);
    }

    private loadSettingsFromStorage(): Promise<void> {
        return this.appStorage.get(this.storageKey).then(settings => {
            if (settings) {
                this.settingsStorage = this.getSettingsObject(settings);
            } else {
                this.settingsStorage.showHeader = this.settings.showHeaderByDefault;
                this.settingsStorage.headerName = this.settings.headerNameByDefault;
            }
        });
    }
}
