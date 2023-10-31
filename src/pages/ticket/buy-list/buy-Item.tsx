import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ResponseCompanyTicketModel} from "../../../api/models/responses/ticket/response-company-ticket.model";
import {addComma} from "../../../util/format";
import {useNavigation} from "@react-navigation/native";
import {routes} from "../../../routes";

type Props = {
	key: number;
	ticketItem: ResponseCompanyTicketModel;
};
const BuyItem = (props: Props) => {
	const navigation = useNavigation<any>();

	// 식권 클릭 이벤트
	const handleBuyTicket = () => {
		// 식권 구매 화면으로 이동
		navigation.navigate(routes.TICKET_BUY_DETAIL, {ticketItem: props.ticketItem});
	}

	return (
		<TouchableOpacity style={styles.wrap} onPress={handleBuyTicket}>
			<View style={styles.contentBox}>
				<Text style={{fontSize: 14}}>{props.ticketItem.name}</Text>
				<Text style={{fontSize: 14}}><Text style={{fontWeight: '700'}}>{addComma(props.ticketItem.price)}</Text>원</Text>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	wrap: {
		flexDirection: 'row',
		gap: 10,
		borderBottomColor: 'lightgrey',
		borderBottomWidth: 0.5,
		paddingVertical: 18,
		paddingHorizontal: 16,
	},
	stateBox: {
		width: '30%',
		borderRadius: 5,
		textAlign: 'center',
		paddingHorizontal: 5,
		justifyContent: 'center',
	},
	stateText: {
		textAlign: 'center',
		fontSize: 12,
		color: '#333333',
	},
	contentBox: {
		paddingHorizontal: 5,
	},
});

export default BuyItem;
