import instance from "../axios_interceptor";
import {AxiosResponse} from "axios";
import {RequestChargingPointModel} from "../models/requests/point/request-charging-point.model";
import {CommonResponse} from "../models/responses/common-response.model";

const POINT_URL: string = '/point';

// 포인트 충전 요청
export const charging = async (request: RequestChargingPointModel): Promise<CommonResponse> => {
	try {
		const response: AxiosResponse<CommonResponse> = await instance.post<CommonResponse>(`${POINT_URL}/charging`, request);
		return response.data;
	} catch (error) {
		throw error;
	}
};