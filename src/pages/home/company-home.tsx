import {
	Alert,
	BackHandler,
	RefreshControl,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {hideLoading, showLoading} from "../../util/action";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {commonStyles, theme} from "../../assets/styles/common-styles";
import StatusBarSize from "../../components/status-bar-size";
import {CommonResponseData} from "../../api/models/responses/common-response-data.model";
import {doApproval, doGetPointList} from "../../api/services/point-service";
import Icon from "react-native-vector-icons/MaterialIcons";
import {useRecoilState, useSetRecoilState} from 'recoil';
import {companyIdNameState, pointListHistoryRefreshState, pointListHistoryState} from "../../atoms/common-state";
import {CommonListModel} from "../../api/models/responses/common-list.model";
import {ResponsePointHistoryListModel} from "../../api/models/responses/point/response-point-history-list.model";
import {addComma, momentFormat} from "../../util/format";
import {CommonResponse} from "../../api/models/responses/common-response.model";
import {RequestPointApprovalModel} from "../../api/models/requests/point/request-point-approval.model";

const CompanyHome = () => {
	const navigation = useNavigation<any>();

	// 회사 uuid 정보
	const [companyIdName, setCompanyIdName] = useRecoilState(companyIdNameState);

	// 포인트 충전 요청/승인 목록 정보
	const [pointHistoryList, setPointHistoryList] = useRecoilState(pointListHistoryState);

	// 리프레시 상태
	const [refreshing, setRefreshing] = useState<boolean>(false);

	// 포인트 충전 요청/승인 목록 정보 리프레시 여부 정보
	const setPointListHistoryRefresh = useSetRecoilState(pointListHistoryRefreshState);

	// 리프레시 이벤트
	const onRefresh = useCallback((): void => {
		setRefreshing(true);

		// 포인트 충전 요청/승인 목록 조회 후 리프레시 종료
		getPointList().then(() => setRefreshing(false));
	}, []);

	// 뒤로가기 시 컨펌 후 앱 종료
	const onBackPress = () => {
		Alert.alert(
			'앱 종료',
			'앱을 종료하시겠습니까?',
			[
				{
					text: '취소',
					onPress: () => null,
					style: 'cancel',
				},
				{text: '확인', onPress: () => BackHandler.exitApp()},
			],
			{cancelable: false},
		);
		return true;
	}

	// 로그아웃 컨펌
	const onLogoutPress = () => {
		Alert.alert(
			'로그아웃',
			'로그아웃 하시겠습니까?',
			[
				{
					text: '취소',
					onPress: () => null,
					style: 'cancel',
				},
				{
					text: '확인', onPress: async () => {
						// 로딩 표시
						showLoading();

						// storage 초기화
						await AsyncStorage.clear();
						setCompanyIdName({id: '', name: ''});

						// 로딩 숨기기
						hideLoading();
					}
				},
			],
			{cancelable: false},
		);
		return true;
	}

	useEffect(() => {
		console.log('CompanyHome mounted');

		// 뒤로 가기 이벤트 리스너 등록
		const backAction = () => {
			// 여기에 뒤로 가기 버튼을 눌렀을 때 수행할 작업을 정의합니다.

			// 작업을 수행한 후에는 true 또는 false를 반환합니다.
			// true를 반환하면 기본적인 뒤로 가기 동작을 막습니다.
			// false를 반환하면 기본 동작인 앱을 종료하지 않고 뒤로 갑니다.

			// 일반적으로 작업이 처리되었으면 true를 반환하여 기본 동작을 막습니다.
			navigation.isFocused() && onBackPress();
			return navigation.isFocused();
		};

		// 리스너 등록
		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

		return () => {
			// 이벤트 리스너 해제
			backHandler.remove();
		}
	}, []);

	/**
	 * 포인트 충전 요청/승인 목록 조회
	 */
	const getPointList = async () => {
		// 로딩 표시
		showLoading();

		try {
			// 포인트 조회 요청 데이터 준비
			const queryData: {
				skip: number,
				take: number,
				sort: 'DESC',
				option: '',
				search: ''
			} = {
				skip: 0,
				// express max int Todo: 추후 infinite scroll로 변경
				take: 9007199254740991,
				sort: 'DESC',
				option: '',
				search: ''
			};

			// 포인트 충전 요청/승인 목록 조회 API 엔드포인트 URL
			const response: CommonResponseData<CommonListModel<ResponsePointHistoryListModel>> = await doGetPointList(companyIdName.id, queryData);

			// 응답에 성공했을 경우
			if (response.status === 200) {
				console.log('response: ', response);
				// 데이터가 존재할 경우
				if (response.data && response.data.items) {
					console.log('데이터가 존재할 경우: ', response.data.items);
					// 포인트 충전 요청/승인 목록 세팅
					setPointHistoryList(response.data.items);
				}
			} else {
				// 200 상태 코드가 아닌 경우 (예: 400, 401 등)
				Alert.alert('포인트 충전 요청/승인 목록 조회 실패', response.message);
			}
		} catch (error) {
			console.error('네트워크 오류', error);
			Alert.alert('네트워크 오류', '서버와 통신 중 문제가 발생했습니다.');
		} finally {
			// 로딩 숨기기
			hideLoading();

			// 포인트 충전 요청/승인 목록 정보 리프레시 여부 정보 변경
			setPointListHistoryRefresh(false);
		}
	}

	const approval = async (chargingUuid: string, companyUuid: string) => {
		// 로딩 표시
		showLoading();

		try {
			// 포인트 구매 요청 데이터 준비
			const requestData: RequestPointApprovalModel = {
				charging_uuid: chargingUuid,
				company_uuid: companyUuid
			};

			// 로그인 API 엔드포인트 URL
			const response: CommonResponse = await doApproval(requestData);

			// 응답에 성공했을 경우
			if (response.status === 200) {
				// 구매성공 메세지 출력 후 확인 클릭 시 뒤로가기
				Alert.alert('포인트 충전 승인', '포인트 충전 승인 완료', [
					{
						text: '확인',
						onPress: () => {
							// 다시 포인트 충전 요청/승인 목록 조회
							getPointList();
						}
					}
				]);
			} else {
				// 200 상태 코드가 아닌 경우 (예: 400, 401 등)
				Alert.alert('포인트 충전 승인 실패', response.message);
			}
		} catch (error) {
			console.error('네트워크 오류', error);
			Alert.alert('네트워크 오류', '서버와 통신 중 문제가 발생했습니다.');
		} finally {
			// 로딩 숨기기
			hideLoading();
		}
	}

	/**
	 * 초기 렌더링 시
	 */
	useEffect(() => {
		getPointList();
	}, []);

	return (
		<SafeAreaView style={{flex: 1}}>
			<View style={{...commonStyles.pageLayout, flex: 1}}>
				<StatusBarSize/>
				<View style={styles.companyCard}>
					<Text style={styles.companyCardText}>{companyIdName.name}</Text>
					<TouchableOpacity
						onPress={onLogoutPress}
					>
						{/*<WithLocalSvg asset={AppImages.iconMarker} width="20" height="20" />*/}
						<Icon name="logout" size={20} color="black"/>
					</TouchableOpacity>
				</View>
				<ScrollView
					style={styles.scrollView}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
					}
				>
					{
						!pointHistoryList.length
							? <Text>포인트 충전 요청 기록이 없습니다.</Text>
							: pointHistoryList.map((item: ResponsePointHistoryListModel, index: number) => {
								return (
									<TouchableOpacity key={index} onPress={() => {
										if (item.type === 'Approval') {
											Alert.alert('포인트 충전 승인', '이미 승인된 포인트 입니다.');
											return;
										}

										Alert.alert('포인트 충전 승인', '포인트 충전 승인 하시겠습니까?', [
											{
												text: '확인',
												onPress: () => {
													// 포인트 충전 승인
													approval(item.uuid, item.company_uuid);
												}
											},
											{
												text: '취소',
												onPress: () => null,
												style: 'cancel',
											},
										]);
									}}>
										<View style={{
											...styles.shadowWrap,
											backgroundColor: item.type === 'Approval' ? '#ddd' : '#fff'
										}}>
											<View style={{...styles.menuButtonContainer, justifyContent: 'space-between'}}>
												<View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
													<View>
														<Text style={{ color: '#333',  fontSize: 14,  fontWeight: '700' }}>
															{item.name}/{item.phone_number.substring(7, 11)}
														</Text>
														<Text style={{ color: '#333',  fontSize: 14,  fontWeight: '700' }}>
															{item.type === 'Charging' ? '입금 확인중(승인대기)' : '포인트 충전 완료(승인완료)'}
														</Text>
														<Text style={{ color: '#333', fontSize: 12, fontWeight: '700' }}>
															{addComma(item.point)}P
														</Text>
													</View>
												</View>

												<Text>{momentFormat(item.type === 'Charging' ? item.regDate : item.modDate, 'YYYY-MM-DD HH:mm:ss')}</Text>
											</View>
										</View>
									</TouchableOpacity>
								)
							})
					}
				</ScrollView>
			</View>
		</SafeAreaView>
	);
};
const styles = StyleSheet.create({
	shadowWrap: {
		backgroundColor: '#fff',
		shadowColor: 'rgba(0, 0, 0, 0.3)',
		padding: 10,
		borderRadius: 10,
		flexDirection: 'column',
		gap: 10,
		marginBottom: 15,
	},
	menuButtonContainer: {
		paddingHorizontal: 10,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
	menuButtonText: {
		color: '#fff',
		fontSize: 15,
		fontWeight: '600',
	},
	createReviewButtonContainer: {
		paddingHorizontal: 10,
		paddingBottom: 15,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
	createReviewButton: {
		padding: 10,
		borderRadius: 10,
		flex: 1,
		height: 50,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 7,
		borderColor: '#fff',
		borderWidth: 0.5,
	},
	createReviewButtonText: {
		textAlign: 'center',
		fontSize: 15,
		fontWeight: '600',
		color: theme.primaryColor
	},
	mainCardWrap: {
		backgroundColor: theme.primaryColor
	},
	companyCard: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 15,
	},
	companyCardText: {
		fontSize: 17,
		fontWeight: '600',
		color: '#333'
	},
	headerIconArea: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: 5,
	},
	scrollView: {
		// padding: 10,
	},
	// modal style
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	button: {
		borderRadius: 50,
		padding: 10,
		elevation: 2,
	},
	buttonOpen: {
		backgroundColor: '#F194FF',
	},
	buttonClose: {
		backgroundColor: theme.primaryColor,
		marginTop: 15,
		opacity: 0.8,
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	modalText: {
		marginBottom: 5,
		textAlign: 'center',
		color: '#333'
	},
});

export default CompanyHome;
