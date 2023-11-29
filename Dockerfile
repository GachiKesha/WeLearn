# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /workspace/frontend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN yarn install

# Bundle app source
COPY . .

# Expose port 3000
EXPOSE 3000

# Define environment variable
ENV NODE_ENV=development

# Run the application
CMD ["yarn", "start"]
