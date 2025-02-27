// app/api/projects/[id]/favorite/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const projectId = params.id;
		const { favorite } = await request.json();

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

		// Update favorite status
		data.projects[projectIndex].favorite = favorite;

		// Write updated data back to file
		fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

		return NextResponse.json({
			success: true,
			favorite: favorite,
			project: data.projects[projectIndex],
		});
	} catch (error) {
		console.error('Error updating favorite status:', error);
		return NextResponse.json({ error: 'Failed to update favorite status' }, { status: 500 });
	}
}
