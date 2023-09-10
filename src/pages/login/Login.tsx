import React, {useEffect, useState} from 'react';
import {Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNavigation} from "@react-navigation/native";
import {hideLoading, showLoading} from "../../util/action";
import commonSlice from "../../redux/slices/common";
import {useAppDispatch} from "../../redux/store";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store/reducers";
import customApi from "../../api/axios";
import {login} from "../../api/services/authService";

const api = axios.create({
	validateStatus: function (status) {
		return status >= 200 && status < 500; // 200-499 사이의 상태 코드를 유효한 상태로 처리
	},
});

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
			const requestData = {
				username: email,
				password: password,
			};

			// 로그인 API 엔드포인트 URL
			const response = await login(requestData);

			if (response.status === 200) {
				console.log(response.data);
				// 성공적인 응답 처리
				const jwtToken = '임시토큰'; // 실제 토큰으로 변경
				await AsyncStorage.setItem('token', jwtToken);
				dispatch(commonSlice.actions.setToken({token: jwtToken}));
			} else {
				// 200 상태 코드가 아닌 경우 (예: 400, 401 등)
				// console.error('로그인 실패', response);
				Alert.alert('로그인 실패', response.data.msg);
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
			<View style={styles.inputContainer}>
				<Image
					style={styles.inputIcon}
					source={{
						uri: 'https://img.icons8.com/ios-filled/512/user.png',
					}}
				/>
				<TextInput
					style={styles.inputs}
					placeholder="아이디"
					underlineColorAndroid="transparent"
					value={email}
					onChangeText={(e: string) => setEmail(e)}
				/>
			</View>

			<View style={styles.inputContainer}>
				<Image
					style={styles.inputIcon}
					source={{uri: 'https://img.icons8.com/ios-glyphs/512/key.png'}}
				/>
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
		backgroundColor: '#DCDCDC',
	},
	inputContainer: {
		borderBottomColor: '#F5FCFF',
		backgroundColor: '#FFFFFF',
		borderRadius: 30,
		borderBottomWidth: 1,
		width: 250,
		height: 45,
		marginBottom: 20,
		flexDirection: 'row',
		alignItems: 'center',
	},
	inputs: {
		height: 45,
		marginLeft: 16,
		borderBottomColor: '#FFFFFF',
		flex: 1,
	},
	inputIcon: {
		width: 30,
		height: 30,
		marginLeft: 15,
		justifyContent: 'center',
	},
	buttonContainer: {
		height: 45,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 20,
		width: 250,
		borderRadius: 30,
	},
	loginButton: {
		backgroundColor: 'orange',
	},
	loginText: {
		color: 'white',
	},
});
