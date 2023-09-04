import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './AppNavigator';
import Toast from './components/Toast';
import { loadingRef, toastRef } from './util/action';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store/reducers';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Loading from './components/Loading';

const AppControlFlow: React.FC = () => {
  const isLoading: boolean = useSelector(
    (state: RootState) => state.common.isLoading,
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
        <Toast {...{ ref: toastRef }} />
        <Loading {...{ ref: loadingRef }} />
        {isLoading && (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  loadingWrap: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: '100%',
    height: '100%',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppControlFlow;
