import React, { useState } from 'react';
import { Link, Stack, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, Image, Pressable } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Ionicons } from '@expo/vector-icons';
import Carousel from '../../components/Carousel';
import menuItems from '../../assets/data/menu-items.json';
import imagesData from '../../assets/data/bannerimages.json';
import MenuItemComponent from '../../components/MenuItem';
import { MenuItem } from '../../components/types';
import { useCartStore } from '../../components/store/cartStore';
import CustomizableModal from '../../components/ItemModal';

const { width } = Dimensions.get('window');

export default function MenuScreen() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'Bhook Ka The End!', title: 'Bhook Ka The End!' },
    { key: 'Starters', title: 'Starters' },
    { key: 'Somewhat Local', title: 'Somewhat Local' },
    { key: 'Somewhat Sooper', title: 'Somewhat Sooper' },
    { key: 'Cheezy Treats', title: 'Cheezy Treats' },
    { key: 'Pizza Deals', title: 'Pizza Deals' },
    { key: 'Sandwiches & Platters', title: 'Sandwiches & Platters' },
    { key: 'Special Pizza', title: 'Special Pizza' },
    { key: 'Somewhat Amazing', title: 'Somewhat Amazing' },
    { key: 'Pastas', title: 'Pastas' },
    { key: 'Burgers', title: 'Burgers' },
    { key: 'Side Orders', title: 'Side Orders' },
    { key: 'Addons', title: 'Addons' },
  ]);

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

  const CategoryScene = ({ route }: { route: { key: string } }) => (
    <FlatList
      data={menuItems.filter(item => item.category === route.key).map(item => ({ ...item, description: item.description || '' }))}
      renderItem={({ item }) => <MenuItemComponent item={item} onOpenCustomizeModal={handleOpenCustomizeModal} />}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={styles.menuList}
    />
  );

  const renderScene = SceneMap({
    'Bhook Ka The End!': CategoryScene,
    'Starters': CategoryScene,
    'Somewhat Local': CategoryScene,
    'Somewhat Sooper': CategoryScene,
    'Cheezy Treats': CategoryScene,
    'Pizza Deals': CategoryScene,
    'Sandwiches & Platters': CategoryScene,
    'Special Pizza': CategoryScene,
    'Somewhat Amazing': CategoryScene,
    'Pastas': CategoryScene,
    'Burgers': CategoryScene,
    'Side Orders': CategoryScene,
    'Addons': CategoryScene,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      scrollEnabled
      style={styles.tabBar}
      tabStyle={styles.tab}
      labelStyle={styles.tabLabel}
      indicatorStyle={styles.tabIndicator}
      activeColor="black"
      inactiveColor="grey"
      bounces={false}
      contentContainerStyle={styles.tabBarContentContainer}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Text style={styles.deliverTo}>DELIVER TO</Text>
          <View style={styles.locationRow}>
            <Text style={styles.location}>COMSATS</Text>
            <Ionicons name="chevron-down" size={24} color="black" />
          </View>
        </View>
        <View style={styles.headerIcons}>
          <Link href='/search' asChild>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="search" size={24} color="black" />
            </TouchableOpacity>
          </Link>
          
          <Link href='/supportcenter' asChild>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="help-circle-outline" size={24} color="black" />
            </TouchableOpacity>
          </Link>
            
          <Link href='/profile' asChild>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="person-outline" size={24} color="black" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View style={styles.bannerContainer}>
        <Carousel data={imagesData} autoplayInterval={4000} />
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={renderTabBar}
        swipeEnabled={true}
        lazy={true}
        lazyPreloadDistance={1}
      />

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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  locationContainer: {
    flex: 1,
  },
  deliverTo: {
    fontSize: 12,
    color: '#666',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  bannerContainer: {
    backgroundColor: '#fff',
  },
  tabBar: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    width: 'auto',
    paddingHorizontal: 15,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'none',
    color: 'black',
  },
  tabIndicator: {
    backgroundColor: '#D32F2F',
    height: 3,
  },
  menuList: {
    padding: 12,
  },
  tabBarContentContainer: {
    alignItems: 'center',
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

