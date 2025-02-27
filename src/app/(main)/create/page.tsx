'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Button, 
  Card, 
  Form, 
  Input, 
  DatePicker, 
  Space, 
  message,
  ConfigProvider,
  Spin,
  Grid
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { useBreakpoint } = Grid;

export default function CreateProjectPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const screens = useBreakpoint();
  
  // Create message instance for antd v5 compatibility
  const [messageApi, contextHolder] = message.useMessage();

  // Handle form initialization and simulate loading
  useEffect(() => {
    // Initialize form with empty values to prevent the warning
    form.resetFields();
    
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [form]);

  // Handle success/error messages
  useEffect(() => {
    if (submitError) {
      messageApi.error(submitError);
      setSubmitError(null);
    }
  }, [submitError, messageApi]);

  useEffect(() => {
    if (submitSuccess) {
      messageApi.success(submitSuccess);
      setSubmitSuccess(null);
    }
  }, [submitSuccess, messageApi]);

  // Handle form submission
  const onFinish = async (values) => {
    try {
      setSubmitting(true);
      
      // Format dates to string format
      const formattedValues = {
        ...values,
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : null,
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null
      };
      
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedValues),
      });

      if (!response.ok) {
        throw new Error(`Failed to create project: ${response.status}`);
      }

      setSubmitSuccess('Project created successfully');
      router.push('/');
    } catch (error) {
      console.error('Error creating project:', error);
      setSubmitError('Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cancel/back
  const handleCancel = () => {
    router.push('/');
  };

  // Render form component (will be conditionally displayed)
  const formComponent = (
    <div className="w-full flex justify-center">
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
            title={<span className="text-base md:text-xl">Create New Project</span>}
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
            >
              <Form.Item
                name="projectId"
                label="Project ID"
                rules={[{ required: true, message: 'Please enter project ID' }]}
              >
                <Input placeholder="PRJ-001" />
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
                    Create Project
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

  // Full-page loading spinner
  const loadingSpinner = (message) => (
    <div className="flex justify-center items-center h-screen w-full bg-[#121212]">
      <div className="text-center">
        <Spin size="large" />
        <div className="mt-3 text-white">{message}</div>
      </div>
    </div>
  );

  // Conditional rendering with form always being somewhere in the component tree
  if (loading) {
    return (
      <>
        {loadingSpinner('Loading form...')}
        <div style={{ display: 'none' }}>
          <Form form={form}>
            <Form.Item name="hidden"><Input /></Form.Item>
          </Form>
        </div>
      </>
    );
  }

  if (submitting) {
    return (
      <>
        {loadingSpinner('Creating project...')}
        <div style={{ display: 'none' }}>
          <Form form={form}>
            <Form.Item name="hidden"><Input /></Form.Item>
          </Form>
        </div>
      </>
    );
  }

  return formComponent;
}