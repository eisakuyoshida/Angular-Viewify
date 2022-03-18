import { HotkeyModule } from 'angular2-hotkeys';
import { HttpClientModule } from '@angular/common/http';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {DeskModule} from './desk/desk.module';
import {StorageModule} from './shared/storage/storage.module';

import {UserModule} from './shared/user/user.module';
import {StartupModule} from './startup/startup.module';
import {UtilsModule} from './shared/utils/utils.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {IframeService} from "./widgets/widget-iframe/iframe.service";
import {WeatherApisService} from "./widgets/widget-weather/weather-apis.service";
import {WeatherService} from "./widgets/widget-weather/weather.service";
import {WhatsappService} from "./widgets/widget-whatsapp/whatsapp.service";
import {DriveService} from "./widgets/widget-drive/services/drive.service";
import {TimeService} from "./widgets/widget-time/time.service";
import {DragulaModule} from "ng2-dragula";
import {SortablejsModule} from "angular-sortablejs";
import {CalculatorService} from "./widgets/widget-calculator/calculator.service";
import {CalendarService} from "./widgets/widget-calendar/calendar.service";

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        HotkeyModule.forRoot(),
        DragulaModule.forRoot(),
        StorageModule,
        DeskModule,
        UserModule,
        StartupModule,
        UtilsModule,

        SortablejsModule.forRoot({ animation: 10 })
    ],
    bootstrap: [AppComponent],
    providers: [
        IframeService,
        WeatherService,
        WeatherApisService,
        TimeService,
        WhatsappService,
        DriveService,
        CalculatorService,
        CalendarService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
