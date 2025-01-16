# Paaybi

A modern test automation platform that leverages AI to generate and execute tests.

## Features

- Generate automated tests for web applications
- Support for multiple testing frameworks (Mocha, Jest)
- AI-powered test generation
- Real-time test execution and results
- Advanced regression testing capabilities
- Cognitive analysis features

## Tech Stack

- Frontend: React with TypeScript
- Backend: Node.js with Express and TypeScript
- Database: MongoDB
- Testing: Playwright, Mocha, Jest
- AI Integration: OpenAI

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Yarn package manager
- MongoDB
- Docker (optional, for running MongoDB)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/paaybi.git
cd paaybi
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
yarn install

# Install client dependencies
cd ../client
yarn install
```

3. Set up environment variables:
Create a `.env` file in the server directory with:
```
MONGODB_URI=mongodb://localhost:27017/paaybi
OPENAI_API_KEY=your_openai_api_key
```

4. Start MongoDB:
```bash
docker-compose up -d
```

5. Start the development servers:
```bash
# In the server directory
yarn dev:all
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Running Tests

```bash
# Run all tests
yarn test:all

# Run specific test suites
yarn test:unit      # Unit tests
yarn test:e2e       # End-to-end tests
yarn test:mocha     # Mocha tests
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
