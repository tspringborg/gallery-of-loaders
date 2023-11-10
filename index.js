const iframe = document.getElementById('content-iframe');
let paths = [];
let currentIndex = 0;
let nextTimer;
let loaderMeta = {}
let timerEnabled = true;

const overlayDiv = document.createElement('div');
overlayDiv.style.position = 'fixed';
overlayDiv.style.top = '0';
overlayDiv.style.left = '0';
overlayDiv.style.width = '100%';
overlayDiv.style.height = '100%';
overlayDiv.style.backgroundColor = '#000000';
overlayDiv.style.opacity = 1;
overlayDiv.style.pointerEvents = 'none';
document.body.appendChild(overlayDiv);

fetch('index.json').then(async (res) => {
    const indexJson = await res.json()
    paths = paths.concat(indexJson.map(p => `loaders/${p}`)).sort(() => Math.random() - 0.5)
    iframe.src = paths[currentIndex];
})

iframe.onload = function () {
    // Access the contentDocument of the iframe
    const contentDocument = iframe.contentDocument || iframe.contentWindow.document;

    // Access the title tag in the head of the HTML document
    const title = contentDocument.head.querySelector('title');
    // Access the meta tags in the head of the HTML document
    const metaTags = contentDocument.head.querySelectorAll('meta');

    loaderMeta = {title};
    // Extract and display metadata information
    metaTags.forEach(metaTag => {
        const name = metaTag.getAttribute('name');
        const content = metaTag.getAttribute('content');
        if (name && content !== '') {
            loaderMeta[name] = content;
        }
    });
    console.log(loaderMeta);
    overlayFadeOut();
    if (timerEnabled) startTimer();
};


function startTimer() {
    const duration = loaderMeta.duration ? parseInt(loaderMeta.loader_duration) : 5000;
    nextTimer = setTimeout(() => {
        navigate(1);
    }, Math.min(duration, 11000));
}

function randomIndex() {
    return Math.floor(Math.random() * paths.length);
}
function stepIndex(step) {
    let next = currentIndex + step;
    if (next < 0) {
        next = paths.length - next;
    }
    next = next % paths.length;
    console.log(next);
    return next;
}

async function navigate(direction) {
    if (nextTimer) clearTimeout(nextTimer)
    await overlayFadeIn();
    currentIndex = stepIndex(direction);
    iframe.src = paths[currentIndex];
}
async function navigateRandom() {
    return navigate(randomIndex());
}

function toggleTimer() {
    timerEnabled = !timerEnabled;
    if (timerEnabled) {
        startTimer();
    } else if(nextTimer){
        clearTimeout(nextTimer);
    }
}

async function overlayFadeIn() {
    return new Promise((resolve) => {
        document.body.appendChild(overlayDiv);
        gsap.to(
            overlayDiv, {
                ease: "circ.out",
                duration: 0.5,
                opacity: 1,
                onComplete: () => {
                    frameDoc = iframe.contentDocument || iframe.contentWindow.document;
                    frameDoc.removeChild(frameDoc.documentElement);
                    resolve()
                },
            }
        )
    })
}
async function overlayFadeOut() {
    return new Promise((resolve) => {
        document.body.appendChild(overlayDiv);
        gsap.to(
            overlayDiv, {
                duration: 0.5,
                opacity: 0,
                ease: "circ.in",
                onComplete: () => {
                    document.body.removeChild(overlayDiv);
                    resolve()
                },
            }
        )
    })
}