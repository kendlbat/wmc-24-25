import os from "os";
import * as msal from "@azure/msal-node";
import "dotenv/config";

// Use the following code
// https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/request.md#client-credentials-flow

const config = {
    auth: {
        clientId: process.env.CLIENT_ID,
        authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}/`,
        clientSecret: process.env.CLIENT_SECRET,
    },
};

const cca = new msal.ConfidentialClientApplication(config);

const clientCredentialRequest = {
    scopes: [`${config.auth.clientId}/.default`],
};

async function getMsalToken() {
    const token = await cca.acquireTokenByClientCredential(
        clientCredentialRequest
    );
    console.log("Got token", token.accessToken);
    return token;
}

async function measureAndReport() {
    let timeStamp = Date.now();
    let [avgLoadOneMin] = os.loadavg();
    let totalMemInMiB = Math.round(os.totalmem() / (1024 * 1024));
    let freeMemInMiB = Math.round(os.freemem() / (1024 * 1024));

    console.log(
        `Sending monitoring data ${timeStamp} - ${avgLoadOneMin} - ${totalMemInMiB} MiB - ${freeMemInMiB} MiB`
    );

    try {
        let response = await fetch("http://localhost:8080/api/metrics", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${(await getMsalToken()).accessToken}`,
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                timeStamp,
                avgLoadOneMin,
                totalMemInMiB,
                freeMemInMiB,
            }),
        });
        console.log(`Got response code ${response.status} from server`);
    } catch (err) {
        console.log(`Error sending monitoring data ${err?.cause?.code}`);
    }
}

setInterval(measureAndReport, 5000);
measureAndReport();
