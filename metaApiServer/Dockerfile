# Usa una imagen base oficial de Node.js
FROM node:16

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el código fuente de la aplicación
COPY . .

# Define el comando de inicio de la aplicación
CMD ["npm", "start"]