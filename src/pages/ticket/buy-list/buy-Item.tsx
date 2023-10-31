import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ResponseCompanyTicketModel} from "../../../api/models/responses/ticket/response-company-ticket.model";
import {addComma} from "../../../util/format";

type Props = {
	key: number;
	ticketItem: ResponseCompanyTicketModel;
};
const BuyItem = (props: Props) => {
  return (
    <TouchableOpacity style={styles.wrap} onPress={() => {}}>
      <View style={styles.contentBox}>
        <Text style={{ fontSize: 14 }}>{props.ticketItem.name}</Text>
        <Text style={{ fontSize: 14 }}>{addComma(props.ticketItem.price)}원</Text>
        {/*<Text style={{ fontSize: 12 }}>*/}
        {/*  {params.regDate?.toLocaleDateString('ko-KR')}*/}
        {/*</Text>*/}
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
