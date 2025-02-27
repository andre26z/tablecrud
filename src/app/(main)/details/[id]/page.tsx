'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Button, 
  Card, 
  Space, 
  message, 
  Spin,
  ConfigProvider,
  Typography,
  Divider
} from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

// Define the project type
interface ProjectType {
  key: string;
  projectId: string;
  projectName: string;
  description?: string;
  startDate: string;
  endDate: string;
  projectManager: string;
}

const { Title, Text, Paragraph } = Typography;

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<ProjectType | null>(null);
  
  // Create message instance for antd v5 compatibility
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        messageApi.error('No project ID provided');
        router.push('/');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/projects/${projectId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch project: ${response.status}`);
        }
        
        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
        messageApi.error('Failed to load project data');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, router, messageApi]);

  // Handle navigation to edit page
  const handleEdit = () => {
    router.push(`/edit/${projectId}`);
  };

  // Handle back button
  const handleBack = () => {
    router.back();
  };

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not specified';
    return dayjs(dateString).format('MMMM D, YYYY');
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        width: '100%' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <Spin size="large" />
          <div style={{ marginTop: '12px', color: '#FFFFFF' }}>Loading project details...</div>
        </div>
      </div>
    );
  }

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '2rem 1rem',
  };

  const wrapperStyle = {
    width: '100%',
    maxWidth: '70%',
    color: 'white',
  };

  const labelStyle = {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.65)',
    marginBottom: '4px',
  };

  const valueStyle = {
    fontSize: '16px',
    color: 'white',
    marginBottom: '16px',
  };

  return (
    <div style={containerStyle}>
      <div style={wrapperStyle}>
        {contextHolder}
        <ConfigProvider
          theme={{
            components: {
              Card: {
                colorTextHeading: 'white',
                colorBorderSecondary: '#303030',
                colorBgContainer: 'var(--card-background)',
              },
              Typography: {
                colorText: 'white',
                colorTextDescription: 'rgba(255, 255, 255, 0.65)',
              },
              Button: {
                colorText: 'white',
                colorBgContainer: '#1f1f1f', // Darker gray for buttons
               }
            },
          }}
        >
          <Card
            title="Project Details"
            className="shadow-md rounded-lg"
            extra={
              <Space>
                <Button 
                  icon={<EditOutlined />} 
                  onClick={handleEdit}
                  type="primary"
                >
                  Edit Project
                </Button>
                <Button 
                  icon={<ArrowLeftOutlined />} 
                  onClick={handleBack}
                >
                  Back
                </Button>
              </Space>
            }
          >
            <div className="p-4">
              <div className="mb-6">
                <Text style={labelStyle}>Project ID</Text>
                <Paragraph style={valueStyle}>
                  {project?.projectId || 'Not available'}
                </Paragraph>
              </div>
              
              <div className="mb-6">
                <Text style={labelStyle}>Project Name</Text>
                <Paragraph style={valueStyle}>
                  <Title level={4} style={{ color: 'white', margin: 0 }}>
                    {project?.projectName || 'Not available'}
                  </Title>
                </Paragraph>
              </div>
              
              <Divider style={{ borderColor: '#303030' }} />
              
              <div className="mb-6">
                <Text style={labelStyle}>Description</Text>
                <Paragraph style={valueStyle}>
                  {project?.description || 'No description provided'}
                </Paragraph>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Text style={labelStyle}>Start Date</Text>
                  <Paragraph style={valueStyle}>
                    {formatDate(project?.startDate)}
                  </Paragraph>
                </div>
                
                <div>
                  <Text style={labelStyle}>End Date</Text>
                  <Paragraph style={valueStyle}>
                    {formatDate(project?.endDate)}
                  </Paragraph>
                </div>
              </div>
              
              <div className="mb-6">
                <Text style={labelStyle}>Project Manager</Text>
                <Paragraph style={valueStyle}>
                  {project?.projectManager || 'Not assigned'}
                </Paragraph>
              </div>
              
              <Divider style={{ borderColor: '#303030' }} />
              
              
            </div>
          </Card>
        </ConfigProvider>
      </div>
    </div>
  );
}