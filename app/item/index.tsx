//import React from 'react';
import { Link, useLocalSearchParams } from 'expo-router';
import { ChevronDown } from 'lucide-react-native';
import { Text, Image, StyleSheet, TouchableOpacity, ScrollView, ImageSourcePropType } from 'react-native';

function FoodItemScreen() {
  const params = useLocalSearchParams();
  const { image, title, price, description } = params;

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Link href='../' asChild>
        <TouchableOpacity style={styles.backButton}>
          <ChevronDown size={30} color="#000" />
        </TouchableOpacity>
      </Link>

      <Image source={{ uri: image }  as ImageSourcePropType | undefined} style={styles.image} />

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.description}>{description}</Text>

      <Text style={styles.price}>from Rs. {price}</Text>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>ADD 🛒</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  }
  ,
  image: {
    width: 300,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
    borderRadius: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  price: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  addButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FoodItemScreen;