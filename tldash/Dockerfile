# Dev container
FROM node:18-alpine

WORKDIR /app

COPY package.json ./

RUN echo '#!/bin/sh' > start.sh && \
    echo 'if [ ! -d "node_modules" ]; then' >> start.sh && \
    echo ' npm install;' >> start.sh && \
    echo 'fi' >> start.sh && \
    echo 'npm run dev' >> start.sh && \
    chmod +x start.sh

COPY . .

CMD ["./start.sh"]
