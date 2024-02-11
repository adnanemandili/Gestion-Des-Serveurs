import { Server } from "./server";

export interface CustumResponse{
    time:Date;
    statusCode:number;
    status:string;
    reason:string;
    message:string;
    DevMsg:string;
    data:{servers?:Server[],server?:Server}
}