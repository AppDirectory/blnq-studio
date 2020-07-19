if (typeof window.fin !== 'undefined') {
    var app = fin.desktop.Application.getCurrent();
    app.addEventListener('run-requested', function (event) {
        if (event.userAppConfigArgs) {
            if (typeof event.userAppConfigArgs.blnqName !== 'undefined') {
                window.location.href = '/e/' + event.userAppConfigArgs.blnqName;
            }
        }
    });
}

try {
    if (typeof window.fin !== 'undefined') {
        fin.desktop.main((userAppConfigArgs) => {
            if (typeof userAppConfigArgs !== 'undefined') {
                if (typeof userAppConfigArgs.blnqName !== 'undefined') {
                    window.location.href = '/e/' + userAppConfigArgs.blnqName;
                }
            } else {
                window.location.href = '/dashboard';
            }
        });
    } else {
        window.location.href = '/dashboard';
    }
} catch (e) {
    window.location.href = '/dashboard';
}
