<h1 align="center">
  <img src="./assets/chessu.png" alt="chessu" height="128" />
</h1>
<p align="center">
  <a href="https://ches.su">
    <img src="https://img.shields.io/github/deployments/nizewn/chessu/Production?label=deployment&style=for-the-badge" alt="ches.su" />
  </a>
  <img src="https://img.shields.io/github/license/nizewn/chessu?color=blue&style=for-the-badge" alt="MIT Licensed" />
  <img src="https://img.shields.io/github/last-commit/nizewn/chessu?style=for-the-badge" alt="Last commit" />
</p>

> This project is still in the early stages of development. Expect bugs and incomplete features.

Yet another Chess web app. Live demo at [ches.su](https://ches.su).

- play against other users in real-time
- spectate and chat in ongoing games with other users
- _optional_ user accounts for tracking stats and game history
- ~~play solo against Stockfish~~ (wip)
- mobile-friendly
- ... and more ([view roadmap](https://github.com/users/nizewn/projects/2))

Built with Next.js 13, Tailwind CSS + daisyUI, react-chessboard, chess.js, Express.js, socket.io and PostgreSQL.

## Configuration

> Node.js 18 or newer is recommended.

This project is structured as a monorepo using npm workspaces, separated into three packages:

- `client` - Next.js application for the front-end, deployed to [ches.su](https://ches.su) via Vercel.
- `server` - Node/Express.js application for the back-end, deployed to [server.ches.su](https://server.ches.su) via Railway.
- `types` - Shared type definitions for the client and server.

For separate deployments, you may exclude the `client` or `server` directory. However, you should include the `types` folder as it contains shared type definitions that are required by both packages.

### Environment variables

client:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001 # replace with backend URL
```

server:

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

You may also create a `.env` file in each package directory to set their environment variables.

### Scripts

For development:

```sh
# install all dependencies, including eslint and prettier
npm install

# concurrently run frontend and backend development servers
npm run dev

# or run them separately
npm run dev -w client
npm run dev -w server
```

For production:

```sh
# for separate deployments
npm install -w client
npm install -w server

npm run build -w client
npm run build -w server

npm start -w client
npm start -w server
```

## Contributing

Pull requests are welcome. For feature changes or suggestions, please open an issue first for discussion.
