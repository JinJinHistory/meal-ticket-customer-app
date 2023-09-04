import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NoticeType } from '../model/noticeList';

const NoticeItem = (params: NoticeType) => {
  return (
    <TouchableOpacity style={{}} onPress={() => {}}>
      <View style={styles.wrap}>
        <Text
          style={{
            fontSize: 14,
          }}
        >
          {params.title}
        </Text>
        <Text
          style={{
            fontSize: 12,
          }}
        >
          {params.regDate?.toLocaleDateString('ko-KR')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: 8,
  },
});

export default NoticeItem;
