import { useState } from 'react';
import { Link, usePathname } from 'expo-router';
import { View, Text, StyleSheet, Dimensions, Image, FlatList, TouchableOpacity, TouchableHighlight, SafeAreaView, StatusBar } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Ionicons } from '@expo/vector-icons';
import Carousel from '../../components/Carousel';
import menuItems from '../../assets/data/menuitems.json';
import imagesData from '../../assets/data/bannerimages.json';
import { renderMenuItem, MenuItem } from '../../components/MenuItem';


const { width } = Dimensions.get('window');

const CategoryScene = ({ route }: { route: { key: string } }) => (
  <FlatList
    data={menuItems.filter(item => item.category === route.key)}
    renderItem={renderMenuItem}
    keyExtractor={item => item.id.toString()}
    contentContainerStyle={styles.menuList}
  />
);

export default function MenuScreen() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'Bhook Ka The End!', title: 'Bhook Ka The End!' },
    { key: 'Starters', title: 'Starters' },
    { key: 'Somewhat Local', title: 'Somewhat Local' },
    { key: 'Somewhat Sooper', title: 'Somewhat Sooper' },
    { key: 'Cheezy Treats', title: 'Cheezy Treats' },
    { key: 'Special Pizza', title: 'Special Pizza' },
    { key: 'Addons', title: 'Addons' },
  ]);

  const renderScene = SceneMap({
    'Bhook Ka The End!': CategoryScene,
    'Starters': CategoryScene,
    'Somewhat Local': CategoryScene,
    'Somewhat Sooper': CategoryScene,
    'Cheezy Treats': CategoryScene,
    'Special Pizza': CategoryScene,
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
  bannerImage: {
    width: '100%',
    height: '100%',
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
  menuDiv: {
    marginBottom: 12,
  }
  ,
  menuList: {
    padding: 12,
  },
  menuItem: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  customization: {
    fontSize: 14,
    color: '#FFA000',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D32F2F',
    marginBottom: 8,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#D32F2F',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tabBarContentContainer: {
    alignItems: 'center',
  },
});