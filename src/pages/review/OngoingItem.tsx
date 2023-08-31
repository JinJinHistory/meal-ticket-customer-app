import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { EnumReviewState, OngoingType } from './model/reviewList';

const OngoingItem = (params: OngoingType) => {
  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.stateBox,
          {
            backgroundColor:
              params.state === EnumReviewState.NOT_ASSIGN
                ? 'orange'
                : 'lightgrey',
          },
        ]}
      >
        <Text
          style={[
            styles.stateText,
            {
              color:
                params.state === EnumReviewState.NOT_ASSIGN
                  ? '#ffffff'
                  : '#333333',
            },
          ]}
        >
          {params.state}
        </Text>
      </View>
      <View style={styles.contentBox}>
        <Text style={{ fontSize: 12 }}>{params.title}</Text>
        <Text style={{ fontSize: 10 }}>
          리뷰생성일: {params.regDate?.toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: 10,
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
    fontSize: 10,
  },
  contentBox: {
    paddingHorizontal: 5,
  },
});

export default OngoingItem;
