import React from 'react';
import {Platform, StatusBar, View} from "react-native";

const StatusBarSize = () => {
	return (
		<View style={{height: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight}}/>
	);
};

export default StatusBarSize;