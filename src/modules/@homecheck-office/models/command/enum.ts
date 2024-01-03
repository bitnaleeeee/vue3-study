

export enum OfficeCommandCategory {
    // 보고서 파트
    ServiceHistoryDataChange = "shdc",



    // 고객 전송 메세지
    ReportMessage = "rmsg"







}


export const OfficeCommandCategoryString: { [key in OfficeCommandCategory]: string | number } = {
  [OfficeCommandCategory.ReportMessage]: "",
  [OfficeCommandCategory.ServiceHistoryDataChange]: 0,
};


export enum CommandResult {
    WORKING = -1,
    OK = 0,
    PENDING = 1,
    ERRORED = 9999
}