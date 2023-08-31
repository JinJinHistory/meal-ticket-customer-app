import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CompletedType } from './model/reviewList';

const CompletedItem = (params: CompletedType) => {
  return (
    <View style={styles.wrap}>
      <View style={styles.stateBox}>
        <Text style={styles.stateText}>
          {params.state} : {params.comDate?.toLocaleDateString()}
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
    backgroundColor: 'lightgrey',
  },
  stateText: {
    textAlign: 'center',
    fontSize: 10,
    color: '#333333',
  },
  contentBox: {
    paddingHorizontal: 5,
  },
});

export default CompletedItem;
