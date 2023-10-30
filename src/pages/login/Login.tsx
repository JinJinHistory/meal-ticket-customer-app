import React, {useState} from 'react';
import {Alert, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {hideLoading, showLoading} from "../../util/action";
import commonSlice from "../../redux/slices/common";
import {useAppDispatch} from "../../redux/store";
import {login} from "../../api/services/account-service";
import {RequestAccountLogin} from "../../api/models/requests/account/request-account-login.model";
import {CommonResponseData} from "../../api/models/responses/common-response-data.model";
import {ResponseAccountLogin} from "../../api/models/responses/account/response-account-login.model";
import {theme} from "../../assets/styles/common-styles";
import {AppImages} from "../../assets";
import {WithLocalSvg} from "react-native-svg";

export default function LoginView() {
	// dispatch 객체 생성
	const dispatch = useAppDispatch();
	// 아이디
	const [email, setEmail] = useState<string>('');
	// 비밀번호
	const [password, setPassword] = useState<string>('');

	const handleLogin = async () => {

		// 아이디 및 비밀번호 유효성 검사
		if (!email) {
			Alert.alert('아이디를 입력하세요.');
			return;
		}
		if (!password) {
			Alert.alert('비밀번호를 입력하세요.');
			return;
		}

		// 로딩 표시
		showLoading();

		try {
			// 로그인 요청 데이터 준비
			const requestData: RequestAccountLogin = {
				username: email,
				password: password,
			};

			// 로그인 API 엔드포인트 URL
			const response: CommonResponseData<ResponseAccountLogin> = await login(requestData);

			// 응답에 성공했을 경우
			if (response.status === 200) {
				// 데이터가 존재할 경우
				if (response.data) {
					console.log('[로그인 성공]: ', response.data);
					await AsyncStorage.setItem('userUuid', response.data.uuid);
					dispatch(commonSlice.actions.setUserUuid({userUuid: response.data.uuid}));
				}
			} else {
				// 200 상태 코드가 아닌 경우 (예: 400, 401 등)
				Alert.alert('로그인 실패', response.message);
			}
		} catch (error) {
			console.error('네트워크 오류', error);
			Alert.alert('네트워크 오류', '서버와 통신 중 문제가 발생했습니다.');
		} finally {
			// 로딩 숨기기
			hideLoading();
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.titleRow}>
				<Text style={styles.titleText}>MEAL TICKET</Text>
				{/*@ts-ignore*/}
				<WithLocalSvg asset={AppImages.iconTicket} width="20" height="20" style={{fill: theme.primaryColor}} />
			</View>

			<View style={styles.inputContainer}>
				<TextInput
					style={styles.inputs}
					placeholder="아이디"
					underlineColorAndroid="transparent"
					value={email}
					onChangeText={(e: string) => setEmail(e)}
				/>
			</View>

			<View style={styles.inputContainer}>
				<TextInput
					style={styles.inputs}
					placeholder="비밀번호"
					secureTextEntry={true}
					underlineColorAndroid="transparent"
					value={password}
					onChangeText={(e: string) => setPassword(e)}
				/>
			</View>

			<TouchableOpacity
				style={[styles.buttonContainer, styles.loginButton]}
				onPress={handleLogin}
			>
				<Text style={styles.loginText}>로그인</Text>
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
		width: 250,
		height: 45,
		marginBottom: 20,
		flexDirection: 'row',
		alignItems: 'center',
	},
	inputs: {
		height: 45,
		marginLeft: 16,
		borderColor: theme.primaryColor,
		flex: 1,
	},
	buttonContainer: {
		height: 45,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 20,
		width: 250,
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
	}
});
