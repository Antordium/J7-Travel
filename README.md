USCYBERCOM J7 Travel Cost Dashboard
A comprehensive travel cost tracking and analytics dashboard for USCYBERCOM J7 staff sections.
Features

Multi-file Excel Import: Upload and process multiple Excel files containing travel data
Interactive Visualizations: Bar charts, pie charts, and timeline analysis
Section-based Filtering: Filter data by organizational sections
Cost Analysis: Compare projected vs actual travel costs
Export Functionality: Export filtered data to Excel format
Responsive Design: Works on desktop and mobile devices
Real-time Analytics: Dynamic calculations and aggregations

Tech Stack

Frontend: Next.js 14, React 18, TypeScript
Styling: Tailwind CSS
Charts: Recharts
Data Processing: Lodash, SheetJS (xlsx)
Icons: Lucide React
Deployment: Vercel

Getting Started
Prerequisites

Node.js 18.0.0 or higher
npm or yarn package manager

Local Development

Clone the repository:

bashgit clone <your-repo-url>
cd uscybercom-j7-travel-dashboard

Install dependencies:

bashnpm install
# or
yarn install

Run the development server:

bashnpm run dev
# or
yarn dev

Open http://localhost:3000 in your browser.

Data Format
The dashboard expects Excel files with the following columns:

Section: Staff section name (e.g., Operations, Intelligence, Logistics)
Personnel Name: Name of the traveler
Destination: Travel destination
Travel Date: Date of travel (YYYY-MM-DD format)
Projected Cost: Estimated cost of travel
Actual Cost: Actual cost incurred (optional, can be null for future travel)

Sample Data
The application includes sample data for demonstration. Upload your own Excel files to replace the sample data.
Deployment
Deploy to Vercel
Show Image

Push your code to GitHub
Connect your GitHub repository to Vercel
Vercel will automatically detect the Next.js configuration
Deploy with default settings

Manual Deployment

Build the application:

bashnpm run build

Start the production server:

bashnpm start
Usage
Uploading Data

Click the "Upload Excel" button in the control panel
Select one or more Excel files containing travel data
The dashboard will automatically process and display the data

Filtering Data

Date Range: Set start and end dates to filter travel records
Sections: Click section tags to filter by specific organizational units
Time Period: Choose between monthly, quarterly, or yearly aggregation

Viewing Details

Click "View Details" on any section in the summary table
Navigate between dashboard and detail views using the breadcrumb navigation

Exporting Data

Click the "Export Data" button to download filtered data as an Excel file
Exported files include all currently filtered records

Features Overview
Dashboard View

Key Metrics: Total records, projected costs, actual costs, active sections
Cost Comparison: Bar chart comparing projected vs actual costs by section
Distribution Analysis: Pie chart showing cost distribution across sections
Timeline Analysis: Line chart showing cost trends over time
Section Summary: Detailed table with drill-down capability

Section Detail View

Section Metrics: Focused statistics for the selected section
Personnel Analysis: Individual travel costs by person
Detailed Records: Complete travel record table with status indicators

Contributing

Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

License
This project is licensed under the MIT License - see the LICENSE file for details.
Support
For questions or support, please contact the USCYBERCOM J7 development team.
Security
This application is designed for internal use with appropriate security measures. Ensure proper access controls are in place when deploying to production environments.
