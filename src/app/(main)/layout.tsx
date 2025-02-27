'use client';

import React, { useEffect } from 'react';
import { Layout, ConfigProvider, Spin, Card, Grid } from 'antd';
import { StarFilled } from '@ant-design/icons';
import Link from 'next/link';
import { FavoritesProvider, useFavorites } from '@/src/app/context/FavoritesContext';
import '@ant-design/v5-patch-for-react-19';
import "@/src/app/globals.css";
import FavoritesList from '@/src/app/components/FavoritesList';

const { Content, Sider } = Layout;
const { useBreakpoint } = Grid;

// Sidebar component - only visible on lg screens (1024px+)
const ProjectSidebar = () => {
  const screens = useBreakpoint();

  // Only render sidebar on lg screens (1024px+)
  if (!screens.lg) return null;

  return (
    <Sider
      width={300}
      collapsedWidth="0"
      style={{
        backgroundColor: '#1E1E1E',
        padding: '68px 0.5px 0.5px 0.5px',
        borderRight: '1px solid #303030',
        boxShadow: '2px 0 4px rgba(0,0,0,0.2)',
        position: 'fixed',
        left: 0,
        height: '100vh',
        zIndex: 10,
        overflow: 'auto'
      }}
    >
      <FavoritesList />
    </Sider>
  );
};

// Favorites card component - shown below content for screens under 1024px
const ResponsiveFavoritesCard = () => {
  const screens = useBreakpoint();

  // Only show this card when sidebar isn't visible (below 1024px)
  if (screens.lg) return null;

  return (
    <div className="w-full mx-auto mt-4">
    
        <FavoritesList />
      
    </div>
  );
};

// Main Layout Component
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const screens = useBreakpoint();
  const { loading } = useFavorites();

  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.className = "bg-[#212121] m-0 p-0";

    return () => {
      document.documentElement.classList.remove('dark');
      document.body.className = "";
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full bg-[#212121]">
        <Spin size="large" />
        <div className="mt-3 text-white">Loading application...</div>
      </div>
    );
  }

  return (
    <ConfigProvider>
      <FavoritesProvider>
        <Layout className="min-h-screen flex bg-[#212121]">
          {/* Sidebar - only visible on lg screens (1024px+) */}
          <ProjectSidebar />

          {/* Main Content */}
          <Layout className={`w-full ${screens.lg ? 'ml-[300px]' : 'ml-0'}`}>
            <Content className="bg-[#212121] p-4 w-full flex flex-col items-center">
              <div className="w-full max-w-6xl">
                {children}
              </div>
              <ResponsiveFavoritesCard />
            </Content>
          </Layout>
        </Layout>
      </FavoritesProvider>
    </ConfigProvider>
  );
}