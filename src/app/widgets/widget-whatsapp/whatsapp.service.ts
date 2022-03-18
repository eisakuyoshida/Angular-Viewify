import {Injectable} from "@angular/core";
import {WidgetService} from "../widget/widget.service";
import {AppStorageService} from "../../shared/storage/services/app-storage.service";
import {WhatsappSettings} from "./models/whatsapp-settings";

@Injectable()
export class WhatsappService extends WidgetService<WhatsappSettings> {
    constructor (protected appStorage: AppStorageService) {super(appStorage)}
}
