import React, {useState} from 'react';
import {Alert, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {hideLoading, showLoading} from "../../../util/action";
import {theme} from "../../../assets/styles/common-styles";
import {AppImages} from "../../../assets";
import {WithLocalSvg} from "react-native-svg";
import {useNavigation} from "@react-navigation/native";
import {doSignUp} from "../../../api/services/account-service";
import {CommonResponse} from "../../../api/models/responses/common-response.model";
import {RequestAccountUserSignupModel} from "../../../api/models/requests/account/request-account-user-signup.model";
import {routes} from "../../../routes";

export default function SignUpView() {
	const navigation = useNavigation<any>();

	// 이름
	const [name, setName] = useState<string>('');

	// 전화번호
	const [phoneNumber, setPhoneNumber] = useState<string>('');

	// 아이디
	const [email, setEmail] = useState<string>('');

	// 비밀번호
	const [password, setPassword] = useState<string>('');

	const handleSignUp = async () => {

		// 아이디 및 비밀번호 유효성 검사
		if (!name) {
			Alert.alert('이름을 입력하세요.');
			return;
		}
		if (!phoneNumber) {
			Alert.alert('전화번호를 입력하세요.');
			return;
		}
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
			const requestData: RequestAccountUserSignupModel = {
				name: name,
				phone_number: phoneNumber,
				username: email,
				password: password,
			};

			// 로그인 API 엔드포인트 URL
			const response: CommonResponse = await doSignUp(requestData);

			// 응답에 성공했을 경우
			if (response.status === 200) {
				// 회원가입 성공 alert 후 확인버튼 클릭 시 로그인 페이지로 이동
				Alert.alert('회원가입 성공', '로그인 페이지로 이동합니다.', [
					{
						text: '확인',
						onPress: () => navigation.navigate(routes.LOGIN),
					},
				]);
			} else {
				// 200 상태 코드가 아닌 경우 (예: 400, 401 등)
				Alert.alert('회원가입 실패', response.message);
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
					placeholder="이름"
					underlineColorAndroid="transparent"
					value={name}
					onChangeText={(e: string) => setName(e)}
				/>
			</View>

			<View style={styles.inputContainer}>
				{/*전화번호 인풋: 숫자패드*/}
				<TextInput
					style={styles.inputs}
					placeholder="전화번호"
					underlineColorAndroid="transparent"
					value={phoneNumber}
					maxLength={11}
					onChangeText={(e: string) => setPhoneNumber(e)}
					keyboardType="numeric" />
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
				style={{...styles.buttonContainer, ...styles.loginButton, marginBottom: 10}}
				onPress={handleSignUp}
			>
				<Text style={styles.loginText}>회원가입</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.buttonContainer, styles.goBackButton]}
				onPress={() => navigation.goBack()}
			>
				<Text style={styles.loginText}>뒤로가기</Text>
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
		marginBottom: 10,
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
		width: 250,
		borderRadius: 10,
	},
	loginButton: {
		backgroundColor: theme.primaryColor,
	},
	goBackButton: {
		backgroundColor: '#333',
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
