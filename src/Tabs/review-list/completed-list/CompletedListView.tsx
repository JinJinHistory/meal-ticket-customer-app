import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect } from 'react';
// import { useNavigation } from '@react-navigation/native';
import { COMPLETED_REVIEW_LIST } from '../model/reviewList';
import CompletedItem from './CompletedItem';
import commonSlice from '../../../redux/slices/common';
import { useAppDispatch } from '../../../redux/store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppImages } from '../../../assets';

const CompletedListView = () => {
  const dispatch = useAppDispatch();
  // const navigation = useNavigation<any>();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    console.log('CompletedListView mounted');
    dispatch(commonSlice.actions.setUser({ isLoading: true }));
    setTimeout(() => {
      dispatch(commonSlice.actions.setUser({ isLoading: false }));
    }, 500);
  }, []);

  return (
    <>
      <View style={styles.controlContainer}>
        <TouchableOpacity style={{}} onPress={() => {}}>
          <Icon name="search" size={25} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={{}} onPress={() => {}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Text style={{ color: 'white', fontSize: 12 }}>
              1개월 • 전체 • 최신순
            </Text>
            <Image source={AppImages.downArrow} resizeMode="cover" />
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView
        // contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {COMPLETED_REVIEW_LIST.length === 0 && (
          <Text style={styles.noItemText}>완료된 리뷰가 없습니다.</Text>
        )}
        {COMPLETED_REVIEW_LIST.map(item => (
          <CompletedItem {...item} />
        ))}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  controlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#000',
    paddingHorizontal: 16,
  },
  noItemText: {
    textAlign: 'center',
    paddingTop: 20,
    fontSize: 14,
    color: '#666',
  },
});

export default CompletedListView;
