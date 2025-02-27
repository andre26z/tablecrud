'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Space, Table, message, Spin, Tooltip, Modal } from 'antd';
import type { TableProps } from 'antd';
import { StarOutlined, StarFilled, EditOutlined, CloseCircleOutlined } from '@ant-design/icons';
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
  const [clearingFavorites, setClearingFavorites] = useState(false);

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

  // This is now a memoized callback to prevent recreation on each render
  const handleClearFavorites = useCallback(async () => {
    try {
      setClearingFavorites(true);
      
      // Get all project keys that are currently favorited
      const favoritedProjects = Object.entries(favorites)
        .filter(([_, isFavorite]) => isFavorite)
        .map(([key]) => key);
      
      if (favoritedProjects.length === 0) {
        messageApi.info('No favorites to clear');
        setClearingFavorites(false);
        return;
      }
      
      // Create a temporary object to optimistically update UI
      const tempFavorites = { ...favorites };
      favoritedProjects.forEach(key => {
        tempFavorites[key] = false;
      });
      setFavorites(tempFavorites);
      
      // Make API calls to unfavorite all projects
      const promises = favoritedProjects.map(projectKey => 
        fetch(`/api/projects/${projectKey}/favorite`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ favorite: false }),
        })
      );
      
      await Promise.all(promises);
      await refreshFavorites();
      
      messageApi.success('All favorites have been cleared');
    } catch (error) {
      // Restore favorites state in case of error
      const newFavorites = data.reduce((acc, project) => {
        acc[project.key] = project.favorite || false;
        return acc;
      }, {} as Record<string, boolean>);
      setFavorites(newFavorites);
      
      messageApi.error('Failed to clear all favorites');
    } finally {
      setClearingFavorites(false);
    }
  }, [favorites, data, messageApi, refreshFavorites]);

  // Separate the modal creation from the handler to avoid render-time messaging
  const clearAllFavorites = () => {
    Modal.confirm({
      title: 'Clear all favorites',
      content: 'Are you sure you want to remove all favorite projects? This action cannot be undone.',
      okText: 'Yes, clear all',
      okType: 'danger',
      cancelText: 'Cancel',
      className: 'custom-dark-modal', // Add this custom class for your CSS targeting
      onOk: handleClearFavorites,
      // Custom button styling
      okButtonProps: {
        style: {
          backgroundColor: '#d32029',
          borderColor: '#d32029',
          color: 'white',
        }
      },
      cancelButtonProps: {
        style: {
          backgroundColor: '#333',
          borderColor: '#444',
          color: 'white',
        }
      },
    });
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
      title: () => (
        <div className="flex items-center">
          <Tooltip title="Clear all favorites">
            <CloseCircleOutlined 
              className="text-gray-500 bg-gray-800 hover:text-red-500 transition-colors cursor-pointer"
              onClick={clearAllFavorites}
            />
          </Tooltip>
        </div>
      ),
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

  return (
    <>
      {/* Add the specific modal styling without affecting the rest of your app */}
      <style jsx global>{`
        .custom-dark-modal .ant-modal-content,
        .custom-dark-modal .ant-modal-header,
        .custom-dark-modal .ant-modal-confirm-title,
        .custom-dark-modal .ant-modal-confirm-content {
          background-color: #1f1f1f !important;
          color: white !important;
        }
        
        .custom-dark-modal .ant-modal-confirm-body > span {
          color: white !important;
        }
      `}</style>
      
      {contextHolder}
      
      {loading || clearingFavorites ? (
        <div className="flex justify-center items-center w-full mt-10">
          <Spin size="large" />
          <div className="mt-3 text-[var(--foreground)]">
            {loading ? 'Loading projects...' : 'Clearing favorites...'}
          </div>
        </div>
      ) : (
        <div className="mx-0.5 w-[calc(100%-4px)]">
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
      )}
    </>
  );
};

export default DataTable;