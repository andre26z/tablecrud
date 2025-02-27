'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Button, 
  Card, 
  Form, 
  Input, 
  DatePicker, 
  Space, 
  message,
  ConfigProvider
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';

const { TextArea } = Input;

export default function CreateProjectPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  
  // Create message instance for antd v5 compatibility
  const [messageApi, contextHolder] = message.useMessage();

  // Handle form submission
  const onFinish = async (values: any) => {
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

      messageApi.success('Project created successfully');
      router.push('/');
    } catch (error) {
      console.error('Error creating project:', error);
      messageApi.error('Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cancel/back
  const handleCancel = () => {
    router.push('/');
  };

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
                colorTextPlaceholder: 'rgba(255, 255, 255, 0.5)',
                colorBgElevated: 'var(--card-background)',
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
            title="Create New Project"
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
                <Space>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SaveOutlined />}
                    loading={submitting}
                  >
                    Create Project
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