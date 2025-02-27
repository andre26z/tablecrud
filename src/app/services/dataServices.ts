'use client';

import { useState, useEffect } from 'react';

export interface Project {
	key: string;
	projectId: string;
	projectName: string;
	description: string;
	startDate: string;
	endDate: string;
	projectManager: string;
	favorite: boolean;
}

// Create a custom hook for fetching project data
export const useDataService = () => {
	const [data, setData] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchData = async () => {
		try {
			setLoading(true);
			// Update URL to point to projects endpoint
			const response = await fetch('http://localhost:3001/projects');

			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			}

			const result = await response.json();

			// Ensure the data format is correct
			const formattedData = Array.isArray(result)
				? result.map((item: any) => ({
						key: item.key || `${item.projectId || Math.random().toString(36).substring(2, 9)}`,
						projectId: item.projectId || 'Unknown',
						projectName: item.projectName || 'Unnamed Project',
						description: item.description || 'No description',
						startDate: item.startDate || '',
						endDate: item.endDate || '',
						projectManager: item.projectManager || 'Unassigned',
						favorite: item.favorite !== undefined ? item.favorite : false,
				  }))
				: [];

			setData(formattedData);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Unknown error occurred'));
			console.error('Error fetching data:', err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const refreshData = () => {
		fetchData();
	};

	return { data, loading, error, refreshData };
};
