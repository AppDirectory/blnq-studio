var url = `${window.location.protocol}//${window.location.host}/v/`;
export const openfin = (blnqName) => `{
    "licenseKey": "contract_identifier",
    "devtools_port": 9090,
    "startup_app": {
        "name": "${blnqName}",
        "description": "${blnqName}",
        "url": "${url}${blnqName}",
        "uuid": "${blnqName}",
        "autoShow": true,
        "defaultWidth": 500,
        "defaultHeight": 500,
        "defaultCentered": true,
        "saveWindowState": false,
        "frame": true,
        "icon": "https://studio.blnq.io/manifest/icon-of@512w.png"
    },
    "runtime": {
        "arguments": "",
        "version": "community"
    },
    "shortcut": {
        "company": "Blnq Studio",
        "description": "${blnqName}",
        "name": "${blnqName}",
        "icon": "https://studio.blnq.io/manifest/icon.ico",
        "target": [
            "desktop"
        ]
    }
}`;

/*
  REMOVED FROM url for now, because we were ending up with a lot of localhost stuff on the live site ${window.location.origin}
  */
