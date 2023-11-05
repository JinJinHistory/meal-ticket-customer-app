import {atom, RecoilState} from 'recoil';
import {ResponseCompanyModel} from "../api/models/responses/company/response-company.model";
import {ResponseUserTicketModel} from "../api/models/responses/ticket/response-user-ticket.model";

/**
 * 유저 로그인 정보
 */
export const userInfoState: RecoilState<string> = atom({
	key: 'userInfo',
	default: '',
});

/**
 * 회사 정보
 */
export const companyInfoState: RecoilState<ResponseCompanyModel> = atom({
	key: 'companyInfo',
	default: { id: '', name: '' },
});

/**
 * 포인트 정보
 */
export const pointState: RecoilState<number> = atom({
	key: 'pointInfo',
	default: 0,
});

/**
 * 유저 티켓 목록 정보
 */
export const userTicketsState: RecoilState<Array<ResponseUserTicketModel>> = atom({
	key: 'userTickets',
	default: [] as Array<ResponseUserTicketModel>,
});