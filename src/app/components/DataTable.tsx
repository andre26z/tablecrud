'use client';

import React, { useState, useEffect } from 'react';
import { Space, Table, message, Spin } from 'antd';
import type { TableProps } from 'antd';
import { StarOutlined, StarFilled, EditOutlined } from '@ant-design/icons';
import { useFavorites } from '@/src/app/context/FavoritesContext';
import { useRouter } from 'next/navigation';

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
  const { refreshFavorites } = useFavorites();
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const newFavorites = data.reduce((acc, project) => {
      acc[project.key] = project.favorite || false;
      return acc;
    }, {} as Record<string, boolean>);
    setFavorites(newFavorites);
  }, [data]);

  const toggleFavorite = async (projectKey: string) => {
    try {
      const newValue = !favorites[projectKey];
      setFavorites((prev) => ({ ...prev, [projectKey]: newValue }));

      const response = await fetch(`/api/projects/${projectKey}/favorite`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorite: newValue }),
      });

      if (!response.ok) throw new Error('Failed to update favorite status');

      await refreshFavorites();
      messageApi.success(newValue ? 'Added to favorites' : 'Removed from favorites');
    } catch (error) {
      setFavorites((prev) => ({ ...prev, [projectKey]: !prev[projectKey] }));
      messageApi.error('Failed to update favorite status');
    }
  };

  const columns: TableProps<ProjectType>['columns'] = [
    {
      title: 'Project ID',
      dataIndex: 'projectId',
      key: 'projectId',
      render: (text) => <span className="text-white">{text}</span>,
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
      render: (text, record) => (
        <a
          onClick={() => router.push(`/details/${record.key}`)}
          className="text-blue-400 hover:underline cursor-pointer"
        >
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
        <div
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(record.key);
          }}
          className="cursor-pointer"
        >
          {favorites[record.key] ? (
            <StarFilled style={{ color: '#FFD700' }} />
          ) : (
            <StarOutlined className="text-gray-400" />
          )}
        </div>
      ),
    },
    {
      title: '',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Space>
          <a
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/edit/${record.key}`);
            }}
            className="text-blue-500 hover:text-blue-700 flex items-center"
          >
            <EditOutlined className="mr-1" />
            Edit
          </a>
        </Space>
      ),
    },
  ];

  return loading ? (
    <div className="flex justify-center items-center w-full mt-10">
      <Spin size="large" />
      <div className="mt-3 text-[var(--foreground)]">Loading projects...</div>
    </div>
  ) : (
    <div className="mx-0.5 w-[calc(100%-4px)]">
      {contextHolder}
      <div className="w-full overflow-x-auto">
        <Table
          columns={columns}
          dataSource={data}
          rowKey="key"
          pagination={{ pageSize: 10 }}
          className="custom-dark-table"
          scroll={{ x: 'max-content' }}
        />
      </div>
    </div>
  );
};

export default DataTable;