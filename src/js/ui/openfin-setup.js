import { subscribe } from '../state/store';

export default function openfinSetup() {
    if (navigator.userAgent.indexOf('Windows') > -1) {
        document.querySelector('body').classList.add('isWindows');
    }
    if (typeof fin !== 'undefined') {
        var app = fin.desktop.Application.getCurrent();
        app.addEventListener('run-requested', function (event) {
            if (event.userAppConfigArgs) {
                if (typeof event.userAppConfigArgs.blnqName !== 'undefined') {
                    window.location.href =
                        '/e/' + event.userAppConfigArgs.blnqName;
                }
            }
        });

        document.querySelector('body').classList.add('isOpenFin');
        const minButton = document.createElement('button');
        const maxButton = document.createElement('button');
        const closeButton = document.createElement('button');
        const devtoolsButtons = document.querySelector('#devtools');
        const win = fin.desktop.Window.getCurrent();
        if (devtoolsButtons) {
            devtoolsButtons.addEventListener('click', () => {
                const win = fin.desktop.Window.getCurrent();
                win.getAllFrames(function (frames) {
                    var previewIframe = frames[frames.length - 1];
                    fin.desktop.System.showDeveloperTools(
                        win.uuid,
                        win.name,
                        function () {
                            fin.desktop.System.showDeveloperTools(
                                previewIframe.uuid,
                                previewIframe.name
                            );
                        }
                    );
                });
            });
        }

        async function minWindow() {
            const win = await fin.Window.getCurrent();
            return await win.minimize();
        }

        async function maxWindow() {
            const win = await fin.Window.getCurrent();
            if ((await win.getState()) === 'normal') {
                return await win.maximize();
            } else {
                return await win.restore();
            }
        }

        win.addEventListener('restored', () => {
            maxButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
        </svg>
        `;
        });
        win.addEventListener('maximized', () => {
            maxButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
        </svg>
        `;
        });

        async function closeWindow() {
            const win = await fin.Window.getCurrent();
            return await win.close();
        }

        minButton.classList.add('btn');
        minButton.classList.add('btn--win');
        minButton.classList.add('btn--win--min');
        minButton.classList.add('hide-osframe');
        minButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>`;
        minButton.addEventListener('click', () => {
            minWindow();
        });

        maxButton.classList.add('btn');
        maxButton.classList.add('btn--win');
        maxButton.classList.add('hide-osframe');
        maxButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
    </svg>
    `;
        maxButton.addEventListener('click', () => {
            maxWindow();
        });

        closeButton.classList.add('btn');
        closeButton.classList.add('btn--win');
        closeButton.classList.add('hide-osframe');
        closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;
        closeButton.addEventListener('click', () => {
            closeWindow();
        });

        document.querySelector('.app__header').append(minButton);
        document.querySelector('.app__header').append(maxButton);
        document.querySelector('.app__header').append(closeButton);

        async function restoreWindow() {
            const win = await fin.Window.getCurrent();
            const state = await win.getState();
            if (state === 'maximized') {
                maxButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
            </svg>
            `;
            } else {
                maxButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            </svg>
            `;
            }
        }
        restoreWindow();

        subscribe('updateOSFrame', (obj) => {
            win.updateOptions({ frame: obj.showOSFrame });
            if (obj.showOSFrame) {
                document.querySelector('body').classList.add('hasOSFrame');
            } else {
                document.querySelector('body').classList.remove('hasOSFrame');
            }
        });
    } else {
        const installButtons = document.querySelector('#installButtons');
        if (installButtons) {
            var start = document.createElement('a');
            start.classList.add('install-button');
            var startlink = `/e`;
            start.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24">
            <path d="M13 12h7v1.5h-7zm0-2.5h7V11h-7zm0 5h7V16h-7zM21 4H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 15h-9V6h9v13z"/>
        </svg>
        
            <div>
                <div>Code in</div>
                <div>Browser</div>
            </div>`;

            start.href = startlink;
            installButtons.append(start);

            var url =
                window.location.protocol +
                '//' +
                window.location.host +
                '/openfin';

            var installerURL = '';
            //var linkWrapper = document.createElement('div');
            //var linkWrapper = querySelector('#installButtons');
            var link = document.createElement('a');
            link.classList.add('install-button');
            var os;
            if (navigator.userAgent.indexOf('Macintosh') > -1) {
                installerURL = `https://install.openfin.co/download/?os=osx&config=https%3A%2F%2Fstudio.blnq.io%2Fopenfin&fileName=Blnq-Studio-Installer`;
                link.innerHTML = `<svg width="29" height="34" viewBox="0 0 29 34" xmlns="http://www.w3.org/2000/svg"><path d="M28.333 24.943c-1.113 3.23-4.447 8.95-7.88 9.012-2.279.044-3.011-1.35-5.615-1.35-2.602 0-3.417 1.307-5.57 1.392C5.624 34.137 0 25.742 0 18.421 0 11.696 4.686 8.363 8.78 8.3c2.196-.039 4.27 1.481 5.61 1.481 1.343 0 3.862-1.827 6.51-1.56 1.108.047 4.22.447 6.218 3.368-5.3 3.46-4.474 10.694 1.215 13.353zM20.936 0c-4.004.162-7.27 4.362-6.815 7.836 3.7.287 7.25-3.86 6.815-7.836z" fill="#FFF" fill-rule="nonzero"/></svg>
                <div>
                    <div>Install For</div>
                    <div>MacOS<i>*</i></div>
                </div>`;
                os = 'MacOS';
                //  installButtons.append(link);
            }
            if (navigator.userAgent.indexOf('Windows') > -1) {
                installerURL = `https://install.openfin.co/download/?os=win&config=https%3A%2F%2Fstudio.blnq.io%2Fopenfin&fileName=Blnq-Studio-Installer&supportEmail=info%40blnq.io`;
                link.innerHTML = `<svg width="34" height="34" viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg"><path d="M0 17V4.752l14.167-1.92V17H0zm15.583 0H34V0L15.583 2.56V17zm-1.416 1.417H0v10.831l14.167 1.92V18.417zm1.416 0V31.44L34 34V18.417H15.583z" fill="#FFF" fill-rule="nonzero"/></svg>
                <div>
                    <div>Install For</div>
                    <div>Windows<i>*</i></div>
                </div>`;
                os = 'Windows';
                //installButtons.append(link);
            }
            if (installerURL !== '') {
                link.href = installerURL;

                if (navigator.userAgent.indexOf('Windows') > -1) {
                    var p = document.createElement('p');
                    p.innerHTML = `<span>*</span> Download and Install for ${os} to start prototyping Electron powered applications with the <a href="https://developers.openfin.co/docs" target="_blank">OpenFin</a> platform`;
                    //installButtons.append(p);
                }
                if (navigator.userAgent.indexOf('Macintosh') > -1) {
                    var p = document.createElement('p');
                    p.innerHTML = `<span>*</span> Download and Install for ${os} to start prototyping Electron powered applications with the <a href="https://developers.openfin.co/docs" target="_blank">OpenFin</a> platform.<br/>Requires additional extras: <a href="/assets/files/Fins MacOS Protocol.zip">FINS://</a> protocol launcher, <a href="https://www.npmjs.com/package/npx" target="_blank">npx</a> and <a href="https://www.npmjs.com/package/openfin-cli" target="_blank">openfin-cli</a>.`;
                    //installButtons.append(p);
                }
            }
        }
    }
}
