import {WidgetSettings} from "../../../shared/base-structures/widget-settings";
import { CalendarEvent } from "calendar-utils";

export class CalendarSettings extends WidgetSettings{
    public CalendarUpdatedAt: string;
    public events: CalendarEvent[];

}
