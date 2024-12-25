import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useCartStore } from '../../components/store/cartStore';

export default function Cart() {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    if (items.length === 0) {
      router.back();
    }
  }, [items]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Cart' }} />
      <ScrollView style={styles.itemList}>
        {items.map((item, index) => (
          <View key={`${item.id}-${index}`} style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              {item.customizable && (
                <>
                  {Object.entries(item.selectedOptions).map(([key, value]) => (
                    <Text key={key} style={styles.itemCustomization}>{key}: {value}</Text>
                  ))}
                </>
              )}
              <Text style={styles.itemPrice}>Rs. {item.finalPrice.toFixed(2)}</Text>
              <View style={styles.quantityControls}>
                <Pressable
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </Pressable>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <Pressable
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </Pressable>
              </View>
            </View>
            <Pressable style={styles.removeButton} onPress={() => removeFromCart(item.id)}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: Rs. {total.toFixed(2)}</Text>
        <TouchableOpacity 
          style={styles.checkoutButton} 
          onPress={() => {
            router.replace("./thankyouscreen")
          }}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
  itemList: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  itemDetails: {
    flex: 1,
    padding: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemCustomization: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    backgroundColor: 'red',
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 12,
  },
  removeButton: {
    backgroundColor: '#ffcccc',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'red',
    fontSize: 12,
  },
  totalContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  checkoutButton: {
    backgroundColor: 'red',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});