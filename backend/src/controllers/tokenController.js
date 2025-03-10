import fileUtils from "../utils/fileUtils.js";
const { readTokenFile, writeTokenFile } = fileUtils;
import tokenService from "../services/tokenService.js";

const { getNewAccessToken, refreshAccessToken } = tokenService;
import moment from "moment";

const getAccessToken = async () => {
    const tokenData = await readTokenFile();

    if (!tokenData) {
        const newToken = await getNewAccessToken();
        await writeTokenFile(newToken);
        return newToken;
    }

    const { accessExpiresAt, refreshToken, refreshExpiresAt } = tokenData;
    const accessExpiresDate = moment(accessExpiresAt);
    const refreshExpiresDate = moment(refreshExpiresAt);
    const now = moment();

    if (accessExpiresDate.isBefore(now)) {
        if (refreshExpiresDate.isBefore(now)) {
            const newToken = await getNewAccessToken();
            await writeTokenFile(newToken);
            return newToken;
        } else {
            const newToken = await refreshAccessToken(refreshToken);
            await writeTokenFile(newToken);
            return newToken;
        }
    } else {
        return tokenData;
    }
};

export default { getAccessToken };
