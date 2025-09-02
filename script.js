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

// Statistical analysis function - runs 1000 picks and shows distribution
function runStatisticalAnalysis() {
    if (names.length === 0) {
        alert('No names saved. Please enter and save names first.');
        return;
    }

    // Store original weights to restore later
    const originalWeights = names.map(nameObj => ({ ...nameObj }));
    
    // Reset weights to 1 for the test
    names.forEach(nameObj => nameObj.weight = 1);
    
    const results = {};
    const totalRuns = 1000;
    
    // Initialize results object
    names.forEach(nameObj => {
        results[nameObj.name] = 0;
    });
    
    // Run 1000 picks
    for (let i = 0; i < totalRuns; i++) {
        const pickedName = simulateRandomPick();
        results[pickedName]++;
    }
    
    // Calculate statistics
    const expectedPerPerson = totalRuns / names.length;
    let output = `Statistical Analysis Results (${totalRuns} runs):\n\n`;
    output += `Expected picks per person: ${expectedPerPerson.toFixed(1)}\n\n`;
    output += `Results:\n`;
    output += `Name              Picks    Percentage   Deviation\n`;
    output += `------------------------------------------------\n`;
    
    let totalDeviation = 0;
    for (const [name, picks] of Object.entries(results)) {
        const percentage = (picks / totalRuns * 100).toFixed(1);
        const deviation = picks - expectedPerPerson;
        const deviationStr = deviation >= 0 ? `+${deviation.toFixed(1)}` : deviation.toFixed(1);
        totalDeviation += Math.abs(deviation);
        
        output += `${name.padEnd(16)} ${picks.toString().padStart(5)}    ${percentage.padStart(6)}%     ${deviationStr}\n`;
    }
    
    output += `------------------------------------------------\n`;
    output += `Total absolute deviation: ${totalDeviation.toFixed(1)}\n`;
    output += `Average deviation per person: ${(totalDeviation / names.length).toFixed(1)}\n\n`;
    
    // Assess randomness
    const avgDeviation = totalDeviation / names.length;
    if (avgDeviation < expectedPerPerson * 0.1) {
        output += `✅ RESULT: Excellent randomness (avg deviation < 10% of expected)\n`;
    } else if (avgDeviation < expectedPerPerson * 0.2) {
        output += `✅ RESULT: Good randomness (avg deviation < 20% of expected)\n`;
    } else {
        output += `⚠️  RESULT: Moderate randomness (avg deviation >= 20% of expected)\n`;
    }
    
    output += `\nNote: With truly random distribution, we expect some variation.\n`;
    output += `Small deviations are normal and expected in random sampling.`;
    
    // Display results
    document.getElementById('analysisResults').textContent = output;
    
    // Restore original weights
    names.length = 0;
    names.push(...originalWeights);
    localStorage.setItem('names', JSON.stringify(names));
    loadNamesToGrid();
}

// Helper function to simulate a single random pick without side effects
function simulateRandomPick() {
    let totalWeight = names.reduce((sum, nameObj) => sum + nameObj.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let nameObj of names) {
        if (random < nameObj.weight) {
            return nameObj.name;
        }
        random -= nameObj.weight;
    }
    
    // Fallback (should never reach here)
    return names[0].name;
}
