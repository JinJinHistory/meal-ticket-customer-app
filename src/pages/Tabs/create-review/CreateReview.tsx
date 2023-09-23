import * as React from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { useEffect } from 'react';
import commonSlice from '../../../redux/slices/common';
import { useAppDispatch } from '../../../redux/store';
import {hideLoading, showLoading} from "../../../util/action";

const BlogRoute = () => (
  <View>
    <Text>블로그 리뷰</Text>
  </View>
);

const DirectRoute = () => (
  <View>
    <Text>방문자 리뷰</Text>
  </View>
);

const renderScene = SceneMap({
  blog: BlogRoute,
  direct: DirectRoute,
});

const renderTabBar = (props: any) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: 'white' }}
    style={{ backgroundColor: '#000000' }}
  />
);

export default function CreateReview() {
  const dispatch = useAppDispatch();
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'blog', title: '블로그 리뷰' },
    { key: 'direct', title: '방문자 리뷰' },
  ]);

  useEffect(() => {
    console.log('CreateReview mounted');
    showLoading();
    setTimeout(() => {
      hideLoading();
    }, 500);
  }, []);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      sceneContainerStyle={{ paddingTop: 16 }}
      renderTabBar={renderTabBar}
    />
  );
}
