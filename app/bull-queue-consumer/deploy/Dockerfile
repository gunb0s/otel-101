FROM node:20-bullseye

# Create app directory
WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
