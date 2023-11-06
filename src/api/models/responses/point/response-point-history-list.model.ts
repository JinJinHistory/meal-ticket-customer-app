export class ResponsePointHistoryListModel {
	// 충전 기록 uuid
	public uuid: string = '';
	// 사용자 uuid
	public user_uuid: string = '';
	// 업체 uuid
	public company_uuid: string = '';
	// 타입
	public type: string = '';
	// 포인트
	public point: number = 0;
	// 등록일
	public regDate: Date | null = null;
	// 수정일
	public modDate: Date | null = null;
}