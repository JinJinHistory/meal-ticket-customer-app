/**
 * 공용 응답 데이터 모델
 */
export class CommonResponseData<T> {
	// 응답 상태
	public status: number = 0;
	// 응답 메시지
	public message: string = '';
	// 응답 데이터
	public data: T | null = null;
}