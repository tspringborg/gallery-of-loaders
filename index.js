const iframe = document.getElementById('content-iframe');
let paths = [];
let currentIndex = 0;

fetch('index.json').then(async (res) => {
    const indexJson = await res.json()
    paths = paths.concat(indexJson.map(p => `loaders/${p}`))
    navigateRandom();
})

function navigate(direction) {
    currentIndex += direction;
    currentIndex = currentIndex % paths.length
    iframe.src = paths[currentIndex];
}
function navigateRandom() {
    navigate(Math.floor(Math.random() * paths.length))
}
