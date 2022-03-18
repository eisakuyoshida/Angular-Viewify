import {Injectable} from "@angular/core";
import {CalculatorSettings} from "./model/calculator-settings";
import {AppStorageService} from "../../shared/storage/services/app-storage.service";
import {WidgetService} from "../widget/widget.service";

@Injectable()
export class CalculatorService extends WidgetService<CalculatorSettings>{
    constructor (protected appStorage: AppStorageService) {super(appStorage)}
}
