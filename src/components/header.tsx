import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {useNavigation} from "@react-navigation/native";

type Props = {
	title: string;
}

const Header = (props: Props) => {
	const navigation = useNavigation();

	return (
		<View style={styles.wrap}>
			<TouchableOpacity style={styles.buttonArea} onPress={() => {
				// 페이지 뒤로가기
				navigation.goBack();
			}}>
				<Icon name="chevron-left" size={30} color="#333"/>
			</TouchableOpacity>
			<Text style={styles.boldText}>{props.title}</Text>
			<View style={styles.buttonArea} />
		</View>
	);
};

export default Header;

const styles = StyleSheet.create({
	wrap: {
		padding: 10,
		height: 50,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	boldText: {
		fontWeight: "500",
		color: '#333',
		fontSize: 17,
	},
	buttonArea: {
		width: 30,
	}
});
