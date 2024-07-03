let array = [];
let speed = 1;
let barCount = 50;
let sorting = false;
let paused = false;
let currentAlgorithm = 'bubble';
let timeoutIds = [];

document.addEventListener("DOMContentLoaded", function() {
    setupTabs();
    generateArray();
    displayArray();
});

function setupTabs() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            tabLinks.forEach(link => link.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            this.classList.add('active');
        });
    });
}

function generateArray() {
    array = [];
    for (let i = 0; i < barCount; i++) {
        array.push(Math.floor(Math.random() * 400) + 10);
    }
}

function displayArray() {
    const container = document.getElementById('array-container');
    container.innerHTML = '';
    const barWidth = Math.floor(container.clientWidth / barCount);
    array.forEach((height, index) => {
        const bar = document.createElement('div');
        bar.style.height = `${height}px`;
        bar.style.width = `${barWidth - 2}px`; // 2px for margin
        bar.classList.add('bar');
        container.appendChild(bar);
    });
}

function updateSpeed(value) {
    speed = value;
}

function updateBarCount(value) {
    barCount = value;
    generateArray();
    displayArray();
}

function updateSortingMethod(value) {
    currentAlgorithm = value;
}

function shuffleArray() {
    if (!sorting) {
        generateArray();
        displayArray();
    }
}

function startSort() {
    if (!sorting) {
        sorting = true;
        switch (currentAlgorithm) {
            case 'bubble':
                bubbleSort();
                break;
            case 'heap':
                heapSort();
                break;
            case 'merge':
                mergeSort();
                break;
        }
    }
}

function stopSort() {
    if (sorting) {
        paused = true;
        sorting = false;
        document.querySelector('#controls button[onclick="stopSort()"]').textContent = 'Continue';
    } else if (paused) {
        paused = false;
        sorting = true;
        document.querySelector('#controls button[onclick="stopSort()"]').textContent = 'Stop';
        continueSort();
    }
}

function continueSort() {
    switch (currentAlgorithm) {
        case 'bubble':
            bubbleSort();
            break;
        case 'heap':
            heapSort();
            break;
        case 'merge':
            mergeSort();
            break;
    }
}

async function bubbleSort() {
    sorting = true;
    let bars = document.querySelectorAll('.bar');
    for (let i = 0; i < array.length - 1 && sorting; i++) {
        for (let j = 0; j < array.length - i - 1 && sorting; j++) {
            bars[j].classList.add('comparing');
            bars[j + 1].classList.add('comparing');
            await new Promise(resolve => sortTimeout = setTimeout(resolve, 150 / speed)); // Ajusta o tempo com base na velocidade

            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                bars[j].style.height = `${array[j] * 1}px`;
                bars[j + 1].style.height = `${array[j + 1] * 1}px`;
                bars[j].classList.add('swapping');
                bars[j + 1].classList.add('swapping');
                await new Promise(resolve => sortTimeout = setTimeout(resolve, 150 / speed)); // Ajusta o tempo com base na velocidade
                bars[j].classList.remove('swapping');
                bars[j + 1].classList.remove('swapping');
            }

            bars[j].classList.remove('comparing');
            bars[j + 1].classList.remove('comparing');
        }
    }
    sorting = false;
}


async function heapSort() {
    let bars = document.getElementsByClassName('bar');
    let n = array.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(bars, n, i);
    }

    for (let i = n - 1; i > 0; i--) {
        if (paused) {
            return;
        }
        bars[i].classList.add('comparing')
        
        await swap(bars, 0, i);
        await heapify(bars, i, 0);
        bars[i].classList.remove('comparing')
        
    }
    sorting = false;
}

async function heapify(bars, n, i) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (left < n && array[left] > array[largest]) {
        largest = left;
    }

    if (right < n && array[right] > array[largest]) {
        largest = right;
    }

    if (largest !== i) {
        await swap(bars, i, largest);
        await heapify(bars, n, largest);
    }
}

async function swap(bars, i, j) {
    if (paused) {
        return;
    }
    bars[i].classList.add('swapping');
    bars[j].classList.add('swapping');
    await new Promise(resolve => setTimeout(resolve, 300 / speed));
    [array[i], array[j]] = [array[j], array[i]];
    displayArray();
    await new Promise(resolve => setTimeout(resolve, 300 / speed));
    bars[i].classList.remove('swapping');
    bars[j].classList.remove('swapping');
}
