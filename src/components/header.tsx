import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {useNavigation} from "@react-navigation/native";
import StatusBarSize from "./status-bar-size";

type Props = {
	title: string;
}

const Header = (props: Props) => {
	const navigation = useNavigation();

	return (
		<>
			<StatusBarSize />
			<View style={styles.wrap}>
				<TouchableOpacity style={styles.buttonArea} onPress={() => {
					// 페이지 뒤로가기
					navigation.goBack();
				}}>
					<Icon name="chevron-left" size={30} color="#333"/>
				</TouchableOpacity>
				<Text style={styles.boldText}>{props.title}</Text>
				<View style={styles.buttonArea}/>
			</View>
		</>
	);
};

export default Header;

const styles = StyleSheet.create({
	wrap: {
		height: 50,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomColor: '#ddd',
		borderBottomWidth: 1,
		paddingHorizontal: 15,
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
