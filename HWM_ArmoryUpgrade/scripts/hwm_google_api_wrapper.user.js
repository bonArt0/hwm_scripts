// ==UserScript==
// @name          hwm_google_api_wrapper
// @namespace     https://github.com/bonArt0/hwm_scripts
// @version       0.0.1
// @description   Обёртка gapi с интерфейсом для HWM
// @author        bonArt
// @license       GPL-3.0-only
// @icon          https://cdn-icons-png.flaticon.com/512/2991/2991148.png
// @match         https://*.heroeswm.ru/*
// @match         https://178.248.235.15/*
// @match         https://www.lordswm.com/*
// @match         https://my.lordswm.com/*
// @run-at        document-body
// @supportURL    https://www.heroeswm.ru/sms-create.php?mailto_id=117282
// ==/UserScript==

/**
 * @see https://developers.google.com/sheets/api/quickstart/js?hl=ru
 */
class GapiWrapper
{
    static CLIENT_ID = 'X-files';
    static API_KEY = 'X-files';

    // Discovery doc URL for APIs used by the quickstart
    static DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    static SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

    static tokenClient;
    static gapiInitialized = false;
    static gisInitialized = false;

    /**
     * Callback after api.js is loaded.
     */
    static _gapiLoaded() {
        gapi.load('client', GapiWrapper._initializeGapiClient);
    }

    /**
     * Callback after the API client is loaded. Loads the
     * discovery doc to initialize the API.
     */
    static _initializeGapiClient() {
        gapi.client.init({
            apiKey: GapiWrapper.API_KEY,
            discoveryDocs: [GapiWrapper.DISCOVERY_DOC],
        });
        GapiWrapper.gapiInitialized = true;
    }

    /**
     * Callback after Google Identity Services are loaded.
     */
    static _gisLoaded() {
        GapiWrapper.tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: GapiWrapper.CLIENT_ID,
            scope: GapiWrapper.SCOPES,
            callback: (resp) => console.debug(resp), // defined later
        });
        GapiWrapper.gisInitialized = true;
    }
}

const openModalButton = document.createElement('img');
openModalButton.src = 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png';
openModalButton.style.display = 'block';
openModalButton.style.position = 'absolute';
openModalButton.style.top = '50px';
openModalButton.style.right = '50px';
openModalButton.style.width = '50px';
openModalButton.style.height = '50px';
openModalButton.cursor = 'pointer';
document.body.append(openModalButton);

class GapiControls
{

}

let script = document.createElement('script');
script.src = 'https://apis.google.com/js/api.js';
script.defer = true;
script.async = true;
script.addEventListener('load', GapiWrapper._gapiLoaded);
document.head.appendChild(script);

script = document.createElement('script');
script.src = 'https://accounts.google.com/gsi/client';
script.defer = true;
script.async = true;
script.addEventListener('load', GapiWrapper._gisLoaded);
document.head.appendChild(script);
