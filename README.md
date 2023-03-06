# chessu

> ❗ This project is still in the early stages of development and should be considered unstable. Expect bugs and weird behavior.

Yet another Chess web app. Live demo at [ches.su](https://ches.su).

- play against other users in real-time
- spectate and chat in ongoing games with other users
- ~~_optional_ user accounts for tracking stats and game history~~ (wip)
- mobile-friendly (wip)

Built with Next.js 13, Tailwind CSS + daisyUI, react-chessboard, chess.js, Express.js, socket.io and PostgreSQL.

## Configuration

This project is structured as a monorepo using npm workspaces, separated into three packages:

- `client` - Next.js application for the front-end, deployed to [ches.su](https://ches.su).
- `server` - Node/Express.js application for the back-end, deployed to [server.ches.su](https://server.ches.su).
- `types` - Shared type definitions for the client and server.

### Scripts

```sh
# install all dependencies, including eslint and prettier for development
npm install

# concurrently run frontend and backend development servers
npm run dev # -w client/server to run only one


# for separate production deployments
npm install -w client
npm install -w server

npm run build -w client
npm run build -w server

npm start -w client
npm start -w server
```

For separate deployments, you may exclude the `client` or `server` directory. However, you should include the `types` folder as it contains shared type definitions that are required by both packages.

### Environment variables

You may create a `.env` file in each package directory to set their environment variables.

client:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001 # replace with backend URL
```

server:

```env
CORS_ORIGIN=http://localhost:3000 # replace with frontend URL
PORT=3001
SESSION_SECRET=randomstring # replace for security

# PostgreSQL connection info
PGHOST=db.example.com
PGUSER=exampleuser
PGPASSWORD=examplepassword
PGDATABASE=chessu

# or use a connection string instead
DATABASE_URL=postgres://...
```
