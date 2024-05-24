#Uporabimo base-image alpine za Node.js
FROM node:14-alpine

#Za delovni direktorij nastavimo /app/backend
WORKDIR /app/backend

#Kopiramo package.json in package-lock.json
COPY package*.json ./
#Naložimo odvisnosti(module)
RUN npm cache clean --force && npm install
#Kopiramo preostale datoteke
COPY . .

#Povemo na katerem portu aplikacija komunicira
EXPOSE 3001

#Zaženemo backend
CMD ["npm", "start"]