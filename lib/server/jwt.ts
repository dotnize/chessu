import { type JWTPayload, SignJWT, jwtVerify } from "jose";

const encodedKey = new TextEncoder().encode(process.env.JWT_SECRET);

interface Payload extends JWTPayload {
  userId: string;
}

export async function encrypt(payload: Payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify<Payload>(session, encodedKey, {
      algorithms: ["HS256"],
    });

    return payload;
  } catch (error) {
    console.log("Failed to verify session: ", error);
  }
}

export async function parseJWT(headers: Headers | undefined) {
  const jwt = headers
    ?.get("cookie")
    ?.split("; ")
    .find((c) => c.startsWith("access_token"))
    ?.split("=")[1];

  if (!jwt) {
    return;
  }

  const payload = await decrypt(jwt);
  return payload;
}
