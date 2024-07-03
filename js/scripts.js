document.addEventListener('DOMContentLoaded', () => {
    generateArray();
    setupTabs();
});

let array = [];
let sorting = false;
let sortTimeout = null;
let speed = 1; // Velocidade inicial
let barCount = 50; // Quantidade inicial de barras

function generateArray() {
    array = Array.from({ length: barCount }, () => Math.floor(Math.random() * 100));
    displayArray();
}

function displayArray() {
    const container = document.getElementById('array-container');
    container.innerHTML = '';
    array.forEach(value => {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${value * 3}px`;
        container.appendChild(bar);
    });
}

async function bubbleSort() {
    sorting = true;
    let bars = document.querySelectorAll('.bar');
    for (let i = 0; i < array.length - 1 && sorting; i++) {
        for (let j = 0; j < array.length - i - 1 && sorting; j++) {
            bars[j].classList.add('comparing');
            bars[j + 1].classList.add('comparing');
            await new Promise(resolve => sortTimeout = setTimeout(resolve, 50 / speed)); // Ajusta o tempo com base na velocidade

            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                bars[j].style.height = `${array[j] * 3}px`;
                bars[j + 1].style.height = `${array[j + 1] * 3}px`;
                bars[j].classList.add('swapping');
                bars[j + 1].classList.add('swapping');
                await new Promise(resolve => sortTimeout = setTimeout(resolve, 50 / speed)); // Ajusta o tempo com base na velocidade
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
    // Implement Heap Sort
}

async function mergeSort() {
    // Implement Merge Sort
}

function shuffleArray() {
    array = array.sort(() => Math.random() - 0.5);
    displayArray();
}

function startSort() {
    if (!sorting) {
        bubbleSort();  // Call the selected sort function here
    }
}

function stopSort() {
    sorting = false;
    clearTimeout(sortTimeout);
}

function updateSpeed(value) {
    speed = value;
}

function updateBarCount(value) {
    barCount = parseInt(value);
    generateArray();
}

function setupTabs() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetTab = event.target.getAttribute('data-tab');
            
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.classList.add('inactive');
            });

            tabLinks.forEach(link => {
                link.classList.remove('active');
            });

            setTimeout(() => {
                tabContents.forEach(content => {
                    content.classList.remove('inactive');
                });
                document.getElementById(targetTab).classList.add('active');
                event.target.classList.add('active');
            }, 500); // Tempo da transição de saída antes de carregar o novo conteúdo
        });
    });
}
