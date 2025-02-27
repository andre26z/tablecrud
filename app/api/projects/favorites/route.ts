// app/api/projects/favorites/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
	try {
		// Read from db.json
		const filePath = path.join(process.cwd(), 'db.json');
		const fileData = fs.readFileSync(filePath, 'utf8');
		const data = JSON.parse(fileData);

		// Filter to only favorite projects
		const favoriteProjects = data.projects.filter((project: any) => project.favorite === true);

		return NextResponse.json(favoriteProjects);
	} catch (error) {
		console.error('Error reading favorite projects:', error);
		return NextResponse.json({ error: 'Failed to fetch favorite projects' }, { status: 500 });
	}
}
