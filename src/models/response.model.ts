export type ResponseModel = {
    statuscode: number;
    timestamp?: String;
    error: boolean;
    messages: string | string[];
    errorType?: string;
    data?: Object;

}
