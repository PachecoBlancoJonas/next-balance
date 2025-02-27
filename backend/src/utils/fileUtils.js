const fs = require("fs-extra");
const path = require("path");

// Ruta del archivo tokens.json
const tokensFilePath = path.join(__dirname, "../tokens.json");

// Leer el archivo tokens.json
const readTokenFile = async () => {
  if (fs.existsSync(tokensFilePath)) {
    return await fs.readJson(tokensFilePath);
  }
  return null;
};

// Escribir en el archivo tokens.json
const writeTokenFile = async (tokenData) => {
  const existingData = fs.existsSync(tokensFilePath)
    ? await fs.readJson(tokensFilePath)
    : {};

  // Combinar los datos existentes con los nuevos
  const updatedData = { ...existingData, ...tokenData };

  await fs.writeJson(tokensFilePath, updatedData, { spaces: 2 });
};

module.exports = { readTokenFile, writeTokenFile };
