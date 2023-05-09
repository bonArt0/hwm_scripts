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
 * @type {GapiWrapper} _GapiWrapperInstance
 * @private
 */
let _GapiWrapperInstance;

class GapiCredentialsNotSetError extends Error {
    constructor() {
        super();

        this.message = 'GoogleAPI credentials not set';
    }
}

class AlreadyInitializedError extends Error {
    constructor() {
        super();

        this.message = 'GoogleAPI Wrapper already initialized';
    }
}

/**
 * @see https://developers.google.com/sheets/api/quickstart/js?hl=ru
 */
class GapiWrapper
{
    /** Discovery doc URL for APIs used by the quickstart */
    static DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

    /** Authorization scopes required by the API; multiple scopes can be included, separated by spaces. */
    static SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

    /**
     * @type {boolean}
     * @private
     */
    _initialized = false;

    /** @var {object} tokenClient */
    tokenClient;

    /** @var {object} gapiClient */
    gapiClient;

    /**
     * @return {GapiWrapper}
     */
    static init() {
        if (!_GapiWrapperInstance || !_GapiWrapperInstance?._initialized) {
            console.info('GoogleAPI Wrapper initialization started');

            GapiControls.init();

            const gapiApiKey = window.localStorage.getItem('gapi_api_key');
            const gapiClientId = window.localStorage.getItem('gapi_client_id');
            if (!gapiApiKey || !gapiClientId) {
                throw new GapiCredentialsNotSetError();
            }

            try {
                _GapiWrapperInstance = new GapiWrapper(gapiApiKey, gapiClientId);
            } catch (e) {
                if (e instanceof AlreadyInitializedError) {
                    console.info(e.message);
                    return _GapiWrapperInstance;
                }

                console.error('Something happen while GoogleAPI Wrapper initializing', e.context);
                throw e;
            }

            console.info('GoogleAPI Wrapper initialized');
        }

        return _GapiWrapperInstance;
    }

    constructor(apiKey, clientId, scope) {
        let script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.defer = true;
        script.async = true;
        script.addEventListener('load', () => {
            this._gapiLoaded(apiKey);
        });
        document.head.appendChild(script);

        script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.defer = true;
        script.async = true;
        script.addEventListener('load', () => {
            this.tokenClient = this._gisLoaded(clientId, scope);
        });
        document.head.appendChild(script);
    }

    /**
     * @private
     *
     * @param {string} apiKey
     * @param {string[]} discoveryDocs
     *
     * Callback after api.js is loaded.
     */
    _gapiLoaded(apiKey, discoveryDocs = [GapiWrapper.DISCOVERY_DOC]) {
        gapi.load('client', () => {
            const result = gapi.client.init({
                apiKey: apiKey,
                discoveryDocs: discoveryDocs,
            });

            if (!result || true) { // TODO: resolve 'Pe' value and check for apiKey error
                this.gapiClient = gapi.client;
                return;
            }

            throw new Error(result.Pe.error.message);
        });
    }

    /**
     @private

     @param {string} clientId
     @param {string} scope
     @return {object}

     * Callback after Google Identity Services are loaded.
     */
    _gisLoaded(clientId, scope = GapiWrapper.SCOPE) {
        return  google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: scope,
            callback: (resp) => console.debug(resp), // TODO: defined later
        });
    }
}

class GapiControls
{
    static MODAL_OPEN_BUTTON_ICON = 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png';
    static GAPI_CONTENT_ID_CONFIG_NAME = 'gapi_client_id';
    static GAPI_API_KEY_CONFIG_NAME = 'gapi_api_key';

    /**
     * @type {boolean}
     * @private
     */
    static _initialized = false;

    static init() {
        if (!GapiControls._initialized) {
            const controlsModal = GapiControls.buildControlsModal();
            const openModalButton = GapiControls.buildControlsModalSwitch(controlsModal);
            document.body.append(controlsModal);
            document.body.append(openModalButton);
        }
    }

    static buildControlsModalSwitch(controlsModal) {
        const openModalButton = document.createElement('img');
        openModalButton.className = 'gapi_controls_button';
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

        modal.className = 'gapi_controls_modal wbwhite';
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

GapiWrapper.init();
