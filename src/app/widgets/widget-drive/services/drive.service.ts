import {Injectable} from "@angular/core";
import {WidgetService} from "../../widget/widget.service";
import {AppStorageService} from "../../../shared/storage/services/app-storage.service";
import {HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import {Observable} from "rxjs/Observable";

import {DriveSettings} from "../models/drive-settings";


@Injectable()
export class DriveService extends WidgetService<DriveSettings> {
    private readonly API_URL: string = 'https://www.googleapis.com/drive/v2/files';
    public SESSION_STORAGE_KEY = 'access_token';

    constructor (protected appStorage: AppStorageService,
                 private httpClient: HttpClient) {super(appStorage)}

    public authorize(opt_callback) {
        try {
            chrome.identity.getAuthToken({interactive: true}, function(token) {
              if (token) {
                sessionStorage.setItem(this.SESSION_STORAGE_KEY, token);
                    opt_callback({status:"success",token: token});
                    return;
              }
              else{
                opt_callback({status:"failed"});
                return;
              }

            });
          } catch(e) {
            opt_callback({status:"error"});
            console.log(e);
          }        
    }

    public getFiles(token): Observable<any[]> {

        let params = new HttpParams();
        params = params.append('maxResults', '8');
        params = params.append('fields', 'items(alternateLink,iconLink,mimeType,thumbnailLink,lastModifyingUserName,modifiedDate,title)');
       
        return this.httpClient.get<any[]>(this.API_URL, {
          headers: new HttpHeaders({
                Authorization: `Bearer ${token}`,
            }),
          params: params
        }).map(res => {
            return res["items"].map(item => {
                var temp = {
                    name: item.title,
                    icon: item.iconLink.replace('16','48'),
                    link: item.alternateLink,
                    user: item.lastModifyingUserName,
                    date: item.modifiedDate 
                };
                return temp;
            })
        })
    }
    saveSettings() {
        this.settings.FilesUpdatedAt = new Date().toString();
        super.saveSettings();
    }

}
