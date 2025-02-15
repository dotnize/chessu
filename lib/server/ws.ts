import { defineEventHandler, defineWebSocket } from "@tanstack/start/server";
import { auth } from "./auth";

export default defineEventHandler({
  handler() {},
  websocket: defineWebSocket({
    async upgrade(req) {
      console.log("attempting upgrade...");

      const session = await auth.api.getSession({ headers: req.headers });

      if (!session) {
        console.log("upgrade unauthorized.");
        // for some reason, adding a BodyInit causes an error on subsequent requests
        // return new Response("Unauthorized", { status: 401 });
        return new Response(null, { status: 401 });
      }

      console.log("proceeding with upgrade.");
      console.log(typeof req.context);

      req.context.user = {
        id: session.user.id,
        email: session.user.email,
        username: session.user.username,
        name: session.user.name,
      };
    },
    async open(peer) {
      peer.publish("test", `User ${peer} has connected!`);

      console.log("-------- context");
      console.log(typeof peer.context);
      console.log(peer.context);

      peer.send("You have connected successfully!");
      peer.subscribe("test");
    },
    async message(peer, msg) {
      console.log("-------- context");
      console.log(typeof peer.context);
      console.log(peer.context);

      const message = msg.text();
      console.log(`msg from userid '${peer.context.userId}': `, message);
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
