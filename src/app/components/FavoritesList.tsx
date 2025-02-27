'use client';

import React from 'react';
import { Menu, Spin } from 'antd';
import { StarFilled } from '@ant-design/icons';
import Link from 'next/link';
import { useFavorites } from '@/src/app/context/FavoritesContext';
import { usePathname } from 'next/navigation';

const FavoritesList = ({ className = '' }) => {
  const { favoriteProjects, loading } = useFavorites();
  const pathname = usePathname();
  const maxVisibleItems = 18; // Limit before enabling scrolling

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
        backgroundColor: '#1E1E1E',
        color: '#EDEDED',
        border: '1px solid #303030',
        padding: '8px',
        maxHeight: '720px', // Set max height
        overflowY: favoriteProjects.length > maxVisibleItems ? 'auto' : 'visible',
        scrollbarWidth: 'thin', // Firefox
        scrollbarColor: '#555 #222', // Dark theme scrollbar
      }}
    >
      <div
        className="font-medium text-gray-300 p-3 border-b"
        style={{ borderBottom: '1px solid #303030' }}
      >
        Favorite Projects
      </div>

      {favoriteProjects.slice(0, maxVisibleItems).map((project) => {
        const isActive = pathname === `/edit/${project.key}`;
        
        return (
          <Menu.Item
            key={project.key}
            className={`
              ${isActive ? 'bg-gray-800' : 'hover:bg-gray-800'}
            `}
            style={{
              padding: '10px',
              borderBottom: '1px solid #303030',
              backgroundColor: isActive ? '#303030' : 'transparent',
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
                color: '#EDEDED',
                textDecoration: 'none',
              }}
            >
              <StarFilled className="mr-2" style={{ color: '#FFD700' }} />
              {project.projectName}
            </Link>
          </Menu.Item>
        );
      })}
    </Menu>
  );
};

export default FavoritesList;