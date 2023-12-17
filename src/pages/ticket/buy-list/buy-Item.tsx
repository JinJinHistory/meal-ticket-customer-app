import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ResponseCompanyTicketModel} from "../../../api/models/responses/ticket/response-company-ticket.model";
import {addComma} from "../../../util/format";
import {useNavigation} from "@react-navigation/native";
import {routes} from "../../../routes";
import {theme} from "../../../assets/styles/common-styles";

type Props = {
	itemIndex: number;
	ticketItem: ResponseCompanyTicketModel;
	countList: number[];
	setCountList: React.Dispatch<React.SetStateAction<number[]>>;
};
const BuyItem = (props: Props) => {
	const navigation = useNavigation<any>();

	return (
		<View style={styles.wrap}>
			<View style={styles.contentBox}>
				<Text style={{fontSize: 14}}>{props.ticketItem.name}</Text>
				<Text style={{fontSize: 14}}><Text style={{fontWeight: '700'}}>{addComma(props.ticketItem.price)}</Text>P</Text>
			</View>
			<View style={styles.countArea}>
				<View style={styles.countInnerArea}>
					<TouchableOpacity
						style={{
							...styles.countBtn,
							backgroundColor: props.countList[props.itemIndex] === 0 ? '#ddd' : theme.primaryColor
						}} disabled={props.countList[props.itemIndex] === 0}
						onPress={(): void => {
							let updateCountList: number[] = [...props.countList];
							if (updateCountList[props.itemIndex] > 0) {
								updateCountList[props.itemIndex] -= 1;
							} else {
								updateCountList[props.itemIndex] = 0;
							}
							props.setCountList(updateCountList);
						}}>
						<Text style={styles.countBtnText}>-</Text>
					</TouchableOpacity>
					<Text style={styles.countText}>{addComma(props.countList[props.itemIndex])}</Text>
					<TouchableOpacity style={{ ...styles.countBtn, backgroundColor: theme.primaryColor}}
					                  onPress={(): void => {
						                  let updateCountList: number[] = [...props.countList];
						                  updateCountList[props.itemIndex] += 1;
										  props.setCountList(updateCountList);
					                  }}>
						<Text style={styles.countBtnText}>+</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	wrap: {
		flexDirection: 'row',
		justifyContent: 'space-between',
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
	// 카운트 영역
	countArea: {
		marginBottom: 20,
		paddingHorizontal: 20,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	countInnerArea: {
		width: 100,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	countBtn: {
		width: 20,
		height: 20,
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme.primaryColor
	},
	countBtnText: {
		fontSize: 13,
		fontWeight: '700',
		color: '#fff'
	},
	countText: {
		fontSize: 20,
		fontWeight: '700',
		color: theme.primaryColor
	},
});

export default BuyItem;
