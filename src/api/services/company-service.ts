import instance from "../axios_interceptor";
import {CommonResponseData} from "../models/responses/common-response-data.model";
import {AxiosResponse} from "axios";
import {ResponseCompanyModel} from "../models/responses/company/response-company.model";

const COMPANY_URL: string = '/company';

export const getCompanyList = async (): Promise<CommonResponseData<Array<ResponseCompanyModel>>> => {
	try {
		const response: AxiosResponse<CommonResponseData<Array<ResponseCompanyModel>>> = await instance.get<CommonResponseData<Array<ResponseCompanyModel>>>(`${COMPANY_URL}`);
		return response.data;
	} catch (error) {
		throw error;
	}
};