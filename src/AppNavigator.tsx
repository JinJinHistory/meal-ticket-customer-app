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
import {companyIdNameState, userInfoState} from "./atoms/common-state";
import SignUpView from "./pages/account/sign-up/sign-up";
import {showToast} from "./util/action";
import CompanyHome from "./pages/home/company-home";

const Stack = createStackNavigator();

export default () => {
	// 유저 로그인 정보
	const userInfo: string = useRecoilValue(userInfoState);

	// 회사 uuid 정보 (해당 값이 존재하면 관리자)
	const companyIdName: {id: string, name: string} = useRecoilValue(companyIdNameState);

	const renderView = () => {
		// 유저 정보(uuid)가 존재하면 로그인 된 상태
		if (userInfo) {
			return (
				<>
					<Stack.Screen name={routes.HOME} component={Home}/>
					<Stack.Screen name={routes.SELECT_COMPANY} component={SelectCompany}/>
				</>
			);
		}
		else if (companyIdName.id) {
			showToast('관리자!');
			return <Stack.Screen name={routes.COMPANY_HOME} component={CompanyHome}/>;
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
