// import React from 'react';
import { Link } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
} from 'react-native';
import {
  ChevronDown,
  ChevronRight,
  Edit2,
  Heart,
  Home,
  List,
  LogOut,
  Settings,
  Trash2,
  Wallet,
} from 'lucide-react-native';

type MenuItemProps = {
  icon: React.ReactNode;
  title: string;
  rightText?: string;
  onPress: () => void;
  danger?: boolean;
};

const MenuItem = ({ icon, title, rightText, onPress, danger }: MenuItemProps) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
  >
    <View style={styles.menuItemLeft}>
      {icon}
      <Text style={[styles.menuItemText, danger && styles.dangerText]}>{title}</Text>
    </View>
    <View style={styles.menuItemRight}>
      {rightText && (
        <Text style={styles.rightText}>{rightText}</Text>
      )}
      <ChevronRight size={20} color="#666" />
    </View>
  </TouchableOpacity>
);

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <Image
              source={{ uri: 'https://via.placeholder.com/100' }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>Muhammad Zaeem</Text>
              <View style={styles.phoneContainer}>
                <Text style={styles.phone}>+92335454510</Text>
                <TouchableOpacity>
                  <Edit2 size={16} color="#D32F2F" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Link href='../' asChild>
            <TouchableOpacity>
              <ChevronDown size={30} color="#000" />
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal</Text>
          <MenuItem
            icon={<List size={24} color="#666" />}
            title="My Orders"
            onPress={() => {}}
          />
          <MenuItem
            icon={<Home size={24} color="#666" />}
            title="My Addresses"
            onPress={() => {}}
          />
          <MenuItem
            icon={<Wallet size={24} color="#666" />}
            title="My Payment Methods"
            onPress={() => {}}
          />
          <MenuItem
            icon={<Heart size={24} color="#666" />}
            title="My Favourites"
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          <MenuItem
            icon={<Settings size={24} color="#666" />}
            title="Change Password"
            onPress={() => {}}
          />
          <MenuItem
            icon={<LogOut size={24} color="#666" />}
            title="Logout"
            onPress={() => {}}
          />
          <MenuItem
            icon={<Trash2 size={24} color="#D32F2F" />}
            title="Request Account Deletion"
            onPress={() => {}}
            danger
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  
  backButton: {
    position: 'absolute',
    top: 30, // Adjusted for more padding
    left: 16,
    padding: 16, // Increased size for better usability
    backgroundColor: '#f0f0f0',
    borderRadius: 32,
  },
  backArrow: {
    fontSize: 28,
    color: 'black',
    transform: [{ rotate: '180deg' }], // Rotate to create downward arrow
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  phone: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuItemText: {
    fontSize: 16,
  },
  rightText: {
    fontSize: 16,
    color: '#D32F2F',
  },
  dangerText: {
    color: '#D32F2F',
  },
});