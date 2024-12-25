import { defineEventHandler, defineWebSocket } from "vinxi/http";

export default defineEventHandler({
  handler() {},
  websocket: defineWebSocket({
    async upgrade(req) {
      console.log("upgrading");
      // // TODO: remove, not ideal. see below for JWT solution
      // const { user } = await getWebSocketSession(req);

      // console.log(user)

      // // deny unauthorized connections
      // if (!user) {
      //   console.log("cancelling");
      //   // for some reason, adding a BodyInit causes an error on subsequent requests
      //   // return new Response("Unauthorized", { status: 401 });

      //   return new Response(null, { status: 401 });
      // }

      console.log("proceeding with upgrade");

      /* 

        A short-lived JWT is probably the best option here
        since we don't need to hit the database.

        Let the frontend request a JWT from an API route, which uses Lucia's user info to generate a JWT.
        The frontend can then use this JWT to connect to the WebSocket server.
      */
    },
    async open(peer) {
      peer.publish("test", `User ${peer} has connected!`);
      console.log("open", peer.id);
      console.log(!!peer.request);
      peer.send("You have connected successfully!");
      peer.subscribe("test");
    },
    async message(peer, msg) {
      const message = msg.text();
      console.log("msg", peer.id, message);
      peer.publish("test", message);
      peer.send("Hello to you!");
    },
    async close(peer, details) {
      peer.publish("test", `User ${peer} has disconnected!`);
      console.log("close", peer.id, details.reason);
    },
    async error(peer, error) {
      console.log("error", peer.id, error);
    },
  }),
});
