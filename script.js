let names = [];

// Function to collect the names and run the random selection
function pickName() {
    names = [];
    
    // Collect names from input fields
    for (let i = 1; i <= 9; i++) {
        let name = document.getElementById(`name${i}`).value;
        if (name.trim()) {
            names.push({ name: name, weight: 1 });
        }
    }

    // Check if there are names to select from
    if (names.length === 0) {
        alert('Please enter at least one name.');
        return;
    }

    // Select the name randomly based on weights
    let totalWeight = names.reduce((sum, nameObj) => sum + nameObj.weight, 0);
    let random = Math.random() * totalWeight;

    for (let nameObj of names) {
        if (random < nameObj.weight) {
            document.getElementById("pickedName").innerText = `Selected: ${nameObj.name}`;
            nameObj.weight = Math.max(nameObj.weight - 0.2, 0);  // Decrease weight
            return;
        }
        random -= nameObj.weight;
    }
}

// Reset function to clear inputs and reset state
function resetPicker() {
    for (let i = 1; i <= 9; i++) {
        document.getElementById(`name${i}`).value = '';
    }
    document.getElementById("pickedName").innerText = '';
    names = [];
}
