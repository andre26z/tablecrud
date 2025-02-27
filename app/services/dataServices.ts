'use client';

import { useState, useEffect } from 'react';

export interface ProjectType {
	key: string;
	projectId: string;
	projectName: string;
	startDate: string;
	endDate: string;
	projectManager: string;
}

export function useDataService() {
	const [data, setData] = useState<ProjectType[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchData = async () => {
		setLoading(true);
		setError(null);

		try {
			// Adjust the URL to point to your db.json file or API endpoint
			const response = await fetch('/api/projects');

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const result = await response.json();
			setData(result.projects || result); // Handle both {projects: [...]} and direct array
		} catch (err) {
			console.error('Failed to fetch data:', err);
			setError(err instanceof Error ? err : new Error('Unknown error occurred'));
		} finally {
			setLoading(false);
		}
	};

	// Initial data fetch
	useEffect(() => {
		fetchData();
	}, []);

	// Function to manually refresh data
	const refreshData = () => {
		fetchData();
	};

	return { data, loading, error, refreshData };
}
