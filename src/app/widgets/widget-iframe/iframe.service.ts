import {Injectable} from "@angular/core";
import {AppStorageService} from "../../shared/storage/services/app-storage.service";
import {IframeSettings} from "./models/iframe-settings";
import {WidgetService} from "../widget/widget.service";

@Injectable()
export class IframeService extends WidgetService<IframeSettings>{
    constructor (protected appStorage: AppStorageService) {super(appStorage);}
}
