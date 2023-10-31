import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeView from '../home/HomeView';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import OngoingListView from './review-list/ongoing-list/OngoingListView';
import CompletedListView from './review-list/completed-list/CompletedListView';
import {routes} from "../../routes";
import {theme} from "../../assets/styles/common-styles";
import {AppImages} from "../../assets";
import {WithLocalSvg} from "react-native-svg";

const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: theme.primaryColor,
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
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={routes.ONGOING_LIST}
        component={OngoingListView}
        options={{
          tabBarLabel: '식권',
          tabBarIcon: ({ color, size }) => (
	          // @ts-ignore
	          <WithLocalSvg asset={AppImages.iconQrcode} width="20" height="20" style={{fill: color}} />
          ),
          headerTitle: '식권',
        }}
      />
      <Tab.Screen
        name={routes.COMPLETED_LIST}
        component={CompletedListView}
        options={{
          tabBarLabel: '설정',
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings" size={size} color={color} />
          ),
          headerTitle: '설정',
        }}
      />
    </Tab.Navigator>
  );
}

export default Tabs;
