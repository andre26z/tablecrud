'use client';

import React, { useEffect, useState } from 'react';
import { Layout, Menu, ConfigProvider, theme, Spin, Card, Grid } from 'antd';
import type { MenuProps } from 'antd';
import { StarFilled } from '@ant-design/icons';
import Link from 'next/link';
import { FavoritesProvider, useFavorites } from '@/app/context/FavoritesContext';
import '@ant-design/v5-patch-for-react-19';

const { Content, Sider } = Layout;
const { useBreakpoint } = Grid;

// Custom dark theme for Ant Design
const darkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#3872FA',
    colorBgBase: '#121212',
    colorBgContainer: '#1E1E1E',
    colorBgElevated: '#282828',
    colorBgLayout: '#121212',
    colorText: '#FFFFFF',
    colorTextSecondary: '#D1D5DB',
    colorBorder: '#404040',
    borderRadius: 8,
  },
  components: {
    Menu: {
      ItemBg: '#1E1E1E',
      ItemText: '#D1D5DB',
      ItemTextSelected: '#FFFFFF',
      ItemBgSelected: 'rgba(56, 114, 250, 0.2)',
      ItemBgHover: 'rgba(56, 114, 250, 0.1)',
    },
    Card: {
      colorBgContainer: '#282828',
      colorBorderSecondary: '#404040',
    },
    Layout: {
      BgBody: '#121212',
      BgHeader: '#1E1E1E',
      BgLayout: '#121212',
    },
    Table: {
      BgContainer: '#1E1E1E',
      Text: '#FFFFFF',
      TextHeading: '#FFFFFF',
      BorderSecondary: '#404040',
    },
  },
};

// Sidebar content as a component that can be used in sidebar or card
const FavoritesList = ({ className = '' }) => {
  const { favoriteProjects, loading } = useFavorites();

  // Create menu items from favorite projects
  const menuItems: MenuProps['items'] = [
    {
      key: 'favorites-header',
      label: <div className="font-medium text-gray-300">Favorite Projects</div>,
      type: 'group',
    },
    ...favoriteProjects.map(project => ({
      key: project.key,
      label: (
        <Link href={`/edit/${project.key}`} className="flex items-center">
          <StarFilled style={{ color: '#FADB14', marginRight: 8 }} />
          {project.projectName}
        </Link>
      ),
    })),
  ];

  if (loading) {
    return (
      <div className={`flex justify-center p-4 ${className}`}>
        <Spin size="small" />
      </div>
    );
  }

  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={[favoriteProjects[0]?.key || '']}
      style={{ borderRight: 0, background: '#1E1E1E' }}
      items={menuItems}
      className={className}
    />
  );
};

// Sidebar component that only renders on md and above
const ProjectSidebar = () => {
  const screens = useBreakpoint();
  
  // Don't render the sidebar at all on small screens
  if (!screens.md) {
    return null;
  }

  return (
    <Sider 
      width={200} 
      className="h-screen overflow-auto shadow-md fixed left-0 top-0 bottom-0 border-r border-opacity-50 border-gray-700"
      style={{ background: '#1E1E1E' }}
    >
      <FavoritesList className="h-[calc(100%-56px)]" />
    </Sider>
  );
};

// Mobile favorites card that only renders below md breakpoint
const MobileFavoritesCard = () => {
  const screens = useBreakpoint();
  
  // Only render on small screens
  if (screens.md) {
    return null;
  }

  return (
    <Card 
      title="Favorite Projects" 
      className="mt-4 shadow-md" 
      style={{ background: '#282828' }}
    >
      <FavoritesList />
    </Card>
  );
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const screens = useBreakpoint();
  const { loading } = useFavorites();
  
  // Apply dark mode to HTML element for a consistent dark theme
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.style.backgroundColor = '#121212';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    
    return () => {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
    };
  }, []);

  // Full-page loading spinner for initial app loading
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        width: '100%',
        background: '#121212'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Spin size="large" />
          <div style={{ marginTop: '12px', color: '#FFFFFF' }}>Loading application...</div>
        </div>
      </div>
    );
  }

  return (
    <ConfigProvider theme={darkTheme}>
      <FavoritesProvider>
        <Layout className="min-h-screen bg-[#121212]" style={{ background: '#121212' }}>
          <Layout style={{ background: '#121212', margin: 0, padding: 0 }} hasSider>
            {/* Desktop sidebar */}
            <ProjectSidebar />
            
            {/* Main content area with conditional margin */}
            <Layout 
              className={screens.md ? "ml-[200px]" : "ml-0"}
              style={{ 
                minHeight: '100vh', 
                background: '#121212',
                margin: 0,
                padding: 0
              }}
            >
              <Content 
                className="bg-[#121212] p-4" 
                style={{ background: '#121212' }}
              >
                {/* Main content (your table would go here) */}
                <div>{children}</div>
                
                {/* Mobile favorites card that appears below content on small screens */}
                <MobileFavoritesCard />
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </FavoritesProvider>
    </ConfigProvider>
  );
}