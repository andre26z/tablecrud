'use client';

import React, { useState, useEffect } from 'react';
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

// Custom modal for dark theme
const showDarkConfirmModal = (
  title: string, 
  content: string, 
  onOk: () => Promise<void>
) => {
  const modal = Modal.confirm({
    title: <span className="text-white">{title}</span>,
    content: <span className="text-gray-300">{content}</span>,
    okText: 'Yes, clear all',
    okType: 'danger',
    cancelText: 'Cancel',
    onOk,
    className: 'dark-theme-modal',
    // Apply dark styles to the modal
    okButtonProps: {
      style: {
        backgroundColor: '#ff4d4f',
        borderColor: '#ff4d4f',
      }
    },
    cancelButtonProps: {
      style: {
        backgroundColor: '#303030',
        borderColor: '#444',
        color: '#ddd'
      }
    },
    // Force dark styles on the modal content
    modalRender: (node) => (
      <div style={{ 
        color: '#fff',
      }}>
        {node}
      </div>
    ),
  });

  // Apply custom styles to modal container
  setTimeout(() => {
    const modalContainer = document.querySelector('.dark-theme-modal .ant-modal-content');
    if (modalContainer) {
      (modalContainer as HTMLElement).style.backgroundColor = '#1E1E1E';
      (modalContainer as HTMLElement).style.borderColor = '#303030';
      (modalContainer as HTMLElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5)';
    }
  }, 10);

  return modal;
};

const DataTable: React.FC<DataTableProps> = ({ data, loading }) => {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const { refreshFavorites } = useFavorites();
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [clearingFavorites, setClearingFavorites] = useState(false);

  // Add a style tag for custom modal styling
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      .dark-theme-modal .ant-modal-content {
        background-color: #1E1E1E !important;
        border: 1px solid #303030 !important;
      }
      .dark-theme-modal .ant-modal-header {
        background-color: #1E1E1E !important;
        border-bottom: 1px solid #303030 !important;
      }
      .dark-theme-modal .ant-modal-title {
        color: #fff !important;
      }
      .dark-theme-modal .ant-modal-close {
        color: #888 !important;
      }
      .dark-theme-modal .ant-modal-close:hover {
        color: #fff !important;
      }
      .dark-theme-modal .ant-modal-body {
        color: #ddd !important;
      }
    `;
    document.head.appendChild(styleTag);
    
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

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

  const clearAllFavorites = async () => {
    // Get all project keys that are currently favorited
    const favoritedProjects = Object.entries(favorites)
      .filter(([_, isFavorite]) => isFavorite)
      .map(([key]) => key);
    
    if (favoritedProjects.length === 0) {
      messageApi.info('No favorites to clear');
      return;
    }
    
    showDarkConfirmModal(
      'Clear all favorites',
      'Are you sure you want to remove all favorite projects? This action cannot be undone.',
      async () => {
        try {
          setClearingFavorites(true);
          
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
      }
    );
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
              className="text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
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

  return loading || clearingFavorites ? (
    <div className="flex justify-center items-center w-full mt-10">
      <Spin size="large" />
      <div className="mt-3 text-[var(--foreground)]">
        {loading ? 'Loading projects...' : 'Clearing favorites...'}
      </div>
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