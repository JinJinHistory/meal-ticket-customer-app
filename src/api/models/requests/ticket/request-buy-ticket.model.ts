/**
 * 식권 구매 요청 모델
 */
export class RequestBuyTicketModel {
	// 유저 아이디
	public user_uuid: string = '';
	// 회사 아이디
	public company_uuid: string = '';
	// 식권 아이디
	public ticket_uuid: string = '';
	// 구매 개수
	public count: number = 0;
}