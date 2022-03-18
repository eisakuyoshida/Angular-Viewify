import { Component, OnDestroy } from '@angular/core';

import {
    WidgetBaseComponent
} from '../../../shared/base-structures/widget-base.component';
import { AppStorageService } from '../../../shared/storage/services/app-storage.service';
import { LocationSuggest } from '../models/location-suggest';
import { WeatherSettings } from '../models/weather-settings';
import { WeatherApisService } from '../weather-apis.service';
import { WeatherService } from '../weather.service';

@Component({
    selector: 'app-widget-weather',
    templateUrl: './widget-weather.component.html',
    styleUrls: ['./widget-weather.component.scss']
})
export class WidgetWeatherComponent extends WidgetBaseComponent<WeatherSettings> implements OnDestroy {

    public locationOptions: LocationSuggest[] = [];
    public isEditingLocation = false;
    locationInputData: string = "";
    foundLocation: string;

    constructor(
        protected appStorage: AppStorageService,
        public weatherService: WeatherService,
        private weatherApisService: WeatherApisService
    ) {
        super(appStorage);
    }

    ngOnDestroy(): void {
        this.saveSettings();
    }

    widgetInit(): void {
        this.startWork(this.weatherService);
    }

    public reload(): void {
        // Todo
    }

    public saveSettings(): void {
        this.weatherService.saveSettings();
    }

    public onMinimize(value): void {
        this.weatherService.settings.minimized = value;
        this.appStorage.set<WeatherSettings>(this.storageKey, this.weatherService.settings);
    }

    onLocationSettingsChange(value) {
        if (value.checked === false) {
            this.weatherService.settings.FindAutoAddress = false;
        } else {
            this.weatherService.settings.FindAutoAddress = true;
        }
        this.saveSettings();
    }

    onChangeTempUnit(value) {
        if (value.checked === true) {
            this.weatherService.isFahrenheit = true;
            this.weatherService.addOrUpdateTempType('f');
        } else {
            this.weatherService.isFahrenheit = false;
            this.weatherService.addOrUpdateTempType('c');
        }

        this.weatherService.getWeatherForecastFahrenheit(this.weatherService.isFahrenheit);
    }

    editLocation() {
        this.foundLocation = "";
        this.locationOptions = [];
        this.isEditingLocation = true;
    }

    changeLocation(address: string) {
        this.locationOptions = [];
        this.locationInputData = address;
        this.foundLocation = address;
    }

    saveLocation() {
        this.locationOptions = [];
        this.isEditingLocation = false;

        if (this.foundLocation && this.foundLocation == this.locationInputData &&
            this.foundLocation !== this.weatherService.settings.Location.city) {

            this.weatherService.settings.Location.city = this.foundLocation;
            this.weatherService.settings.ManualAddress = this.foundLocation;
            this.weatherService.updateUserSettingsAddress()
                .then(result => {
                    this.weatherService.saveSettings();
                    this.reload();
                });
        }
        this.locationInputData = "";
        this.foundLocation = "";
    }

    getMyLocation() {
        this.locationInputData = this.weatherService.geolocation.name;
        this.foundLocation = this.weatherService.geolocation.name;
        /*this.weatherService.findMyLocation()
            .then(result => {
                this.locationInputData = this.weatherService.state;
                this.foundLocation = this.weatherService.state;
            });*/
    }

    displayFn(value):string | undefined {
        return value;
    }

    keyUpLocation() {
        let foundLocations = [];
        let redundantLocations = [];
        if (this.locationInputData.length > 0) {
            this.weatherApisService.getSuggestedLocations(this.locationInputData).then((locations: LocationSuggest[]) => {
                locations.forEach(l => {
                    if (foundLocations.length < 10) {
                        if (l.city.toLowerCase().startsWith(this.locationInputData.toLowerCase())) {
                            foundLocations.push(l);
                        } else if (l.country.toLowerCase().startsWith(this.locationInputData.toLowerCase())) {
                            foundLocations.push(l);
                        } else redundantLocations.push(l);
                    }
                });

                this.locationOptions = foundLocations.concat(redundantLocations);
            });
        } else this.locationOptions = [];
    }
}
