// Utils.js
'use strict';
import MersenneTwister from 'mersenne-twister';
import NodeCrypto from 'crypto-browserify';

const mersenneTwister = new MersenneTwister();
export const random = () => mersenneTwister.random_long();

const DEFAULT_CIPHER_SALT = '54883155';

export const encryptString = ({ string, salt = DEFAULT_CIPHER_SALT}) => {
    const cipher = NodeCrypto.createCipher('aes192', salt);
    let encrypted = cipher.update(string, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export const decryptString = ({ string, salt = DEFAULT_CIPHER_SALT }) => {
    let result = undefined;
    try {
        const decipher = NodeCrypto.createDecipher('aes192', salt);
        let decrypted = decipher.update(string, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        result = decrypted;
    } catch(e) { }
    return result;
}

export const isCookieEnabled = () => {
    let cookieEnabled = navigator.cookieEnabled;
    if(!cookieEnabled) { 
        document.cookie = 'testcookie';
        cookieEnabled = -1 != document.cookie.indexOf('testcookie');
    }
    return cookieEnabled;
}

export const saveCookieByName = ({ name, data, expireDate, domain }) => {
    var dataString = JSON.stringify(data);
    var cookie = name + '=' + encryptString({string: dataString});
    if(expireDate) { cookie += "; expires=" + expireDate.toGMTString(); }
    if(domain) { cookie += "; domain=" + domain; }
    document.cookie = cookie;
}

export const getCookieByName = ({ name }) => {
	let cookieValue = null;
	if(document.cookie && document.cookie != '') {
        const cookies = document.cookie.split(';').map(cookie => cookie.trim());
        cookies.forEach(cookie => {
			// Does this cookie string begin with the name we want?
			if(cookie.substring(0, name.length + 1) == (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
			}
        });
	}
	return JSON.parse(decryptString({string: cookieValue}) || null);
}

export const newUuid = () => {
    var regexp = new RegExp('[xy]', 'g');
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(regexp, function(c) {
        var r = random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

export const getUrlSearches = () => {
    const result = {};
    const searches = window.location.search.slice(1).split('&').filter(search => search);
    searches.forEach(search => {
        const pair = search.split('=');
        result[pair[0]] = pair[1];
    });
    return result;
}

export const makeSearchString = (search) => {
    const searchKeys = Object.keys(search);
    if(0 === searchKeys.length) { return ''; }
    return searchKeys.map(key => `${key}=${search[key]}`).join('&');
}

export const trimObject = object => {
    const result = {};
    Object.keys(object).forEach(objectKey => {
        if(object[objectKey]) { result[objectKey] = object[objectKey]; }
    });
    return result;
};
