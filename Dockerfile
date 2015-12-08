FROM node:4

RUN git clone https://github.com/Live4Code/Employee-Directory.git /app
WORKDIR /app
RUN npm install

RUN apt-get update \
&& apt-get install -yqq python python-pip python-setuptools \
&& pip install pydns

ENV MONGO_SERVICE_NAME=mongo
ADD start.sh start.sh
ADD rancher.py rancher.py
RUN chmod a+x start.sh

EXPOSE 3000

ENTRYPOINT ["./start.sh"]
