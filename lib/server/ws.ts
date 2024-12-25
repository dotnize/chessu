import { defineEventHandler, defineWebSocket } from "vinxi/http";
import { parseJWT } from "./jwt";

// TODO is this a good idea?
const peerUserIds = new Map();

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

      // TODO ideally we should use some sort of context to store this,
      // instead of parsing the JWT every time
      const payload = await parseJWT(peer.request?.headers);
      console.log("payload", payload);

      // TODO like this?
      if (payload) {
        peerUserIds.set(peer.id, payload.userId);
      } else {
        peer.close();
      }

      peer.send("You have connected successfully!");
      peer.subscribe("test");
    },
    async message(peer, msg) {
      const message = msg.text();
      console.log(`msg from userid '${peerUserIds.get(peer.id)}': `, message);
      peer.publish("test", message);
      peer.send("Hello to you!");
    },
    async close(peer, details) {
      peer.publish("test", `User ${peer} has disconnected!`);
      console.log("close", peer.id, details.reason);

      // remove user id from map
      peerUserIds.delete(peer.id);
    },
    async error(peer, error) {
      console.log("error", peer.id, error);

      // does this hook also disconnect the peer? or will it also call `close`?
      // peerUserIds.delete(peer.id);
    },
  }),
});
