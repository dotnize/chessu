FROM node:lts-alpine3.20

ENV PNPM_HOME=/usr/local/bin

WORKDIR /opt/chessu/

COPY . .

RUN apk update && \
    corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm config set store-dir /opt/chessu/.pnpm-store && \
    pnpm install -g pnpm@latest && \
    pnpm install --unsafe-perm

ENTRYPOINT ["pnpm"]

CMD ["start"]
