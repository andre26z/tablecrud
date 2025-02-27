// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET handler to fetch all projects
export async function GET() {
	try {
		// Read from db.json
		const filePath = path.join(process.cwd(), 'db.json');
		const fileData = fs.readFileSync(filePath, 'utf8');
		const data = JSON.parse(fileData);

		// Return the projects array from the JSON file
		return NextResponse.json(data.projects || []);
	} catch (error) {
		console.error('Error reading projects data:', error);
		return NextResponse.json({ error: 'Failed to load projects' }, { status: 500 });
	}
}

// POST handler to create a new project
export async function POST(request: NextRequest) {
	try {
		const newProject = await request.json();

		// Read current data
		const filePath = path.join(process.cwd(), 'db.json');
		const fileData = fs.readFileSync(filePath, 'utf8');
		const data = JSON.parse(fileData);

		// Generate a new key (simple increment)
		const lastKey =
			data.projects.length > 0 ? Math.max(...data.projects.map((p: any) => parseInt(p.key))) : 0;

		const projectWithKey = {
			...newProject,
			key: String(lastKey + 1),
		};

		// Add new project
		data.projects.push(projectWithKey);

		// Write updated data back to file
		fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

		return NextResponse.json(projectWithKey, { status: 201 });
	} catch (error) {
		console.error('Error creating project:', error);
		return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
	}
}
