import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NOTICE_LIST } from '../model/noticeList';
import NoticeItem from './NoticeItem';
// import { useNavigation } from '@react-navigation/native';

const NoticeListView = () => {
  // const navigation = useNavigation<any>();

  return (
    <View>
      {NOTICE_LIST.length === 0 && (
        <Text style={styles.noItemText}>공지사항이 없습니다.</Text>
      )}
      {NOTICE_LIST.slice(0, 3).map(item => {
        return <NoticeItem {...item} />;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  noItemText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
});

export default NoticeListView;
