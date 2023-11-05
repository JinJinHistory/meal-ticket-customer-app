import instance from "../axios_interceptor";
import {RequestAccountLogin} from "../models/requests/account/request-account-login.model";
import {CommonResponseData} from "../models/responses/common-response-data.model";
import {ResponseAccountLogin} from "../models/responses/account/response-account-login.model";
import {AxiosResponse} from "axios";

const ACCOUNT_URL: string = '/account';

// 로그인 요청
export const doLogin = async (requestData: RequestAccountLogin): Promise<CommonResponseData<ResponseAccountLogin>> => {
	try {
		const response: AxiosResponse<CommonResponseData<ResponseAccountLogin>> = await instance.post<CommonResponseData<ResponseAccountLogin>>(`${ACCOUNT_URL}/login`, requestData);
		return response.data;
	} catch (error) {
		throw error;
	}
};