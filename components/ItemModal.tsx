import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { MenuItem, CartItem, CustomizationCategory } from './types';
import { useCartStore } from './store/cartStore';

interface CustomizableModalProps {
  visible: boolean;
  item: MenuItem | null;
  onClose: () => void;
}

export default function CustomizableModal({
  visible,
  item,
  onClose,
}: CustomizableModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [quantity, setQuantity] = useState(1);
  const [activeCategory, setActiveCategory] = useState<CustomizationCategory | null>(null);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    if (item && item.customizable) {
      const initialOptions: { [key: string]: string } = {};
      item.customizable.forEach((category) => {
        if (category.required && category.options.length > 0) {
          initialOptions[category.title] = category.options[0].name;
        }
      });
      setSelectedOptions(initialOptions);
    }
  }, [item]);

  const handleOptionSelect = (category: string, option: string) => {
    setSelectedOptions((prev) => ({ ...prev, [category]: option }));
    setActiveCategory(null);
  };

  const calculateTotalPrice = () => {
    if (!item) return 0;
    let total = 0;
    if (item.customizable) {
      item.customizable.forEach((category) => {
        const selectedOption = category.options.find(
          (opt) => opt.name === selectedOptions[category.title]
        );
        if (selectedOption && selectedOption.price) {
          total += selectedOption.price;
        }
      });
    } else {
      total = parseFloat(item.price.replace('Rs. ', '').replace(',', ''));
    }
    return total * quantity;
  };

  const handleAddToCart = () => {
    if (!item) return;

    if (isAddToCartDisabled()) {
      Alert.alert(
        "Required Options",
        "Please select all required options before adding to cart.",
        [{ text: "OK" }]
      );
      return;
    }

    const cartItem: CartItem = {
      ...item,
      quantity,
      selectedOptions,
      finalPrice: calculateTotalPrice(),
    };

    addToCart(cartItem);
    onClose();
  };

  const isAddToCartDisabled = () => {
    if (!item || !item.customizable) return false;
    return item.customizable.some(
      (category) => category.required && !selectedOptions[category.title]
    );
  };

  if (!item) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </Pressable>
            <Text style={styles.modalTitle}>CUSTOMIZE ITEM</Text>
          </View>

          <ScrollView style={styles.scrollView}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              {!item.customizable && <Text style={styles.price}>{item.price}</Text>}
            </View>

            {item.customizable && (
              <View style={styles.customizationContainer}>
                <Text style={styles.sectionHeader}>PLEASE SELECT</Text>
                {item.customizable.map((category) => (
                  <Pressable
                    key={category.title}
                    style={styles.categoryButton}
                    onPress={() => setActiveCategory(category)}
                  >
                    <View>
                      <Text style={styles.categoryTitle}>{category.title}</Text>
                      {category.required && <Text style={styles.required}>Required</Text>}
                    </View>
                    <Text style={styles.categoryValue}>
                      {selectedOptions[category.title] || 'Choose'}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            <View style={styles.quantitySection}>
              <Text style={styles.quantityLabel}>Quantity</Text>
              <View style={styles.quantityControls}>
                <Pressable
                  style={styles.quantityButton}
                  onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </Pressable>
                <Text style={styles.quantity}>{quantity}</Text>
                <Pressable
                  style={styles.quantityButton}
                  onPress={() => setQuantity((q) => q + 1)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.totalPrice}>
              Total Price: Rs. {calculateTotalPrice().toFixed(2)}
            </Text>
            <Pressable
              style={[styles.addButton, isAddToCartDisabled() && styles.addButtonDisabled]}
              onPress={handleAddToCart}
            >
              <Text style={styles.addButtonText}>Add to Cart</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <Modal visible={!!activeCategory} transparent animationType="fade">
        <View style={styles.optionsModalContainer}>
          <View style={styles.optionsModalContent}>
            <Text style={styles.optionsModalTitle}>{activeCategory?.title}</Text>
            <Text style={styles.optionsModalSubtitle}>Please select any one option</Text>
            <ScrollView>
              {activeCategory?.options.map((option) => (
                <Pressable
                  key={option.name}
                  style={styles.optionItem}
                  onPress={() => handleOptionSelect(activeCategory.title, option.name)}
                >
                  <Text style={styles.optionName}>{option.name}</Text>
                  {option.price !== undefined && (
                    <Text style={styles.optionPrice}>Rs. {option.price.toFixed(2)}</Text>
                  )}
                </Pressable>
              ))}
            </ScrollView>
            <View style={styles.optionsModalFooter}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setActiveCategory(null)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.confirmButton}
                onPress={() => setActiveCategory(null)}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    padding: 10,  // Increased touch area
    marginRight: 10,
  },
  closeButtonText: {
    fontSize: 28,  // Increased size for better visibility
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    maxHeight: '70%',
  },
  itemImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  itemDetails: {
    padding: 16,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  customizationContainer: {
    padding: 16,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  categoryValue: {
    fontSize: 14,
    color: '#666',
  },
  required: {
    fontSize: 12,
    color: 'red',
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 18,
    marginHorizontal: 16,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 16,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: 'red',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#ffcccc',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionsModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsModalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: '80%',
    maxHeight: '80%',
    padding: 16,
  },
  optionsModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  optionsModalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionName: {
    fontSize: 16,
  },
  optionPrice: {
    fontSize: 14,
    color: '#666',
  },
  optionsModalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});