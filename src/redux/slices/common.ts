import {createSlice} from '@reduxjs/toolkit';
import {ResponseCompanyModel} from "../../api/models/responses/company/response-company.model";

type initType = {
	isLoading: boolean;
	userUuid: string;
	selectedCompany: ResponseCompanyModel;
}
const initialState: initType = {
	isLoading: false,
	userUuid: '',
	selectedCompany: {id: '', name: ''},
};
const commonSlice = createSlice({
	name: 'common',
	initialState,
	reducers: {
		setUser(state, action) {
			state.isLoading = action.payload.isLoading;
		},
		setUserUuid(state, action) {
			state.userUuid = action.payload.userUuid;
		},
		setCompanyUuid(state, action) {
			state.selectedCompany = action.payload.selectedCompany;
		}
	},
});

export default commonSlice;
