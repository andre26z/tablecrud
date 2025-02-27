'use client';

import React from 'react';
import { Button, Card, Typography, Layout, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import DataTable from '@/app/components/DataTable';
import { useDataService } from '@/app/services/dataServices';
import { useRouter } from 'next/navigation';

const { Title } = Typography;
const { Content } = Layout;

export default function HomePage() {
  const { data, loading, error } = useDataService();
  const router = useRouter();
  
  // Show error message if fetch fails
  React.useEffect(() => {
    if (error) {
      message.error(`Failed to load data: ${error.message}`);
    }
  }, [error]);

  // Handle create new project
  const handleCreateProject = () => {
    router.push('/create');
  };

  return (
    <Content style={{ padding: 24 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16
        }}
      >
        <Title level={4} style={{ margin: 0, color: '#fff' }}>
          Project Management
        </Title>
        <div>
          <Button 
            type="primary"
            icon={<PlusOutlined />} 
            onClick={handleCreateProject}
          >
            Create Project
          </Button>
        </div>
      </div>
      
      <Card
        style={{ 
          background: '#282828',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
        variant={false}
      >
        <DataTable data={data || []} loading={loading} />
      </Card>
    </Content>
  );
}