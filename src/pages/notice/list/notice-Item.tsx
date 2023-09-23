import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {EnumReviewState, OngoingType} from "./model/reviewList";

const NoticeItem = (params: OngoingType) => {
  return (
    <TouchableOpacity style={styles.wrap} onPress={() => {}}>
      <View style={styles.contentBox}>
        <Text style={{ fontSize: 14 }}>임시 공지글</Text>
        <Text style={{ fontSize: 12 }}>
          {params.regDate?.toLocaleDateString('ko-KR')}
        </Text>
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

export default NoticeItem;
