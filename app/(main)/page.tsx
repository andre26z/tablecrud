'use client';

import React, { useState, useEffect } from 'react';
import { Button, Card, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import DataTable from '@/app/components/DataTable';
import { useDataService } from '@/app/services/dataServices';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const { data, loading, error, refreshData } = useDataService();
  const [projects, setProjects] = useState([]);
  
  // Create message instance for antd v5 compatibility
  const [messageApi, contextHolder] = message.useMessage();
  
  // Process data when it arrives
  useEffect(() => {
    if (data && Array.isArray(data.projects)) {
      setProjects(data.projects);
    } else if (data && Array.isArray(data)) {
      // Handle case where data might be direct array
      setProjects(data);
    } else {
      console.warn('Data format unexpected:', data);
      setProjects([]);
    }
  }, [data]);

  // Show error message if fetch fails
  useEffect(() => {
    if (error) {
      messageApi.error(`Failed to load data: ${error.message}`);
    }
  }, [error]);

  const handleCreateProject = () => {
    router.push('/create');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {contextHolder}
      <Card 
        title="Project Management" 
        className="shadow-sm"
        styles={{ body: { padding: '0' } }}
        extra={
          <Button 
            type="primary"
            icon={<PlusOutlined />} 
            onClick={handleCreateProject}
          >
            Create Project
          </Button>
        }
      >
        <DataTable data={projects} loading={loading} />
      </Card>
    </div>
  );
}