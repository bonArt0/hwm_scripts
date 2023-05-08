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
    // Discovery doc URL for APIs used by the quickstart
    static DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    static SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

    static tokenClient;
    static gapiClient;
    static gapiInitialized = false;
    static gisInitialized = false;

    /**
     * @private
     *
     * Callback after api.js is loaded.
     */
    static _gapiLoaded(apiKey, discoveryDocs) {
        gapi.load('client', () => GapiWrapper._initializeGapiClient(apiKey, discoveryDocs));
    }

    /**
     * @private
     *
     * Callback after the API client is loaded. Loads the
     * discovery doc to initialize the API.
     */
    static _initializeGapiClient(apiKey, discoveryDocs) {
        const result = gapi.client.init({
            apiKey: apiKey,
            discoveryDocs: discoveryDocs,
        });
        GapiWrapper.gapiClient = gapi.client;

        if (!result || true) { // TODO: resolve 'Pe' value and check for apiKey error
            GapiWrapper.gapiInitialized = true;
            return;
        }

        throw new Error(result.Pe.error.message);
    }

    /**
     * Callback after Google Identity Services are loaded.
     */
    static _gisLoaded(clientId) {
        GapiWrapper.tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: GapiWrapper.SCOPES,
            callback: (resp) => console.debug(resp), // TODO: defined later
        });
        GapiWrapper.gisInitialized = true;
    }
}

class GapiControls
{
    static MODAL_OPEN_BUTTON_ICON = 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png';
    static GAPI_CONTENT_ID_CONFIG_NAME = 'gapi_client_id';
    static GAPI_API_KEY_CONFIG_NAME = 'gapi_api_key';

    static buildControlsModalSwitch(controlsModal) {
        const openModalButton = document.createElement('img');
        openModalButton.src = GapiControls.MODAL_OPEN_BUTTON_ICON;
        openModalButton.style.display = 'block';
        openModalButton.style.position = 'absolute';
        openModalButton.style.top = '114px';
        openModalButton.style.right = '125px';
        openModalButton.style.width = '25px';
        openModalButton.style.height = '25px';
        openModalButton.style.cursor = 'pointer';
        openModalButton.addEventListener('click', () => controlsModal.style.display = 'inline-block');

        return openModalButton;
    }

    static buildControlsModal() {
        const modal = document.createElement('div');
        const clientIdBox = GapiControls.buildTextboxLabel(
            'clientId',
            window.localStorage.getItem(GapiControls.GAPI_CONTENT_ID_CONFIG_NAME),
            'Client ID',
        );
        const apiKeyBox = GapiControls.buildTextboxLabel(
            'apiKey',
            window.localStorage.getItem(GapiControls.GAPI_API_KEY_CONFIG_NAME),
            'API Key',
        );
        const closeButton = GapiControls.buildCloseButton(
            function () {
                window.localStorage.setItem(GapiControls.GAPI_CONTENT_ID_CONFIG_NAME, clientIdBox.lastChild.value);
                window.localStorage.setItem(GapiControls.GAPI_API_KEY_CONFIG_NAME, apiKeyBox.lastChild.value);
                modal.style.display = 'none';
            }
        );

        modal.className = 'wbwhite';
        modal.style.display = 'none';
        modal.style.position = 'absolute';
        modal.style.top = '114px';
        modal.style.right = '50px';
        modal.style.width = '200px';
        modal.style.height = '105px';
        modal.style.zIndex = '9';
        modal.append(clientIdBox);
        modal.append(apiKeyBox);
        modal.append(closeButton);

        return modal;
    }

    /**
     * @param {string} name
     * @param {string} value
     * @param {string} innerHTML
     * @returns {HTMLLabelElement}
     */
    static buildTextboxLabel(name, value, innerHTML) {
        const textbox = document.createElement('input');
        textbox.type = 'password';
        textbox.autocomplete = 'off';
        textbox.value = value;
        textbox.name = name;
        textbox.style.display = 'block';

        const label = document.createElement('label');
        label.style.display = 'block';
        label.style.margin = '10px';
        label.append(innerHTML);
        label.append(textbox);

        return label;
    }

    static buildCloseButton(onClick) {
        const button = document.createElement('button');
        button.textContent = '☓';
        button.style.position = 'absolute';
        button.style.top = '5px';
        button.style.right = '5px';
        button.addEventListener('click', onClick);

        return button;
    }
}

const controlsModal = GapiControls.buildControlsModal();
const openModalButton = GapiControls.buildControlsModalSwitch(controlsModal);
document.body.append(controlsModal);
document.body.append(openModalButton);

const gapiClientId = window.localStorage.getItem('gapi_client_id');
const gapiApiKey = window.localStorage.getItem('gapi_api_key');
const discoveryDocs = [GapiWrapper.DISCOVERY_DOC];
if (!gapiClientId || !gapiApiKey) {
    throw new Error('GAPI credentials not set');
}

let script = document.createElement('script');
script.src = 'https://apis.google.com/js/api.js';
script.defer = true;
script.async = true;
script.addEventListener('load', ()  => GapiWrapper._gapiLoaded(gapiApiKey, discoveryDocs));
document.head.appendChild(script);

script = document.createElement('script');
script.src = 'https://accounts.google.com/gsi/client';
script.defer = true;
script.async = true;
script.addEventListener('load', () => GapiWrapper._gisLoaded(gapiClientId));
document.head.appendChild(script);
