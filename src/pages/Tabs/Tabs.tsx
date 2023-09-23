import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeView from './home/HomeView';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import OngoingListView from './review-list/ongoing-list/OngoingListView';
import CompletedListView from './review-list/completed-list/CompletedListView';
import CreateReview from './create-review/CreateReview';
import {routes} from "../../routes";

const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: 'orange',
      }}
    >
      <Tab.Screen
        name={routes.HOME}
        component={HomeView}
        options={{
          tabBarLabel: 'HOME',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
          headerTitle: '고향옥얼큰순대국 구래점',
        }}
      />
      <Tab.Screen
        name={routes.CREATE_REVIEW}
        component={CreateReview}
        options={{
          tabBarLabel: '리뷰생성',
          tabBarIcon: ({ color, size }) => (
            <Icon name="edit" size={size} color={color} />
          ),
          // tabBarBadge: 3,
          headerTitle: '리뷰생성',
        }}
      />
      <Tab.Screen
        name={routes.ONGOING_LIST}
        component={OngoingListView}
        options={{
          tabBarLabel: '진행중인 리뷰',
          tabBarIcon: ({ color, size }) => (
            <Icon name="list" size={size} color={color} />
          ),
          headerTitle: '진행중인 리뷰',
        }}
      />
      <Tab.Screen
        name={routes.COMPLETED_LIST}
        component={CompletedListView}
        options={{
          tabBarLabel: '완료된 리뷰',
          tabBarIcon: ({ color, size }) => (
            <Icon name="list" size={size} color={color} />
          ),
          headerTitle: '완료된 리뷰',
        }}
      />
    </Tab.Navigator>
  );
}

export default Tabs;
