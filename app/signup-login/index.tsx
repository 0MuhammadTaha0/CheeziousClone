import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';

interface UserData {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
}

const SignupLoginScreen: React.FC = () => {
  const [isSignup, setIsSignup] = useState<boolean>(true);
  const [formData, setFormData] = useState<UserData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
  });
  const router = useRouter();

  const filePath = FileSystem.documentDirectory + 'userData.json';

  useEffect(() => {
    const initializeUserDataFile = async () => {
      const fileExists = await FileSystem.getInfoAsync(filePath);
      if (!fileExists.exists) {
        await FileSystem.writeAsStringAsync(filePath, JSON.stringify([]));
      }
    };
    initializeUserDataFile();
  }, []);

 // const filePath = FileSystem.documentDirectory + 'userData.json';

// Function to load user data
const loadUserData = async (): Promise<UserData[]> => {
  try {
    const fileExists = await FileSystem.getInfoAsync(filePath);

    if (fileExists.exists) {
      const fileContent = await FileSystem.readAsStringAsync(filePath);
      const parsedData = JSON.parse(fileContent);
      if (Array.isArray(parsedData)) {
        return parsedData; // Return the valid array
      } else {
        console.warn('Invalid file content, resetting to empty array.');
        return [];
      }
    } else {
      console.warn('File does not exist, initializing empty data.');
      return [];
    }
  } catch (error) {
    console.error('Error loading user data:', error);
    return []; // Default to empty array if any error occurs
  }
};

// Function to save user data
const saveUserData = async (newUser: UserData): Promise<void> => {
  try {
    const existingUsers = await loadUserData();
    const updatedUsers = [...existingUsers, newUser]; // Spread operator assumes an array
    await FileSystem.writeAsStringAsync(filePath, JSON.stringify(updatedUsers, null, 2));
    console.log('User data saved successfully:', updatedUsers);
  } catch (error) {
    console.error('Error saving user data:', error);
    throw new Error('Failed to save user data.'); // Re-throw error for alert
  }
};


  const handleInputChange = (field: keyof UserData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSignup = async () => {
    try {
      const newUser = { ...formData };
      await saveUserData(newUser);
      Alert.alert('Success', 'Account created!');
      router.push('../../MainMenu'); // Redirect to the main menu
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      Alert.alert('Error', errorMessage);
    }
  };
  

  const handleLogin = async () => {
    try {
      const existingUsers = await loadUserData();
      const matchedUser = existingUsers.find(
        (user) => user.email === formData.email && user.password === formData.password
      );

      if (matchedUser) {
        Alert.alert('Success', 'Login successful!');
        router.push('../../MainMenu');
      } else {
        Alert.alert('Error', 'Invalid email or password.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load user data.';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/cheeziousLogo.jpeg')}
        style={styles.logo}
      />
      <Text style={styles.title}>{isSignup ? 'Sign Up' : 'Log In'}</Text>
      {isSignup && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#4A4A4A"
            onChangeText={(value) => handleInputChange('name', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            placeholderTextColor="#4A4A4A"
            keyboardType="phone-pad"
            onChangeText={(value) => handleInputChange('phone', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            placeholderTextColor="#4A4A4A"
            onChangeText={(value) => handleInputChange('address', value)}
          />
        </>
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#4A4A4A"
        keyboardType="email-address"
        onChangeText={(value) => handleInputChange('email', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#4A4A4A"
        secureTextEntry
        onChangeText={(value) => handleInputChange('password', value)}
      />
      <Button
        title={isSignup ? 'Sign Up' : 'Log In'}
        onPress={isSignup ? handleSignup : handleLogin}
      />
      <Text
        style={styles.switchText}
        onPress={() => setIsSignup((prev) => !prev)}
      >
        {isSignup ? 'Already have an account? Log In' : 'Don’t have an account? Sign Up'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    paddingBottom:130,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#FFF',
    color: '#000',
  },
  switchText: {
    textAlign: 'center',
    color: '#007BFF',
    marginTop: 15,
  },
});

export default SignupLoginScreen;
