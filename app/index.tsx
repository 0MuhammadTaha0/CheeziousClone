import React, { useEffect } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const SplashScreen: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Automatically navigate to the signup-login screen after 3 seconds
    const timer = setTimeout(() => {
      router.push('../../signup-login');
    }, 3000);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [router]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/cheeziousLogo.jpeg')} style={styles.logo} />
      <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD700', // Cheezious theme color
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
  },
  loader: {
    marginTop: 20,
  },
});

export default SplashScreen;
