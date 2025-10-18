# GitHub Copilot Instructions

## Package Manager

**Always use `yarn` instead of `npm` for this project.**

### Correct Commands:

- `yarn install` - Install dependencies
- `yarn add <package>` - Add a package
- `yarn add -D <package>` - Add a dev dependency
- `yarn remove <package>` - Remove a package
- `yarn start:dev` - Start in development mode
- `yarn build` - Build the project
- `yarn lint` - Run linter
- `yarn test` - Run tests

### Incorrect Commands (Do NOT use):

- ❌ `npm install`
- ❌ `npm i`
- ❌ `npm run start:dev`
- ❌ `npm add`

## Project Conventions

### Code Style

- Use TypeScript strict mode
- Use async/await over promises
- Use descriptive variable names
- Add JSDoc comments for public methods
- Follow NestJS naming conventions

### Module Structure

- One module per feature (products, orders, consumers)
- Export services for cross-module usage
- Keep controllers thin, logic in services
- Use dependency injection

### Data Generation

- Use Faker.js for mock data
- Initialize data in `onModuleInit` lifecycle hook
- Generate data volumes: 500 products, 100 consumers, 10,000 orders
- Keep all data in memory (no database)

### API Design

- RESTful endpoints
- Use proper HTTP methods (GET, POST, PUT, DELETE)
- Return appropriate status codes
- Use query parameters for filtering
- Include error handling with NotFoundException

### MCP Server Development

- Use @modelcontextprotocol/sdk for MCP servers
- Create tools for each API endpoint
- Include proper error handling
- Provide clear tool descriptions
- Use axios or fetch for HTTP requests

## Technology Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Package Manager**: yarn
- **Data Generation**: @faker-js/faker
- **MCP SDK**: @modelcontextprotocol/sdk
- **HTTP Client**: axios (preferred for MCP servers)

## File Naming

- Controllers: `*.controller.ts`
- Services: `*.service.ts`
- Modules: `*.module.ts`
- Interfaces: Define in service files or separate `*.interface.ts`
- MCP Servers: `mcp-server.ts` or `index.ts`

## Best Practices

1. **Always validate user input** - Use NestJS ValidationPipe
2. **Handle errors gracefully** - Use try/catch and proper error responses
3. **Keep functions small** - Single responsibility principle
4. **Use types everywhere** - Avoid `any` type
5. **Document complex logic** - Add comments for clarity
6. **Test your code** - Write unit tests for services

## MCP Tool Development

When creating MCP tools:

1. **Tool names** - Use descriptive kebab-case (e.g., `get-products`, `create-order`)
2. **Input schemas** - Define clear JSON schemas with required/optional fields
3. **Descriptions** - Explain what the tool does and when to use it
4. **Error handling** - Catch HTTP errors and return user-friendly messages
5. **Return format** - Return structured data, not raw HTML

## Example MCP Tool Structure

```typescript
{
  name: "get-products",
  description: "Retrieve all products or filter by category",
  inputSchema: {
    type: "object",
    properties: {
      category: {
        type: "string",
        description: "Filter products by category (optional)"
      }
    }
  }
}
```

## Remember

- 🚀 Use `yarn` for all package management
- 📦 Keep dependencies up to date
- 🧪 Test changes before committing
- 📝 Update documentation when adding features
- 🔧 Use ESLint and Prettier for code formatting
