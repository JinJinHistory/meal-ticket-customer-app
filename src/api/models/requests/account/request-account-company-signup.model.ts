import {RequestAccountUserSignupModel} from "./request-account-user-signup.model";

export class RequestAccountSignupModel extends RequestAccountUserSignupModel {
	// 은행명
	public bank_name: string = '';
	// 계좌번호
	public account_number: string = '';
}