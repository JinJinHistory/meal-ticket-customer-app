import React, {useEffect, useState} from 'react';
import {Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {addComma} from "../../util/format";
import Header from "../../components/header";
import {theme} from "../../assets/styles/common-styles";
import {hideLoading, showLoading} from "../../util/action";
import {RequestGetPointModel} from "../../api/models/requests/point/request-get-point.model";
import {CommonResponseData} from "../../api/models/responses/common-response-data.model";
import {doGetPoint} from "../../api/services/point-service";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store/reducers";

const BuyDetail = ({route}: any) => {

	// redux에 저장 된 유저 uuid 가져오기
	const userUuid = useSelector((state: RootState) => state.common.userUuid);

	// redux에 저장 된 회사 정보 가져오기
	const selectedCompany = useSelector((state: RootState) => state.common.selectedCompany);

	// 포인트
	const [point, setPoint] = useState<number>(0);

	// 수량
	const [count, setCount] = useState<number>(1);

	// 구매가능 개수
	const buyCount: number = Math.floor(point / route.params.ticketItem.price) > 0
		? Math.floor(point / route.params.ticketItem.price)
		: 0

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

	/**
	 * 초기화 이벤트
	 */
	useEffect(() => {
		// 포인트 조회
		getPoint();
	}, []);

	return (
		<SafeAreaView style={{flex: 1}}>
			<Header title='식권구매'/>
			<View style={styles.contentBox}>
				<View style={styles.titleArea}>
					<Text style={{fontSize: 25}}>{route.params.ticketItem.name}</Text>
					<Text style={{fontSize: 30}}>
						<Text style={{fontWeight: '700'}}>{addComma(route.params.ticketItem.price)}</Text>원
					</Text>
				</View>

				<View style={styles.countArea}>
					<View  style={styles.countInnerArea}>
						<TouchableOpacity style={{...styles.countBtn, backgroundColor: count === 1 ? '#ddd' : theme.primaryColor}} disabled={count === 1} onPress={() => setCount((prev: number) => prev > 1 ? prev - 1 : 1)}>
							<Text style={styles.countBtnText}>-</Text>
						</TouchableOpacity>
						<Text style={styles.countText}>{addComma(count)}장</Text>
						<TouchableOpacity style={{...styles.countBtn, backgroundColor: buyCount === count ? '#ddd' : theme.primaryColor}} disabled={buyCount === count} onPress={() => setCount((prev: number) => prev + 1)}>
							<Text style={styles.countBtnText}>+</Text>
						</TouchableOpacity>
					</View>
				</View>

				<View style={styles.pointArea}>
					<Text>구매 가능 개수: <Text style={styles.pointText}>{buyCount}장</Text>
					</Text>
					<Text>보유 포인트: <Text style={styles.pointText}>{addComma(point)}P</Text></Text>
					<Text>결제할 포인트: <Text style={styles.pointText}>{addComma(count * route.params.ticketItem.price)}P</Text></Text>
					<Text>결제 후 포인트: <Text style={styles.pointText}>{addComma(point - count * route.params.ticketItem.price)}P</Text></Text>
				</View>
			</View>

			<TouchableOpacity style={{
				...styles.submitBtn,
				// backgroundColor: inputValue && inputValue.replace(/[^0-9]/g, '') !== '0' ? theme.primaryColor : theme.disabledColor
			}}
				// onPress={onClickSubmitBtn}
			>
				<Text style={styles.submitText}>구매</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	contentBox: {
		padding: 20,
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	// 상단 타이틀 영역
	titleArea: {
		flexDirection: 'column',
		alignItems: 'center',
	},
	// 카운트 영역
	countArea: {
		marginBottom: 20,
		paddingHorizontal: 20,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	countInnerArea: {
		width: 250,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	countBtn: {
		width: 40,
		height: 40,
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.primaryColor
	},
	countBtnText: {
		fontSize: 20,
		fontWeight: '700',
		color: '#fff'
	},
	countText: {
		fontSize: 25,
		fontWeight: '700',
		color: theme.primaryColor
	},
	// 포인트 영역
	pointArea: {
		flexDirection: 'column',
		alignItems: 'center',
	},
	pointText: {
		fontSize: 17,
		fontWeight: '700',
		color: theme.primaryColor
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
});

export default BuyDetail;
