import * as OAuth from 'oauth-1.0a';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Location } from './models/location';   
import { LocationSuggest } from './models/location-suggest';
import { WeatherData } from './models/weather-data';

@Injectable()
export class WeatherApisService {
    private apiUrl = 'https://weather-ydn-yql.media.yahoo.com/forecastrss';

    private clientOAuthOptions: OAuth.Options = {
        consumer: {
            key: 'dj0yJmk9ZmFVb2cya3E1Ym03JmQ9WVdrOVZsUlBjWHBQTldVbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD02Yw--',
            secret: 'fb6a2ac83f818dd2cf47bca7c836b40039f9f5cd'
        },
        signature_method: 'PLAINTEXT',
        realm: ''
    };

    constructor(private http: HttpClient) { }

    public getWeatherForecast(woeid: number, tempType: string): Promise<WeatherData[]> {
        return new Promise(resolve => {
            const oauth = new OAuth(this.clientOAuthOptions);
            $.ajax({
                url: this.apiUrl,
                type: 'POST',
                data: oauth.authorize({
                    url: this.apiUrl,
                    method: 'POST',
                    data: { w: woeid, u: tempType }
                })
            }).done(function (data) {
                const weatherDatas: WeatherData[] = [];
                const condition = $(data).find('item>yweather\\:condition');
                const wind = $(data).find('channel>yweather\\:wind');
                const atmosphere = $(data).find('channel>yweather\\:atmosphere');
                const astronomy = $(data).find('channel>yweather\\:astronomy');
                const units = $(data).find('channel>yweather\\:units');
                weatherDatas.push({
                    day: 'Today',
                    temp: parseInt(condition.attr('temp'), 10),
                    conditionCode: parseInt(condition.attr('code'), 10),
                    condition: condition.attr('text'),
                    wind: { chill: +wind.attr('chill'), direction: +wind.attr('direction'), speed: +wind.attr('speed') },
                    atmosphere: { humidity: +atmosphere.attr('humidity'), pressure: +atmosphere.attr('pressure') },
                    astronomy: { sunrise: astronomy.attr('sunrise'), sunset: astronomy.attr('sunset') },
                    unit: {
                        distance: units.attr('distance'), pressure: units.attr('pressure'),
                        speed: units.attr('speed'), temperature: units.attr('temperature')
                    }
                });

                $(data).find('item>yweather\\:forecast').each((index, forecast) => {
                    weatherDatas.push({
                        day: $(forecast).attr('day'),
                        high: parseInt($(forecast).attr('high'), 10),
                        low: parseInt($(forecast).attr('low'), 10),
                        conditionCode: parseInt($(forecast).attr('code'), 10),
                        condition: $(forecast).attr('text')
                    });
                });

                resolve(weatherDatas);
            });
        });
    }

    public getLocationBasedOnIp(): Promise<Location> {
        return new Promise(resolve => {
            const regionUrlRequest = 'http://api.ipstack.com/check?access_key=3589f68db60f0f3e4898489508833085&format=1';
            this.http.get<any>(regionUrlRequest).toPromise().then(data => {
                const woeidUrlRequest = `http://query.yahooapis.com/v1/public/yql?q=select * from geo.places where text=` +
                    `"${data.region_name}"&format=json`;
                this.http.get<any>(woeidUrlRequest).toPromise().then(res => {
                    if (res.query.results) {
                        const woeid = +res.query.results.place.woeid || +res.query.results.place[0].woeid;
                        const location: Location = {
                            woeid: woeid,
                            regionName: data.region_name,
                            city: data.city
                        };
                        resolve(location);
                    }
                });
            });
        });
    }

    public getLocationBasedOnSearchText(locationSearchText: string): Promise<Location> {
        return new Promise(resolve => {
            const woeidUrlRequest = `http://query.yahooapis.com/v1/public/yql?q=select * from geo.places where text=` +
                `"${locationSearchText}"&format=json`;
            this.http.get<any>(woeidUrlRequest).toPromise().then(res => {
                if (!res.query.results) {
                    resolve(null);
                    return;
                }
                const woeid = +res.query.results.place.woeid || +res.query.results.place[0].woeid;
                const location: Location = {
                    woeid: woeid,
                    regionName: res.query.results.place.length > 0 ? res.query.results.place[0].name : res.query.results.place.name,
                    city: res.query.results.place.length > 0 ? res.query.results.place[0].name : res.query.results.place.name,
                };
                resolve(location);
            });
        });
    }

    public getSuggestedLocations(searchText: string): Promise<LocationSuggest[]> {
        return new Promise(resolve => {
            this.http.get('https://www.yahoo.com/news/_tdnews/api/resource/WeatherSearch;text=' + searchText)
                .toPromise().then(res => {
                    const result: LocationSuggest[] = [];
                    if (res instanceof Array) {
                        res.forEach(item => {
                            result.push(Object.assign(new LocationSuggest(), item));
                        });
                    }
                    resolve(result);
                });
        });
    }
}
