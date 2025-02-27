'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';

interface Project {
  key: string;
  projectId: string;
  projectName: string;
  favorite?: boolean;
}

interface FavoritesContextType {
  favoriteProjects: Project[];
  refreshFavorites: () => Promise<void>;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favoriteProjects: [],
  refreshFavorites: async () => {},
  loading: false
});

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [favoriteProjects, setFavoriteProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects/favorites');
      
      if (!response.ok) {
        throw new Error('Failed to fetch favorite projects');
      }
      
      const data = await response.json();
      setFavoriteProjects(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of favorites
  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <FavoritesContext.Provider 
      value={{
        favoriteProjects,
        refreshFavorites: fetchFavorites,
        loading
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};