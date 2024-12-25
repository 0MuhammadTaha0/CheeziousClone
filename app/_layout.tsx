import React from 'react';
import { Stack } from 'expo-router';
import { MenuProvider } from '../contexts/MenuItemsContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <MenuProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack 
            screenOptions={{headerShown: false}}
        />
      </SafeAreaView>
    </MenuProvider>
  );
}


