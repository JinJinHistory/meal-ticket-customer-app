import {Alert, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text,} from 'react-native';
import React, {useEffect} from 'react';
import BuyItem from "./buy-Item";
import {hideLoading, showLoading} from "../../../util/action";
import Header from "../../../components/header";
import {doGetCompanyTickets} from "../../../api/services/ticket-service";
import {CommonResponseData} from "../../../api/models/responses/common-response-data.model";
import {ResponseCompanyTicketModel} from "../../../api/models/responses/ticket/response-company-ticket.model";
import {useRecoilState} from "recoil";
import {companyInfoState} from "../../../atoms/common-state";

const BuyListView = () => {
	// 회사 정보
	const [companyInfo, setCompanyInfo] = useRecoilState(companyInfoState);

	// 리프레시 상태
	const [refreshing, setRefreshing] = React.useState(false);

	// 회사 티켓 리스트
	const [companyTickets, setCompanyTickets] = React.useState<Array<ResponseCompanyTicketModel>>([]);

	// 리프레시 이벤트
	const onRefresh = React.useCallback(() => {
		setRefreshing(true);

		// 회사 식권 조회 요청
		getCompanyTickets().then(() => setRefreshing(false));
	}, []);

	// 회사 식권 조회 요청
	const getCompanyTickets = async () => {
		// 로딩 표시
		showLoading();

		try {
			// 로그인 API 엔드포인트 URL
			const response: CommonResponseData<Array<ResponseCompanyTicketModel>> = await doGetCompanyTickets(companyInfo.id);

			// 응답에 성공했을 경우
			if (response.status === 200) {
				// 데이터가 존재할 경우
				if (response.data) {
					console.log('데이터가 존재할 경우: ', response.data);
					setCompanyTickets(response.data);
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
	 * 초기화 이벤트
	 */
	useEffect(() => {
		// 회사 식권 조회 요청
		getCompanyTickets();
	}, []);

	return (
		<>
			<SafeAreaView>
				<Header title='식권목록'/>
				<ScrollView
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
					}
				>
					{companyTickets.length === 0 && (<Text style={styles.noItemText}>등록된 식권이 없습니다.</Text>)}
					{companyTickets.map((item: ResponseCompanyTicketModel, index: number) => (<BuyItem key={index} ticketItem={item} />))}
				</ScrollView>
			</SafeAreaView>
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
});

export default BuyListView;
