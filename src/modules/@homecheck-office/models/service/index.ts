export class OfficeService {
    id       : number = 0;
    user_id  : string = "";
    Name     : string = "";
    sort     : string = "";
    caption  : string = ""
    Date     : string = "";
    Building : string = "";
    Building1: string = "";
    Building2: string = "";
    Sequence : string = "";
    Mail     : string = "";

}

export class OfficeServiceHistory {
  id           : number = 0;
  service_id   : number = 0;
  device_id    : string = "";
  uuid         : string = "";
  service_date: string  = "";
  caption     : string  = "";
  Equipment   : string  = "";
  Leader      : string  = "";
  Team1       : string  = "";
  Team2       : string  = "";
  Memo        : string  = "";
  update_time : string  = "";


    Report_count          : number  = 0;
    Report_unvalid        : number  = 0;
    Report_unvalid_caption: string  = "";
    deleted               : number  = 0;
    sorting               : number  = 0;
    direct_uploaded       : number  = 0;
    origin_uploaded       : number  = 0;
    mail_delivered        : number  = 0;
    app_uploaded          : number  = 0;
    args                   : object = {}

}
