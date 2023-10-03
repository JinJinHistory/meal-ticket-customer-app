import React, {useState} from 'react';
import Header from "../../components/header";
import {SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {commonStyles, theme} from "../../assets/styles/common-styles";
import {AppImages} from "../../assets";
import {WithLocalSvg} from "react-native-svg";

const keyboardKeys: Array<number | string | undefined> = [
	1, 2, 3, 4, 5, 6, 7, 8, 9, undefined, 0, 'remove'
]

const PointCharging = () => {
	const [inputValue, setInputValue] = useState<string>('');

	const handleKeyPress = (key: number | string | undefined): void => {
		// 입력값에서 쉼표(,)와 숫자 이외의 문자를 제거합니다.
		const cleanedValue: string = inputValue.replace(/[^0-9]/g, '');

		// key의 값이 remove 일 경우 inputValue의 값에서 마지막 문자를 제거합니다. 그리고 key의 값이 number일 경우 inputValue의 값에 key의 값을 추가합니다.
		switch (key) {
			case undefined:
				break;
			case 'remove':
				// 천단위 쉼표를 추가합니다.
				const removeResultValueWithComma: string = cleanedValue.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
				if (removeResultValueWithComma === '') {
					setInputValue('');
					return;
				}
				setInputValue(removeResultValueWithComma + '원');
				break;
			default:
				console.log('cleanedValue: ', cleanedValue);
				// 0으로 시작하는 숫자는 입력할 수 없도록 합니다.
				if (cleanedValue === '0') {
					setInputValue(key.toString() + '원');
					return;
				}

				// 천단위 쉼표를 추가합니다.
				const resultValueWithComma: string = (cleanedValue + key).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

				setInputValue(resultValueWithComma + '원');
		}
	};

	const renderKeyboard = (key: number| string | undefined, index: number): JSX.Element => {
		switch (key) {
			case undefined:
				return <View key={index} style={styles.key}></View>
			case 'remove':
				return (
					<TouchableOpacity
						key={index}
						onPress={() => handleKeyPress(key)}
						style={styles.key}>
						<WithLocalSvg asset={AppImages.iconDelete} width="20" height="20" />
					</TouchableOpacity>
				)
			default:
				return (
					<TouchableOpacity
						key={index}
						onPress={() => handleKeyPress(key)}
						style={styles.key}>
						<Text style={styles.keyText}>{key}</Text>
					</TouchableOpacity>
				)
		}
	}

	const onClickSubmitBtn = (): void => {
		if (!inputValue || inputValue.replace(/[^0-9]/g, '') === '0') return;
		console.log('충전 금액: ', inputValue.replace(/[^0-9]/g, ''));
	}

	return (
		<SafeAreaView style={{flex: 1}}>
			<Header title='포인트 충전'/>
			<View style={{
				...commonStyles.pageLayout,
				flex: 1,
				gap: 10,
				justifyContent: 'center',
				alignItems: 'center',
			}}>
				<View>
					{
						inputValue
							? <Text style={styles.pointInput}>{inputValue}</Text>
							: <Text style={styles.hintText}>충전할 포인트</Text>
					}
				</View>
			</View>
			<View style={styles.keyboard}>
				{
					keyboardKeys.map((key: string | number | undefined, index: number) => renderKeyboard(key, index))
				}
			</View>
			<TouchableOpacity style={{
				...styles.submitBtn,
				backgroundColor: inputValue && inputValue.replace(/[^0-9]/g, '') !== '0' ? theme.primaryColor : theme.disabledColor
			}} onPress={onClickSubmitBtn}>
				<Text style={styles.submitText}>충전 요청</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	pointInput: {
		fontSize: 30,
		fontWeight: '700',
		color: theme.primaryColor,
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
	keyboard: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	key: {
		width: '33.33%', // 화면 폭의 1/3만큼 너비를 가지도록 설정
		justifyContent: 'center',
		alignItems: 'center',
		height: 70,
	},
	keyText: {
		fontSize: 24,
		fontWeight: '600',
		color: '#333',
	},
	hintText: {
		fontSize: 24,
		color: '#d2d2d2',
		fontWeight: '600'
	}
});

export default PointCharging;