# Edible Backend

A production-ready Node.js TypeScript backend for the Edible food scanning application.

## 🚀 Features

- **TypeScript**: Full TypeScript support with strict type checking
- **Express.js**: Fast, unopinionated web framework
- **Production Ready**: Security middleware, logging, error handling
- **Testing**: Jest testing framework with TypeScript support
- **Code Quality**: ESLint configuration for code standards
- **Logging**: Winston logger with file and console output
- **Security**: Helmet, CORS, rate limiting, input validation
- **Health Checks**: Built-in health monitoring endpoints

## 📁 Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Express middleware
├── models/          # Data models
├── routes/          # API route definitions
├── services/        # Business logic
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── __tests__/       # Test files
└── server.ts        # Main application entry point
```

## 🛠️ Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Edible-BE
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
This starts the server with hot reload using `ts-node-dev`.

### Production Mode
```bash
npm run build
npm start
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test -- --coverage
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Check code with ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run clean` - Remove build artifacts

## 🌐 API Endpoints

### Health Check
- `GET /health` - Basic health status
- `GET /health/detailed` - Detailed system information

### API v1
- `GET /api/v1` - API information

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: Request rate limiting
- **Input Validation**: Request data validation
- **Error Handling**: Secure error responses

## 📝 Logging

The application uses Winston for structured logging:
- Console output in development
- File output in production
- Separate error log files
- Request logging with Morgan

## 🧹 Code Quality

- **ESLint**: Code linting with TypeScript rules
- **Prettier**: Code formatting (can be added)
- **TypeScript**: Strict type checking
- **Jest**: Unit testing framework

## 🔄 Environment Variables

Copy `env.example` to `.env` and configure:

```env
NODE_ENV=development
PORT=3000
HOST=localhost
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
```

## 📊 Monitoring

- Health check endpoints for monitoring
- Structured logging for observability
- Error tracking and reporting
- Performance metrics (can be extended)

## 🚀 Deployment

1. Build the application: `npm run build`
2. Set production environment variables
3. Start with: `npm start`
4. Use PM2 or similar for process management

## 🤝 Contributing

1. Follow the established folder structure
2. Write tests for new features
3. Follow the coding standards (ESLint)
4. Update documentation as needed

## 📄 License

MIT License - see LICENSE file for details
