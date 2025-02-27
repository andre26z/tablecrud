'use client';

import React, { useState, useEffect } from 'react';
import { Space, Table, message, Card, Typography, List, Button, Grid, Spin } from 'antd';
import type { TableProps } from 'antd';
import { StarOutlined, StarFilled, EditOutlined } from '@ant-design/icons';
import { useFavorites } from '@/src/app/context/FavoritesContext';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const screens = useBreakpoint();
  const { refreshFavorites } = useFavorites();
  const [favorites, setFavorites] = useState<Record<string, boolean>>(
    data.reduce((acc, project) => {
      acc[project.key] = project.favorite || false;
      return acc;
    }, {} as Record<string, boolean>)
  );

  useEffect(() => {
    const newFavorites = data.reduce((acc, project) => {
      acc[project.key] = project.favorite || favorites[project.key] || false;
      return acc;
    }, {} as Record<string, boolean>);
    setFavorites(newFavorites);
  }, [data]);

  const toggleFavorite = async (projectKey: string) => {
    try {
      const newValue = !favorites[projectKey];
      setFavorites(prev => ({ ...prev, [projectKey]: newValue }));

      const response = await fetch(`/api/projects/${projectKey}/favorite`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorite: newValue }),
      });

      if (!response.ok) throw new Error('Failed to update favorite status');

      await refreshFavorites();
      messageApi.success(newValue ? 'Added to favorites' : 'Removed from favorites');
    } catch (error) {
      setFavorites(prev => ({ ...prev, [projectKey]: !prev[projectKey] }));
      messageApi.error('Failed to update favorite status');
    }
  };

  const goToProjectDetails = (projectKey: string) => {
    router.push(`/details/${projectKey}`);
  };

  const handleEditClick = (e: React.MouseEvent, projectKey: string) => {
    e.stopPropagation();
    router.push(`/edit/${projectKey}`);
  };

  const columns: TableProps<ProjectType>['columns'] = [
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
      render: (text, record) => (
        <a onClick={() => goToProjectDetails(record.key)} className="text-blue-400 hover:underline cursor-pointer">
          {text}
        </a>
      ),
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
      title: 'Manager',
      dataIndex: 'projectManager',
      key: 'projectManager',
    },
    {
      title: '',
      key: 'favorite',
      width: 50,
      render: (_, record) => (
        <div onClick={(e) => { e.stopPropagation(); toggleFavorite(record.key); }} className="cursor-pointer">
          {favorites[record.key] ? <StarFilled style={{ color: '#fadb14' }} /> : <StarOutlined style={{ color: '#d9d9d9' }} />}
        </div>
      ),
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={(e) => handleEditClick(e, record.key)} className="text-blue-500 hover:text-blue-700">
            <EditOutlined className="mr-1" />
            Edit
          </a>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <Spin size="large" />
        <div className="mt-3">Loading projects...</div>
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <div className="p-4 md:p-6 w-full">
        <div className="overflow-x-auto">
          <Table<ProjectType>
            columns={columns}
            dataSource={data}
            rowKey="key"
            pagination={{ pageSize: 10, showSizeChanger: false }}
            scroll={{ x: 'max-content' }}
            onRow={(record) => ({ onClick: () => goToProjectDetails(record.key), style: { cursor: 'pointer' } })}
          />
        </div>
      </div>
    </>
  );
};

export default DataTable;
