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
  ConfigProvider 
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

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [project, setProject] = useState<ProjectType | null>(null);
  
  // Create message instance for antd v5 compatibility
  const [messageApi, contextHolder] = message.useMessage();
  
  // Only create the form instance when we're about to use it
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
        
        // Set form values only after we have the data and when form exists
        form.setFieldsValue({
          projectId: data.projectId,
          projectName: data.projectName,
          description: data.description || '',
          startDate: data.startDate ? dayjs(data.startDate) : null,
          endDate: data.endDate ? dayjs(data.endDate) : null,
          projectManager: data.projectManager
        });
      } catch (error) {
        console.error('Error fetching project:', error);
        messageApi.error('Failed to load project data');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, form, router, messageApi]);

  // Handle form submission
  const onFinish = async (values: any) => {
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
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-3">Loading project data...</div>
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
              Form: {
                colorText: 'white',
                colorTextLabel: 'white',
              },
              DatePicker: {
                colorTextPlaceholder: 'rgb(255, 255, 255)',
                colorBgElevated: 'rgb(67, 66, 66)',
                colorBgContainer: 'var(--card-background)',
              },
              Input: {
                colorTextPlaceholder: 'rgba(255, 255, 255, 0.5)',
                colorBgContainer: 'var(--card-background)',
              },
            },
          }}
        >
          <Card
            title="Edit Project"
            className="shadow-md rounded-lg"
            extra={
              <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={handleCancel}
              >
                Back
              </Button>
            }
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className="p-4"
              // We don't need initialValues here since we're using form.setFieldsValue in the useEffect
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
                <Space>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SaveOutlined />}
                    loading={submitting}
                  >
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel}>
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