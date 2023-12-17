import React, {useCallback, useEffect, useState} from 'react';
import {
	Alert,
	Modal,
	Pressable,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from "react-native";
import {ResponseUserTicketModel} from "../../../api/models/responses/ticket/response-user-ticket.model";
import {WithLocalSvg} from "react-native-svg";
import {AppImages} from "../../../assets";
import {addComma} from "../../../util/format";
import QRCode from "react-native-qrcode-svg";
import Icon from "react-native-vector-icons/MaterialIcons";
import {CommonResponseData} from "../../../api/models/responses/common-response-data.model";
import {hideLoading, showLoading} from "../../../util/action";
import {doGetUserTickets} from "../../../api/services/ticket-service";
import {RequestGetPointModel} from "../../../api/models/requests/point/request-get-point.model";
import {theme} from "../../../assets/styles/common-styles";
import {useRecoilState} from "recoil";
import {userTicketsRefreshState, userTicketsState} from "../../../atoms/common-state";
import {ResponseCompanyDetailModel} from "../../../api/models/responses/company/response-company-detail.model";

type Props = {
	userInfo: string;
	companyInfo: ResponseCompanyDetailModel;
}
const MyTicketList = ({ userInfo, companyInfo }: Props) => {

	// 유저 티켓 목록 정보
	const [userTickets, setUserTickets] = useRecoilState(userTicketsState);

	// 선택한 식권의 정보
	const [selectedTicket, setSelectedTicket] = useState<ResponseUserTicketModel>({ qr_id: '', name: '', price: 0 });

	// 모달 상태
	const [modalVisible, setModalVisible] = useState<boolean>(false);

	// 리프레시 상태
	const [refreshing, setRefreshing] = useState<boolean>(false);

	// 유저 티켓 목록 정보 리프레시 여부 정보
	const [userTicketsRefresh, setUserTicketsRefresh] = useRecoilState(userTicketsRefreshState);

	// 리프레시 이벤트
	const onRefresh = useCallback((): void => {
		setRefreshing(true);

		// 유저 식권 조회 후 리프레시 종료
		getUserTickets().then(() => setRefreshing(false));
	}, [companyInfo]);

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

	// 식권 클릭 이벤트
	const onTicketPress = (ticket: ResponseUserTicketModel) => {
		// 선택한 식권 정보 세팅
		setSelectedTicket(ticket);

		// 모달 오픈
		setModalVisible(true);
	}

	/**
	 * 초기 렌더링 시 포인트 조회, 회사 아이디 변경 시 포인트 조회
	 */
	useEffect(() => {
		// 유저 식권 조회
		userTicketsRefresh && getUserTickets();
	}, [userTicketsRefresh]);

	return (
		<>
			<ScrollView
				style={styles.scrollView}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
				}
			>
				{
					!userTickets.length
						? <Text>포인트 충전 후 식권을 구매할 수 있습니다.</Text>
						: userTickets.map((item: ResponseUserTicketModel, index: number) => {
							return (
								<TouchableOpacity key={index} style={{}} onPress={() => {
									onTicketPress(item);
								}}>
									<View style={styles.shadowWrap}>
										<View style={{...styles.menuButtonContainer, justifyContent: 'space-between'}}>
											<View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
												{/*@ts-ignore*/}
												<WithLocalSvg asset={AppImages.iconQrcode} width="25" height="25" style={{fill: '#333', marginRight: 5}} />
												<View>
													<Text style={{ color: '#333',  fontSize: 14,  fontWeight: '700' }}>
														{item.name}
													</Text>
													<Text style={{ color: '#333', fontSize: 12, fontWeight: '700' }}>
														{addComma(item.price)}P
													</Text>
												</View>
											</View>

											<Text>Click <Text style={{fontStyle: 'italic'}}>!</Text></Text>
										</View>
									</View>
								</TouchableOpacity>
							)
						})
				}
			</ScrollView>
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<Text style={{...styles.modalText, fontWeight: '700'}}>QR 코드를 제시해 주세요</Text>
						<Text style={{...styles.modalText, marginBottom: 15}}>{selectedTicket.name} {addComma(selectedTicket.price)}P</Text>
						<QRCode
							value={selectedTicket.qr_id}
							size={200}
							color="black"
							backgroundColor="white"
						/>
						<Pressable
							style={[styles.button, styles.buttonClose]}
							onPress={() => setModalVisible(!modalVisible)}>
							<Icon name="close" size={20} color="white" />
						</Pressable>
					</View>
				</View>
			</Modal>
		</>
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

export default React.memo(MyTicketList);