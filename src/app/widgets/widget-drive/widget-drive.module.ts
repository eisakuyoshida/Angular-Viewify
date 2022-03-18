import {NgModule} from '@angular/core';
import {BrowserModule } from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {WidgetDriveComponent} from './component/widget-drive.component';
import {BaseStructuresModule} from '../../shared/base-structures/base-structures.module';
import {WidgetModule} from '../widget/widget.module';
import { HttpClientModule } from '@angular/common/http';
import {
    GoogleApiModule, 
    NgGapiClientConfig, 
    NG_GAPI_CONFIG,
    GoogleApiConfig
} from "ng-gapi";

import { DriveService } from './services/drive.service';

let gapiClientConfig: NgGapiClientConfig = {
    client_id: "991346621443-5a7gge8fh4gc793dm2bjglb584r9q56v.apps.googleusercontent.com",
    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v2/rest"],
    scope:  "https://www.googleapis.com/auth/drive.readonly" ,
};


@NgModule({
    imports: [
        CommonModule,
        BaseStructuresModule,
        WidgetModule,
        BrowserModule,
        HttpClientModule,
        GoogleApiModule.forRoot({
          provide: NG_GAPI_CONFIG,
          useValue: gapiClientConfig
        }),
  
    ],
    declarations: [WidgetDriveComponent],
    exports: [
        WidgetDriveComponent,
    ],
    providers: [
        DriveService,
    ]
})
export class WidgetDriveModule {
}


