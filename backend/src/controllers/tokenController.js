const { readTokenFile, writeTokenFile } = require("../utils/fileUtils");
const {
  getNewAccessToken,
  refreshAccessToken,
} = require("../services/tokenService");
const moment = require("moment"); // Para trabajar con fechas fácilmente

// Check accessToken from tokens.json
const getAccessToken = async () => {
  const tokenData = await readTokenFile();

  if (!tokenData) {
    // Doesn't exists tokens.json
    const newToken = await getNewAccessToken();
    await writeTokenFile(newToken);
    return newToken;
  }

  // tokens.json exist
  const { accessExpiresAt, refreshToken, refreshExpiresAt } = tokenData;
  const accessExpiresDate = moment(accessExpiresAt);
  const refreshExpiresDate = moment(refreshExpiresAt);
  const now = moment();

  if (accessExpiresDate.isBefore(now)) {
    if (refreshExpiresDate.isBefore(now)) {
      // Access & refresh Tokens expires
      const newToken = await getNewAccessToken();
      await writeTokenFile(newToken);
      return newToken;
    } else {
      // Only accessToken expires
      const newToken = await refreshAccessToken(refreshToken);
      await writeTokenFile(newToken);
      return newToken;
    }
  } else {
    // Valid accessToken
    return tokenData;
  }
};

module.exports = { getAccessToken };
