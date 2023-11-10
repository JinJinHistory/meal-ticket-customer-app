import {
	Alert,
	BackHandler,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	useWindowDimensions,
	View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {hideLoading, showLoading} from "../../util/action";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {routes} from "../../routes";
import {commonStyles, theme} from "../../assets/styles/common-styles";
import {AppImages} from "../../assets";
import {WithLocalSvg} from "react-native-svg";
import StatusBarSize from "../../components/status-bar-size";
import {CommonResponseData} from "../../api/models/responses/common-response-data.model";
import {RequestGetPointModel} from "../../api/models/requests/point/request-get-point.model";
import {doGetPoint, doGetPointList} from "../../api/services/point-service";
import {addComma} from "../../util/format";
import Icon from "react-native-vector-icons/MaterialIcons";
import {useRecoilState, useSetRecoilState} from 'recoil';
import {
	companyInfoState,
	pointListHistoryRefreshState,
	pointListHistoryState,
	pointState,
	userInfoState,
	userTicketsRefreshState,
	userTicketsState
} from "../../atoms/common-state";
import MyTicketList from "../ticket/my-ticket-list/my-ticket-list";
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import PointChargingHistoryList from "../point/point-charging-history/point-charging-history-list";
import {CommonListModel} from "../../api/models/responses/common-list.model";
import {ResponsePointHistoryListModel} from "../../api/models/responses/point/response-point-history-list.model";
import {ResponseUserTicketModel} from "../../api/models/responses/ticket/response-user-ticket.model";
import {doGetUserTickets} from "../../api/services/ticket-service";

const Home = () => {
	const navigation = useNavigation<any>();
	const layout = useWindowDimensions();

	const [tabIndex, setTabIndex] = useState<number>(0);
	const [tabRoutes] = useState<Array<{key: string, title: string}>>([
		{ key: 'first', title: '보유 식권 목록' },
		{ key: 'second', title: '충전 요청 기록' },
	]);

	const FirstRoute = () => (
		<MyTicketList userInfo={userInfo} companyInfo={companyInfo} />
	);

	const SecondRoute = () => (
		<PointChargingHistoryList userInfo={userInfo} companyInfo={companyInfo} />
	);

	const renderScene = SceneMap({
		first: FirstRoute,
		second: SecondRoute,
	});

	// 유저 로그인 정보
	const [userInfo, setUserInfo] = useRecoilState(userInfoState);

	// 회사 정보
	const [companyInfo, setCompanyInfo] = useRecoilState(companyInfoState);

	// 포인트 정보
	const [point, setPoint] = useRecoilState(pointState);

	// 유저 티켓 목록 정보
	const setUserTickets = useSetRecoilState(userTicketsState);

	// 유저 티켓 목록 정보 리프레시 여부 정보
	const setUserTicketsRefresh = useSetRecoilState(userTicketsRefreshState);

	// 포인트 충전 요청/승인 목록 정보
	const setPointHistoryList = useSetRecoilState(pointListHistoryState);

	// 포인트 충전 요청/승인 목록 정보 리프레시 여부 정보
	const setPointListHistoryRefresh = useSetRecoilState(pointListHistoryRefreshState);

	// 포인트 조회
	const getPoint = async () => {
		// 로딩 표시
		showLoading();

		try {
			// 포이트 조회 요청 데이터 준비
			const queryData: RequestGetPointModel = {
				user_uuid: userInfo,
				company_uuid: companyInfo.id
			};

			// 포인트 조회 API 엔드포인트 URL
			const response: CommonResponseData<number> = await doGetPoint(queryData);

			// 응답에 성공했을 경우
			if (response.status === 200) {
				console.log('response: ', response);
				// 데이터가 존재할 경우
				if (response.data || response.data === 0) {
					console.log('데이터가 존재할 경우: ', response.data);
					// 포인트 저장
					setPoint(response.data);
				}
			} else {
				// 200 상태 코드가 아닌 경우 (예: 400, 401 등)
				Alert.alert('포인트 조회 실패', response.message);
			}
		} catch (error) {
			console.error('네트워크 오류', error);
			Alert.alert('네트워크 오류', '서버와 통신 중 문제가 발생했습니다.');
		} finally {
			// 로딩 숨기기
			hideLoading();
		}
	}

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
						setUserInfo('');
						setCompanyInfo({ id: '', bank_name: '', account_number: '', account_holder: '', name: '', phone_number: '' });
						setPoint(0);
						setUserTickets([]);
						setUserTicketsRefresh(false);
						setPointHistoryList([]);
						setPointListHistoryRefresh(false);

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
		console.log('Home mounted');

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
			const response: CommonResponseData<CommonListModel<ResponsePointHistoryListModel>> = await doGetPointList(companyInfo.id, queryData);

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

	/**
	 * 유저 식권 조회
	 */
	const getUserTickets = async () => {
		// 로딩 표시
		showLoading();

		try {
			// 포인트 조회 요청 데이터 준비
			const queryData: RequestGetPointModel = {
				user_uuid: userInfo,
				company_uuid: companyInfo.id
			};

			// 유저 식권 조회 API 엔드포인트 URL
			const response: CommonResponseData<Array<ResponseUserTicketModel>> = await doGetUserTickets(queryData);

			// 응답에 성공했을 경우
			if (response.status === 200) {
				console.log('response: ', response);
				// 데이터가 존재할 경우
				if (response.data) {
					console.log('데이터가 존재할 경우: ', response.data);
					// 유저 식권 목록 저장
					setUserTickets(response.data);
				}
			} else {
				// 200 상태 코드가 아닌 경우 (예: 400, 401 등)
				Alert.alert('' +
					'유저 식권 조회 실패', response.message);
			}
		} catch (error) {
			console.error('네트워크 오류', error);
			Alert.alert('네트워크 오류', '서버와 통신 중 문제가 발생했습니다.');
		} finally {
			// 로딩 숨기기
			hideLoading();

			// 유저 티켓 목록 정보 리프레시 여부 정보 변경
			setUserTicketsRefresh(false);
		}
	}

	/**
	 * 초기 렌더링 시 포인트 조회, 회사 아이디 변경 시 포인트 조회
	 */
	useEffect(() => {
		// promiseAll
		companyInfo.id &&
		Promise.all([
			getPoint(),
			getPointList(),
			getUserTickets()
		]);
	}, [companyInfo]);

	return (
		<SafeAreaView style={{flex: 1}}>
			<View style={{...commonStyles.pageLayout, flex: 1}}>
				<StatusBarSize/>
				<View style={styles.companyCard}>
					<TouchableOpacity
						style={styles.headerIconArea}
						onPress={() => {
							// 회사 선택 페이지를 위에 쌓는다
							navigation.push(routes.SELECT_COMPANY);
						}}
					>
						<WithLocalSvg asset={AppImages.iconMarker} width="15" height="15"/>
						<Text style={styles.companyCardText}>{companyInfo.name}</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={onLogoutPress}
					>
						{/*<WithLocalSvg asset={AppImages.iconMarker} width="20" height="20" />*/}
						<Icon name="logout" size={20} color="black"/>
					</TouchableOpacity>
				</View>
				<View style={[styles.shadowWrap, styles.mainCardWrap]}>
					<View style={[styles.menuButtonContainer, {paddingVertical: 15, justifyContent: 'space-between'}]}>
						<View style={{
							flexDirection: 'row',
							alignItems: 'center',
							gap: 5,
						}}>
							<WithLocalSvg asset={AppImages.iconConins} width="20" height="20"/>
							<Text style={styles.menuButtonText}>보유 포인트 <Text
								style={{color: '#fff'}}>{addComma(point)}P</Text></Text>
						</View>
						<TouchableOpacity onPress={getPoint}>
							<Icon name="refresh" size={25} color="white"/>
						</TouchableOpacity>
					</View>
					<View style={styles.createReviewButtonContainer}>
						<TouchableOpacity
							onPress={() => navigation.navigate(routes.POINT_CHARGING)}
							style={[
								styles.createReviewButton,
								{backgroundColor: '#fff'},
							]}
						>
							<WithLocalSvg asset={AppImages.iconAdd} width="20" height="20"/>
							<Text style={styles.createReviewButtonText}>포인트 충전</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => navigation.navigate(routes.TICKET_LIST)}
							style={[
								styles.createReviewButton,
								{backgroundColor: '#eeeeee'},
							]}
						>
							<WithLocalSvg asset={AppImages.iconShoppingBagAdd} width="17" height="17"/>
							<Text style={styles.createReviewButtonText}>식권 구매</Text>
						</TouchableOpacity>
					</View>
				</View>
				{/*<View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingBottom: 5, gap: 5}}>*/}
				{/*	/!*@ts-ignore*!/*/}
				{/*	<WithLocalSvg asset={AppImages.iconTicket} width="20" height="20" style={{fill: '#333'}} />*/}
				{/*	<Text style={{fontSize: 14, fontWeight: '700', color: '#333' }}>나의 식권 목록</Text>*/}
				{/*</View>*/}
				<TabView
					navigationState={{ index: tabIndex, routes: tabRoutes }}
					renderScene={renderScene}
					onIndexChange={setTabIndex}
					initialLayout={{ width: layout.width }}
					renderTabBar={(props: any) => {
						return <TabBar
							{...props}
							indicatorStyle={{ backgroundColor: 'white' }}
							style={{ backgroundColor: theme.primaryColor, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
						/>
					}}
				/>
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
		padding: 10,
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

export default Home;
