import * as React from 'react';
import { FlatList, useWindowDimensions, View } from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { ONGOING_REVIEW_LIST, COMPLETED_REVIEW_LIST } from './model/reviewList';
import CompletedItem from './completed-list/CompletedItem';
import OngoingItem from './ongoing-list/OngoingItem';

const OngoingRoute = () => (
  <FlatList
    data={ONGOING_REVIEW_LIST}
    contentContainerStyle={{ paddingHorizontal: 16 }}
    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
    renderItem={({ item }) => <OngoingItem {...item} />}
  />
);

const CompletedRoute = () => (
  <FlatList
    data={COMPLETED_REVIEW_LIST}
    contentContainerStyle={{ paddingHorizontal: 16 }}
    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
    renderItem={({ item }) => <CompletedItem {...item} />}
  />
);

const renderScene = SceneMap({
  ongoing: OngoingRoute,
  completed: CompletedRoute,
});

const renderTabBar = (props: any) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: 'white' }}
    style={{ backgroundColor: '#000000' }}
  />
);

export default function TabIndex() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'ongoing', title: '진행중인 리뷰' },
    { key: 'completed', title: '완료된 리뷰' },
  ]);

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
