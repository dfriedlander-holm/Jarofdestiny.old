let names = [];
let allPicked = [];

// Load names from localStorage or set default names
window.onload = function() {
    if (localStorage.getItem('names')) {
        names = JSON.parse(localStorage.getItem('names'));
        loadNamesToInputs();
        loadNamesToGrid();
    } else {
        resetNames();
    }
    if (localStorage.getItem('allPicked')) {
        allPicked = JSON.parse(localStorage.getItem('allPicked'));
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
    for (let i = 1; i <= 10; i++) {
        const name = document.getElementById(`name${i}`).value.trim();
        if (name) {
            names.push({ name: name, weight: 1 });
        }
    }
    
    if (names.length === 0) {
        alert('Please enter at least one name before saving.');
        return;
    }
    
    localStorage.setItem('names', JSON.stringify(names));
    loadNamesToGrid();  // Load names into grid
    alert(`${names.length} names saved successfully!`);
}

// Load saved names into the input fields
function loadNamesToInputs() {
    // Clear all inputs first
    for (let i = 1; i <= 10; i++) {
        document.getElementById(`name${i}`).value = '';
    }
    
    // Load saved names into inputs
    names.forEach((nameObj, index) => {
        if (index < 10) {
            document.getElementById(`name${index + 1}`).value = nameObj.name;
        }
    });
}

// Load saved names into the display grid with their weights
function loadNamesToGrid() {
    const grid = document.getElementById('nameGrid');
    grid.innerHTML = '';  // Clear the grid

    if (names.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.innerHTML = '<p>Enter names above and click "Save Names" to get started!</p>';
        emptyMessage.style.gridColumn = '1 / -1';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.padding = '20px';
        emptyMessage.style.color = '#666';
        grid.appendChild(emptyMessage);
        return;
    }

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
    localStorage.setItem('allPicked', JSON.stringify(allPicked));  // Save to localStorage
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
    names = [];
    // Clear input fields
    for (let i = 1; i <= 10; i++) {
        document.getElementById(`name${i}`).value = '';
    }
    localStorage.setItem('names', JSON.stringify(names));  // Reset localStorage
    loadNamesToGrid();
}

// Reset picker and restore default names
function resetPicker() {
    resetNames();
    allPicked = [];
    localStorage.setItem('allPicked', JSON.stringify(allPicked));  // Clear localStorage
    updateAllPickedList();
    document.getElementById("pickedName").innerText = '';
}
