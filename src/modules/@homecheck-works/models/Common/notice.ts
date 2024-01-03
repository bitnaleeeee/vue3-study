import { getRandomString} from '@/modules/@homecheck/libs'


export enum NoticeContentType {
    MarkDown = "md",
    HTML = "html"
}

export enum NoticePeriod {
    Every = "e",
    Once = "o"
}

export const NoticePeriodString: { [key in NoticePeriod]: string } = {
    [NoticePeriod.Every]: "항상",
    [NoticePeriod.Once] : "한 번만"
}


export class WorksNotice {

    _id: string = getRandomString(8, false);
    type : NoticeContentType = NoticeContentType.HTML
    period : NoticePeriod = NoticePeriod.Once
    
    author_id: string = "";
    html: string = "";
    __deleted__: number = 0;

    static Parse(value : Partial<WorksNotice>) {
        const output = new WorksNotice()
        return Object.assign(output, value)
    }
}