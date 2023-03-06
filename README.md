# chessu

> ❗ This is an old version of the project. For the latest version, see the [main](https://github.com/nizewn/chessu/tree/main) branch.

Online 2-player chess. Live demo at [ches.su](https://ches.su)

- React 18
- CSS Modules
- [react-chessboard](https://github.com/Clariity/react-chessboard)
- [chess.js](https://github.com/jhlywa/chess.js)
- Express.js
- socket.io
- PostgreSQL

## Development

This repository is used for production deployments. You will need to make changes to the configuration to get this running locally.

```sh
npm install # install all dependencies

npm run dev # concurrently run frontend and backend dev servers

npm run react-dev # run frontend server only
```

### Environment variables

Client: `APIURL` (or just change `apiUrl` in `/client/src/config/config.ts`)

Server: `PORT`, `SESSION_SECRET`, `PGUSER`, `PGPASSWORD`, `PGHOST`, `PGDATABASE`, `PGPORT`
(also see server cors config and session middleware for local development)
