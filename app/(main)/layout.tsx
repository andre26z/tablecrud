'use client';

import React, { useEffect } from 'react';
import { Layout, Menu, ConfigProvider, theme, Spin } from 'antd';
import type { MenuProps } from 'antd';
import { StarFilled } from '@ant-design/icons';
import Link from 'next/link';
import { FavoritesProvider, useFavorites } from '@/app/context/FavoritesContext';

const { Content, Sider } = Layout;

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

// Separate the sidebar into its own component to use the context
const ProjectSidebar = () => {
  const { favoriteProjects, loading } = useFavorites();

  // Create menu items from favorite projects
  const sidebarItems: MenuProps['items'] = [
    {
      key: 'favorites-header',
      label: <div className="font-medium text-gray-300">Favorite Projects</div>,
      type: 'group',
    },
    ...favoriteProjects.map(project => ({
      key: project.key,
      label: (
        <Link href={`/edit?id=${project.key}`} className="flex items-center">
          <StarFilled style={{ color: '#FADB14', marginRight: 8 }} />
          {project.projectName}
        </Link>
      ),
    })),
  ];

  return (
    <Sider 
      width={200} 
      className="h-screen overflow-auto shadow-md fixed left-0 top-0 bottom-0 border-r border-opacity-50 border-gray-700"
      style={{ background: '#1E1E1E' }}
    >
      <div className="p-4 font-bold text-lg text-white border-b border-gray-700 border-opacity-50">Projects</div>
      {loading ? (
        <div className="flex justify-center p-4">
          <Spin size="small" />
        </div>
      ) : (
        <Menu
          mode="inline"
          defaultSelectedKeys={[favoriteProjects[0]?.key || '']}
          style={{ height: 'calc(100% - 56px)', borderRight: 0, background: '#1E1E1E' }}
          items={sidebarItems}
        />
      )}
    </Sider>
  );
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return (
    <ConfigProvider theme={darkTheme}>
      <FavoritesProvider>
        <Layout className="min-h-screen bg-[#121212]" style={{ background: '#121212' }}>
          <Layout style={{ background: '#121212', margin: 0, padding: 0 }} hasSider>
            <ProjectSidebar />
            <Layout 
              className="ml-[200px]"
              style={{ 
                minHeight: '100vh', 
                background: '#121212',
                margin: 0,
                padding: 0
              }}
            >
              <Content className="bg-[#121212]" style={{ background: '#121212' }}>
                {children}
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </FavoritesProvider>
    </ConfigProvider>
  );
}