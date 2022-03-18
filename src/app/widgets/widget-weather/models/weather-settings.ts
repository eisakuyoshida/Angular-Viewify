import { WidgetSettings } from 'src/app/shared/base-structures/widget-settings';

import { Location } from '../models/location';
import { Astronomy, Atmosphere, Unit, WeatherData, Wind } from './weather-data';

export class WeatherSettings extends WidgetSettings {
    public IpAddress: string;
    public WeatherUpdatedAt: string;
    public WeatherDatas: WeatherData[] = [];
    public FindAutoAddress = true;
    public ManualAddress: string;
    public WeatherLocation: string;
    public Location = new Location();
    public TempType: string;

    public get currentTemperature(): string {
        return this.WeatherDatas[0] && this.WeatherDatas[0].temp !== undefined && this.WeatherDatas[0].temp.toString() !== 'NaN' ?
            this.WeatherDatas[0].temp.toString() : '';
    }

    public get currentStatus(): string {
        return this.WeatherDatas[0] && this.WeatherDatas[0].condition;
    }

    public get currentWind(): Wind {
        return this.WeatherDatas[0] && this.WeatherDatas[0].wind || {};
    }

    public get currentAtmosphere(): Atmosphere {
        return this.WeatherDatas[0] && this.WeatherDatas[0].atmosphere || {};
    }

    public get currentAstronomy(): Astronomy {
        return this.WeatherDatas[0] && this.WeatherDatas[0].astronomy || {};
    }

    public get currentUnit(): Unit {
        return this.WeatherDatas[0] && this.WeatherDatas[0].unit || {};
    }

    public get needUpdateWeather(): boolean {
        return this.WeatherDatas.length === 0 || (this.WeatherUpdatedAt ?
            Math.floor((new Date().getTime() - new Date(this.WeatherUpdatedAt).getTime()) / 1000 / 60 / 60) > 0 : true);
    }
}
