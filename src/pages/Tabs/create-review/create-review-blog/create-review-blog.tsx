import React from 'react';
import Header from "../../../../components/header";
import {SafeAreaView, StyleSheet, Text, TextInput, View} from "react-native";

const CreateReviewBlog = () => {
	const [text, onChangeText] = React.useState('업장 상호명');
	const [number, onChangeNumber] = React.useState('키워드 5가지 입력');
	const [value, onChangeTextArea] = React.useState('가이드라인');

	return (
		<SafeAreaView>
			<Header title='방문자 리뷰 작성'/>
			<View style={styles.wrap}>

				<Text style={styles.subTitle}>
					리뷰 생성은 하루에 한번, 영업일(주말제외)만 생성 가능합니다.{"\n"}
					아래의 내용을 정확히 입력해 주세요
				</Text>

				<View style={styles.inputWrap}>

					{/* 리뷰 */}
					<View style={styles.inputBox}>
						<Text style={styles.inputLabel}>리뷰</Text>
						<Text style={styles.inputDesc}>리뷰제목은 블로거 성향, 가이드라인 방향에따라 임의로 설정됩니다.</Text>
						<TextInput
							style={{...styles.input, ...styles.inputText}}
							onChangeText={onChangeText}
							value={text}
						/>
					</View>

					{/* 키워드 */}
					<View style={styles.inputBox}>
						<Text style={styles.inputLabel}>키워드</Text>
						<Text style={styles.inputDesc}>[예시] 메인 키워드-서울네일샵 / 서브 키워드 대학로네일샵, 혜화네일샵</Text>
						<TextInput
							style={{...styles.input, ...styles.inputText}}
							onChangeText={onChangeText}
							value={text}
						/>
					</View>

					{/* 해시태그 */}
					<View style={styles.inputBox}>
						<Text style={styles.inputLabel}>해시태그</Text>
						<Text style={styles.inputDesc}>[예시] #혜화네일잘하는곳, #네일잘하는곳, #이달의아트</Text>
						<TextInput
							style={{...styles.input, ...styles.inputText}}
							onChangeText={onChangeText}
							value={text}
						/>
					</View>

					{/* 이미지 업로드 */}
					<View style={styles.inputBox}>
						<Text style={styles.inputLabel}>이미지 업로드</Text>
						<Text style={styles.inputDesc}>최대 15장의 이미지를 업로드 할 수 있습니다. (최소 5장이상)</Text>
						<View>
							<Text>
								이미지 선택 영역
							</Text>
						</View>
					</View>

					{/* 작성 가이드라인 */}
					<View style={styles.inputBox}>
						<Text style={styles.inputLabel}>작성 가이드라인</Text>
						<Text style={styles.inputDesc}>
							강조하고 싶은 내용이나 스토리의 전개방향 혹은 문제 등을 구체적으로 임력해 주세요.{'\n'}
							[공지사항)을 동해 더 나은 리뷰"를 위한 업종별 가이드라인 작성법을 확인해 주세요.
						</Text>
						<TextInput
							editable
							multiline
							numberOfLines={4}
							maxLength={40}
							onChangeText={text => onChangeTextArea(text)}
							value={value}
							style={{...styles.input, ...styles.textArea}}
						/>
					</View>

				</View>

			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	wrap: {
		height: '100%',
		padding: 10,
	},
	subTitle: {
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 20,
	},
	inputWrap: {
		gap: 25,
	},
	inputBox: {
		gap: 5,
	},
	inputLabel: {
		fontWeight: 'bold',
		color: 'orange',
	},
	inputDesc: {
		fontSize: 12,
		color: '#333',
		marginBottom: 2.5,
	},
	input: {
		borderWidth: 1,
		padding: 5,
		borderColor: 'orange',
		borderRadius: 5,
	},
	inputText: {
		height: 40,
	},
	textArea: {
		height: 120,
	},
});

export default CreateReviewBlog;