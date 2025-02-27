'use client';

import React, { useEffect, useState } from 'react';
import { Layout, Menu, ConfigProvider, theme, Spin, Card, Grid } from 'antd';
import type { MenuProps } from 'antd';
import { StarFilled } from '@ant-design/icons';
import Link from 'next/link';
import { FavoritesProvider, useFavorites } from '@/src/app/context/FavoritesContext';
import '@ant-design/v5-patch-for-react-19';
import "@/src/app/globals.css";

const { Content, Sider } = Layout;
const { useBreakpoint } = Grid;

// Sidebar content
const FavoritesList = ({ className = '' }) => {
  const { favoriteProjects, loading } = useFavorites();

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
      className={`border-none rounded-lg ${className}`}
      style={{
        backgroundColor: '#1E1E1E', // Dark background like DataTable
        color: '#EDEDED', // White text by default
        border: '1px solid #303030', // Subtle border
        padding: '8px',
      }}
    >
      <div
        className="font-medium text-gray-300 p-3 border-b"
        style={{ borderBottom: '1px solid #303030' }} // Matches table row dividers
      >
        Favorite Projects
      </div>
      
      {favoriteProjects.map((project) => (
        <Menu.Item
          key={project.key}
          style={{
            padding: '10px',
            borderBottom: '1px solid #303030', // Divider like table rows
          }}
        >
          <Link
            href={`/edit/${project.key}`}
            className="flex items-center transition duration-200"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px',
              borderRadius: '4px',
              transition: 'background 0.2s ease-in-out',
              color: '#EDEDED', // **Ensure text is always white**
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#000000'; // Hover background black
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'; // Reset background
            }}
          >
            <StarFilled
              className="mr-2"
              style={{ color: '#FFD700' }} // Yellow star
            />
            {project.projectName}
          </Link>
        </Menu.Item>
      ))}
    </Menu>
  );
};

// Sidebar component (only for md+ screens)
const ProjectSidebar = () => {
  const screens = useBreakpoint();

  if (!screens.md) return null;

  return (
    <Sider
      width={200}
      style={{
        backgroundColor: '#1E1E1E', // Match DataTable's background
        padding: '16px 0',
        borderRight: '1px solid #303030', // Subtle border like table lines
        boxShadow: '2px 0 4px rgba(0,0,0,0.2)', // Slight shadow for depth
      }}
    >
      <FavoritesList className="p-2" />
    </Sider>
  );
};

// Mobile favorites card (only for sm screens)
const MobileFavoritesCard = () => {
  const screens = useBreakpoint();

  if (screens.md) return null;

  return (
    <Card title="Favorite Projects" className="mt-4 shadow-md bg-[#282828] text-white">
      <FavoritesList />
    </Card>
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
          {/* Sidebar (hidden on small screens) */}
          <ProjectSidebar />

          {/* Main Content */}
          <Layout className={`w-full ${screens.md ? 'ml-[0px]' : 'ml-0'}`}>
            <Content className="bg-[#212121] p-4 w-full flex flex-col items-center">
              <div className="w-full max-w-6xl">
                {children}
              </div>
              <MobileFavoritesCard />
            </Content>
          </Layout>
        </Layout>
      </FavoritesProvider>
    </ConfigProvider>
  );
}