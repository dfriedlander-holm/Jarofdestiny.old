let names = [];
let lastPicked = [];

// Load names from localStorage or set default names
window.onload = function() {
    if (localStorage.getItem('names')) {
        names = JSON.parse(localStorage.getItem('names'));
        loadNamesToFields();
    } else {
        resetNames();
    }
    updateLastPickedList();
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
    alert('Names saved!');
}

// Function to load saved names back into input fields
function loadNamesToFields() {
    names.forEach((nameObj, index) => {
        document.getElementById(`name${index + 1}`).value = nameObj.name;
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
            addToLastPicked(nameObj.name);
            localStorage.setItem('names', JSON.stringify(names));  // Save the updated weights
            return;
        }
        random -= nameObj.weight;
    }
}

// Add picked name to the last picked list (up to 3 entries)
function addToLastPicked(name) {
    lastPicked.unshift(name);  // Add name to the beginning
    if (lastPicked.length > 3) {
        lastPicked.pop();  // Remove the oldest entry if more than 3
    }
    updateLastPickedList();
}

// Update the last picked names list
function updateLastPickedList() {
    const list = document.getElementById('lastPickedList');
    list.innerHTML = '';  // Clear previous list

    lastPicked.forEach(pickedName => {
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
    loadNamesToFields();
}

// Reset picker and restore default names
function resetPicker() {
    resetNames();
    lastPicked = [];
    updateLastPickedList();
    document.getElementById("pickedName").innerText = '';
}
