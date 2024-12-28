import React, { useState, useEffect } from 'react';
import { Link, useRouter } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
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
import { supabase } from '../../lib/supabase';

type MenuItemProps = {
  icon: React.ReactNode;
  title: string;
  rightText?: string;
  onPress: () => void;
  danger?: boolean;
};

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  phone: string;
}

const MenuItem = ({ icon, title, rightText, onPress, danger }: MenuItemProps) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemLeft}>
      {icon}
      <Text style={[styles.menuItemText, danger && styles.dangerText]}>{title}</Text>
    </View>
    <View style={styles.menuItemRight}>
      {rightText && <Text style={styles.rightText}>{rightText}</Text>}
      <ChevronRight size={20} color="#666" />
    </View>
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const createProfile = async (userId: string, userData: any) => {
    try {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            full_name: userData?.full_name || userData?.user_metadata?.full_name || 'New User',
            phone: userData?.phone || userData?.user_metadata?.phone || '',
            avatar_url: userData?.avatar_url || null,
            updated_at: new Date().toISOString(),
          },
        ]);

      if (insertError) throw insertError;

      // Fetch the newly created profile
      const { data: newProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, phone')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;
      return newProfile;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting user:', userError);
        router.replace('../../signup-login');
        return;
      }

      if (!user) {
        console.log('No user found, redirecting to login');
        router.replace('../../signup-login');
        return;
      }

      console.log('Fetching profile for user:', user.id);

      // Try to fetch existing profile
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, phone')
        .eq('id', user.id)
        .maybeSingle(); // Use maybeSingle instead of single to handle no rows gracefully

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // If profile doesn't exist, create it
      if (!existingProfile) {
        console.log('Profile not found, creating new profile...');
        const newProfile = await createProfile(user.id, user);
        setProfile(newProfile);
      } else {
        console.log('Profile found:', existingProfile);
        setProfile(existingProfile);
      }

    } catch (error) {
      console.error('Error in fetchProfile:', error);
      Alert.alert(
        'Error',
        'Failed to load profile. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace('../../signup-login');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const getImageUrl = (avatarUrl: string | null) => {
    if (!avatarUrl) return 'https://via.placeholder.com/100';
  
    // If the URL is already a full URL, return it
    if (avatarUrl.startsWith('http')) return avatarUrl;
  
    // If it's a storage path, construct the full URL
    return supabase.storage.from('user-images').getPublicUrl(avatarUrl).data.publicUrl;
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <Text>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <Image
              source={{
                uri: getImageUrl(profile?.avatar_url ?? null),
              }}
              style={styles.profileImage}
              onError={(e) => {
                console.error('Error loading image:', e.nativeEvent.error);
              }}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{profile?.full_name || 'Guest'}</Text>
              <View style={styles.phoneContainer}>
                <Text style={styles.phone}>{profile?.phone || 'No phone number'}</Text>
                <TouchableOpacity>
                  <Edit2 size={16} color="#D32F2F" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={() => { router.back(); }}>
            <ChevronDown size={30} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal</Text>
          <MenuItem icon={<List size={24} color="#666" />} title="My Orders" onPress={() => {}} />
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
            onPress={handleLogout}
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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

