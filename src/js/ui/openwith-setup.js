import store, { subscribe, dispatch } from '../state/store';

const openWithHolder = document.getElementById('openWithHolder');

const tpl = function(user) {
    return ` <div class="dropdown">
    <button class="btn dropdown__toggler" id="openWithButton" disabled title="Preview Blnq" aria-label="Preview Blnq">
        <svg
            width="12"
            height="12"
            viewBox="0 0 20 18"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill="currentcolor"
                d="M18 16H2V2h9V0H2a2 2 0 00-2 2v14a2 2 0 002 2h16c1.1 0 2-.9 2-2V9h-2v7zM13 0v2h3.59l-5.83 5.83 1.41 1.41L18 3.41V7h2V0h-7z"
                fill="#000"
                fill-rule="nonzero"
            />
        </svg>
        <span class="inner">Preview</span>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
        >
            <path
                fill="currentcolor"
                d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"
            />
        </svg>
    </button>
    <div
        class="dropdown__body"
        style="right:10px;min-width:150px;"
    >
        <button
            class="btn"
            id="openWithBrowser"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
            >
                <path
                    fill="currentcolor"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
                />
            </svg>

            <div class="btn__title">
                Preview in Browser
            </div>
            <span class="stale badge">Stale</span>
        </button>
        <button class="btn" id="openWithOpenFin">
            <svg
                width="24"
                height="24"
                viewBox="0 0 28 28"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill="currentcolor"
                    d="M25.93 10.432a4.575 4.575 0 00-.525-.452l-.069-.048c-.04-.027-.078-.056-.118-.082-.04-.027-.087-.055-.13-.082l-.06-.037a4.128 4.128 0 00-.164-.092l-.032-.017a4.539 4.539 0 00-2.105-.52 4.549 4.549 0 01-4.545-4.553 4.54 4.54 0 10-4.548 4.532 4.549 4.549 0 11-.008 9.098 4.54 4.54 0 01-4.544-4.545 4.54 4.54 0 10-4.54 4.54 4.54 4.54 0 014.54 4.541 4.55 4.55 0 009.098 0 4.54 4.54 0 014.54-4.54c.811 0 1.607-.216 2.306-.628l.183-.112.013-.008c.055-.036.11-.075.163-.113l.023-.017c.048-.034.092-.072.142-.11l.04-.03c.044-.036.086-.074.13-.111l.046-.04c.055-.05.109-.101.162-.154l.008-.008a4.56 4.56 0 00.63-.79 4.54 4.54 0 00-.635-5.622z"
                    fill-rule="nonzero"
                />
            </svg>
            <div class="btn__title">
                Preview in OpenFin
            </div>
            <span class="stale badge">Stale</span>
        </button>
    </div>
</div>`;
};

const tplSingle = function(user) {
    return ` <div class="dropdown">
    <button class="btn" id="openWithButton" disabled title="Open Blnq" aria-label="Open Blnq">
        <svg
            width="12"
            height="12"
            viewBox="0 0 20 18"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill="currentcolor"
                d="M18 16H2V2h9V0H2a2 2 0 00-2 2v14a2 2 0 002 2h16c1.1 0 2-.9 2-2V9h-2v7zM13 0v2h3.59l-5.83 5.83 1.41 1.41L18 3.41V7h2V0h-7z"
                fill="#000"
                fill-rule="nonzero"
            />
        </svg>
        <span class="inner hide-mobile">Preview</span>
    </button>
</div>`;
};

const openWithSetup = () => {
    if (document.querySelector('#pref-OpenFin').checked) {
        const frag = document.createRange().createContextualFragment(tpl());
        openWithHolder.innerHTML = '';
        const dropdown = openWithHolder.appendChild(frag.firstElementChild);

        const openWithButton = dropdown.querySelector('#openWithButton');
        const openWithBrowser = dropdown.querySelector('#openWithBrowser');
        const openWithOpenFin = dropdown.querySelector('#openWithOpenFin');

        openWithBrowser.addEventListener('click', function() {
            if (typeof fin !== 'undefined') {
                var url = `${window.location.protocol}//${
                    window.location.host
                }/v/${openWithButton.getAttribute('href')}`;
                fin.System.openUrlWithBrowser(url);
            } else {
                var url = '/v/' + openWithButton.getAttribute('href');
                window.open(url);
            }
            [...document.querySelectorAll('.dropdown.open')].forEach(dd =>
                dd.classList.remove('open')
            );
        });

        openWithOpenFin.addEventListener('click', function() {
            var url = openWithButton.getAttribute('href');
            var finProtocol = 'fins:';
            if (window.location.protocol === 'http:') {
                finProtocol = 'fin:';
            }
            var oldIframe = document.querySelector('#finsLauncher');
            if (oldIframe) {
                oldIframe.remove();
            }
            var iframe = document.createElement('iframe');
            iframe.id = 'finsLauncher';
            iframe.classList.add('finsLauncher');
            var finsURL = `${finProtocol}//${window.location.host}/f/${url}.openfin`;
            iframe.src = finsURL;
            document.querySelector('body').append(iframe);
            [...document.querySelectorAll('.dropdown.open')].forEach(dd =>
                dd.classList.remove('open')
            );
        });

        dropdown
            .querySelector('.dropdown__toggler')
            .addEventListener('click', e => {
                const current = e.currentTarget.parentNode;
                current.classList.toggle('open');
                document.body.addEventListener('click', e => {
                    if (!current.contains(e.target)) {
                        current.classList.remove('open');
                    }
                });
            });
        if (store.state.blnqName !== '') {
            openWithButton.setAttribute('href', store.state.blnqName);
            openWithButton.removeAttribute('disabled');
        }
    } else {
        const frag = document
            .createRange()
            .createContextualFragment(tplSingle());
        openWithHolder.innerHTML = '';
        const dropdown = openWithHolder.appendChild(frag.firstElementChild);
        const openWithButton = dropdown.querySelector('#openWithButton');

        if (store.state.blnqName !== '') {
            openWithButton.setAttribute('href', store.state.blnqName);
            openWithButton.removeAttribute('disabled');
        }

        openWithButton.addEventListener('click', function() {
            var url = '/v/' + openWithButton.getAttribute('href');
            window.open(url);
        });
    }
    subscribe('savedSuccess', () => {
        if (store.state.hasBeenSaved) {
            openWithButton.setAttribute('href', store.state.blnqName);
            openWithButton.removeAttribute('disabled');
        }
    });
    subscribe('updateOpenFin', () => {
        openWithSetup();
    });
};

export default async function() {
    return openWithSetup();
}
