/**
 * (C) 2023 Tekmonks. All rights reserved.
 */

const serverutils = require(`${CONSTANTS.LIBDIR}/utils.js`);
const httpClient = require(`${CONSTANTS.LIBDIR}/httpClient.js`);

const conf = require(`${TEKMONKS_COM_CONSTANTS.CONF_DIR}/config.json`);
const API_JWT_VALIDATION = `${conf.tekmonkslogin_backend}/apps/loginapp/validatejwt`;

exports.doService = async jsonReq => {
	if (!validateRequest(jsonReq)) {LOG.error("Validation failure."); return CONSTANTS.FALSE_RESULT;}
    
    if (jsonReq.op == "getotk") return _getOTK(jsonReq);
    else if (jsonReq.op == "verify") return await _verifyJWT(jsonReq);
    else return CONSTANTS.FALSE_RESULT;
}

exports.isValidLogin = headers => APIREGISTRY.getExtension("JWTTokenManager").checkToken(exports.getToken(headers));
exports.getID = headers => APIREGISTRY.getExtension("JWTTokenManager").getClaims(headers).id;
exports.getJWT = headers => APIREGISTRY.getExtension("JWTTokenManager").getToken(headers);
exports.getToken = headers => exports.getJWT(headers);

function _getOTK(_jsonReq) {
    return {...CONSTANTS.TRUE_RESULT, otk: serverutils.generateUUID(false)};
}

async function _verifyJWT(jsonReq) {
    let tokenValidationResult; try {
        tokenValidationResult = await httpClient.fetch(
            `${API_JWT_VALIDATION}?jwt=${jsonReq.jwt}${jsonReq.cmdline?"&noonce=true":""}`);
    } catch (err) {
        LOG.error(`Network error validating JWT token ${jsonReq.jwt}, validation failed.`);
        return CONSTANTS.FALSE_RESULT;
    }

	if (!tokenValidationResult.ok) {
        LOG.error(`Fetch error validating JWT token ${jsonReq.jwt}, validation failed.`);
        return CONSTANTS.FALSE_RESULT;
    }

    const responseJSON = await tokenValidationResult.json();
    if ((!responseJSON.result) || (responseJSON.jwt != jsonReq.jwt)) {
        LOG.error(`Validation error when validating JWT token ${jsonReq.jwt}.`);
        return CONSTANTS.FALSE_RESULT;
    }

    try {
        const _decodeBase64 = string => Buffer.from(string, "base64").toString("utf8");
        const jwtClaims = JSON.parse(_decodeBase64(jsonReq.jwt.split(".")[1]));
        return {...jwtClaims , ...CONSTANTS.TRUE_RESULT};
    } catch (err) {
        LOG.error(`Bad JWT token passwed for login ${jsonReq.jwt}, validation succeeded but decode failed.`);
        return CONSTANTS.FALSE_RESULT;
    }
}

const validateRequest = jsonReq => jsonReq && ((jsonReq.op=="verify" && jsonReq.jwt) || jsonReq.op=="getotk");