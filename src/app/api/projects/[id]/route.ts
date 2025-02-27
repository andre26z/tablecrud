// app/api/projects/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET handler to fetch a specific project
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const projectId = params.id;

		// Read from db.json
		const filePath = path.join(process.cwd(), 'db.json');
		const fileData = fs.readFileSync(filePath, 'utf8');
		const data = JSON.parse(fileData);

		// Find the project with the matching key
		const project = data.projects.find(
			(p: any) => p.key === projectId || p.projectId === projectId
		);

		if (!project) {
			return NextResponse.json({ error: 'Project not found' }, { status: 404 });
		}

		return NextResponse.json(project);
	} catch (error) {
		console.error('Error fetching project:', error);
		return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
	}
}

// PUT handler to update a project
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const projectId = params.id;
		const updatedProject = await request.json();

		// Read current data
		const filePath = path.join(process.cwd(), 'db.json');
		const fileData = fs.readFileSync(filePath, 'utf8');
		const data = JSON.parse(fileData);

		// Find project index
		const projectIndex = data.projects.findIndex(
			(p: any) => p.key === projectId || p.projectId === projectId
		);

		if (projectIndex === -1) {
			return NextResponse.json({ error: 'Project not found' }, { status: 404 });
		}

		// Update project while preserving the key
		data.projects[projectIndex] = {
			...data.projects[projectIndex],
			...updatedProject,
			// Ensure key remains unchanged
			key: data.projects[projectIndex].key,
		};

		// Write updated data back to file
		fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

		return NextResponse.json(data.projects[projectIndex]);
	} catch (error) {
		console.error('Error updating project:', error);
		return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
	}
}
