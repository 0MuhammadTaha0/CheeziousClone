// import React from 'react';
import { Link } from 'expo-router';
import { ChevronDown } from 'lucide-react-native';
import { View, Text, StyleSheet, Image, SafeAreaView, Linking, TouchableOpacity } from 'react-native';

export default function SupportCenterScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Back Icon */}
      <Link href='../' asChild>
        <TouchableOpacity style={styles.backButton}>
          <ChevronDown size={30} color="#000" />
        </TouchableOpacity>
      </Link>
      
      {/* Content Section */}
      <View style={styles.content}>
        {/* Logo */}
        <Image
          source={require("../../assets/images/cheeziousLogo.png")} // Replace with your logo path
          style={styles.logo}
        />

        {/* Support Center Text */}
        <Text style={styles.title}>Support Center</Text>
        <Text style={styles.subtitle}>For queries, please contact us at:</Text>

        {/* Contact Details */}
        <Text
          style={styles.contactEmail}
          onPress={() => Linking.openURL('mailto:support@cheezious.com')}
        >
          support@cheezious.com
        </Text>
        <Text
          style={styles.contactPhone}
          onPress={() => Linking.openURL('tel:051111446699')}
        >
          051111446699
        </Text>

        {/* Privacy Policy */}
        <TouchableOpacity style={styles.privacyPolicyButton}>
          <Text style={styles.privacyPolicyText}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 30, // Adjusted for more padding
    left: 16,
    borderRadius: 32,
  },
  backArrow: {
    fontSize: 28,
    color: 'black',
    transform: [{ rotate: '180deg' }], // Rotate to create downward arrow
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 16,
  },
  contactEmail: {
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 16,
  },
  privacyPolicyButton: {
    marginTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingBottom: 4,
  },
  privacyPolicyText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
});