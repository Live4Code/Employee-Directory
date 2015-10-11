FROM node:4

RUN git clone https://github.com/Live4Code/Employee-Directory.git /app
WORKDIR /app
RUN npm install

EXPOSE 3000

ENTRYPOINT ["node","--harmony","index.js"]
