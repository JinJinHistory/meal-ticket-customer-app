import React from 'react';
import Header from "../../../../components/header";
import {SafeAreaView, StyleSheet, TextInput, View} from "react-native";

const CreateReviewDirect = () => {
	const [text, onChangeText] = React.useState('Useless Text');
	const [number, onChangeNumber] = React.useState('');
	const [value, onChangeTextArea] = React.useState('Useless Multiline Placeholder');

	return (
		<SafeAreaView>
			<Header title='방문자 리뷰 작성'/>
			<View>
				<TextInput
					style={styles.input}
					onChangeText={onChangeText}
					value={text}
				/>
				<TextInput
					style={styles.input}
					onChangeText={onChangeNumber}
					value={number}
					placeholder="useless placeholder"
					keyboardType="numeric"
				/>
				<TextInput
					editable
					multiline
					numberOfLines={4}
					maxLength={40}
					onChangeText={text => onChangeTextArea(text)}
					value={value}
					style={{padding: 10}}
				/>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	input: {
		height: 40,
		margin: 12,
		borderWidth: 1,
		padding: 10,
	},
});

export default CreateReviewDirect;