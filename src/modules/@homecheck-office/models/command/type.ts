import { OfficeCommandCategory, OfficeCommandCategoryString } from "./enum";

type OfficeCommandResult = typeof OfficeCommandCategoryString;
 
export type CommandResultMessage = {}

export type CommandArguments = {}

export type CommandRequest = {
    type  : OfficeCommandCategory,
    arg   : CommandArguments,
    author: string
}

export type ExecuteCommand = <K extends OfficeCommandCategory>(command: K, arg: CommandArguments) => OfficeCommandResult[OfficeCommandCategory];