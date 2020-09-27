import config from "../config/app";
import fetch from 'node-fetch';

const checkRecaptcha = async (token) => {
    const secret = config.recaptchaSecretKey;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;
    const response = await fetch(url, {
        method: 'post'
    });
    const json = await response.json();
    return json;
}
export default { checkRecaptcha };

