<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

MCP with API - A comprehensive e-commerce analytics API built with NestJS, featuring:

- **Mock Data Generation**: 500 products, 100 consumers, 10,000 orders
- **Analytics & Predictions**: RFM analysis, customer behavior scoring, reorder predictions
- **AI-Powered Analysis**: Generate Python Jupyter notebooks for data analysis using AI
- **MCP Server**: Model Context Protocol integration for AI assistants
- **RESTful API**: Full CRUD operations and advanced filtering

## ✨ New Feature: AI-Powered Data Analysis

Generate Python Jupyter notebooks with AI-powered data analysis code!

**Quick Start:**

```bash
# 1. Install dependencies
yarn install

# 2. Setup environment variables
copy .env.example .env
# Edit .env and add your OpenRouter API key

# 3. Start the server
yarn start:dev

# 4. Generate analysis
curl -X POST http://localhost:3000/api/ai-analysis/generate -H "Content-Type: application/json" -d "{\"analysisType\": \"consumers\", \"description\": \"Analyze consumer spending patterns\"}"
```

📚 **Full Documentation**: See `AI_ANALYSIS_QUICKSTART.md` and `AI_ANALYSIS_DOCUMENTATION.md`

## Project setup

```bash
# 1. Install dependencies
$ yarn install

# 2. Setup environment (copy and edit .env file)
$ copy .env.example .env
# Add your OPENROUTER_API_KEY to the .env file
```

📖 **Environment Setup Guide**: See `ENVIRONMENT_SETUP.md` for detailed configuration

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## 📡 API Endpoints

### AI Analysis (NEW!)

- `POST /ai-analysis/generate` - Generate AI-powered analysis notebook
- `GET /ai-analysis/files` - List generated files
- `GET /ai-analysis/examples` - Get example requests

### Analytics & Predictions

- `GET /analytics/consumer-behavior/:id` - Get consumer behavior analysis
- `GET /analytics/predictions/all` - Get all reorder predictions
- `GET /analytics/predictions/summary` - Get prediction summary
- `GET /analytics/high-value-reorder-candidates` - Get high-value customers
- `GET /analytics/churn-risk-consumers` - Get at-risk customers

### Consumers

- `GET /consumers` - Get all consumers
- `GET /consumers/:id` - Get consumer by ID
- `GET /consumers/top/:limit` - Get top spending consumers
- `GET /consumers/:id/statistics` - Get consumer statistics
- `GET /consumers/:id/orders` - Get consumer's orders

### Orders

- `GET /orders` - Get all orders
- `GET /orders/:id` - Get order by ID
- `GET /orders/status/:status` - Filter by status
- `GET /orders/statistics` - Get order statistics

### Products

- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `GET /products/category/:category` - Filter by category

## 📚 Documentation

- **[AI Analysis Quick Start](AI_ANALYSIS_QUICKSTART.md)** - 5-minute setup guide
- **[AI Analysis Full Docs](AI_ANALYSIS_DOCUMENTATION.md)** - Complete documentation
- **[API Documentation](API_DOCUMENTATION.md)** - Full API reference
- **[Analytics Guide](ANALYTICS_DOCUMENTATION.md)** - Analytics features
- **[MCP Setup](MCP_SETUP_GUIDE.md)** - Model Context Protocol setup

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
