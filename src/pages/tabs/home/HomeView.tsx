import {
	Alert,
	BackHandler,
	Platform,
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
import {useAppDispatch} from '../../../redux/store';
import {hideLoading, showLoading} from "../../../util/action";
import AsyncStorage from "@react-native-async-storage/async-storage";
import commonSlice from "../../../redux/slices/common";
import {routes} from "../../../routes";
import {commonStyles, theme} from "../../../assets/styles/common-styles";
import {AppImages} from "../../../assets";
import {WithLocalSvg} from "react-native-svg";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store/reducers";
import StatusBarSize from "../../../components/status-bar-size";
import {CommonResponseData} from "../../../api/models/responses/common-response-data.model";
import {RequestGetPointModel} from "../../../api/models/requests/point/request-get-point.model";
import {doGetPoint} from "../../../api/services/point-service";
import {addComma} from "../../../util/format";

const HomeView = () => {
	const dispatch = useAppDispatch();
	const navigation = useNavigation<any>();

	// redux에 저장 된 유저 uuid 가져오기
	const userUuid = useSelector((state: RootState) => state.common.userUuid);

	// redux에 저장 된 회사 정보 가져오기
	const selectedCompany = useSelector((state: RootState) => state.common.selectedCompany);

	// 포인트
	const [point, setPoint] = useState<number>(0);

	const [refreshing, setRefreshing] = useState<boolean>(false);

	const onRefresh = useCallback((): void => {
		setRefreshing(true);

		// 포인트 조회
		getPoint().then(() => setRefreshing(false));
	}, []);

	// 포인트 조회
	const getPoint = async () => {
		// 로딩 표시
		showLoading();

		try {
			// 포이트 조회 요청 데이터 준비
			const queryData: RequestGetPointModel = {
				user_uuid: userUuid,
				company_uuid: selectedCompany.id
			};

			// 로그인 API 엔드포인트 URL
			const response: CommonResponseData<number> = await doGetPoint(queryData);

			// 응답에 성공했을 경우
			if (response.status === 200) {
				console.log('response: ', response);
				// 데이터가 존재할 경우
				if (response.data || response.data === 0) {
					console.log('데이터가 존재할 경우: ', response.data);
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
				{ text: '확인', onPress: () => BackHandler.exitApp() },
			],
			{ cancelable: false },
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
				{ text: '확인', onPress: () => {
					// storage 초기화
					AsyncStorage.clear();
					dispatch(commonSlice.actions.setUserUuid({userUuid: ''}));
					dispatch(commonSlice.actions.setCompanyUuid({selectedCompany: {id: '', name: ''}}));
				} },
			],
			{ cancelable: false },
		);
		return true;
	}

	useEffect(()=>{
		console.log('HomeView mounted');

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
	},[]);

	/**
	 * 초기 렌더링 시 포인트 조회, 회사 아이디 변경 시 포인트 조회
	 */
	useEffect(() => {
		console.log('초기 렌더링 시 포인트 조회, 회사 아이디 변경 시 포인트 조회');
		// 포인트 조회
		getPoint();
	}, [selectedCompany]);

	return (
		<SafeAreaView style={{flex: 1}}>
			<ScrollView
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
				}
			>
				<View style={commonStyles.pageLayout}>
					<StatusBarSize />
					<View style={styles.companyCard}>
						<Text style={styles.companyCardText}>{selectedCompany.name}</Text>
						<TouchableOpacity
							onPress={() => {
								// 회사 선택 페이지를 위에 쌓는다
								navigation.push(routes.SELECT_COMPANY);
							}}
						>
							<WithLocalSvg asset={AppImages.iconMarker} width="20" height="20" />
						</TouchableOpacity>
					</View>
					<View style={[styles.shadowWrap, styles.mainCardWrap]}>
						<View style={[styles.menuButtonContainer, {paddingBottom: 10}]}>
							<WithLocalSvg asset={AppImages.iconConins} width="20" height="20" />
							<Text style={styles.menuButtonText}>보유 포인트 <Text style={{color: '#fff'}}>{addComma(point)}P</Text></Text>
						</View>
						<View style={styles.createReviewButtonContainer}>
							<TouchableOpacity
								onPress={() => navigation.navigate(routes.POINT_CHARGING)}
								style={[
									styles.createReviewButton,
									{backgroundColor: '#fff'},
								]}
							>
								<WithLocalSvg asset={AppImages.iconAdd} width="20" height="20" />
								<Text style={styles.createReviewButtonText}>포인트 충전</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => navigation.navigate(routes.CREATE_REVIEW_BLOG)}
								style={[
									styles.createReviewButton,
									{backgroundColor: '#eeeeee'},
								]}
							>
								<WithLocalSvg asset={AppImages.iconShoppingBagAdd} width="17" height="17" />
								<Text style={styles.createReviewButtonText}>식권 구매</Text>
							</TouchableOpacity>
						</View>
					</View>
					<TouchableOpacity style={{}} onPress={onLogoutPress}>
						<View style={styles.shadowWrap}>
							<View style={styles.menuButtonContainer}>
								<Text
									style={{
										color: '#333',
										fontSize: 15,
										fontWeight: '700',
									}}
								>
									[임시] 로그아웃
								</Text>
							</View>
						</View>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	shadowWrap: {
		backgroundColor: '#fff',
		shadowColor: 'rgba(0, 0, 0, 0.3)',
		padding: 10,
		borderRadius: 10,
		...Platform.select({
			ios: {
				shadowColor: 'rgba(0, 0, 0, 0.3)',
				shadowOffset: {width: 0, height: 2},
				shadowOpacity: 0.3,
				shadowRadius: 4,
			},
			android: {
				elevation: 5,
			},
		}),
		flexDirection: 'column',
		gap: 10,
		marginBottom: 15,
	},
	menuButtonContainer: {
		paddingHorizontal: 10,
		paddingVertical: 15,
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
	}
});

export default HomeView;
