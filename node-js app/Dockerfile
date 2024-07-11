FROM node:20

RUN apt-get update && apt-get install -y ffmpeg

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

ENV PORT=3000
EXPOSE 3000

#CMD ["npm", "start"]
# Run ESLint to lint TypeScript files
CMD ["npx", "eslint", "src/**/*.js", "src/**/*.ts"]
