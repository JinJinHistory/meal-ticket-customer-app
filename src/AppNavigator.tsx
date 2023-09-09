import React, {useEffect, useLayoutEffect} from 'react';
import {StatusBar} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginView from './pages/login/Login';
import Tabs from './Tabs/Tabs';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useAppDispatch} from "./redux/store";
import commonSlice from "./redux/slices/common";
import {useSelector} from "react-redux";
import {RootState} from "./redux/store/reducers";

const Stack = createStackNavigator();

export default () => {
	// redux에 저장 된 토큰 가져오기
	const token = useSelector((state: RootState) => state.common.token);

	return (
		<>
			<StatusBar
				backgroundColor="transparent"
				barStyle="dark-content"
				translucent
			/>

			<Stack.Navigator screenOptions={{headerShown: false}}>
				{
					!!token
						? <Stack.Screen name="Tabs" component={Tabs}/>
						: <Stack.Screen name="Login" component={LoginView}/>
				}
			</Stack.Navigator>
		</>
	);
};
