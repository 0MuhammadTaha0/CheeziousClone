import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MenuItemComponent from '../../components/MenuItem';
import FOOD_ITEMS from '../../assets/data/menu-items.json';
import { useCartStore } from '../../components/store/cartStore';
import { MenuItem } from '../../components/types';
import CustomizableModal from '../../components/ItemModal';

export default function SearchScreen() {
  const [customizeModalVisible, setCustomizeModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const { items, total } = useCartStore();
  const router = useRouter();

  const handleOpenCustomizeModal = (item: MenuItem) => {
    setSelectedItem(item);
    setCustomizeModalVisible(true);
  };

  const handleCloseModal = () => {
    setCustomizeModalVisible(false);
    setSelectedItem(null);
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(FOOD_ITEMS);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const filtered = FOOD_ITEMS.filter(item =>
      item.name.toLowerCase().includes(text.toLowerCase()) ||
      item.description.toLowerCase().includes(text.toLowerCase())
    );
    setSearchResults(filtered);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search product by name"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {searchQuery.trim() === '' ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Type to search product</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={({ item }) => <MenuItemComponent item={item} onOpenCustomizeModal={handleOpenCustomizeModal} />}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {items.length > 0 && (
        <Pressable style={styles.cartBar} onPress={() => router.push('/cart')}>
          <Text style={styles.cartText}>
            {items.length} item{items.length !== 1 ? 's' : ''} • Rs. {total.toFixed(2)}
          </Text>
          <Text style={styles.viewCart}>View Cart</Text>
        </Pressable>
      )}

      <CustomizableModal
        visible={customizeModalVisible}
        item={selectedItem}
        onClose={handleCloseModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  searchIcon: {
    marginHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  cardContent: {
    gap: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  customization: {
    fontSize: 14,
    color: '#FFB800',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFB800',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
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
  favoriteButton: {
    padding: 8,
  },
  cartBar: {
    backgroundColor: '#FFD700',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewCart: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
});