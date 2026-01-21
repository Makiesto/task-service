# Task Management System

A comprehensive microservices-based task management application built with Spring Boot and React.

## 🏗️ Architecture

This project follows a microservices architecture with three main backend services:

- **User Service** (Port 8082): User authentication, authorization, and team management
- **Task Service** (Port 8081): Task and project management
- **Notification Service** (Port 8083): Email notifications and reminders

### Communication
- **RabbitMQ**: Asynchronous message broker for inter-service communication
- **REST APIs**: Synchronous HTTP communication between services
- **OpenFeign**: Declarative REST client for service-to-service calls

## 🚀 Features

### User Management
- User registration and authentication with JWT
- Role-based access control (ADMIN, MANAGER, DEVELOPER)
- Team creation and member management
- User profiles with statistics

### Task Management
- Create, update, and delete tasks
- Task assignment to multiple users
- Priority levels (LOW, MEDIUM, HIGH, CRITICAL)
- Status tracking (TODO, IN_PROGRESS, DONE)
- Deadline management with validation
- File attachments (images, PDFs, documents)
- Comments and discussions
- Sortable task lists

### Project Management
- Project creation and organization
- Task grouping by projects
- Project statistics and progress tracking
- Timeline visualization
- Completion rate calculation

### Notifications
- Email notifications for task events:
  - Task creation
  - Task assignment
  - Task completion
  - Email changes
- Automated reminders:
  - 3 days before deadline
  - 24 hours before deadline
- Rate-limited email sending (Mailtrap integration)

### Dark Mode
- Full dark mode support with theme persistence
- Smooth transitions between themes

## 🛠️ Technology Stack

### Backend
- **Java 23+**
- **Spring Boot 4.0.x**
- **Spring Security** with JWT authentication
- **Spring Data JPA** with PostgreSQL
- **RabbitMQ** for message queuing
- **MapStruct** for object mapping
- **Lombok** for boilerplate reduction
- **Maven** for dependency management
- **Resilience4j** for rate limiting

### Frontend
- **React 18**
- **Vite** for build tooling
- **TailwindCSS** for styling
- **Lucide React** for icons
- **Context API** for state management

### Infrastructure
- **PostgreSQL** (3 separate databases)
- **RabbitMQ** for messaging
- **Mailtrap** for email testing

## 📋 Prerequisites

- Java 23 or higher
- Node.js 18+ and npm
- PostgreSQL 14+
- RabbitMQ 3.x
- Maven 3.9+

## 🔧 Installation & Setup

### 1. Database Setup

Create three PostgreSQL databases:

```sql
CREATE DATABASE task_db;
CREATE DATABASE user_db;
CREATE DATABASE notification_db;
```

### 2. RabbitMQ Setup

Install and start RabbitMQ:

```bash
# Using Docker
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

# Or install locally
# Visit: https://www.rabbitmq.com/download.html
```

### 3. Environment Variables

Create a `.env` file in the root directory or set environment variables:

```bash
# PostgreSQL - Task Service
POSTGRES_TASKS_DB=task_db
POSTGRES_USER1=your_user
POSTGRES_PASSWORD1=your_password

# PostgreSQL - User Service
POSTGRES_USERS_DB=user_db
POSTGRES_USER2=your_user
POSTGRES_PASSWORD2=your_password

# PostgreSQL - Notification Service
POSTGRES_NOTIFICATIONS_DB=notification_db
POSTGRES_USER3=your_user
POSTGRES_PASSWORD3=your_password

# RabbitMQ
RABBITMQ_DEFAULT_USER=guest
RABBITMQ_DEFAULT_PASS=guest

# Mailtrap (for email testing)
MAILTRAP_USER=your_mailtrap_user
MAILTRAP_PASS=your_mailtrap_password
```

### 4. Backend Setup

Start each service in separate terminals:

```bash
# Task Service
cd backend/task-service
./mvnw spring-boot:run

# User Service
cd backend/user-service
./mvnw spring-boot:run

# Notification Service
cd backend/notification-service
./mvnw spring-boot:run
```

Or on Windows:
```cmd
mvnw.cmd spring-boot:run
```

### 5. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

## 🎯 Usage

### Default Login Credentials

After first run, you can register a new user or use test credentials if you've created them.

### User Roles

- **ADMIN**: Full system access, user management, can delete projects/tasks
- **MANAGER**: Can create projects, tasks, assign users, view all data
- **DEVELOPER**: Can only view and update their assigned tasks

### Creating Your First Task

1. Login as ADMIN or MANAGER
2. Navigate to "Projects" and create a project (optional)
3. Navigate to "Tasks" and click "Create Task"
4. Fill in the task details:
   - Title and description
   - Deadline (must be in the future)
   - Priority level
   - Assign to user(s)
5. Click "Create Task"

### Email Notifications

Email notifications are sent via Mailtrap. To receive notifications:

1. Sign up at [Mailtrap.io](https://mailtrap.io)
2. Get your SMTP credentials
3. Update environment variables
4. Restart the notification service

## 📁 Project Structure

```
.
├── backend/
│   ├── task-service/         # Task & Project management
│   ├── user-service/         # User authentication & teams
│   └── notification-service/ # Email notifications
├── frontend/
│   └── src/
│       ├── components/       # React components
│       ├── context/         # React context providers
│       ├── hooks/           # Custom React hooks
│       └── api/             # API integration
└── README.md
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with BCrypt
- Role-based access control (RBAC)
- CORS configuration
- Request validation
- Session management

## 🐛 Troubleshooting

### Backend won't start
- Check if PostgreSQL is running
- Verify database credentials
- Ensure ports 8081, 8082, 8083 are available

### RabbitMQ connection errors
- Verify RabbitMQ is running on port 5672
- Check RabbitMQ credentials
- Check RabbitMQ management console at `http://localhost:15672`

### Frontend can't connect to backend
- Verify all three backend services are running
- Check CORS configuration in backend
- Verify API endpoints in `frontend/src/api/api.js`

### Emails not sending
- Verify Mailtrap credentials
- Check notification service logs
- Ensure RabbitMQ is properly configured

## 🧪 Testing

```bash
# Backend tests
cd backend/[service-name]
./mvnw test

# Frontend (when tests are added)
cd frontend
npm test
```

## 📝 API Documentation

Once the services are running, access Swagger UI documentation:

- User Service: `http://localhost:8082/swagger-ui.html`
- Task Service: `http://localhost:8081/swagger-ui.html`
- Notification Service: `http://localhost:8083/swagger-ui.html`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Mateusz Stojek

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the frontend library
- RabbitMQ for messaging infrastructure
- TailwindCSS for the styling framework

## 🔮 Future Enhancements

- [ ] Real-time notifications with WebSockets
- [ ] Task templates
- [ ] Gantt chart visualization
- [ ] Export functionality (PDF, Excel)
- [ ] Mobile application
- [ ] Advanced analytics dashboard
- [ ] Integration with third-party services (Slack, Jira)
- [ ] Recurring tasks
- [ ] Time tracking
- [ ] Document version control

## 📞 Support

For issues and questions:
- Create an issue in the GitHub repository
- Contact: mateusz.stojek@proton.me

---

**Note**: This is a development setup. For production deployment, additional configuration for security, performance, and scalability is required.
