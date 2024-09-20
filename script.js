let names = [];
let allPicked = [];

// Load names from localStorage or set default names
window.onload = function() {
    if (localStorage.getItem('names')) {
        names = JSON.parse(localStorage.getItem('names'));
        loadNamesToGrid();
    } else {
        resetNames();
    }
    updateAllPickedList();
};

// Update the reduction percentage label
function updateReductionLabel(value) {
    document.getElementById('reductionLabel').innerText = `${value}%`;
}

// Function to save names entered by the user
function saveNames() {
    names = [];
    for (let i = 1; i <= 9; i++) {
        const name = document.getElementById(`name${i}`).value.trim();
        if (name) {
            names.push({ name: name, weight: 1 });
        }
    }
    localStorage.setItem('names', JSON.stringify(names));
    loadNamesToGrid();  // Load names into grid
    alert('Names saved!');
}

// Load saved names into the 3x3 grid with their weights
function loadNamesToGrid() {
    const grid = document.getElementById('nameGrid');
    grid.innerHTML = '';  // Clear the grid

    names.forEach((nameObj, index) => {
        const nameBox = document.createElement('div');
        nameBox.className = 'name-box';
        nameBox.innerHTML = `<strong>${nameObj.name}</strong><small>Weight: ${nameObj.weight.toFixed(2)}</small>`;
        grid.appendChild(nameBox);
    });
}

// Pick a random name based on weights
function pickRandomName() {
    if (names.length === 0) {
        alert('No names saved. Please enter and save names first.');
        return;
    }

    let totalWeight = names.reduce((sum, nameObj) => sum + nameObj.weight, 0);
    let random = Math.random() * totalWeight;
    let reductionPercentage = document.getElementById("reduction").value;
    let reductionFactor = 1 - (reductionPercentage / 100); // Convert percentage to reduction factor

    for (let nameObj of names) {
        if (random < nameObj.weight) {
            document.getElementById("pickedName").innerText = `Selected: ${nameObj.name}`;
            nameObj.weight = nameObj.weight * reductionFactor;  // Apply user-defined reduction
            addToAllPicked(nameObj.name);
            localStorage.setItem('names', JSON.stringify(names));  // Save the updated weights
            loadNamesToGrid();  // Update grid with new weights
            return;
        }
        random -= nameObj.weight;
    }
}

// Add picked name to the all picked list
function addToAllPicked(name) {
    allPicked.push(name);  // Add name to the end of the list
    updateAllPickedList();
}

// Update the all picked names list
function updateAllPickedList() {
    const list = document.getElementById('allPickedList');
    list.innerHTML = '';  // Clear previous list

    allPicked.forEach(pickedName => {
        const li = document.createElement('li');
        li.innerText = pickedName;
        list.appendChild(li);
    });
}

// Reset names and weights
function resetNames() {
    names = [
        { name: 'Name 1', weight: 1 },
        { name: 'Name 2', weight: 1 },
        { name: 'Name 3', weight: 1 },
        { name: 'Name 4', weight: 1 },
        { name: 'Name 5', weight: 1 },
        { name: 'Name 6', weight: 1 },
        { name: 'Name 7', weight: 1 },
        { name: 'Name 8', weight: 1 },
        { name: 'Name 9', weight: 1 }
    ];
    localStorage.setItem('names', JSON.stringify(names));  // Reset localStorage
    loadNamesToGrid();
}

// Reset picker and restore default names
function resetPicker() {
    resetNames();
    allPicked = [];
    updateAllPickedList();
    document.getElementById("pickedName").innerText = '';
}
