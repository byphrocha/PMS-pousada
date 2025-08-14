##############################################
# Stage 1 – Build (instala dependências dev) #
##############################################
FROM node:18-alpine AS build

# Diretório de trabalho
WORKDIR /app

# Copia apenas package.json e package-lock.json
COPY package*.json ./

# Instala dependências (inclui dev)
RUN npm ci

# Copia o restante do código
COPY . .

# Caso já use TypeScript, descomente:
# RUN npm run build

##############################################
# Stage 2 – Runtime (imagem enxuta)          #
##############################################
FROM node:18-alpine

WORKDIR /app
ENV NODE_ENV=production

# Copia tudo do estágio de build
COPY --from=build /app /app

# Instala somente dependências de produção
RUN npm ci --omit=dev

EXPOSE 3000
CMD ["node", "server.js"]   # ajuste p/ dist/server.js se usar TS
