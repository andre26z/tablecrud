'use client';

import React, { useState, useEffect } from 'react';
import { Space, Table, message, Card, Typography, List, Button, Grid } from 'antd';
import type { TableProps } from 'antd';
import Link from 'next/link';
import { StarOutlined, StarFilled, EditOutlined } from '@ant-design/icons';
import { useFavorites } from '@/app/context/FavoritesContext';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

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
  
  // Use Ant Design's built-in responsive grid breakpoints
  const screens = useBreakpoint();
  
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
      responsive: ['md'],
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
      responsive: ['lg'],
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      responsive: ['lg'],
    },
    {
      title: 'Project Manager',
      dataIndex: 'projectManager',
      key: 'projectManager',
      responsive: ['md'],
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
            <EditOutlined className="mr-1" />
            Edit
          </Link>
        </Space>
      ),
    },
  ];

  // Use Ant Design's responsive breakpoints
  // xs: < 576px (mobile phones)
  // sm: ≥ 576px (mobile phones)
  // md: ≥ 768px (tablets)
  // lg: ≥ 992px (desktops)
  // xl: ≥ 1200px (large desktops)
  // xxl: ≥ 1600px (extra large desktops)

  return (
    <>
      {contextHolder}
      <div className="p-4 md:p-6">
        {/* For smaller screens (xs and sm), show card list */}
        {(!screens.md) && (
          <List
            loading={loading}
            dataSource={data}
            renderItem={(project) => (
              <List.Item
                key={project.key}
                className="mb-4"
              >
                <Card
                  className="w-full"
                  style={{ background: '#1E1E1E', border: '1px solid #404040' }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Title level={5} style={{ margin: 0, color: 'white' }}>
                        {project.projectName}
                      </Title>
                      <Text type="secondary">ID: {project.projectId}</Text>
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(project.key);
                      }}
                      className="cursor-pointer"
                    >
                      {favorites[project.key] ? (
                        <StarFilled style={{ color: '#fadb14', fontSize: '18px' }} />
                      ) : (
                        <StarOutlined style={{ color: '#d9d9d9', fontSize: '18px' }} />
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between">
                      <Text type="secondary">Start:</Text>
                      <Text>{project.startDate}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text type="secondary">End:</Text>
                      <Text>{project.endDate}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text type="secondary">Manager:</Text>
                      <Text>{project.projectManager}</Text>
                    </div>
                  </div>
                  
                  <Link href={`/edit/${project.key}`}>
                    <Button 
                      type="primary" 
                      icon={<EditOutlined />}
                      className="w-full"
                    >
                      Edit Project
                    </Button>
                  </Link>
                </Card>
              </List.Item>
            )}
          />
        )}

        {/* For medium screens and up, show the table */}
        {screens.md && (
          <Table<ProjectType> 
            columns={columns} 
            dataSource={data} 
            loading={loading}
            rowKey="key"
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
            }}
            scroll={{ x: 'max-content' }}
          />
        )}
      </div>
    </>
  );
};

export default DataTable;