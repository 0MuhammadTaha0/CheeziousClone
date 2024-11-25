import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const ThankYouScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.thankYouText}>Thank you for your order!</Text>
      <Text style={styles.message}>We appreciate your business.</Text>
      <TouchableOpacity 
        style={styles.mainMenuButton} 
        onPress={() => router.replace('/mainmenu')}
      >
        <Text style={styles.mainMenuButtonText}>Go Back to Main Menu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  thankYouText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#6c757d',
  },
  mainMenuButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8, 
    alignItems: 'center',
    marginTop: 20,
  },
  mainMenuButtonText: {
    color: '#FFFFFF',
    fontSize: 18, 
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ThankYouScreen;
