import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {hideLoading, showLoading} from "../../util/action";
import {CommonResponseData} from "../../api/models/responses/common-response-data.model";
import {theme} from "../../assets/styles/common-styles";
import {ResponseCompanyModel} from "../../api/models/responses/company/response-company.model";
import {doGetCompany, doGetCompanyList} from "../../api/services/company-service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNavigation} from "@react-navigation/native";
import {routes} from "../../routes";
import {useRecoilState, useSetRecoilState} from "recoil";
import {
	companyInfoState,
	pointListHistoryRefreshState,
	pointListHistoryState,
	pointState,
	userTicketsRefreshState,
	userTicketsState
} from "../../atoms/common-state";
import {ResponseCompanyDetailModel} from "../../api/models/responses/company/response-company-detail.model";

export default function SelectCompany() {
	const navigation = useNavigation<any>();

	// 회사 정보
	const [companyInfo, setCompanyInfo] = useRecoilState(companyInfoState);

	// 회사 목록
	const [companyList, setCompanyList] = useState<Array<ResponseCompanyModel>>([]);

	// 선택한 회사 정보
	const [selectedCompany, setSelectedCompany] = useState<ResponseCompanyModel>({id: companyInfo.id, name: companyInfo.name});

	// 포인트 정보
	const setPoint = useSetRecoilState(pointState);

	// 유저 티켓 목록 정보
	const setUserTickets = useSetRecoilState(userTicketsState);

	// 유저 티켓 목록 정보 리프레시 여부 정보
	const setUserTicketsRefresh = useSetRecoilState(userTicketsRefreshState);

	// 포인트 충전 요청/승인 목록 정보
	const setPointHistoryList = useSetRecoilState(pointListHistoryState);

	// 포인트 충전 요청/승인 목록 정보 리프레시 여부 정보
	const setPointListHistoryRefresh = useSetRecoilState(pointListHistoryRefreshState);

	// 회사 목록 조회
	const getCompanyList = async () => {
		// 로딩 표시
		showLoading();

		try {
			// 회사 목록 조회 API 엔드포인트 URL
			const response: CommonResponseData<Array<ResponseCompanyModel>> = await doGetCompanyList();
			// 응답에 성공했을 경우
			if (response.status === 200) {
				// 데이터가 존재할 경우
				if (response.data) {
					console.log('[회사 목록 조회 성공]: ', response.data);
					// 회사 목록 저장
					setCompanyList(response.data);
				}
			} else {
				// 200 상태 코드가 아닌 경우 (예: 400, 401 등)
				Alert.alert('회사 목록 조회 실패', response.message);
			}
		} catch (error) {
			console.error('네트워크 오류', error);
			Alert.alert('네트워크 오류', '서버와 통신 중 문제가 발생했습니다.');
		} finally {
			// 로딩 숨기기
			hideLoading();
		}
	};

	// 회사 상세 조회
	const getCompany = async () => {
		// 로딩 표시
		showLoading();

		try {
			// 회사 조회 API 엔드포인트 URL
			const response: CommonResponseData<ResponseCompanyDetailModel> = await doGetCompany(selectedCompany.id);

			// 응답에 성공했을 경우
			if (response.status === 200) {
				console.log('response: ', response);
				// 데이터가 존재할 경우
				if (response.data) {
					console.log('데이터가 존재할 경우: ', response.data);

					// selectedCompany 를 storage 에 저장
					await AsyncStorage.setItem('selectedCompany', JSON.stringify(response.data));
					setCompanyInfo(response.data);

					// 업장 선택(변경) 시 업장 관련 정보 초기화
					setPoint(0);
					setUserTickets([]);
					setUserTicketsRefresh(false);
					setPointHistoryList([]);
					setPointListHistoryRefresh(false);

					// 홈으로 이동
					navigation.navigate(routes.HOME);
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

	const submit = async () => {
		if (!selectedCompany) {
			Alert.alert('업장 선택', '업장을 선택해 주세요.');
			return;
		}

		// 로딩 표시
		showLoading();

		// 현재 선택된 업장과 동일한 업장일 경우 홈으로 아무런 처리 없이 이동
		if (companyInfo.id === selectedCompany.id) {
			navigation.navigate(routes.HOME);
			// 로딩 숨기기
			hideLoading();
			return;
		}

		// 현재 선택된 업장과 다른 업장을 선택했을 경우 해당 업장을 상세조회 한다
		getCompany();
	}

	/**
	 * 초기화 이벤트
	 */
	useEffect(() => {
		// 회사 목록 조회
		getCompanyList();
	}, []);

	return (
		<View style={styles.container}>
			<View style={styles.titleRow}>
				<Text style={styles.titleText}>업장을 선택해 주세요 ^^</Text>
			</View>

			<View style={styles.inputContainer}>
				<ScrollView style={{width: '100%'}}>
					{
						companyList.map((company: ResponseCompanyModel, index: number) => {
							return (
								<TouchableOpacity
									key={index}
									onPress={() => {
										setSelectedCompany(company)
									}}
								>
									<Text style={[styles.companyText, selectedCompany?.id === company.id ? styles.activeCompanyText : undefined]}>{company.name}</Text>
								</TouchableOpacity>
							)
						})
					}
				</ScrollView>
			</View>

			<TouchableOpacity
				style={[styles.buttonContainer, styles.loginButton]}
				onPress={submit}
			>
				<Text style={styles.loginText}>선택</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
	},
	inputContainer: {
		borderColor: theme.primaryColor,
		borderWidth: 1.5,
		backgroundColor: '#FFFFFF',
		borderRadius: 10,
		width: 200,
		marginBottom: 20,
		flexDirection: 'column',
		alignItems: 'center',
		padding: 15,
		height: 200,
	},
	buttonContainer: {
		height: 45,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 20,
		width: 200,
		borderRadius: 10,
	},
	loginButton: {
		backgroundColor: theme.primaryColor,
	},
	loginText: {
		color: 'white',
	},
	titleRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 20,
		gap: 5,
	},
	titleText: {
		color: theme.primaryColor,
		fontSize: 20,
		fontWeight: '600',
	},
	companyText: {
		textAlign: 'center',
		paddingVertical: 5,
	},
	activeCompanyText: {
		color: theme.primaryColor,
		fontWeight: '600',
	}
});
