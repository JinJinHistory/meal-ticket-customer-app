import React from 'react';
import {StatusBar} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginView from './pages/login/Login';
import Tabs from './pages/tabs/Tabs';
import {useSelector} from "react-redux";
import {RootState} from "./redux/store/reducers";
import {routes} from "./routes";
import NoticeListView from "./pages/notice/list/notice-list-view";
import CreateReviewBlog from "./pages/tabs/create-review/create-review-blog/create-review-blog";
import PointCharging from "./pages/point-charging/point-charging";
import SelectCompany from "./pages/select-company/select-company";

const Stack = createStackNavigator();

export default () => {
	// redux에 저장 된 유저 uuid 가져오기
	const userUuid = useSelector((state: RootState) => state.common.userUuid);

	// redux에 저장 된 회사 정보 가져오기
	const selectedCompany = useSelector((state: RootState) => state.common.selectedCompany);

	const renderView = () => {
		// 유저 uuid가 존재하면 로그인 된 상태
		if (userUuid) {
			// 회사 uuid가 존재하지 않으면 회사 선택 화면으로 이동
			if (!selectedCompany.id) {
				return <Stack.Screen name={routes.SELECT_COMPANY} component={SelectCompany}/>;
			}
			// 회사 uuid가 존재하면 탭 화면으로 이동
			else {
				return (
					<>
						<Stack.Screen name={routes.TABS} component={Tabs}/>
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
				<Stack.Screen name={routes.NOTICE_LIST} component={NoticeListView}/>
				<Stack.Screen name={routes.CREATE_REVIEW_BLOG} component={CreateReviewBlog}/>
				<Stack.Screen name={routes.POINT_CHARGING} component={PointCharging}/>
			</Stack.Navigator>
		</>
	);
};
