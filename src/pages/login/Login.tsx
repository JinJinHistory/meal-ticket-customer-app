import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  // Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoginView() {
  const navigation = useNavigation<any>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [email, setEmail] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [password, setPassword] = useState('');

  // const showAlert = (viewId: string) =>
  //   Alert.alert('Alert', 'Button pressed ' + viewId);
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Image
          style={styles.inputIcon}
          source={{
            uri: 'https://img.icons8.com/ios-filled/512/circled-envelope.png',
          }}
        />
        <TextInput
          style={styles.inputs}
          placeholder="Email"
          keyboardType="email-address"
          underlineColorAndroid="transparent"
          onChangeText={(e: string) => setEmail(e)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Image
          style={styles.inputIcon}
          source={{ uri: 'https://img.icons8.com/ios-glyphs/512/key.png' }}
        />
        <TextInput
          style={styles.inputs}
          placeholder="Password"
          secureTextEntry={true}
          underlineColorAndroid="transparent"
          onChangeText={(e: string) => setPassword(e)}
        />
      </View>

      <TouchableOpacity
        style={[styles.buttonContainer, styles.loginButton]}
        onPress={() => navigation.navigate('MainDrawer')}
      >
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      {/*<TouchableOpacity*/}
      {/*  style={styles.buttonContainer}*/}
      {/*  onPress={() => showAlert('forgot password')}*/}
      {/*>*/}
      {/*  <Text>Forgot your password?</Text>*/}
      {/*</TouchableOpacity>*/}

      {/*<TouchableOpacity*/}
      {/*  style={styles.buttonContainer}*/}
      {/*  onPress={() => showAlert('sign up')}*/}
      {/*>*/}
      {/*  <Text>Sign up</Text>*/}
      {/*</TouchableOpacity>*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 250,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: 'center',
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: 'orange',
  },
  loginText: {
    color: 'white',
  },
});
