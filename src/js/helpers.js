import { async } from "regenerator-runtime";
import { TIMEOUT_SEC } from "./config.js";

export const AJAX = async function(url, uploadData = undefined) {
    try {
        const settings = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(uploadData),
        }

        const fetchPro = uploadData ? fetch(url, settings) : fetch(url);

        const res = await Promise.race([
            fetchPro,
            timeout(TIMEOUT_SEC)
        ]);

        const data = await res.json();
        
        if (!res.ok) throw new Error(`\nError message: ${data.message} \nStatus: ${res.status}`);

        return data;
    } catch(err) {
        throw err;
    }
}

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};