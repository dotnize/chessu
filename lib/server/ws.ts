import { defineEventHandler, defineWebSocket } from "@tanstack/start/server";
import { parseJWT } from "./jwt";

export default defineEventHandler({
  handler() {},
  websocket: defineWebSocket({
    async upgrade(req) {
      console.log("attempting upgrade...");
      const payload = await parseJWT(req.headers);

      if (!payload) {
        console.log("upgrade unauthorized.");
        // for some reason, adding a BodyInit causes an error on subsequent requests
        // return new Response("Unauthorized", { status: 401 });
        return new Response(null, { status: 401 });
      }

      console.log("proceeding with upgrade.");
    },
    async open(peer) {
      peer.publish("test", `User ${peer} has connected!`);

      const payload = await parseJWT(peer.request?.headers);
      if (!payload) {
        return peer.close();
      }

      console.log(payload);

      peer.send("You have connected successfully!");
      peer.subscribe("test");
    },
    async message(peer, msg) {
      const payload = await parseJWT(peer.request?.headers);
      if (!payload) {
        return peer.close();
      }

      const message = msg.text();
      console.log(`msg from userid '${payload.userId}': `, message);
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
