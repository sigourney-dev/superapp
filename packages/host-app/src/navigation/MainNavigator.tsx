import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';
import MiniAppScreen from '../screens/MiniScreen';
import {Federated} from '@callstack/repack/client';

export type MainStackParamList = {
  Home: undefined;
  Detail: undefined;
  MiniApp: undefined;
};

export type MainStackNavigationProp =
  NativeStackNavigationProp<MainStackParamList>;

const Main = createNativeStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  const AuthProvider = React.lazy(() =>
    Federated.importModule('AuthModule', './AuthProvider'),
  );
  const SignInScreen = React.lazy(() =>
    Federated.importModule('AuthModule', './SignInScreen'),
  );
  const FallbackComponent = () => (
    <View style={styles.container}>
      <ActivityIndicator color="rgba(56, 30, 114, 1)" size="large" />
    </View>
  );
  return (
    <AuthProvider>
      {(authData: {isSignOut: boolean}) => {
        if (authData.isSignOut) {
          return (
            <React.Suspense fallback={<FallbackComponent />}>
              <SignInScreen />
            </React.Suspense>
          );
        }

        return (
          <Main.Navigator
            screenOptions={{
              headerTitle: 'HostApp',
              headerBackTitleVisible: false,
              headerStyle: styles.header,
              headerTitleStyle: styles.headerTitle,
              headerTintColor: 'rgba(255,255,255,1)',
            }}>
            <Main.Screen name="Home" component={HomeScreen} />
            <Main.Screen name="Detail" component={DetailScreen} />
            <Main.Screen name="MiniApp" component={MiniAppScreen} />
          </Main.Navigator>
        );
      }}
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: 'rgba(56, 30, 114, 1)',
  },
  headerTitle: {
    color: 'rgba(255,255,255,1)',
  },
});

export default MainNavigator;
