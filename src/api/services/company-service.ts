import instance from "../axios_interceptor";
import {CommonResponseData} from "../models/responses/common-response-data.model";
import {AxiosResponse} from "axios";
import {ResponseCompanyModel} from "../models/responses/company/response-company.model";
import {ResponseCompanyDetailModel} from "../models/responses/company/response-company-detail.model";

const COMPANY_URL: string = '/company';

// 회사 목록 조회
export const doGetCompanyList = async (): Promise<CommonResponseData<Array<ResponseCompanyModel>>> => {
	try {
		const response: AxiosResponse<CommonResponseData<Array<ResponseCompanyModel>>> = await instance.get<CommonResponseData<Array<ResponseCompanyModel>>>(`${COMPANY_URL}`);
		return response.data;
	} catch (error) {
		throw error;
	}
};

// 회사 상세 조회
export const doGetCompany = async (companyId: string): Promise<CommonResponseData<ResponseCompanyDetailModel>> => {
	try {
		const response: AxiosResponse<CommonResponseData<ResponseCompanyDetailModel>> = await instance.get<CommonResponseData<ResponseCompanyDetailModel>>(`${COMPANY_URL}/${companyId}`);
		return response.data;
	} catch (error) {
		throw error;
	}
};