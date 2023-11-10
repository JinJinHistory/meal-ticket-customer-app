import React from 'react';
import {StatusBar} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginView from './pages/account/login/login';
import {routes} from "./routes";
import BuyListView from "./pages/ticket/buy-list/buy-list-view";
import PointCharging from "./pages/point/point-charging/point-charging";
import SelectCompany from "./pages/select-company/select-company";
import Home from "./pages/home/home";
import BuyDetail from "./pages/ticket/buy-detail";
import {useRecoilValue} from 'recoil';
import {companyInfoState, userInfoState} from "./atoms/common-state";
import SignUpView from "./pages/account/sign-up/sign-up";
import {ResponseCompanyModel} from "./api/models/responses/company/response-company.model";

const Stack = createStackNavigator();

export default () => {
	// 유저 로그인 정보
	const userInfo: string = useRecoilValue(userInfoState);

	// 회사 정보
	const companyInfo: ResponseCompanyModel = useRecoilValue(companyInfoState);

	const renderView = () => {
		// 유저 정보(uuid)가 존재하면 로그인 된 상태
		if (userInfo) {
			// 회사 uuid가 존재하지 않으면 회사 선택 화면으로 이동
			if (!companyInfo.id) {
				return <Stack.Screen name={routes.SELECT_COMPANY} component={SelectCompany}/>;
			}
			// 회사 uuid가 존재하면 탭 화면으로 이동
			else {
				return (
					<>
						<Stack.Screen name={routes.HOME} component={Home}/>
						<Stack.Screen name={routes.SELECT_COMPANY} component={SelectCompany}/>
					</>
				);
			}
		}
		// 유저 uuid가 존재하지 않으면 로그인 되지 않은 상태
		else {
			return <Stack.Screen name={routes.LOGIN} component={LoginView}/>;
		}
	}

	return (
		<>
			<StatusBar
				backgroundColor="transparent"
				barStyle="dark-content"
				translucent
			/>

			<Stack.Navigator screenOptions={{headerShown: false}}>
				{renderView()}
				<Stack.Screen name={routes.SIGN_UP} component={SignUpView}/>
				<Stack.Screen name={routes.TICKET_LIST} component={BuyListView}/>
				<Stack.Screen name={routes.TICKET_BUY_DETAIL} component={BuyDetail}/>
				<Stack.Screen name={routes.POINT_CHARGING} component={PointCharging}/>
			</Stack.Navigator>
		</>
	);
};
