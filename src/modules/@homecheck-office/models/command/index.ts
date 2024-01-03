import { OfficeCommandCategory, CommandResult } from "./enum";
import { ExecuteCommand, CommandArguments, CommandResultMessage, CommandRequest  } from './type'



export class OfficeCommand {
    id: number = 0;
    type: OfficeCommandCategory = OfficeCommandCategory.ReportMessage;
    arg: CommandArguments = {}
    author: string = "";

    result  : CommandResult = CommandResult.WORKING
    resultMessage : CommandResultMessage = {}
















    static Parse(input: Partial<OfficeCommand>): OfficeCommand {
        const output = new OfficeCommand();
        Object.assign(output, input);
        return output;
    }
    

    static Execute(request: CommandRequest) {
        
    }
}

