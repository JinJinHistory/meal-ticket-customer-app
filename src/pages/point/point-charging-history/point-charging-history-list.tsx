import React, {useCallback, useEffect, useState} from 'react';
import {Alert, RefreshControl, ScrollView, StyleSheet, Text, View} from "react-native";
import {addComma, momentFormat} from "../../../util/format";
import {CommonResponseData} from "../../../api/models/responses/common-response-data.model";
import {hideLoading, showLoading} from "../../../util/action";
import {theme} from "../../../assets/styles/common-styles";
import {useRecoilState} from "recoil";
import {pointListHistoryRefreshState, pointListHistoryState} from "../../../atoms/common-state";
import {doGetPointList} from "../../../api/services/point-service";
import {CommonListModel} from "../../../api/models/responses/common-list.model";
import {ResponsePointHistoryListModel} from "../../../api/models/responses/point/response-point-history-list.model";
import {ResponseCompanyDetailModel} from "../../../api/models/responses/company/response-company-detail.model";

type Props = {
	userInfo: string;
	companyInfo: ResponseCompanyDetailModel;
}
const PointChargingHistoryList = ({ userInfo, companyInfo }: Props) => {

	// 포인트 충전 요청/승인 목록 정보
	const [pointHistoryList, setPointHistoryList] = useRecoilState(pointListHistoryState);

	// 리프레시 상태
	const [refreshing, setRefreshing] = useState<boolean>(false);

	// 포인트 충전 요청/승인 목록 정보 리프레시 여부 정보
	const [pointListHistoryRefresh, setPointListHistoryRefresh] = useRecoilState(pointListHistoryRefreshState);

	// 리프레시 이벤트
	const onRefresh = useCallback((): void => {
		setRefreshing(true);

		// 포인트 충전 요청/승인 목록 조회 후 리프레시 종료
		getPointList().then(() => setRefreshing(false));
	}, [companyInfo]);

	/**
	 * 포인트 충전 요청/승인 목록 조회
	 */
	const getPointList = async () => {
		// 로딩 표시
		showLoading();

		try {
			// 포이트 조회 요청 데이터 준비
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
	 * 초기 렌더링 시 포인트 조회, 회사 아이디 변경 시 포인트 조회
	 */
	useEffect(() => {
		// 포인트 충전 요청/승인 목록 조회
		pointListHistoryRefresh && getPointList();
	}, [pointListHistoryRefresh]);

	return (
		<>
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
								<View key={index} style={styles.shadowWrap}>
									<View style={{...styles.menuButtonContainer, justifyContent: 'space-between'}}>
										<View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
											<View>
												<Text style={{ color: '#333',  fontSize: 14,  fontWeight: '700' }}>
													{item.type === 'Charging' ? '입금 확인중' : '포인트 충전 완료'}
												</Text>
												<Text style={{ color: '#333', fontSize: 12, fontWeight: '700' }}>
													{addComma(item.point)}P
												</Text>
											</View>
										</View>

										<Text>{momentFormat(item.type === 'Charging' ? item.regDate : item.modDate, 'YYYY-MM-DD HH:mm:ss')}</Text>
									</View>
								</View>
							)
						})
				}
			</ScrollView>
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

export default React.memo(PointChargingHistoryList);