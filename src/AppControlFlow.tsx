import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './AppNavigator';
import Toast from './components/Toast';
import {loadingRef, toastRef} from './util/action';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Loading from './components/Loading';
import {useAppDispatch} from "./redux/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import commonSlice from "./redux/slices/common";

const AppControlFlow: React.FC = () => {
	const dispatch = useAppDispatch();

	// 초기 토큰이 storage에 존재하는지 확인 후 redux에 저장
	useEffect(() => {
		AsyncStorage.getItem('userUuid').then((userUuid) => {
			console.log('초기 실행 시 유저 uuid 확인: ', userUuid);
			dispatch(commonSlice.actions.setUserUuid({userUuid: userUuid??''}));
		});

		AsyncStorage.getItem('selectedCompany').then((selectedCompany) => {
			console.log('초기 실행 시 선택된 회사 정보 확인: ', selectedCompany ? JSON.parse(selectedCompany) : { id: '', name: '' });
			dispatch(commonSlice.actions.setCompanyUuid({selectedCompany: selectedCompany ? JSON.parse(selectedCompany) : { id: '', name: '' }}));
		});
	}, []);

	return (
		<GestureHandlerRootView style={{flex: 1}}>
			<SafeAreaProvider>
				<NavigationContainer>
					<AppNavigator/>
				</NavigationContainer>
				<Toast {...{ref: toastRef}} />
				<Loading {...{ref: loadingRef}} />
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
};

export default AppControlFlow;
