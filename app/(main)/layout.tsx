'use client';

import React from 'react';
import { Layout, Menu, theme, Spin } from 'antd';
import type { MenuProps } from 'antd';
import { StarFilled } from '@ant-design/icons';
import Link from 'next/link';
import { FavoritesProvider, useFavorites } from '@/app/context/FavoritesContext';

const { Content, Sider } = Layout;

// Separate the sidebar into its own component to use the context
const ProjectSidebar = () => {
  const { favoriteProjects, loading } = useFavorites();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Create menu items from favorite projects
  const sidebarItems: MenuProps['items'] = [
    {
      key: 'favorites-header',
      label: <div className="font-medium">Favorite Projects</div>,
      type: 'group',
    },
    ...favoriteProjects.map(project => ({
      key: project.key,
      label: (
        <Link href={`/edit?id=${project.key}`} className="flex items-center">
          <StarFilled style={{ color: '#fadb14', marginRight: 8 }} />
          {project.projectName}
        </Link>
      ),
    })),
  ];

  return (
    <Sider 
      width={200} 
      style={{ background: colorBgContainer }}
      className="h-screen overflow-auto shadow-sm fixed left-0 top-0 bottom-0"
    >
      <div className="p-4 font-bold text-lg">Projects</div>
      {loading ? (
        <div className="flex justify-center p-4">
          <Spin size="small" />
        </div>
      ) : (
        <Menu
          mode="inline"
          defaultSelectedKeys={[favoriteProjects[0]?.key || '']}
          style={{ height: 'calc(100% - 56px)', borderRight: 0 }}
          items={sidebarItems}
        />
      )}
    </Sider>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <FavoritesProvider>
      <Layout className="min-h-screen bg-white">
        <Layout hasSider className="bg-white">
          <ProjectSidebar />
          <Layout 
            className="bg-white ml-[200px]"
            style={{ minHeight: '100vh' }}
          >
            <Content
              className="p-6 bg-white"
              style={{
                borderRadius: borderRadiusLG,
              }}
            >
              {children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </FavoritesProvider>
  );
}