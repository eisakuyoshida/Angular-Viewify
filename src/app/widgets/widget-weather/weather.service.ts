import { Subject } from 'rxjs';

import {Injectable, OnDestroy} from '@angular/core';
import { Location } from './models/location';
import { WeatherSettings } from './models/weather-settings';
import {AppStorageService} from "../../shared/storage/services/app-storage.service";
import {WidgetService} from "../widget/widget.service";
import {WidgetDefaultSettings} from "../../shared/base-structures/widget-default-settings";
import {WeatherApisService} from "./weather-apis.service";
import {Subscription} from "rxjs/Rx";
import {UtilsService} from "../../shared/utils/utils.service";
import {HttpClient} from "@angular/common/http";
import {GeolocationModel} from "../../shared/model/geolocation.model";
import {ChromeStorageService} from "../../shared/storage/services/chrome-storage.service";
import {widget_storage_keys} from "../../shared/model/storage-keys";

@Injectable()
export class WeatherService extends WidgetService<WeatherSettings> implements OnDestroy {
    private geoUrl = "http://api.geonames.org/findNearbyJSON?lat=";
    public settings: WeatherSettings = new WeatherSettings();
    private getWeatherForecastSub = new Subject<boolean>();
    public getWeatherForecast$ = this.getWeatherForecastSub.asObservable();

    public tempType = "";
    private userIpAddress: string;
    state: string = "";
    public isFahrenheit = true;
    private interval;
    public geolocation: GeolocationModel = new GeolocationModel();
    private sub = new Subscription();

    private _tempTypeKey = 'widget-weather-temp-type';

    constructor (protected appStorage: AppStorageService,
                 private weatherApiSvc: WeatherApisService,
                 private chromeStorage: ChromeStorageService,
                 private http: HttpClient,
                 private utils: UtilsService) {super(appStorage);}

    ngOnDestroy(): void {
        clearInterval(this.interval);
        this.sub.unsubscribe();
        this.saveSettings();
    }

    public addOrUpdateTempType(newContent: string): void {
        this.tempType = newContent;
        this.sync();
    }
    public getTempType(): any {
        return new Promise(resolve => {
            chrome.storage.sync.get(this._tempTypeKey, data => {
                if (data.tempType != null) {
                    this.tempType = data.tempType;
                    resolve(this.tempType);
                } else {
                    resolve('');
                }
            });
        });
    }

    public sync(): void {
        chrome.storage.sync.set({ tempType: this.tempType });
    }

    public getWeatherForecastFahrenheit(isFahrenheit: boolean): void {
        this.getWeatherForecastSub.next(isFahrenheit);
    }

    public getWeatherForecast(woeid: number): void {
        if (this.isFahrenheit) {
            this.settings.TempType = 'f';
        } else {
            this.settings.TempType = 'c';
        }

        this.weatherApiSvc.getWeatherForecast(woeid, this.settings.TempType).then(data => {
            this.settings.WeatherDatas = data;
            this.saveSettings();
        });
    }

    startWork(settings: WidgetDefaultSettings, key: any): Promise<any> {
        /*avigator.geolocation.getCurrentPosition((success: any) => {
            this.http.get(this.geoUrl+success.coords.latitude+"&lng="+success.coords.longitude+"&username=bezr")
                .subscribe((result: any) => {
                    console.log(result.geonames[0]);
                    if (result && result.geonames[0].name) this.settings.ManualAddress = result.geonames[0].name;
                });
        }, (error: any) => {});*/

        this.interval = setInterval(() => {
            this.updateUserSettingsAddress()
                .then(result => {
                    this.saveSettings();
                });
        },3600000);

        return new Promise<any>(resolve => {
            this.sub.add(this.getWeatherForecast$.subscribe(isFahrenheit => {
                this.isFahrenheit = isFahrenheit;
                this.getWeatherForecast(this.settings.Location.woeid);
            }));

            super.startWork(settings, key)
                .then(result => {
                    this.getMyGeoLocation(false)
                        .then(result => {
                            if (this.settings.needUpdateWeather || !this.settings.Location.city) {
                                this.getUserLocation(this.settings.ManualAddress).then(location => {
                                    this.settings.Location = location;
                                    this.getTempType().then(data => {
                                        this.settings.TempType = data;
                                        this.CheckStoredTempType();
                                        this.utils.getIpAddress().subscribe(resp => {
                                            this.userIpAddress = resp['ip'];
                                            if (this.settings !== undefined) {
                                                if (this.userIpAddress !== this.settings.IpAddress || this.settings.needUpdateWeather) {
                                                    this.getWeatherForecast(location.woeid);
                                                }
                                            } else {
                                                this.getWeatherForecast(location.woeid);
                                            }
                                        });
                                    });
                                    this.saveSettings();
                                    resolve();
                                });
                            } else {
                                this.saveSettings();
                                resolve();
                            }
                        });
                });
        });
    }

    public getUserLocation(userLocation: string): Promise<Location> {
        return new Promise(resolve => {
            if (!userLocation) {
                if (this.settings && this.settings.Location
                    && this.settings.Location.woeid && this.settings.Location.city) {
                    resolve(this.settings.Location);
                } else {
                    this.weatherApiSvc.getLocationBasedOnIp().then(location => {
                        this.settings.Location = location;
                        resolve(location);
                    });
                }
            } else {
                this.weatherApiSvc.getLocationBasedOnSearchText(userLocation).then(location => {
                    if (!location) {
                        alert('Location not found');
                        this.settings.ManualAddress = this.settings.Location.city;
                        resolve(null);
                        return;
                    } else {
                        this.settings.Location = location;
                        //this.saveSettings();
                        resolve(location);
                    }
                });
            }
        });
    }

    saveSettings() {
        this.settings.WeatherUpdatedAt = new Date().toString();
        //this.appStorage.set<WeatherSettings>(this.storageKey, this.settings);
        super.saveSettings();
    }

    CheckStoredTempType() {
        if (this.settings.TempType !== '') {
            if (this.settings.TempType === 'f') {
                this.isFahrenheit = true;
            } else {
                this.isFahrenheit = false;
            }
        } else {
            // if user comes fr the first time
            // if (this.woeid && this.woeid.toString() === '23424977') { // for usa only, defalut is Fahrenheit
            if (this.settings.Location.woeid.toString() === '23424977') { // for usa only, defalut is Fahrenheit
                this.isFahrenheit = true;
            } else {
                this.isFahrenheit = false;
            }
        }
    }

    updateUserSettingsAddress(): Promise<any> {
        return new Promise<any>(resolve => {
            this.settings.FindAutoAddress = false;
            //this.saveSettings();
            this.getUserLocation(this.settings.ManualAddress).then(location => {
                if (location) {
                    this.settings.Location = location;
                    this.getTempType().then(data => {
                        this.settings.TempType = data;
                        this.CheckStoredTempType();
                        this.utils.getIpAddress().subscribe(resp => {
                            this.userIpAddress = resp['ip'];
                            this.getWeatherForecast(location.woeid);
                        });
                        resolve();
                    });
                } else resolve();
            });
        });
    }

    findMyLocation(): Promise<any> {
        return new Promise<any>(resolve => {
            navigator.geolocation.getCurrentPosition((success: any) => {
                this.http.get(this.geoUrl+success.coords.latitude+"&lng="+success.coords.longitude+"&username=bezr")
                    .subscribe((result: any) => {
                        if (result && result.geonames[0].name) {
                            this.settings.ManualAddress = result.geonames[0].name;
                            this.geolocation.name = result.geonames[0].name;
                            this.geolocation.updateTime = new Date().getTime();
                            this.chromeStorage.set(widget_storage_keys.geo, this.geolocation);
                            this.state = result.geonames[0].name;
                            resolve();
                        } else {
                            this.http.get("http://api.ipstack.com/check?access_key=3589f68db60f0f3e4898489508833085&format=1")
                                .subscribe((location: any) => {
                                    this.state = location.city;
                                    resolve();
                                });
                        }
                    }, error => {});
            }, error2 => {
                this.http.get("http://api.ipstack.com/check?access_key=3589f68db60f0f3e4898489508833085&format=1")
                    .subscribe((location: any) => {
                        this.state = location.city;
                        resolve();
                    });
            });
        });
    }

    public weatherIcon(conditionCode?: string): string {
        if (!conditionCode && !this.settings.WeatherDatas[0]) {
            return '<i class="wi wi-cloud"></i>';
        }
        if (this.settings.WeatherDatas[0].conditionCode !== undefined) {
            switch (conditionCode || this.settings.WeatherDatas[0].conditionCode.toString()) {
                case '0': return '<i class="wi wi-tornado"></i>';
                case '1': return '<i class="wi wi-storm-showers"></i>';
                case '2': return '<i class="wi wi-tornado"></i>';
                case '3': return '<i class="wi wi-thunderstorm"></i>';
                case '4': return '<i class="wi wi-thunderstorm"></i>';
                case '5': return '<i class="wi wi-snow"></i>';
                case '6': return '<i class="wi wi-rain-mix"></i>';
                case '7': return '<i class="wi wi-rain-mix"></i>';
                case '8': return '<i class="wi wi-sprinkle"></i>';
                case '9': return '<i class="wi wi-sprinkle"></i>';
                case '10': return '<i class="wi wi-hail"></i>';
                case '11': return '<i class="wi wi-showers"></i>';
                case '12': return '<i class="wi wi-showers"></i>';
                case '13': return '<i class="wi wi-snow"></i>';
                case '14': return '<i class="wi wi-storm-showers"></i>';
                case '15': return '<i class="wi wi-snow"></i>';
                case '16': return '<i class="wi wi-snow"></i>';
                case '17': return '<i class="wi wi-hail"></i>';
                case '18': return '<i class="wi wi-hail"></i>';
                case '19': return '<i class="wi wi-cloudy-gusts"></i>';
                case '20': return '<i class="wi wi-fog"></i>';
                case '21': return '<i class="wi wi-fog"></i>';
                case '22': return '<i class="wi wi-fog"></i>';
                case '23': return '<i class="wi wi-cloudy-gusts"></i>';
                case '24': return '<i class="wi wi-cloudy-windy"></i>';
                case '25': return '<i class="wi wi-thermometer"></i>';
                case '26': return '<i class="wi wi-cloudy"></i>';
                case '27': return '<i class="wi wi-night-cloudy"></i>';
                case '28': return '<i class="wi wi-day-cloudy"></i>';
                case '29': return '<i class="wi wi-night-cloudy"></i>';
                case '30': return '<i class="wi wi-day-cloudy"></i>';
                case '31': return '<i class="wi wi-night-clear"></i>';
                case '32': return '<i class="wi wi-day-sunny"></i>';
                case '33': return '<i class="wi wi-night-clear"></i>';
                case '34': return '<i class="wi wi-day-sunny-overcast"></i>';
                case '35': return '<i class="wi wi-hail"></i>';
                case '36': return '<i class="wi wi-day-sunny"></i>';
                case '37': return '<i class="wi wi-thunderstorm"></i>';
                case '38': return '<i class="wi wi-thunderstorm"></i>';
                case '39': return '<i class="wi wi-thunderstorm"></i>';
                case '40': return '<i class="wi wi-storm-showers"></i>';
                case '41': return '<i class="wi wi-snow"></i>';
                case '42': return '<i class="wi wi-snow"></i>';
                case '43': return '<i class="wi wi-snow"></i>';
                case '44': return '<i class="wi wi-cloudy"></i>';
                case '45': return '<i class="wi wi-lightning"></i>';
                case '46': return '<i class="wi wi-snow"></i>';
                case '47': return '<i class="wi wi-thunderstorm"></i>';
                case '3200': return '<i class="wi wi-cloud"></i>';
                default: return '<i class="wi wi-cloud"></i>';
            }
        } else {
            return '<i class="wi wi-cloud"></i>';
        }
    }

    private getMyGeoLocation(needUpdate: boolean): Promise<any> {
        return new Promise<any>(resolve => {
            if (!this.settings.ManualAddress || needUpdate) {
                this.chromeStorage.get(widget_storage_keys.geo)
                    .subscribe((location: GeolocationModel) => {
                        if (location && location.name) {
                            this.settings.ManualAddress = location.name;
                            this.geolocation = location;
                        }

                        if (!this.settings.ManualAddress) {
                            navigator.geolocation.getCurrentPosition((success: any) => {
                                this.http.get(this.geoUrl+success.coords.latitude+"&lng="+success.coords.longitude+"&username=bezr")
                                    .subscribe((result: any) => {
                                        if (result && result.geonames[0].name) this.settings.ManualAddress = result.geonames[0].name;
                                        this.geolocation.name = result.geonames[0].name;
                                        this.geolocation.updateTime = new Date().getTime();
                                        this.chromeStorage.set(widget_storage_keys.geo, this.geolocation);
                                        resolve();
                                    });
                            }, (error: any) => resolve());
                        }
                    });
            } else resolve();
        });
    }
}
