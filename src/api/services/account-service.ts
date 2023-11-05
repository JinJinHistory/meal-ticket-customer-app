import instance from "../axios_interceptor";
import {RequestAccountLogin} from "../models/requests/account/request-account-login.model";
import {CommonResponseData} from "../models/responses/common-response-data.model";
import {ResponseAccountLogin} from "../models/responses/account/response-account-login.model";
import {AxiosResponse} from "axios";
import {CommonResponse} from "../models/responses/common-response.model";
import {RequestAccountUserSignupModel} from "../models/requests/account/request-account-user-signup.model";

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

// 회원가입 요청
export const doSignUp = async (requestData: RequestAccountUserSignupModel): Promise<CommonResponse> => {
	try {
		const response: AxiosResponse<CommonResponse> = await instance.post<CommonResponse>(`${ACCOUNT_URL}/signUp`, requestData);
		return response.data;
	} catch (error) {
		throw error;
	}
};