import {
	Alert, Modal,
	Pressable,
	RefreshControl,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import BuyItem from "./buy-Item";
import {hideLoading, showLoading} from "../../../util/action";
import Header from "../../../components/header";
import {doGetCompanyTickets} from "../../../api/services/ticket-service";
import {CommonResponseData} from "../../../api/models/responses/common-response-data.model";
import {ResponseCompanyTicketModel} from "../../../api/models/responses/ticket/response-company-ticket.model";
import {useRecoilValue} from "recoil";
import {companyInfoState, pointState, userInfoState} from "../../../atoms/common-state";
import {theme} from "../../../assets/styles/common-styles";
import {addComma} from "../../../util/format";
import QRCode from "react-native-qrcode-svg";
import Icon from "react-native-vector-icons/MaterialIcons";

const BuyListView = () => {
	// 유저 정보
	const userInfo: string = useRecoilValue(userInfoState);

	// 회사 정보
	const companyInfo = useRecoilValue(companyInfoState);

	// 나의 포인트 정보
	const myPoint: number = useRecoilValue(pointState);

	// 리프레시 상태
	const [refreshing, setRefreshing] = useState(false);

	// 회사 티켓 리스트
	const [companyTickets, setCompanyTickets] = useState<Array<ResponseCompanyTicketModel>>([]);

	// 각 메뉴의 수량 리스트
	const [countList, setCountList] = useState<number[]>([]);

	// 모달 상태
	const [modalVisible, setModalVisible] = useState<boolean>(false);

	// 결제 QR 코드 데이터
	const [qrCodeData, setQrCodeData] = useState<{
		randomId: string,
		userId: string,
		ticketData: { ticketId: string, count: number }[]
	}>({
		randomId: '',
		userId: '',
		ticketData: []
	});

	// 리프레시 이벤트
	const onRefresh = React.useCallback(() => {
		setRefreshing(true);

		// 회사 식권 조회 요청
		getCompanyTickets().then(() => setRefreshing(false));
	}, []);

	/**
	 * submit 버튼 disabled 여부
	 * @description countList의 합이 0이면 disabled
	 */
	const submitBtnDisabled: boolean = countList.reduce((a: number, b: number) => a + b, 0) === 0;

	// 회사 식권 조회 요청
	const getCompanyTickets = async () => {
		// 로딩 표시
		showLoading();

		try {
			// 회사 식권 조회 요청 API 엔드포인트 URL
			const response: CommonResponseData<Array<ResponseCompanyTicketModel>> = await doGetCompanyTickets(companyInfo.id);

			// 응답에 성공했을 경우
			if (response.status === 200) {
				// 데이터가 존재할 경우
				if (response.data) {
					console.log('데이터가 존재할 경우: ', response.data);
					setCompanyTickets(response.data);

					let newCountList: number[] = [];
					Array.from({length: response.data.length}, () => {
						newCountList.push(0);
					});
					setCountList(newCountList);
				}
			} else {
				// 200 상태 코드가 아닌 경우 (예: 400, 401 등)
				Alert.alert('회사 식권 리스트 조회 실패', response.message);
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
	 * 결제하기 버튼 클릭 이벤트
	 */
	const submitBtnClickEvent = (): void => {
		// 최종 결제 포인트
		let totalPoint: number = 0;

		// ticket data 를 담을 배열 선언
		let newTicketData: { ticketId: string, count: number }[] = [];

		// 회사 식권 리스트를 순회하면서 수량이 0보다 큰 경우에만 QR 코드 데이터에 추가
		companyTickets.forEach((item: ResponseCompanyTicketModel, index: number): void => {
			// 수량이 0보다 큰 경우에만 QR 코드 데이터에 추가
			if (countList[index] > 0) {
				// QR 코드 데이터 추가
				newTicketData.push({
					ticketId: item.ticket_uuid,
					count: countList[index]
				});
				// 결제 포인트 계산 (나의 포인트와 비교해서 결제 가능 여부 판단을 위해 세팅)
				totalPoint += item.price * countList[index];
			}
		});

		if (totalPoint > myPoint) {
			Alert.alert('포인트 부족', '포인트가 부족합니다.');
			return;
		}

		// uuid 생성
		let uuid: string = '';
		for (let i: number = 0; i < 32; i++) {
			uuid += Math.floor(Math.random() * 16).toString(16);
		}

		// 최종 QR 코드 데이터 세팅
		setQrCodeData({
			randomId: uuid,
			userId: userInfo,
			ticketData: newTicketData
		});

		// 모달 오픈
		setModalVisible(true);
	}

	/**
	 * 초기화 이벤트
	 */
	useEffect(() => {
		// 회사 식권 조회 요청
		getCompanyTickets();
	}, []);

	return (
		<>
			<SafeAreaView style={{flex: 1}}>
				<Header title='식사 메뉴'/>
				<ScrollView
					style={{flex: 1}}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
					}
				>
					{companyTickets.length === 0 && (<Text style={styles.noItemText}>등록된 식권이 없습니다.</Text>)}
					{companyTickets.map((item: ResponseCompanyTicketModel, index: number) => (
						<BuyItem key={index} itemIndex={index} ticketItem={item} countList={countList} setCountList={setCountList}/>))}
				</ScrollView>

				<TouchableOpacity style={{
					...styles.submitBtn,
					backgroundColor: submitBtnDisabled ? '#ddd' : theme.primaryColor
				}} onPress={submitBtnClickEvent} disabled={submitBtnDisabled}>
					<Text style={styles.submitText}>결제하기</Text>
				</TouchableOpacity>
			</SafeAreaView>
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
						<QRCode
							value={JSON.stringify(qrCodeData)}
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
	controlContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 50,
		backgroundColor: '#000',
		paddingHorizontal: 16,
	},
	noItemText: {
		textAlign: 'center',
		paddingTop: 20,
		fontSize: 14,
		color: '#666',
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
	modalText: {
		marginBottom: 5,
		textAlign: 'center',
		color: '#333'
	},
	button: {
		borderRadius: 50,
		padding: 10,
		elevation: 2,
	},
	buttonClose: {
		backgroundColor: theme.primaryColor,
		marginTop: 15,
		opacity: 0.8,
	},
});

export default BuyListView;
