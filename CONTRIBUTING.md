# Contributing

Welcome! We're glad you're interested in contributing to the project.

We welcome contributions of any kind; however, for **feature changes or additions**, please open an issue first for discussion.

## Getting Started

To get started, [fork this repository](https://github.com/nizewn/chessu/fork) to your GitHub account. You can then clone the repository to your local machine and create a new branch for your changes.

```sh
git clone https://github.com/[your-username]/chessu.git
cd chessu
git checkout -b my-feature-branch
```

## Development

> Node.js 18 or newer is recommended.

This project is structured as a monorepo using npm workspaces, separated into three packages:

- `client` - Next.js application for the front-end, deployed to [ches.su](https://ches.su) via Vercel.
- `server` - Node/Express.js application for the back-end, deployed to [server.ches.su](https://server.ches.su) via Railway.
- `types` - Shared type definitions required by the client and server.

### Running the project

1. Install the necessary dependencies by running `npm install` in the root directory of the project.
2. In the `server` directory, create a `.env` file for your PostgreSQL database. You can try [ElephantSQL](https://www.elephantsql.com/) or [Aiven](https://aiven.io/postgresql) for a free hosted database.
   ```env
   PGHOST=db.example.com
   PGUSER=exampleuser
   PGPASSWORD=examplepassword
   PGDATABASE=chessu
   ```
3. Run the development servers with `npm run dev`.
   - To run the frontend and backend servers separately, use `npm run dev -w client` and `npm run dev -w server`, respectively.
4. You can access the frontend at http://localhost:3000 and the backend at http://localhost:3001.
5. You may now make your changes and commit them to your branch.

When adding new dependencies or running other commands from the root directory, you can specify the workspace with the `-w` flag. For example, `npm run build -w client` or `npm install express -w server`.

### Formatting and linting

We use ESLint and Prettier to enforce code style and formatting. Please make sure to run `npm run lint-fix` and `npm run format` before committing your changes.

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
- Ensure that your code is formatted and linted using `npm run lint-fix` and `npm run format`.
- Make your pull requests as descriptive as possible.
