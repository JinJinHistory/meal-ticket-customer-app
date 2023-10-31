import instance from "../axios_interceptor";
import {AxiosResponse} from "axios";
import {CommonResponseData} from "../models/responses/common-response-data.model";
import {ResponseCompanyTicketModel} from "../models/responses/ticket/response-company-ticket.model";
import {RequestGetCompanyTicketModel} from "../models/requests/ticket/request-get-company-ticket.model";

const TICKET_URL: string = '/ticket';

// 회사 식권 조회
export const doGetCompanyTickets = async (queryData: RequestGetCompanyTicketModel): Promise<CommonResponseData<Array<ResponseCompanyTicketModel>>> => {
	try {
		const response: AxiosResponse<CommonResponseData<Array<ResponseCompanyTicketModel>>> = await instance.get<CommonResponseData<Array<ResponseCompanyTicketModel>>>(`${TICKET_URL}/company`, { params: queryData });
		return response.data;
	} catch (error) {
		throw error;
	}
};