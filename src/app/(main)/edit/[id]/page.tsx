'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Button, 
  Card, 
  Form, 
  Input, 
  DatePicker, 
  Space, 
  message, 
  Spin,
  ConfigProvider,
  Grid
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
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

const { TextArea } = Input;
const { useBreakpoint } = Grid;

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const screens = useBreakpoint();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [project, setProject] = useState<ProjectType | null>(null);
  const [formInitialized, setFormInitialized] = useState(false);
  
  // Create message instance for antd v5 compatibility
  const [messageApi, contextHolder] = message.useMessage();
  
  // Initialize form outside of conditionals
  const [form] = Form.useForm();

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
        
        // Mark data as ready to be set into form
        setFormInitialized(true);
      } catch (error) {
        console.error('Error fetching project:', error);
        messageApi.error('Failed to load project data');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, router, messageApi]);

  // Set form values in a separate effect after form is mounted and data is ready
  useEffect(() => {
    if (project && formInitialized && form) {
      form.setFieldsValue({
        projectId: project.projectId,
        projectName: project.projectName,
        description: project.description || '',
        startDate: project.startDate ? dayjs(project.startDate) : null,
        endDate: project.endDate ? dayjs(project.endDate) : null,
        projectManager: project.projectManager
      });
    }
  }, [project, form, formInitialized]);

  // Handle form submission
  const onFinish = async (values) => {
    try {
      setSubmitting(true);
      
      // Format dates back to string format
      const formattedValues = {
        ...values,
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : null,
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null
      };
      
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedValues),
      });

      if (!response.ok) {
        throw new Error(`Failed to update project: ${response.status}`);
      }

      messageApi.success('Project updated successfully');
      router.push('/');
    } catch (error) {
      console.error('Error updating project:', error);
      messageApi.error('Failed to update project');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cancel/back
  const handleCancel = () => {
    router.push('/');
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full bg-[#121212]">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-3 text-white">Loading project data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center pt-[52px]">
      <div className={`mx-0.5 w-[calc(100%-4px)] ${screens.md ? 'max-w-3xl' : 'max-w-full'}`}>
        {contextHolder}
        <ConfigProvider
          theme={{
            components: {
              Card: {
                colorTextHeading: 'white',
                colorBorderSecondary: '#303030',
                colorBgContainer: '#1f1f1f', // Darker gray background for card
              },
              Form: {
                colorText: 'white',
                colorTextLabel: 'white',
              },
              DatePicker: {
                colorTextPlaceholder: 'rgba(255, 255, 255, 0.5)',
                colorBgElevated: '#2c2c2c', // Darker gray for dropdown
                colorBgContainer: '#333333', // Gray for the input field
                colorText: 'white',
                colorPrimary: '#1890ff',
              },
              Input: {
                colorTextPlaceholder: 'rgba(255, 255, 255, 0.5)',
                colorBgContainer: '#333333', // Gray for input fields
                colorText: 'white',
              },
              Button: {
                colorText: 'white',
                colorBgContainer: '#1f1f1f', // Darker gray for buttons
              }
            },
          }}
        >
          <Card
            title={<span className="text-base md:text-xl">Edit Project</span>}
            className="shadow-md rounded-lg"
            extra={
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={handleCancel}
                size={screens.md ? "middle" : "small"}
              >
                Back
              </Button>
            }
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className="p-2 md:p-4"
              preserve={false}
            >
              <Form.Item
                name="projectId"
                label="Project ID"
                rules={[{ required: true, message: 'Please enter project ID' }]}
              >
                <Input disabled placeholder="PRJ-001" />
              </Form.Item>

              <Form.Item
                name="projectName"
                label="Project Name"
                rules={[{ required: true, message: 'Please enter project name' }]}
              >
                <Input placeholder="Enter project name" />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
              >
                <TextArea 
                  rows={4} 
                  placeholder="Enter project description" 
                />
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="startDate"
                  label="Start Date"
                  rules={[{ required: true, message: 'Please select start date' }]}
                >
                  <DatePicker 
                    className="w-full" 
                    format="YYYY-MM-DD"
                  />
                </Form.Item>

                <Form.Item
                  name="endDate"
                  label="End Date"
                  rules={[{ required: true, message: 'Please select end date' }]}
                >
                  <DatePicker 
                    className="w-full" 
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
              </div>

              <Form.Item
                name="projectManager"
                label="Project Manager"
                rules={[{ required: true, message: 'Please enter project manager' }]}
              >
                <Input placeholder="Enter project manager name" />
              </Form.Item>

              <Form.Item>
                <Space size={screens.md ? "middle" : "small"} className="flex flex-wrap">
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SaveOutlined />}
                    loading={submitting}
                    size={screens.md ? "middle" : "small"}
                  >
                    Save Changes
                  </Button>
                  <Button 
                    onClick={handleCancel}
                    size={screens.md ? "middle" : "small"}
                  >
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </ConfigProvider>
      </div>
    </div>
  );
}