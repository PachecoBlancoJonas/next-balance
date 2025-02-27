import pkg from "fs-extra";
const { existsSync, readJson, writeJson } = pkg;
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// get dirname on ESM (ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// token path
const tokensFilePath = join(__dirname, "../tokens.json");

// Read tokens.json
const readTokenFile = async () => {
    if (existsSync(tokensFilePath)) {
        return await readJson(tokensFilePath);
    }
    return null;
};

// Write tokens.json
const writeTokenFile = async (tokenData) => {
    const existingData = existsSync(tokensFilePath)
        ? await readJson(tokensFilePath)
        : {};

    // Combinar los datos existentes con los nuevos
    const updatedData = { ...existingData, ...tokenData };

    await writeJson(tokensFilePath, updatedData, { spaces: 2 });
};

export default { readTokenFile, writeTokenFile };
