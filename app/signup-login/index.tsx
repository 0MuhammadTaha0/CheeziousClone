import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer'
import { supabase } from '../../lib/supabase';

interface UserData {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  address?: string;
}

const SignupLoginScreen: React.FC = () => {
  const [isSignup, setIsSignup] = useState<boolean>(true);
  const [formData, setFormData] = useState<UserData>({
    email: '',
    password: '',
    name: '',
    phone: '',
    address: '',
  });
  const [imageUri, setImageUri] = useState<string | null>(null);
  const router = useRouter();

  const handleInputChange = (field: keyof UserData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): string | null => {
    if (!validateEmail(formData.email)) {
      return 'Please enter a valid email address.';
    }
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    if (isSignup && !formData.name) {
      return 'Please enter your name.';
    }
    return null;
  };

  const handleSignup = async () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            phone: formData.phone,
            address: formData.address,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        let avatarUrl: string | null = null;
        
        if (imageUri) {
          console.log('Uploading image...');
          avatarUrl = await uploadImage(imageUri, data.user.id);
          console.log('Avatar URL after upload:', avatarUrl);
        }

        // Create profile immediately after signup
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: data.user.id,
            full_name: formData.name,
            avatar_url: avatarUrl,
            phone: formData.phone,
            address: formData.address,
            updated_at: new Date().toISOString(),
          }])
          .select()
          .single();

        if (profileError) {
          console.error('Error creating profile:', profileError);
          // Don't throw the error, as the user is already created
          Alert.alert('Note', 'Account created but profile setup had an issue. You can update your profile later.');
        }

        Alert.alert(
          'Signup Successful', 
          'Please check your email for verification. You can now log in.',
          [
            {
              text: 'OK',
              onPress: () => setIsSignup(false) // Switch to login view
            }
          ]
        );
      }
    } catch (error: any) {
      console.error('Error during signup:', error);
      Alert.alert('Signup Failed', error.message || 'An unexpected error occurred');
    }
  };

  const handleLogin = async () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user) {
        router.push('../../mainmenu');
      }
    } catch (error: any) {
      console.error('Error during login:', error);
      Alert.alert('Login Failed', error.message || 'An unexpected error occurred');
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking an image:', error);
      Alert.alert('Error', 'Failed to pick an image. Please try again.');
    }
  };

  const uploadImage = async (uri: string, userId: string): Promise<string | null> => {
    try {
      // Get the binary data of the image
      const response = await fetch(uri);
      const blob = await response.blob();

      // Convert to base64 first
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            if (typeof reader.result !== 'string') {
              throw new Error('Failed to convert image to base64');
            }

            // Remove the data URL prefix to get just the base64 string
            const base64Data = reader.result.split(',')[1];
            
            // Convert base64 to ArrayBuffer
            const arrayBuffer = decode(base64Data);

            // Generate file path with file extension
            const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
            const filePath = `${userId}/avatar.${fileExt}`;

            console.log('Uploading to path:', filePath);

            // Upload to Supabase
            const { data, error: uploadError } = await supabase.storage
              .from('user-images')
              .upload(filePath, arrayBuffer, {
                contentType: `image/${fileExt}`,
                upsert: true
              });

            if (uploadError) {
              console.error('Upload error:', uploadError);
              throw uploadError;
            }

            console.log('Upload successful:', data);

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
              .from('user-images')
              .getPublicUrl(filePath);

            console.log('Public URL:', publicUrl);
            resolve(publicUrl);
          } catch (error) {
            console.error('Error in upload process:', error);
            reject(error);
          }
        };
        reader.onerror = () => {
          reject(new Error('Failed to read file'));
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Upload Error', 'Failed to upload image. Please try again.');
      return null;
    }
  };


  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/cheeziousLogo.png')}
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
          
          <Button title="Pick Profile Image (Optional)" onPress={pickImage} />
          {imageUri && <Image source={{ uri: imageUri }} style={styles.profileImage} />}
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
        {isSignup ? 'Already have an account? Log In' : 'Don\'t have an account? Sign Up'}
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
    paddingBottom: 130,
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
  profileImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginTop: 15,
    alignSelf: 'center',
  },
});

export default SignupLoginScreen;

