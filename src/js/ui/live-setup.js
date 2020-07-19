import store, { dispatch, subscribe } from '../state/store';
import { getEditors } from './editor-setup';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';

export default async function () {
    const liveButton = document.querySelector('#liveButton');
    if (store.state.hasBeenSaved && store.state.blnqName !== '') {
        liveButton.removeAttribute('disabled');
    }

    subscribe('savedSuccess', () => {
        liveButton.removeAttribute('disabled');
    });

    var wss = [];
    liveButton.addEventListener('click', () => {
        var blnqName = store.state.blnqName;
        const editors = getEditors();
        if (!liveButton.classList.contains('live')) {
            alert(
                "WIP FEATURE: Share this URL with someone and ask them to click the 'Go Live' button."
            );
            for (var editor in editors) {
                if (typeof wss[editor + '-yProvider'] === 'undefined') {
                    const origValue = editors[editor].getValue();
                    wss[editor + '-yDocument'] = new Y.Doc();
                    wss[editor + '-yProvider'] = new WebsocketProvider(
                        `${location.protocol === 'http:' ? 'ws:' : 'wss:'}//${
                            location.hostname
                        }${location.port ? ':' + location.port : ''}`,
                        editor + '-' + blnqName,
                        wss[editor + '-yDocument']
                    );

                    wss[editor + '-yText'] = wss[editor + '-yDocument'].getText(
                        editor + '-' + blnqName
                    );

                    wss[editor + '-yBinding'] = new MonacoBinding(
                        wss[editor + '-yText'],
                        editors[editor].getModel(),
                        new Set([editors[editor]]),
                        wss[editor + '-yProvider'].awareness
                    );

                    var user = store.state.user
                        ? store.state.user.displayname
                        : 'Anon';
                    wss[editor + '-yProvider'].awareness.setLocalStateField(
                        'user',
                        {
                            name: user,
                            client: wss[editor + '-yDocument'].clientID
                        }
                    );

                    (function (editor, origValue) {
                        wss[editor + '-yProvider'].on('status', (event) => {
                            if (event.status === 'connected') {
                                setTimeout(function () {
                                    if (
                                        wss[editor + '-yText'].toString() === ''
                                    ) {
                                        editors[editor].setValue(origValue);
                                    } else {
                                        editors[editor].setValue(
                                            wss[editor + '-yText'].toString()
                                        );
                                    }
                                }, 500); //This is Annoying that we need to set a timeout as the getText doesn have anything by default...
                            }
                        });
                    })(editor, origValue);
                } else {
                    wss[editor + '-yProvider'].connect();
                }
            }
            liveButton.classList.add('live');
            liveButton.querySelector('.inner').innerHTML = 'LIVE';
        } else {
            liveButton.querySelector('.inner').innerHTML = 'Go Live';
            liveButton.classList.remove('live');
            for (var editor in editors) {
                wss[editor + '-yProvider'].disconnect();
            }
        }
    });
}
