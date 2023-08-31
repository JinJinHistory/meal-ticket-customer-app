import React, {useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import MyPressable from '../../components/MyPressable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import TabIndex from './TabIndex';
import { FloatingAction } from 'react-native-floating-action';

const actions = [
  {
    text: '블로그 리뷰',
    icon: <Icon name="edit" size={20} color="white" />,
    name: 'blog',
    position: 1,
    color: 'black',
    textColor: '#000000',
    textBackground: 'white',
  },
  {
    text: '영수증 리뷰',
    icon: <Icon name="edit" size={20} color="white" />,
    name: 'receipt',
    position: 2,
    color: 'black',
    textColor: '#000000',
    textBackground: 'white',
  },
];

const FlatListBasics = () => {
  const navigation = useNavigation<any>();
  const inset = useSafeAreaInsets();

  useEffect(() => {
    console.log('FlatListBasics mounted');
  });

  return (
    <SafeAreaView
      style={{ flex: 1, marginTop: inset.top ? inset.top : 24 }}
      edges={['left', 'right']}
    >
      <View style={styles.headerContainer}>
        <MyPressable
          style={{ marginLeft: 8 }}
          android_ripple={{ color: 'grey', radius: 20, borderless: true }}
          touchOpacity={0.6}
          onPress={() => navigation.toggleDrawer()}
        >
          <Icon name="menu" size={25} color="black" />
        </MyPressable>
        <Text style={styles.headerText}>NAME</Text>
        <View style={{ width: 33 }} />
      </View>
      <TabIndex />
      {/*<TouchableOpacity*/}
      {/*  style={styles.floatingButton}*/}
      {/*  onPress={() => navigation.navigate('feedback')}*/}
      {/*>*/}
      {/*  <Icon name="edit" size={30} color="white" />*/}
      {/*</TouchableOpacity>*/}
      <FloatingAction
        actions={actions}
        onPressItem={name => {
          navigation.navigate(name);
        }}
        color="black"
        overlayColor={'rgba(0, 0, 0, 0.5)'}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  headerContainer: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 0,
  },
  headerText: {
    flex: 1,
    color: 'black',
    fontSize: 22,
    fontFamily: 'WorkSans-Bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FlatListBasics;
