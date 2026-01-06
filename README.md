# Elysia with Bun runtime

## Getting Started

To get started with this template, simply paste this command into your terminal:

```bash
bun create elysia ./elysia-example
```

## Development

Add the `.env` file to the root of the project.

You can view the API documentation at https://count.meorion.moe/docs/api.html#environment-variables

```env
# App Configuration
APP_NAME=CountElysia
APP_PORT=3000

# Bun Interpreter
BUN_BIN=

# Database Configuration
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=
DB_NAME=

# Rate Limit Configuration
GET_RATE_LIMIT_MAX=10
POST_RATE_LIMIT_MAX=1
GET_RATE_LIMIT_DURATION=60000
POST_RATE_LIMIT_DURATION=60000
```

To start the development server run:

```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.
