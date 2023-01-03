# chessu

Online 2-player chess. Live demo at [ches.su](https://ches.su)

- React 18
- CSS Modules
- [react-chessboard](https://github.com/Clariity/react-chessboard)
- [chess.js](https://github.com/jhlywa/chess.js)
- Express.js
- socket.io
- PostgreSQL

## Development

Root directory

```sh
npm install # install all dependencies

npm run dev # concurrently run frontend and backend test servers

npm run build # build frontend and backend for production (see dist/ folders)

npm run react-dev # run frontend server only
```

### Environment variables

Client: `APIURL`

Server: `SESSION_SECRET`, `PGUSER`, `PGPASSWORD`, `PGHOST`, `PGDATABASE`, `PGPORT`

## To-do (move this to issues):

- [] real-time games with chat & observer support
- [] user authentication with oauth2 support (optional)
- [] RESTful API for non-real-time games like daily chess
