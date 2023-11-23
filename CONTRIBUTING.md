# Contributing

Welcome! We're glad you're interested in contributing to the project.

We welcome contributions of any kind; however, for **feature changes or additions**, please open an issue first for discussion.

## Getting Started

1. [Fork this repository](https://github.com/dotnize/chessu/fork) to your GitHub account. You can then clone the repository to your local machine and create a new branch for your changes.
   ```sh
   git clone https://github.com/[your-username]/chessu.git
   cd chessu
   git checkout -b my-feature-branch
   ```
2. Follow the [setup guide](./README.md#getting-started) from the README to install the necessary dependencies and run the development servers.
3. You may now make your changes and commit them to your branch.

When adding new dependencies or running other commands from the root directory, you can specify the workspace with the `--filter` flag before the command. For example, `pnpm --filter client lint` or `pnpm --filter server add express`.

### Formatting and linting

We use ESLint and Prettier to enforce code style and formatting. Please make sure to run `pnpm lint:fix` and `pnpm format` before committing your changes.

### Environment variables

You may create a `.env` file in each package directory to set their environment variables.

<details>
<summary>client</summary>

```env
NEXT_PUBLIC_API_URL=http://localhost:3001 # replace with backend URL
```

</details>

<details>
<summary>server</summary>

```env
CORS_ORIGIN=http://localhost:3000 # replace with frontend URL
PORT=3001
SESSION_SECRET=randomstring # replace for security

# PostgreSQL connection info (required)
PGHOST=db.example.com
PGUSER=exampleuser
PGPASSWORD=examplepassword
PGDATABASE=chessu
```

</details>

## Guidelines

- Follow the [Code of Conduct](CODE_OF_CONDUCT.md).
- Make sure your changes are thoroughly tested.
- Keep your commits atomic and descriptive.
- Ensure that your code is formatted and linted using `pnpm lint:fix` and `pnpm format`.
- Make your pull requests as descriptive as possible.
