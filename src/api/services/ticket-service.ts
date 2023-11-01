import instance from "../axios_interceptor";
import {AxiosResponse} from "axios";
import {CommonResponseData} from "../models/responses/common-response-data.model";
import {ResponseCompanyTicketModel} from "../models/responses/ticket/response-company-ticket.model";
import {RequestBuyTicketModel} from "../models/requests/ticket/request-buy-ticket.model";
import {CommonResponse} from "../models/responses/common-response.model";
import {RequestGetPointModel} from "../models/requests/point/request-get-point.model";
import {ResponseUserTicketModel} from "../models/responses/ticket/response-user-ticket.model";

const TICKET_URL: string = '/ticket';

// 회사 식권 조회
export const doGetCompanyTickets = async (companyId: string): Promise<CommonResponseData<Array<ResponseCompanyTicketModel>>> => {
	try {
		const response: AxiosResponse<CommonResponseData<Array<ResponseCompanyTicketModel>>> = await instance.get<CommonResponseData<Array<ResponseCompanyTicketModel>>>(`${TICKET_URL}/company/${companyId}`);
		return response.data;
	} catch (error) {
		throw error;
	}
};

// 회사 식권 구매
export const doBuyCompanyTickets = async (requestData: RequestBuyTicketModel): Promise<CommonResponse> => {
	try {
		const response: AxiosResponse<CommonResponse> = await instance.post<CommonResponse>(`${TICKET_URL}/buy`, requestData);
		return response.data;
	} catch (error) {
		throw error;
	}
};

// 회원 식권 조회
export const doGetUserTickets = async (queryData: RequestGetPointModel): Promise<CommonResponseData<Array<ResponseUserTicketModel>>> => {
	try {
		const response: AxiosResponse<CommonResponseData<Array<ResponseUserTicketModel>>> = await instance.get<CommonResponseData<Array<ResponseUserTicketModel>>>(`${TICKET_URL}/user`, {params: queryData});
		return response.data;
	} catch (error) {
		throw error;
	}
};

