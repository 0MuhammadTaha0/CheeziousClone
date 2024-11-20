import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  customizable?: boolean;
}

export const renderMenuItem = ({ item }: { item: MenuItem }) => (
  <Link style={styles.menuDiv} href={{ pathname: '/item', params: { image: item.image, title: item.name, price: item.price, description: item.description } }}>
    <View style={styles.menuItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        {item.customizable && (
          <Text style={styles.customization}>Customizations available</Text>
        )}
        <Text style={[styles.itemPrice, !item.customizable && styles.noCustomizationPrice]}>{item.price}</Text>
        <View style={styles.itemActions}>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={24} color="#D32F2F" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Link>
);

const styles = StyleSheet.create({
  menuDiv: {
    marginBottom: 16,
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImage: {
    width: 120,
    height: 120,
    borderRadius: 0,
    marginRight: 14,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8, // Increased from 4 to 8
  },
  customization: {
    fontSize: 12,
    color: '#FFB800',
    marginBottom: 8, // Increased from 4 to 8
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '400',
    color: '#D32F2F',
    marginBottom: 8,
  },
  noCustomizationPrice: {
    marginTop: 16, // Added 2 to 3 lines of space when no customization
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
