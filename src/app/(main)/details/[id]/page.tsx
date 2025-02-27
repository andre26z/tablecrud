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
  Divider,
  Grid
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
const { useBreakpoint } = Grid;

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const screens = useBreakpoint();
  
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
      <div className="flex justify-center items-center h-screen w-full bg-[#121212]">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-3 text-white">Loading project details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div className={`mx-0.5 w-[calc(100%-4px)] ${screens.md ? 'max-w-3xl' : 'max-w-full'}`}>
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
                colorText: '#',
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
            title={<span className="text-base md:text-xl">Details</span>}
            className="shadow-md rounded-lg"
            extra={
              <Space size={screens.md ? "middle" : "small"} className="flex flex-wrap">
                <Button 
                  icon={<EditOutlined />} 
                  onClick={handleEdit}
                  type="primary"
                  size={screens.md ? "middle" : "small"}
                >
                  Edit Project
                </Button>
                <Button 
                  icon={<ArrowLeftOutlined />} 
                  onClick={handleBack}
                  size={screens.md ? "middle" : "small"}
                >
                  Back
                </Button>
              </Space>
            }
          >
            <div className="p-2 md:p-4">
              <div className="mb-4 md:mb-6">
                <Text className="text-sm text-gray-400">Project ID</Text>
                <Paragraph className="text-white text-base md:text-lg mt-1">
                  {project?.projectId || 'Not available'}
                </Paragraph>
              </div>
              
            <div className="mb-4 md:mb-6">
            <Text className="text-sm text-gray-400">Project Name</Text>
            <div className="mt-1">
              {/* Use a regular div instead of Typography.Title */}
              <div style={{ color: 'white', fontWeight: 'bold' }} className="text-xl md:text-2xl font-medium">
                {project?.projectName || 'Not available'}
              </div>
            </div>
          </div>
              
              <Divider className="border-gray-700 my-3 md:my-4" />
              
              <div className="mb-4 md:mb-6">
                <Text className="text-sm text-gray-400">Description</Text>
                <Paragraph className="text-white text-base mt-1">
                  {project?.description || 'No description provided'}
                </Paragraph>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Text className="text-sm text-gray-400">Start Date</Text>
                  <Paragraph className="text-white text-base md:text-lg mt-1">
                    {formatDate(project?.startDate)}
                  </Paragraph>
                </div>
                
                <div>
                  <Text className="text-sm text-gray-400">End Date</Text>
                  <Paragraph className="text-white text-base md:text-lg mt-1">
                    {formatDate(project?.endDate)}
                  </Paragraph>
                </div>
              </div>
              
              <div className="mb-4 md:mb-6">
                <Text className="text-sm text-gray-400">Project Manager</Text>
                <Paragraph className="text-white text-base md:text-lg mt-1">
                  {project?.projectManager || 'Not assigned'}
                </Paragraph>
              </div>
              
              <Divider className="border-gray-700 my-3 md:my-4" />
            </div>
          </Card>
        </ConfigProvider>
      </div>
    </div>
  );
}