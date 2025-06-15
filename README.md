# SmartCity Complaint Management System

A comprehensive Progressive Web Application (PWA) for managing civic complaints across Gujarat cities. The platform enables citizens to report issues, administrators to manage complaints and employees, and field workers to resolve assigned cases.

## 🚀 Features

### Multi-City Administration
- **5 Gujarat Cities**: Ahmedabad, Mehsana, Surat, Vadodara, Rajkot
- **Role-Based Access**: Citizens, City Admins, Field Employees
- **City-Specific Filtering**: Admins see only their city's complaints

### Real-Time Complaint Management
- **Interactive Map**: Live complaint visualization with status-based markers
- **Priority System**: High, medium, low priority with visual indicators
- **Status Tracking**: Pending (red), In-Progress (yellow), Resolved (green)
- **Auto-Refresh**: Map updates every 30 seconds for new complaints

### Progressive Web App
- **Offline Support**: Service worker for offline functionality
- **Mobile-First**: Responsive design optimized for mobile devices
- **Install Prompt**: Can be installed as a native app
- **Push Notifications**: Real-time updates for complaint status

### User Management
- **Profile Management**: Update personal information and city
- **Password Security**: Secure password change with verification
- **Points System**: Reward system for active citizens
- **Account Dashboard**: Comprehensive user statistics

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** + **Radix UI** for modern styling
- **TanStack Query** for server state management
- **React Leaflet** for interactive maps
- **React Hook Form** + **Zod** for form validation

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** (Neon serverless)
- **JWT Authentication** with role-based access
- **Multer** for file uploads

### DevOps
- **Replit Deployment** with autoscaling
- **GitHub Integration** for version control
- **Environment Variables** for secure configuration

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Environment variables configured

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smartcity-complaints.git
   cd smartcity-complaints
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Create .env file with:
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. **Database Setup**
   ```bash
   npm run db:push
   ```

5. **Start Development**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## 🎯 Usage

### For Citizens
1. **Register**: Sign up with mobile number and city selection
2. **Report Issues**: Submit complaints with photos and location
3. **Track Progress**: Monitor complaint status and updates
4. **Earn Points**: Get rewards for verified reports

### For City Admins
1. **Login**: Use city-specific admin credentials
2. **Manage Cases**: View and assign complaints to employees
3. **Employee Management**: Create and manage field worker accounts
4. **City Dashboard**: Overview of city-specific metrics

### For Field Employees
1. **Login**: Access assigned complaint dashboard
2. **Update Status**: Mark complaints as in-progress or resolved
3. **Field Updates**: Add resolution details and photos

## 🔐 Default Credentials

### Test Accounts
- **Citizens**: Any mobile number with password/OTP: `1234`
- **Admin Ahmedabad**: `admin_ahmedabad` / `admin123`
- **Admin Mehsana**: `admin_mehsana` / `admin123`
- **Employee**: `test_employee` / `employee123`

## 🗺️ Map Features

- **Real-Time Updates**: Automatic refresh every 30 seconds
- **Status Markers**: Color-coded complaint visualization
- **Priority Indicators**: Visual priority levels
- **Pulse Animation**: Pending complaints highlighted
- **Filter Options**: Search by location, category, status

## 📱 PWA Features

- **Offline Mode**: Works without internet connection
- **Install Prompt**: Add to home screen capability
- **Background Sync**: Queue actions for when online
- **Push Notifications**: Real-time status updates
- **App-Like Experience**: Native app feel and performance

## 🏗️ Architecture

```
SmartCity-Complaints/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and config
├── server/                # Express backend
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth and validation
│   └── models/           # Database models
├── shared/               # Shared types and schemas
└── public/              # Static assets and PWA files
```

## 🚀 Deployment

### Replit Deployment
1. Connect your GitHub repository to Replit
2. Configure environment variables
3. Deploy with autoscaling enabled

### Manual Deployment
1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏙️ Cities Supported

- **Ahmedabad** - Gujarat's largest city
- **Mehsana** - North Gujarat administrative center
- **Surat** - Diamond and textile hub
- **Vadodara** - Cultural capital of Gujarat
- **Rajkot** - Industrial city of Saurashtra

## 📞 Support

For support and queries:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 🔄 Recent Updates

- Enhanced map functionality with real-time updates
- Improved PWA compliance and offline support
- Added comprehensive user profile management
- Implemented city-based administration system
- Added priority-based visual indicators

---

**SmartCity Complaint Management System** - Making cities more responsive to citizen needs through technology.