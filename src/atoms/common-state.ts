import {atom, RecoilState, useResetRecoilState} from 'recoil';
import {ResponseCompanyModel} from "../api/models/responses/company/response-company.model";
import {ResponseUserTicketModel} from "../api/models/responses/ticket/response-user-ticket.model";
import {ResponsePointHistoryListModel} from "../api/models/responses/point/response-point-history-list.model";
import {ResponseCompanyDetailModel} from "../api/models/responses/company/response-company-detail.model";

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
export const companyInfoState: RecoilState<ResponseCompanyDetailModel> = atom({
	key: 'companyInfo',
	default: { id: '', bank_name: '', account_number: '', account_holder: '', name: '', phone_number: '' },

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

/**
 * 유저 티켓 목록 정보 리프레시 여부 정보
 */
export const userTicketsRefreshState: RecoilState<boolean> = atom({
	key: 'userTicketsRefresh',
	default: false,
});

/**
 * 포인트 충전 요청/승인 목록 정보
 */
export const pointListHistoryState: RecoilState<Array<ResponsePointHistoryListModel>> = atom({
	key: 'pointList',
	default: [] as Array<ResponsePointHistoryListModel>,
});

/**
 * 포인트 충전 요청/승인 목록 정보 리프레시 여부 정보
 */
export const pointListHistoryRefreshState: RecoilState<boolean> = atom({
	key: 'pointListHistoryRefresh',
	default: false,
});