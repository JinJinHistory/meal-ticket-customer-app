import React from 'react';
import { StatusBar, StyleSheet, useWindowDimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  DrawerContent,
  FeedbackScene,
  HelpScene,
  HomeScene,
  InviteFriendScene,
} from '.';
import { CourseInfoScreen, HomeDesignCourse } from './design_course';
import { IntroductionAnimationScreen } from './introduction_animation';
import HotelHomeScreen from './hotel_booking/HotelHomeScreen';
// import FlatListBasics from './Tabs/review/ReviewList';
import LoginView from './pages/login/Login';
import Tabs from './Tabs/Tabs';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
// const Stack = createNativeStackNavigator();

const DrawerNavigator: React.FC = () => {
  const window = useWindowDimensions();

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          width: window.width * 0.75,
          backgroundColor: 'rgb(237, 240, 242, 0.5)',
        },
        sceneContainerStyle: styles.drawerSceneContainer,
        drawerActiveBackgroundColor: 'orange',
        drawerType: 'back',
        overlayColor: 'transparent',
        swipeEdgeWidth: window.width,
        headerShown: false,
        swipeEnabled: false,
      }}
      drawerContent={props => <DrawerContent {...props} />}
      detachInactiveScreens={false}
    >
      {/*<Drawer.Screen name="review_list" component={FlatListBasics} />*/}
      <Drawer.Screen name="blog" component={InviteFriendScene} />
      <Drawer.Screen name="receipt" component={HelpScene} />
      <Drawer.Screen name="notice" component={FeedbackScene} />
      <Drawer.Screen name="invite_friend" component={HomeScene} />
    </Drawer.Navigator>
  );
};

export default () => {
  return (
    <>
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent
      />

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="Login" component={LoginView} />
        <Stack.Screen name="MainDrawer" component={DrawerNavigator} />

        <Stack.Screen name="Hotel" component={HotelHomeScreen} />

        <Stack.Group>
          <Stack.Screen name="DesignCourse" component={HomeDesignCourse} />
          <Stack.Screen name="CourseInfo" component={CourseInfoScreen} />
        </Stack.Group>

        <Stack.Screen
          name="onBoarding"
          component={IntroductionAnimationScreen}
        />
      </Stack.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  drawerSceneContainer: {
    elevation: 24,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
  },
});
