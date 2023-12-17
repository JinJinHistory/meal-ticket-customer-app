import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './AppNavigator';
import Toast from './components/Toast';
import {hideLoading, loadingRef, showLoading, toastRef} from './util/action';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Loading from './components/Loading';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useSetRecoilState} from 'recoil';
import {companyInfoState, userInfoState} from "./atoms/common-state";
import {CommonResponseData} from "./api/models/responses/common-response-data.model";
import {ResponseCompanyDetailModel} from "./api/models/responses/company/response-company-detail.model";
import {doGetCompany} from "./api/services/company-service";
import {Alert} from "react-native";

const AppControlFlow: React.FC = () => {
	// 유저 로그인 정보
	const setUserInfo = useSetRecoilState(userInfoState);

	// 회사 정보
	const setCompanyInfo = useSetRecoilState(companyInfoState);

	// 초기 토큰이 storage 에 존재하는지 확인 후 redux 에 저장
	useEffect(() => {
		AsyncStorage.getItem('userUuid').then((userUuid): void => {
			console.log('초기 실행 시 유저 uuid 확인: ', userUuid);
			setUserInfo(userUuid??'');
		});

		AsyncStorage.getItem('companyUuid').then((companyUuid): void => {
			console.log('초기 실행 시 회사 uuid 확인: ', companyUuid);
			setUserInfo(companyUuid??'');
		});

		// 초기 회사 세팅 version 1: 특정 회사 하나만 고정
		getCompany();
	}, []);

	/**
	 * 회사 상세 조회
	 */
	const getCompany = async () => {
		// 로딩 표시
		showLoading();

		try {
			// 회사 조회 API 엔드포인트 URL
			const response: CommonResponseData<ResponseCompanyDetailModel> = await doGetCompany('d8209900-a437-48bb-b6b8-5e3029b0ad98');

			// 응답에 성공했을 경우
			if (response.status === 200) {
				console.log('response: ', response);
				// 데이터가 존재할 경우
				if (response.data) {
					console.log('데이터가 존재할 경우: ', response.data);

					// selectedCompany 를 storage 에 저장
					await AsyncStorage.setItem('selectedCompany', JSON.stringify(response.data));
					setCompanyInfo(response.data);
				}
			} else {
				// 200 상태 코드가 아닌 경우 (예: 400, 401 등)
				Alert.alert('회사 조회 실패', response.message);
			}
		} catch (error) {
			console.error('네트워크 오류', error);
			Alert.alert('네트워크 오류', '서버와 통신 중 문제가 발생했습니다.');
		} finally {
			// 로딩 숨기기
			hideLoading();
		}
	}

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
