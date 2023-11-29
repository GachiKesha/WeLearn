FROM node:14.17
WORKDIR /workspace/Frontend_WeLearn
COPY package*.json ./
RUN npm install
WORKDIR /workspace/WeLearn_Back
COPY WeLearn_Back/requirements.txt ./
RUN pip install -r requirements.txt

