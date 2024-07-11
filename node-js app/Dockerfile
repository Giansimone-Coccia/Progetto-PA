# Use the official Node.js 20 image as the base image
FROM node:20

# Update the package lists and install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Set the working directory inside the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies specified in package.json
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application (assuming there's a build script in package.json)
RUN npm run build

# Set the environment variable PORT to 3000
ENV PORT=3000

# Expose port 3000 to the host
EXPOSE 3000

# Start the application using npm
CMD ["npm", "start"]
