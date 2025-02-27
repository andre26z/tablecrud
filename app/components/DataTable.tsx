'use client';

import React, { useState, useEffect } from 'react';
import { Space, Table, message } from 'antd';
import type { TableProps } from 'antd';
import Link from 'next/link';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import { useFavorites } from '@/app/context/FavoritesContext';

interface ProjectType {
  key: string;
  projectId: string;
  projectName: string;
  startDate: string;
  endDate: string;
  projectManager: string;
  favorite?: boolean;
}

interface DataTableProps {
  data: ProjectType[];
  loading: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ data, loading }) => {
  // Create a message instance
  const [messageApi, contextHolder] = message.useMessage();
  
  const { refreshFavorites } = useFavorites();
  const [favorites, setFavorites] = useState<Record<string, boolean>>(
    // Initialize from data
    data.reduce((acc, project) => {
      acc[project.key] = project.favorite || false;
      return acc;
    }, {} as Record<string, boolean>)
  );

  // Update favorites when data changes
  useEffect(() => {
    const newFavorites = data.reduce((acc, project) => {
      acc[project.key] = project.favorite || favorites[project.key] || false;
      return acc;
    }, {} as Record<string, boolean>);
    
    setFavorites(newFavorites);
  }, [data]);

  const toggleFavorite = async (projectKey: string) => {
    try {
      // Optimistic UI update
      const newValue = !favorites[projectKey];
      setFavorites(prev => ({
        ...prev,
        [projectKey]: newValue
      }));

      // Send update to API
      const response = await fetch(`/api/projects/${projectKey}/favorite`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ favorite: newValue }),
      });

      if (!response.ok) {
        throw new Error('Failed to update favorite status');
      }

      // Refresh the favorites in the sidebar
      await refreshFavorites();
      
      // Use messageApi instead of message directly
      messageApi.success(newValue 
        ? 'Added to favorites' 
        : 'Removed from favorites');
      
    } catch (error) {
      // Revert on error
      setFavorites(prev => ({
        ...prev,
        [projectKey]: !prev[projectKey]
      }));
      
      // Use messageApi for error messages too
      messageApi.error('Failed to update favorite status');
      console.error('Error updating favorite:', error);
    }
  };

  const columns: TableProps<ProjectType>['columns'] = [
    {
      title: 'Project ID',
      dataIndex: 'projectId',
      key: 'projectId',
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: 'Project Manager',
      dataIndex: 'projectManager',
      key: 'projectManager',
    },
    {
      title: '',
      key: 'favorite',
      width: 50,
      render: (_, record) => (
        <div 
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(record.key);
          }}
          className="cursor-pointer"
        >
          {favorites[record.key] ? (
            <StarFilled style={{ color: '#fadb14' }} />
          ) : (
            <StarOutlined style={{ color: '#d9d9d9' }} />
          )}
        </div>
      ),
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link href={`/edit/${record.key}`} className="text-blue-500 hover:text-blue-700">
            Edit
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div className="p-4 md:p-6">
        <Table<ProjectType> 
          columns={columns} 
          dataSource={data} 
          loading={loading}
          rowKey="key"
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
          }}
        />
      </div>
    </>
  );
};

export default DataTable;