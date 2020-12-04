import './cc';
import openfinSetup from './js/ui/openfin-setup';
import userSetup from './js/ui/user-setup';
import { createLoginModal } from './js/ui/reactions/utils';
import { dispatch } from './js/state/store';

userSetup();
openfinSetup();

function LoggedIn() {
    userSetup();
}

document.querySelector('#login').addEventListener('click', function () {
    createLoginModal({
        done: LoggedIn
    });
});

function createCard(obj) {
    //console.log(obj);

    var card = document.createElement('a');
    card.setAttribute('data-id', `${obj.name}`);
    card.classList.add('dash__card');
    card.href = 'e/' + obj.name;
    card.setAttribute('rel', 'ugc');
    card.innerHTML = `
    <div class="card__images">
      <img aria-hidden="true" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiM0MDQ2NjIiIGQ9Ik0wIDBoMjQwdjE4MEgweiIvPjxnIG9wYWNpdHk9Ii4zMyIgZmlsbD0iIzFCMUUyQiI+PHBhdGggZD0iTTkzIDc5LjMzNEw5OS4yMjIgNzNsMTguNjY1IDE5LTE4LjY2NSAxOUw5MyAxMDQuNjY2IDEwNS40NDMgOTIgOTMgNzkuMzM0ek0xNDcuNzUyIDc5LjMzNEwxNDEuNTI5IDczbC0xOC42NjUgMTkgMTguNjY1IDE5IDYuMjIzLTYuMzM0TDEzNS4zMDggOTJsMTIuNDQ0LTEyLjY2NnoiLz48L2c+PC9nPjwvc3ZnPg==" class="card__img--bg"/>
    </div>
    <div class="card__info">
    
    <img class="avatar-img" src="/avatar/${obj.user_id
        }" onload="this.style.display='block'"/>
    
    <div class="flex">  
        <div class="card__name">${obj.displayname != '' ? obj.displayname : 'An Untitled Masterpiece'
        }</div>
        <div class="card__author">${obj.username}</div>
    </div>
    
    <div class="card__meta">
        <div class="card__views">
            <svg width="16" height="10">
                <g fill="none" fill-rule="evenodd">
                    <path d="M0-3h16v16H0z"></path>
                    <path d="M8 0C4.667 0 1.82 2.073.667 5c1.153 2.927 4 5 7.333 5s6.18-2.073 7.333-5c-1.153-2.927-4-5-7.333-5zm0 8.333a3.335 3.335 0 0 1 0-6.666 3.335 3.335 0 0 1 0 6.666zM8 3c-1.107 0-2 .893-2 2s.893 2 2 2 2-.893 2-2-.893-2-2-2z" class="fill"></path>
                </g>
            </svg>
            <span>${obj.views}</span>
        </div>
        <div class="card__updated">
            <svg width="16" height="24" viewBox="0 0 24 24">
                <path class="fill" d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
            </svg>
            <span>${time2TimeAgo(obj.updated)}</span>
        </div>
      </div>
    </div>`;
    var img = document.createElement('img');
    img.setAttribute('alt', '');
    img.src = `f/${obj.name}.png`;
    img.classList.add('card__img');

    img.setAttribute('loading', 'lazy');
    card.querySelector('.card__images').append(img);

    card.addEventListener('mouseenter', (e) => {
        var blnqName = e.currentTarget.getAttribute('data-id');
        try {
            var iframes = document.querySelectorAll('.card__images iframe');
            if (iframes.length > 0) {
                [...iframes].forEach((iFrame) => {
                    iFrame.remove();
                });
            }
        } catch (e) { }

        var iframe = document.createElement('iframe');
        iframe.src = `p/${blnqName}`;
        iframe.setAttribute('scrolling', 'no');
        iframe.classList.add('card__iframe');
        iframe.setAttribute('loading', 'lazy');
        iframe.setAttribute(
            'sandbox',
            'allow-scripts allow-pointer-lock allow-same-origin allow-presentation'
        );
        iframe.setAttribute('tabindex', '-1');
        iframe.addEventListener('load', (e) => {
            e.currentTarget.classList.add('show');
        });
        card.querySelector('.card__images').append(iframe);
    });
    card.addEventListener('mouseleave', () => {
        try {
            var iframes = document.querySelectorAll('.card__images iframe');
            if (iframes.length > 0) {
                [...iframes].forEach((iFrame) => {
                    iFrame.remove();
                });
            }
        } catch (e) { }
    });

    //card.querySelector('.card__images').append(iframe);

    return card;
}

var cardZIndex = 0;

function createCards(cardArray, el) {
    var el = document.querySelector(el);
    cardArray.forEach((card) => {
        var newCard = createCard(card);
        el.append(newCard);
        newCard.addEventListener('mouseover', function (e) {
            cardZIndex = cardZIndex + 1;
            e.currentTarget.style.zIndex = cardZIndex;
        });
    });
}

function time2TimeAgo(someDateInThePast) {
    var result = '';
    var difference = Date.now() - someDateInThePast;

    if (difference < 59 * 1000) {
        return 'Just now';
    } else if (difference < 90 * 1000) {
        return 'Moments ago';
    }

    //it has minutes
    if ((difference % 1000) * 3600 > 0) {
        if (Math.floor((difference / 1000 / 60) % 60) > 0) {
            let s = Math.floor((difference / 1000 / 60) % 60) == 1 ? '' : 's';
            result = `${Math.floor((difference / 1000 / 60) % 60)} min${s} `;
        }
    }

    //it has hours
    if ((difference % 1000) * 3600 * 60 > 0) {
        if (Math.floor((difference / 1000 / 60 / 60) % 24) > 0) {
            let s =
                Math.floor((difference / 1000 / 60 / 60) % 24) == 1 ? '' : 's';
            result =
                `${Math.floor((difference / 1000 / 60 / 60) % 24)} hr${s}${result == '' ? '' : ','
                } ` + result;
        }
    }

    //it has days
    if ((difference % 1000) * 3600 * 60 * 24 > 0) {
        if (Math.floor(difference / 1000 / 60 / 60 / 24) > 0) {
            if (Math.floor(difference / 1000 / 60 / 60 / 24) > 1) {
                result = `${Math.floor(
                    difference / 1000 / 60 / 60 / 24
                )} days `;
            }
        }
    }

    return result + 'ago';
}

async function loadDashboard() {
    const response = await fetch('/api/v1/dashboard/');
    const dashboard = await response.json();

    document.querySelector('#top').innerHTML = '';
    document.querySelector('#latest').innerHTML = '';
    createCards(dashboard.top, '#top');
    createCards(dashboard.latest, '#latest');
}

loadDashboard();

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/blnq-sw.js').then(() => { });
    });
}

var searchDebounce;

document.querySelector('#search').addEventListener('input', (e) => {
    clearTimeout(searchDebounce);

    history.pushState(
        { page: 'dashboard' },
        'Blnq Studio',
        '?q=' + e.target.value
    );

    searchDebounce = setTimeout(function () {
        search();
    }, 500);
});

function search() {
    var searchString = document.querySelector('#search').value;
    if (searchString === '') {
        document.querySelector('.search-holder').classList.remove('show');
        document.querySelector('#searchResults').innerHTML = '';
    } else {
        loadSearch();
    }
}

async function loadSearch() {
    var searchString = document.querySelector('#search').value;
    document.querySelector('.search-holder h2').innerHTML =
        'Results for "' + searchString + '"';
    document.querySelector('.search-holder').classList.add('show');
    document.querySelector('#searchResults').innerHTML = '';
    const response = await fetch('/api/v1/search/' + searchString);
    const search = await response.json();

    createCards(search, '#searchResults');

    setTimeout(function () {
        var searchArea = document
            .querySelector('.search-holder')
            .getBoundingClientRect();

        var scrollTo =
            searchArea.top +
            document.querySelector('.app__body').scrollTop -
            50;
        //console.log(scrollTo);

        document.querySelector('.app__body').scrollTo({
            top: scrollTo,
            behavior: 'smooth'
        });
    }, 500);
}

var words = [
    'accessible',
    'amazing',
    'astounding',
    'astonishing',
    'awesome',
    'beautiful',
    'breathtaking',
    'brilliant',
    'energetic',
    'engaging',
    'enjoyable',
    'exciting',
    'fabulous',
    'fantastic',
    'incredible',
    'magical',
    'magnificent',
    'marvellous',
    'miraculous',
    'provoking',
    'reliable',
    'remarkable',
    'staggering',
    'stunning',
    'usable',
    'unbelievable',
    'wonderful',
    'wondrous'
];
var things = [
    'Sites',
    'Apps',
    'Demos',
    'Things',
    'Prototypes',
    'Tools',
    'Pages',
    'Stuff',
    'Bits'
];

document.querySelector('#bannerWord').innerHTML =
    words[Math.floor(Math.random() * words.length)];

setTimeout(() => {
    setInterval(() => {
        document.querySelector('#bannerWord').innerHTML =
            words[Math.floor(Math.random() * words.length)];
        document.querySelector('#bannerThing').innerHTML =
            things[Math.floor(Math.random() * things.length)];
    }, 2000);
}, 3000);

window.addEventListener('mousedown', function () {
    document.querySelector('body').classList.remove('kb-focus');
});

window.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
        document.querySelector('body').classList.add('kb-focus');
    }
});

let urlSearchParams = new URL(document.location).searchParams;
var paramsSearchString = urlSearchParams.get('q');
if (paramsSearchString !== null) {
    document.querySelector('#search').value = paramsSearchString;
    search();
}

const themePref = localStorage.getItem('pref-theme');
if (themePref !== null) {
    if (themePref === 'light') {
        document
            .querySelector('body')
            .setAttribute('data-theme', 'theme-light');
        document
            .querySelector('html')
            .setAttribute('data-theme', 'theme-light');

        var metaThemeColor = document.querySelector('meta[name=theme-color]');
        metaThemeColor.setAttribute('content', '#ffffff');
    } else if (themePref === 'auto') {
        if (window.matchMedia) {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document
                    .querySelector('body')
                    .setAttribute('data-theme', 'theme-dark');
                var metaThemeColor = document.querySelector(
                    'meta[name=theme-color]'
                );
                metaThemeColor.setAttribute('content', '#292d3e');
            }
            if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                document
                    .querySelector('body')
                    .setAttribute('data-theme', 'theme-light');
                var metaThemeColor = document.querySelector(
                    'meta[name=theme-color]'
                );
                metaThemeColor.setAttribute('content', '#ffffff');
            }
        } else {
            document
                .querySelector('body')
                .setAttribute('data-theme', 'theme-dark');
            var metaThemeColor = document.querySelector(
                'meta[name=theme-color]'
            );
            metaThemeColor.setAttribute('content', '#292d3e');
        }

        const darkModeMediaQuery = window.matchMedia(
            '(prefers-color-scheme: dark)'
        );
        darkModeMediaQuery.addListener((e) => {
            const darkModeOn = e.matches;

            if (darkModeOn) {
                document
                    .querySelector('body')
                    .setAttribute('data-theme', 'theme-dark');
                var metaThemeColor = document.querySelector(
                    'meta[name=theme-color]'
                );
                metaThemeColor.setAttribute('content', '#292d3e');
            } else {
                document
                    .querySelector('body')
                    .setAttribute('data-theme', 'theme-light');
                var metaThemeColor = document.querySelector(
                    'meta[name=theme-color]'
                );
                metaThemeColor.setAttribute('content', '#ffffff');
            }
        });
    } else {
        document.querySelector('body').setAttribute('data-theme', 'theme-dark');
        var metaThemeColor = document.querySelector('meta[name=theme-color]');
        metaThemeColor.setAttribute('content', '#292d3e');
    }
} else {
    document.querySelector('body').setAttribute('data-theme', 'theme-dark');
    var metaThemeColor = document.querySelector('meta[name=theme-color]');
    metaThemeColor.setAttribute('content', '#292d3e');
}

const osFramePref = localStorage.getItem('pref-osframe');
if (osFramePref !== null) {
    var pref = localStorage.getItem('pref-osframe');
    if (JSON.parse(pref)) {
        dispatch('updateOSFrame', {
            showOSFrame: true
        });
    } else {
        dispatch('updateOSFrame', {
            showOSFrame: false
        });
    }
} else {
    dispatch('updateOSFrame', {
        showOSFrame: true
    });
}

if (typeof window.fin !== 'undefined') {
    document.querySelectorAll('a[href][target]').forEach((link) => {
        link.addEventListener('click', (e) => {
            fin.System.openUrlWithBrowser(e.currentTarget.href);
            e.preventDefault();
        });
    });
}

const showInstallPromotion = () => {
    try {
        document.querySelector('#pwaButton').remove();
    } catch (e) { }
    const installButtons = document.querySelector('#installButtons');

    var link = document.createElement('a');
    link.href = '#';
    link.id = 'pwaButton';
    link.classList.add('install-button');
    //installerURL = `/assets/Blnq Studio Installer.dmg`;
    link.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24">
    <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
</svg>

        <div>
            <div>Install as</div>
            <div>Web App</div>
        </div>`;

    link.addEventListener('click', (e) => {
        deferredPrompt.prompt();
        e.preventDefault();
    });

    installButtons.prepend(link);
};

var deferredPrompt;
if (typeof fin === 'undefined') {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallPromotion();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null;
        });
    });
}

const installButtons = document.querySelector('#installButtons');
if (installButtons) {
    var github = document.createElement('a');
    github.classList.add('install-button');
    github.id = 'githublink';
    var githublink = `https://github.com/blnqco/blnq-studio`;
    github.innerHTML = `<svg
        fill="currentcolor"
        viewbox="0 0 1024 1024"
        width="34"
        height="34"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M512 0C229.25 0 0 229.25 0 512c0 226.25 146.688 418.125 350.156 485.812 25.594 4.688 34.938-11.125 34.938-24.625 0-12.188-.469-52.562-.719-95.312C242 908.812 211.906 817.5 211.906 817.5c-23.312-59.125-56.844-74.875-56.844-74.875-46.531-31.75 3.53-31.125 3.53-31.125 51.406 3.562 78.47 52.75 78.47 52.75 45.688 78.25 119.875 55.625 149 42.5 4.654-33 17.904-55.625 32.5-68.375-113.656-12.937-233.218-56.875-233.218-253.063 0-55.938 19.969-101.562 52.656-137.406-5.219-13-22.844-65.094 5.062-135.562 0 0 42.938-13.75 140.812 52.5 40.812-11.406 84.594-17.031 128.125-17.219 43.5.188 87.312 5.875 128.188 17.281 97.688-66.312 140.688-52.5 140.688-52.5 28 70.531 10.375 122.562 5.125 135.5 32.812 35.844 52.625 81.469 52.625 137.406 0 196.688-119.75 240-233.812 252.688 18.438 15.875 34.75 47 34.75 94.75 0 68.438-.688 123.625-.688 140.5 0 13.625 9.312 29.562 35.25 24.562C877.438 930 1024 738.125 1024 512 1024 229.25 794.75 0 512 0z"
        />
    </svg>
    
        <div>
            <div>Open-source on</div>
            <div>GitHub</div>
        </div>`;

    github.href = githublink;
    installButtons.append(github);
}
