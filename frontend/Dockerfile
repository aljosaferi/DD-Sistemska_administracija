#Uporabimo base-image alpine za Node.js
FROM node:alpine

#Za delovni direktorij nastavimo /app/backend
WORKDIR /app

#Kopiramo package.json in package-lock.json
COPY package*.json .
#Naložimo odvisnosti(module)
RUN npm install
#Kopiramo preostale datoteke
COPY . .

#Povemo na katerem portu aplikacija komunicira
EXPOSE 3000

#Zaženemo backend
CMD ["npm", "start"]