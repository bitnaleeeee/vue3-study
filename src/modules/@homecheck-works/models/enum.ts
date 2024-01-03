
export enum ProjectType {
    QAudit = "QAudit"
}

export const ProjectTypeString: { [key in ProjectType]: string } = {
    [ProjectType.QAudit] : "현대 Q-Audit"
}