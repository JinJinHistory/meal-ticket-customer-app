import React, {useState} from 'react';
import Header from "../../../components/header";
import {Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {commonStyles, theme} from "../../../assets/styles/common-styles";
import {AppImages} from "../../../assets";
import {WithLocalSvg} from "react-native-svg";
import {hideLoading, showLoading} from "../../../util/action";
import {charging} from "../../../api/services/point-service";
import {CommonResponse} from "../../../api/models/responses/common-response.model";
import {RequestChargingPointModel} from "../../../api/models/requests/point/request-charging-point.model";
import {routes} from "../../../routes";
import {useNavigation} from "@react-navigation/native";
import {useRecoilState} from "recoil";
import {
	companyInfoState,
	pointListHistoryRefreshState, pointListHistoryState,
	userInfoState,
	userTicketsRefreshState
} from "../../../atoms/common-state";
import {CommonResponseData} from "../../../api/models/responses/common-response-data.model";
import {ResponseCompanyDetailModel} from "../../../api/models/responses/company/response-company-detail.model";
import {doGetCompany} from "../../../api/services/company-service";
import {addComma} from "../../../util/format";

const keyboardKeys: Array<number | string | undefined> = [
	1, 2, 3, 4, 5, 6, 7, 8, 9, undefined, 0, 'remove'
]

const PointCharging = () => {
	const navigation = useNavigation<any>();

	// 유저 로그인 정보
	const [userInfo, setUserInfo] = useRecoilState(userInfoState);

	// 회사 정보
	const [companyInfo, setCompanyInfo] = useRecoilState(companyInfoState);

	// 포인트 충전 요청/승인 목록 정보 리프레시 여부 정보
	const [pointListHistoryRefresh, setPointListHistoryRefresh] = useRecoilState(pointListHistoryRefreshState);

	const [inputValue, setInputValue] = useState<string>('');

	// 회사 조회
	const getCompany = async () => {
		// 로딩 표시
		showLoading();

		try {
			// 회사 조회 API 엔드포인트 URL
			const response: CommonResponseData<ResponseCompanyDetailModel> = await doGetCompany(companyInfo.id);

			// 응답에 성공했을 경우
			if (response.status === 200) {
				console.log('response: ', response);
				// 데이터가 존재할 경우
				if (response.data) {
					console.log('데이터가 존재할 경우: ', response.data);

					// 성공 메시지 출력
					Alert.alert('포인트 충전 요청', `포인트 충전 요청이 완료되었습니다.\n아래 계좌로 ${addComma(Number.parseInt(inputValue.replace(/[^0-9]/g, '')))}원을 입금 후\n관리자에게 연락주세요.\n\n업장명: ${response.data.name}\n입금은행: ${response.data.bank_name}\n계좌번호: ${response.data.account_number}\n예금주: ${response.data.account_holder}\n전화번호: ${response.data.phone_number}`, [
						{
							text: '확인',
							onPress: () => {
								console.log('확인');
								// 포인트 충전 완료 후 메인 화면으로 이동
								navigation.navigate(routes.HOME);
							}
						}
					]);
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

	const handleKeyPress = (key: number | string | undefined): void => {
		// 입력값에서 쉼표(,)와 숫자 이외의 문자를 제거합니다.
		const cleanedValue: string = inputValue.replace(/[^0-9]/g, '');

		// key의 값이 remove 일 경우 inputValue의 값에서 마지막 문자를 제거합니다. 그리고 key의 값이 number일 경우 inputValue의 값에 key의 값을 추가합니다.
		switch (key) {
			case undefined:
				break;
			case 'remove':
				// 천단위 쉼표를 추가합니다.
				const removeResultValueWithComma: string = cleanedValue.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
				if (removeResultValueWithComma === '') {
					setInputValue('');
					return;
				}
				setInputValue(removeResultValueWithComma + '원');
				break;
			default:
				console.log('cleanedValue: ', cleanedValue);
				// 0으로 시작하는 숫자는 입력할 수 없도록 합니다.
				if (cleanedValue === '0') {
					setInputValue(key.toString() + '원');
					return;
				}

				// 천단위 쉼표를 추가합니다.
				const resultValueWithComma: string = (cleanedValue + key).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

				setInputValue(resultValueWithComma + '원');
		}
	};

	const renderKeyboard = (key: number| string | undefined, index: number): JSX.Element => {
		switch (key) {
			case undefined:
				return <View key={index} style={styles.key}></View>
			case 'remove':
				return (
					<TouchableOpacity
						key={index}
						onPress={() => handleKeyPress(key)}
						style={styles.key}>
						<WithLocalSvg asset={AppImages.iconDelete} width="20" height="20" />
					</TouchableOpacity>
				)
			default:
				return (
					<TouchableOpacity
						key={index}
						onPress={() => handleKeyPress(key)}
						style={styles.key}>
						<Text style={styles.keyText}>{key}</Text>
					</TouchableOpacity>
				)
		}
	}

	const onClickSubmitBtn = () => {
		if (!inputValue || inputValue.replace(/[^0-9]/g, '') === '0') return;
		console.log('충전 금액: ', inputValue.replace(/[^0-9]/g, ''));

		// confirm
		Alert.alert('포인트 충전', inputValue + '을\n충전하시겠습니까?', [
			{
				text: '취소',
				onPress: () => {
					console.log('취소');
				}
			},
			{
				text: '확인',
				onPress: () => {
					console.log('확인');
					// 포인트 충전 요청
					doCharging();
				}
			}
		]);
	}

	// 포인트 충전 요청
	const doCharging = async () => {
		// 로딩 표시
		showLoading();

		try {
			// 로그인 요청 데이터 준비
			const requestData: RequestChargingPointModel = {
				user_uuid: userInfo,
				company_uuid: companyInfo.id,
				point: Number.parseInt(inputValue.replace(/[^0-9]/g, ''))
			};

			// 포인트 충전 요청 API 엔드포인트 URL
			const response: CommonResponse = await charging(requestData);

			// 응답에 성공했을 경우
			if (response.status === 200) {
				// 포인트 충전 요청/승인 목록 정보 리프레시 여부 정보 변경
				setPointListHistoryRefresh(true);

				// 회사 상세 정보 조회
				await getCompany();
			} else {
				// 200 상태 코드가 아닌 경우 (예: 400, 401 등)
				Alert.alert('포인트 충전 실패', response.message);
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
		<SafeAreaView style={{flex: 1}}>
			<Header title='포인트 충전'/>
			<View style={{
				...commonStyles.pageLayout,
				flex: 1,
				gap: 10,
				justifyContent: 'center',
				alignItems: 'center',
			}}>
				<View>
					{
						inputValue
							? <Text style={styles.pointInput}>{inputValue}</Text>
							: <Text style={styles.hintText}>충전할 포인트</Text>
					}
				</View>
			</View>
			<View style={styles.keyboard}>
				{
					keyboardKeys.map((key: string | number | undefined, index: number) => renderKeyboard(key, index))
				}
			</View>
			<TouchableOpacity style={{
				...styles.submitBtn,
				backgroundColor: inputValue && inputValue.replace(/[^0-9]/g, '') !== '0' ? theme.primaryColor : theme.disabledColor
			}} onPress={onClickSubmitBtn}>
				<Text style={styles.submitText}>충전 요청</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	pointInput: {
		fontSize: 30,
		fontWeight: '700',
		color: theme.primaryColor,
	},
	submitBtn: {
		backgroundColor: theme.primaryColor,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
	},
	submitText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: '600'
	},
	keyboard: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	key: {
		width: '33.33%', // 화면 폭의 1/3만큼 너비를 가지도록 설정
		justifyContent: 'center',
		alignItems: 'center',
		height: 70,
	},
	keyText: {
		fontSize: 24,
		fontWeight: '600',
		color: '#333',
	},
	hintText: {
		fontSize: 24,
		color: '#d2d2d2',
		fontWeight: '600'
	}
});

export default PointCharging;