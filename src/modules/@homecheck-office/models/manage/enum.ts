export enum ApartmentScheduleCategory {
    SERVICE = "s",
    FLIR ="f",
    AFTER_CARE ="ac",
    MOVE ="m",
    OFFLINE ="o",
    ETC ="e"
}


export const ApartmentScheduleCategoryString: { [key in ApartmentScheduleCategory]: string } = {
  [ApartmentScheduleCategory.SERVICE]: "사전 점검",
  [ApartmentScheduleCategory.AFTER_CARE]: "사후 점검",
  [ApartmentScheduleCategory.FLIR]: "동절기 점검",
  [ApartmentScheduleCategory.MOVE]: "이사",
  [ApartmentScheduleCategory.OFFLINE]: "박람회 행사",
  [ApartmentScheduleCategory.ETC]: "그 외",
};