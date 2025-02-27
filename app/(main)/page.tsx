'use client';

import React from 'react';
import { Button, Card, Space, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import DataTable from '@/app/components/DataTable';
import { useDataService } from '@/app/services/dataServices';

export default function HomePage() {
  const { data, loading, error, refreshData } = useDataService();
  
  // Show error message if fetch fails
  React.useEffect(() => {
    if (error) {
      message.error(`Failed to load data: ${error.message}`);
    }
  }, [error]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Project Management</h1>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={refreshData}
          loading={loading}
        >
          Refresh
        </Button>
      </div>
      
      <Card>
        <DataTable data={data || []} loading={loading} />
      </Card>
    </div>
  );
}