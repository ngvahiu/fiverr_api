FROM node                           # Use basic node image

WORKDIR /usr/src/app                # Set working dir inside base docker image

COPY . .                            # Copy our project files to docker image

RUN npm install                     # Install project dependencies
RUN npx prisma generate             # Generate Prisma client files

RUN yarn build                      # Build our nestjs

EXPOSE 8080                         # Espose our app port for incoming requests

CMD ["npm", "run","start:prod"]     # Run our app