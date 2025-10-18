# Environment Configuration Guide

## Overview

The application now uses `@nestjs/config` for managing environment variables through `.env` files. This provides a type-safe and centralized way to handle configuration.

## Setup

### 1. Install Dependencies

The `@nestjs/config` package has been installed:

```bash
npm install @nestjs/config
```

### 2. Create .env File

Copy the example file and add your values:

```bash
copy .env.example .env
```

Or create a new `.env` file in the project root:

```env
# OpenRouter API Configuration
OPENROUTER_API_KEY=your_actual_api_key_here

# Application Configuration
PORT=3000
NODE_ENV=development
```

### 3. Add Your API Key

1. Get your OpenRouter API key from: https://openrouter.ai/keys
2. Replace `your_actual_api_key_here` with your actual key
3. Save the file

## Environment Variables

### Required Variables

| Variable             | Description                               | Example        | Required              |
| -------------------- | ----------------------------------------- | -------------- | --------------------- |
| `OPENROUTER_API_KEY` | OpenRouter API key for AI code generation | `sk-or-v1-...` | Yes (for AI features) |

### Optional Variables

| Variable   | Description        | Default       | Example                             |
| ---------- | ------------------ | ------------- | ----------------------------------- |
| `PORT`     | Server port number | `3000`        | `3000`, `8080`                      |
| `NODE_ENV` | Environment mode   | `development` | `development`, `production`, `test` |

## Configuration Implementation

### App Module (app.module.ts)

```typescript
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes config available globally
      envFilePath: '.env', // Path to .env file
    }),
    // ... other modules
  ],
})
export class AppModule {}
```

### Using ConfigService in Services

Example from `ai-analysis.service.ts`:

```typescript
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiAnalysisService {
  constructor(
    private configService: ConfigService,
    // ... other services
  ) {
    // Get environment variable with default value
    const apiKey = this.configService.get<string>('OPENROUTER_API_KEY', '');

    // Use the value
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }
}
```

## Benefits of ConfigModule

### 1. Type Safety

```typescript
// Get with type checking
const port = this.configService.get<number>('PORT', 3000);
const apiKey = this.configService.get<string>('OPENROUTER_API_KEY');
```

### 2. Default Values

```typescript
// Provide fallback if variable is not set
const port = this.configService.get<number>('PORT', 3000);
```

### 3. Validation (Optional)

You can add validation schemas using Joi or class-validator:

```typescript
ConfigModule.forRoot({
  isGlobal: true,
  validationSchema: Joi.object({
    OPENROUTER_API_KEY: Joi.string().required(),
    PORT: Joi.number().default(3000),
  }),
});
```

### 4. Multiple Environment Files

```typescript
ConfigModule.forRoot({
  envFilePath: ['.env.local', '.env'], // Load multiple files
});
```

### 5. Custom Configuration

Create typed configuration objects:

```typescript
// config/openrouter.config.ts
export default () => ({
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    model: process.env.OPENROUTER_MODEL || 'qwen/qwen-2.5-coder-32b-instruct',
  },
});
```

## Security Best Practices

### 1. Never Commit .env Files

The `.env` file is already in `.gitignore`:

```gitignore
# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local
```

### 2. Use .env.example

The `.env.example` file shows required variables without sensitive values:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### 3. Different Environments

Use different .env files for different environments:

- `.env.development` - Development settings
- `.env.production` - Production settings
- `.env.test` - Test settings

### 4. Environment-Specific Loading

```typescript
const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;
ConfigModule.forRoot({
  envFilePath,
});
```

## Accessing Environment Variables

### Method 1: ConfigService (Recommended)

```typescript
constructor(private configService: ConfigService) {
  const apiKey = this.configService.get<string>('OPENROUTER_API_KEY');
}
```

### Method 2: Direct Access (Legacy)

```typescript
const port = process.env.PORT || 3000;
```

**Note**: Using `ConfigService` is recommended as it provides better type safety and testing support.

## Testing

### Unit Tests

Mock the ConfigService:

```typescript
const mockConfigService = {
  get: jest.fn((key: string) => {
    const config = {
      OPENROUTER_API_KEY: 'test-key',
      PORT: 3000,
    };
    return config[key];
  }),
};
```

### E2E Tests

Use test environment variables:

```typescript
// test/jest-e2e.json
{
  "moduleNameMapper": {
    "^src/(.*)$": "<rootDir>/../src/$1"
  },
  "testEnvironment": "node",
  "setupFiles": ["<rootDir>/setup-env.ts"]
}

// test/setup-env.ts
process.env.OPENROUTER_API_KEY = 'test-key';
```

## Troubleshooting

### Issue: "Cannot find module '@nestjs/config'"

**Solution**: Install the package

```bash
npm install @nestjs/config
```

### Issue: Environment variables not loading

**Solution**:

1. Check `.env` file exists in project root
2. Verify file has no syntax errors
3. Restart the development server
4. Check file encoding (should be UTF-8)

### Issue: API key not working

**Solution**:

1. Verify the key is correct in `.env`
2. No quotes needed around the value
3. No spaces around the `=` sign
4. Format: `OPENROUTER_API_KEY=sk-or-v1-...`

### Issue: Variables undefined in production

**Solution**:

1. Set environment variables in your hosting platform
2. Or copy `.env` file to production server
3. Or use platform-specific config (Heroku, AWS, etc.)

## Platform-Specific Setup

### Heroku

```bash
heroku config:set OPENROUTER_API_KEY=your-key
```

### AWS Elastic Beanstalk

Add in Configuration → Software → Environment properties

### Docker

```yaml
# docker-compose.yml
services:
  app:
    environment:
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
```

### Vercel/Netlify

Add in project settings → Environment Variables

## Migration Guide

If you have existing code using `process.env` directly:

### Before:

```typescript
const apiKey = process.env.OPENROUTER_API_KEY || '';
```

### After:

```typescript
constructor(private configService: ConfigService) {
  const apiKey = this.configService.get<string>('OPENROUTER_API_KEY', '');
}
```

## Example Configuration Files

### Development (.env.development)

```env
OPENROUTER_API_KEY=sk-or-v1-dev-key
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug
```

### Production (.env.production)

```env
OPENROUTER_API_KEY=sk-or-v1-prod-key
PORT=8080
NODE_ENV=production
LOG_LEVEL=error
```

### Testing (.env.test)

```env
OPENROUTER_API_KEY=test-key
PORT=3001
NODE_ENV=test
```

## Summary

✅ `.env` file support added via `@nestjs/config`
✅ Type-safe configuration with `ConfigService`
✅ Global configuration available to all modules
✅ Support for multiple environment files
✅ Secure and follows best practices

## Quick Start

1. **Copy the example**:

   ```bash
   copy .env.example .env
   ```

2. **Add your API key**:

   ```env
   OPENROUTER_API_KEY=sk-or-v1-your-actual-key
   ```

3. **Start the app**:
   ```bash
   npm run start:dev
   ```

That's it! Your environment variables are now properly configured. 🎉
