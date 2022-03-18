import {WidgetSettings} from "../../shared/base-structures/widget-settings";
import {WidgetDefaultSettings} from "../../shared/base-structures/widget-default-settings";
import {AppStorageService} from "../../shared/storage/services/app-storage.service";
import {ElementRef} from '@angular/core';
import * as $ from "jquery";

export class WidgetService<Settings extends WidgetSettings>{
    isWorking: boolean = false;
    public settings: Settings = <Settings> {headerName: '', showHeader: false, minimized: false};
    public settingShowHeader: boolean;
    public settingHeaderName: string;
    protected storageKey: any;
    protected defaultSettings: WidgetDefaultSettings;
    constructor (protected appStorage: AppStorageService) {}

    startWork(settings: WidgetDefaultSettings, key: any): Promise<any> {
        return new Promise<any>(resolve => {
            this.defaultSettings = settings;
            this.storageKey = key;

            this.appStorage.get(this.storageKey).then(storagSettings => {
                this.settings.showHeader = this.defaultSettings.showHeaderByDefault;
                this.settings.headerName = this.defaultSettings.headerNameByDefault;

                if (storagSettings) {
                    this.settings = Object.assign(this.settings, storagSettings);
                }

                this.settingShowHeader = this.settings.showHeader;
                this.settingHeaderName = this.settings.headerName;

                resolve();
            });
        });
    }

    saveSettings() {
        if (this.settingHeaderName) this.settings.headerName = this.settingHeaderName;
        this.settings.showHeader = this.settingShowHeader;
        this.appStorage.set<Settings>(this.storageKey, this.settings);
    }
}
