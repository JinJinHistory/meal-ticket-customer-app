import {createSlice} from '@reduxjs/toolkit';
import {ResponseCompanyModel} from "../../api/models/responses/company/response-company.model";
import {ResponseUserTicketModel} from "../../api/models/responses/ticket/response-user-ticket.model";

type initType = {
	userUuid: string;
	selectedCompany: ResponseCompanyModel;
	point: number;
	userTickets: Array<ResponseUserTicketModel>
}
const initialState: initType = {
	userUuid: '',
	selectedCompany: {id: '', name: ''},
	point: 0,
	userTickets: []
};
const commonSlice = createSlice({
	name: 'common',
	initialState,
	reducers: {
		setUserUuid(state, action) {
			state.userUuid = action.payload.userUuid;
		},
		setCompanyUuid(state, action) {
			state.selectedCompany = action.payload.selectedCompany;
		},
		setPoint(state, action) {
			state.point = action.payload.point;
		},
		setUserTickets(state, action) {
			state.userTickets = action.payload.userTickets;
		}
	},
});

export default commonSlice;
