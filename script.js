let names = [];

// Function to pick a random name
function pickName() {
    // Get the values from input fields
    names = [];
    for (let i = 1; i <= 9; i++) {
        let name = document.getElementById(`name${i}`).value;
        if (name) {
            names.push({ name: name, weight: 1 });
        }
    }
    
    if (names.length === 0) {
        alert('Please enter at least one name.');
        return;
    }

    // Select the name randomly based on current weights
    let totalWeight = names.reduce((sum, name) => sum + name.weight, 0);
    let random = Math.random() * totalWeight;
    let selected = null;

    for (let nameObj of names) {
        if (random < nameObj.weight) {
            selected = nameObj;
            break;
        }
        random -= nameObj.weight;
    }

    if (selected) {
        document.getElementById("pickedName").innerText = `Selected: ${selected.name}`;
        selected.weight = Math.max(selected.weight - 0.2, 0);
    } else {
        alert('No names left to select.');
    }
}

// Reset picker
function resetPicker() {
    for (let i = 1; i <= 9; i++) {
        document.getElementById(`name${i}`).value = '';
    }
    document.getElementById("pickedName").innerText = '';
    names = [];
}
