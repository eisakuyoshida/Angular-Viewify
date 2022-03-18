import {Component, OnDestroy} from '@angular/core';
import { WidgetBaseComponent } from '../../../shared/base-structures/widget-base.component';
import { DriveSettings } from '../models/drive-settings'
import { AppStorageService } from 'src/app/shared/storage/services/app-storage.service';
import { GoogleApiService } from 'ng-gapi';
import {DriveService} from "../services/drive.service";
import {HttpClient } from "@angular/common/http";

@Component({
    selector: 'app-widget-drive',
    templateUrl: './widget-drive.component.html',
    styleUrls: ['./widget-drive.component.scss'],
})
export class WidgetDriveComponent extends WidgetBaseComponent<DriveSettings> implements OnDestroy {
    doubleWidth: boolean = false;
    fileCount:number = 8;
    strBtnCaption:string =  "Authorize";
    files = [
        {
            name: "Recent trips",
            icon: "https://ssl.gstatic.com/docs/doclist/images/icon_11_collection_email.png",
            link: "https://drive.google.com/",
            user: "John Doe",
            date: 1396978331809
        },
        {
            name: "Getaway camping plans",
            icon: "https://ssl.gstatic.com/docs/doclist/images/icon_11_spreadsheet_email.png",
            link: "https://drive.google.com/",
            user: "John Doe",
            date: 1396961351031
        },
        {
            name: "20120716-213442_3-urban0_high_resolution.jpg",
            icon: "https://ssl.gstatic.com/docs/doclist/images/icon_11_document_email.png",
            link: "https://drive.google.com/",
            user: "Avi Kohn",
            date: 1396912248952
        },
        {
            name: "Engagement party menu ideas",
            icon: "https://ssl.gstatic.com/docs/doclist/images/icon_11_document_email.png",
            link: "https://drive.google.com/",
            user: "John Doe",
            date: 1395760856920
        },
        {
            name: "notifiersalpha",
            icon: "https://ssl.gstatic.com/docs/doclist/images/icon_11_document_email.png",
            link: "https://drive.google.com/",
            user: "John Doe",
            date: 1395760558164
        },
        {
            name: "Catering_agreement.pdf",
            icon: "https://ssl.gstatic.com/docs/doclist/images/icon_11_pdf_email.png",
            link: "https://drive.google.com/",
            user: "John Doe",
            date: 1395760364357
        },
        {
            name: "Grocery List.xlsx",
            icon: "https://ssl.gstatic.com/docs/doclist/images/icon_11_excel_email.png",
            link: "https://drive.google.com/",
            user: "John Doe",
            date: 1394551564697
        },
        {
            name: "H20120827-185744_3-urban2_high_resolution.jpg",
            icon: "https://ssl.gstatic.com/docs/doclist/images/icon_11_spreadsheet_email.png",
            link: "https://drive.google.com/",
            user: "John Doe",
            date: 1394219609054
        }
    ];

    constructor(protected appStorage: AppStorageService,
                public driveService: DriveService,
              private gapiService: GoogleApiService,
              private httpClient: HttpClient,
              ) {
        super(appStorage);
        this.gapiService.onLoad().subscribe();
    }

    public authClick(): void {
        this.strBtnCaption = "Authorizing...";
        this.files = [];
        
        this.driveService.authorize((res) => {
            if(res.status === 'success') {
                this.driveService.getFiles(res.token).subscribe(res => {this.files = res;});
        
            }else if(res.status === 'failed') {
                this.strBtnCaption = "Authurization failed. Retry.";
                sessionStorage.removeItem(this.driveService.SESSION_STORAGE_KEY);
            }else{
                this.strBtnCaption = "Error";
                sessionStorage.removeItem(this.driveService.SESSION_STORAGE_KEY);
            }
        });

    }
    
    public widgetInit() {
        this.startWork(this.driveService);
        //this.files = this.driveService.settings.files;
        if(!this.driveService.settings.showHeader)
            this.files = [];
    }

    public reload() {
        
    }

    saveSettings() {
        
        this.driveService.saveSettings();
    }

    public onMinimize(value): void {
        this.driveService.settings.minimized = value;
        this.appStorage.set<DriveSettings>(this.storageKey, this.driveService.settings);
    }

    ngOnDestroy(): void {
        sessionStorage.removeItem(this.driveService.SESSION_STORAGE_KEY);
        this.saveSettings();
    }

    stretchWindow(target) {
        this.doubleWidth = !this.doubleWidth;

        if (this.doubleWidth) {
            $(target).closest('.column-layer').addClass('widget-doubleWidth');
        } else $(target).closest('.column-layer').removeClass('widget-doubleWidth');
    }

}
