import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MenuItem, MenuImage } from '../components/types';

interface MenuContextType {
  menuItems: MenuItem[];
  menuImages: MenuImage[];
  loading: boolean;
  error: string | null;
}

export const MenuContext = createContext<MenuContextType>({
  menuItems: [],
  menuImages: [],
  loading: true,
  error: null,
});

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuImages, setMenuImages] = useState<MenuImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMenuData() {
      try {
        const [menuItemsResponse, menuImagesResponse] = await Promise.all([
          supabase.from('menu_items').select('data'),
          supabase.from('menu_images').select('url'),
        ]);

        if (menuItemsResponse.error) throw menuItemsResponse.error;
        if (menuImagesResponse.error) throw menuImagesResponse.error;

        if (menuItemsResponse.data) {
          setMenuItems(menuItemsResponse.data.map(item => item.data));
        }

        if (menuImagesResponse.data) {
          setMenuImages(menuImagesResponse.data);
        }
      } catch (err) {
        setError('Failed to fetch menu data');
        console.error('Error fetching menu data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMenuData();
  }, []);

  return (
    <MenuContext.Provider value={{ menuItems, menuImages, loading, error }}>
      {children}
    </MenuContext.Provider>
  );
}

