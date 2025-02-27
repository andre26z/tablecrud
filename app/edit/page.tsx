'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Button, 
  Card, 
  Form, 
  Input, 
  DatePicker, 
  Space, 
  message, 
  Spin 
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
  const searchParams = useSearchParams();
  const projectId = searchParams.get('id');
  
  // Move the form initialization inside the component body where Form is actually rendered
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
        
        // Set form values
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

  return (
    <div className="max-w-4xl mx-auto">
      {contextHolder}
      <Card
        title="Edit Project"
        className="shadow-sm"
        extra={
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleCancel}
          >
            Back
          </Button>
        }
      >
        {/* Ensure the Form has the form prop connected to the Form.useForm instance */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="p-4"
          initialValues={{
            projectId: project?.projectId || '',
            projectName: project?.projectName || '',
            description: project?.description || '',
            startDate: project?.startDate ? dayjs(project.startDate) : null,
            endDate: project?.endDate ? dayjs(project.endDate) : null,
            projectManager: project?.projectManager || ''
          }}
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
    </div>
  );
}