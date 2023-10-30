import {CommonResponse} from "./common-response.model";

/**
 * 공용 응답 데이터 모델
 */
export class CommonResponseData<T> extends CommonResponse{
	// 응답 데이터
	public data: T | null = null;
}