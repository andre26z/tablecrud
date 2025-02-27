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

  const menuItems = [
    {
      key: 'header',
      label: (
        <div
          className="font-medium text-gray-300 p-3 border-b"
          style={{ borderBottom: '1px solid #303030' }}
        >
          Favorite Projects
        </div>
      ),
      style: { height: 'auto', margin: 0, padding: 0 },
      itemicon: null,
      type: 'group'
    },
    ...favoriteProjects.slice(0, maxVisibleItems).map((project) => {
      const isActive = pathname === `/edit/${project.key}`;
      
      return {
        key: project.key,
        label: (
          <Link
            href={`/edit/${project.key}`}
            className="flex items-center transition duration-200 truncate"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px',
              borderRadius: '4px',
              transition: 'background 0.2s ease-in-out',
              color: '#EDEDED',
              textDecoration: 'none',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {project.projectName}
          </Link>
        ),
        icon: <StarFilled style={{ color: '#FFD700' }} />,
        style: {
          padding: '10px',
          borderBottom: '1px solid #303030',
          backgroundColor: isActive ? '#303030' : 'transparent',
          width: '100%',
        },
        className: `${isActive ? 'bg-gray-800' : 'hover:bg-gray-800'}`
      };
    })
  ];

  return (
    <div className={`w-full ${className}`}>
      <Menu
        mode="inline"
        className="border-none rounded-lg w-full"
        style={{
          backgroundColor: '#1E1E1E',
          color: '#EDEDED',
          border: '1px solid #303030',
          padding: '8px',
          maxHeight: '80vh', // More responsive max height using viewport height
          overflowY: favoriteProjects.length > maxVisibleItems ? 'auto' : 'visible',
          overflowX: 'hidden', // Prevent horizontal scrolling
          scrollbarWidth: 'thin', // Firefox
          scrollbarColor: '#555 #222', // Dark theme scrollbar
          width: '100%', // Ensure full width
        }}
        items={menuItems}
      />
    </div>
  );
};

export default FavoritesList;