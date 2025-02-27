# Project Management Dashboard

A modern project management dashboard built with Next.js, TypeScript, and Ant Design. This application features a dark theme, project favorites system, and a responsive UI.

![Project Dashboard Screenshot](https://via.placeholder.com/1200x600/1f1f1f/FFFFFF?text=Project+Management+Dashboard)

## Features

- 🌙 Dark theme UI with custom styling
- ⭐ Project favorites system
- 📱 Responsive design
- 📊 Project data table with sorting and filtering
- 🔒 API endpoints for data persistence

## Technology Stack

- **Frontend**:
  - Next.js 14 (App Router)
  - TypeScript
  - Ant Design
  - Tailwind CSS

- **API**:
  - Next.js API Routes
  - Mock API Server (JSON Server)

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/project-management-dashboard.git
cd project-management-dashboard
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Running the Development Server

Start the Next.js development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Setting Up the Mock API

This project uses JSON Server to simulate a REST API for development.

1. Install JSON Server globally if you haven't already:

```bash
npm install -g json-server
```

2. Create a `db.json` file in the project root with your mock data:

```json
{
  "projects": [
    {
      "key": "1",
      "projectId": "PRJ001",
      "projectName": "Website Redesign",
      "startDate": "2023-01-15",
      "endDate": "2023-06-30",
      "projectManager": "Jane Smith",
      "favorite": true
    },
    {
      "key": "2",
      "projectId": "PRJ002",
      "projectName": "Mobile App Development",
      "startDate": "2023-02-01",
      "endDate": "2023-08-15",
      "projectManager": "John Doe",
      "favorite": false
    }
  ]
}
```

3. Start the JSON Server on port 3001:

```bash
json-server --watch db.json --port 3001
```

4. Create a `.env.local` file in your project root to point to the mock API:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### API Routes

The app uses the following API endpoints:

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get a specific project
- `PUT /api/projects/:id/favorite` - Toggle favorite status
- `PUT /api/projects/:id` - Update a project

## Project Structure

```
├── app/
│   ├── api/               # Next.js API routes
│   ├── components/        # React components
│   ├── context/           # React context providers
│   ├── details/[id]/      # Project details page
│   ├── edit/[id]/         # Project edit page
│   └── page.tsx           # Home page
├── public/                # Static files
├── styles/                # Global CSS and Tailwind setup
├── db.json                # Mock database for JSON Server
└── package.json           # Project dependencies
```

## Customizing the Theme

The dark theme is implemented using CSS variables and Tailwind CSS utilities. You can customize the theme by modifying:

1. The CSS variables in `styles/globals.css`
2. The component-specific styling throughout the application
3. The Tailwind configuration in `tailwind.config.js`

## Development Notes

### Favorites System

The favorites system uses React Context to manage state across the application. The main components:

- `FavoritesContext.tsx` - Context provider for favorite projects
- `DataTable.tsx` - Component for displaying and toggling favorites
- API endpoints for persisting favorites

### Modal Styling

The modal styling uses custom CSS to ensure the dark theme is applied consistently. This includes:

- Custom class names to target specific elements
- Direct style props for immediate buttons
- Global CSS overrides for complex components

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fproject-management-dashboard)

For other deployment options, see the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
