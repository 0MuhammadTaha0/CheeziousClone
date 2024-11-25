import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MenuItem } from './types';
import { useCartStore } from './store/cartStore';

interface MenuItemProps {
  item: MenuItem;
  onOpenCustomizeModal: (item: MenuItem) => void;
}

const MenuItemComponent: React.FC<MenuItemProps> = ({ item, onOpenCustomizeModal }) => {
  const { updateQuantity, getItemQuantity } = useCartStore();
  const router = useRouter();

  const handleAddPress = () => {
    onOpenCustomizeModal(item);
  };

  const quantity = getItemQuantity(item.id);

  return (
    <View style={styles.menuDiv}>
      <View style={styles.menuItem}>
        <TouchableOpacity onPress={handleAddPress} style={styles.itemImageContainer}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
        </TouchableOpacity>
        <View style={styles.itemContent}>
          <TouchableOpacity onPress={handleAddPress}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
            {item.customizable && (
              <Text style={styles.customization}>Customizations available</Text>
            )}
            <Text style={[styles.itemPrice, !item.customizable && styles.noCustomizationPrice]}>{item.price}</Text>
          </TouchableOpacity>
          <View style={styles.itemActions}>
            {quantity > 0 ? (
              <View style={styles.quantityControls}>
                <Pressable
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, quantity - 1)}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </Pressable>
                <Text style={styles.quantity}>{quantity}</Text>
                <Pressable
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, quantity + 1)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </Pressable>
              </View> 
            ) : (
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={handleAddPress}
              >
                <Text style={styles.addButtonText}>ADD</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity>
              <Ionicons name="heart-outline" size={24} color="#D32F2F" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

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
  itemImageContainer: {
    marginRight: 14,
  },
  itemImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
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
    marginBottom: 8,
  },
  customization: {
    fontSize: 12,
    color: '#FFB800',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '400',
    color: '#D32F2F',
    marginBottom: 8,
  },
  noCustomizationPrice: {
    marginTop: 16,
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
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButton: {
    backgroundColor: 'red',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 16,
  }
});

export default MenuItemComponent;

