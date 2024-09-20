// List of names
let names = [
    {name: "Name 1", weight: 1},
    {name: "Name 2", weight: 1},
    {name: "Name 3", weight: 1},
    {name: "Name 4", weight: 1},
    {name: "Name 5", weight: 1},
    {name: "Name 6", weight: 1},
    {name: "Name 7", weight: 1},
    {name: "Name 8", weight: 1},
    {name: "Name 9", weight: 1}
];

// Pick a name based on weight
function pickName(index) {
    const selectedName = names[index];
    
    // Reduce the weight of the picked name and mark it as picked
    if (selectedName.weight > 0) {
        selectedName.weight = Math.max(selectedName.weight - 0.2, 0);
        document.getElementById(`name${index + 1}`).classList.add('picked');
    }

    // Select the name randomly based on current weights
    let totalWeight = names.reduce((sum, name) => sum + name.weight, 0);
    let random = Math.random() * totalWeight;
    let selected = null;

    for (let name of names) {
        if (random < name.weight) {
            selected = name;
            break;
        }
        random -= name.weight;
    }

    if (selected) {
        alert(`${selected.name} has been selected!`);
    } else {
        alert('No names left to select.');
    }
}

// Reset all names
function resetPicker() {
    names = names.map(name => ({ ...name, weight: 1 }));
    for (let i = 0; i < 9; i++) {
        document.getElementById(`name${i + 1}`).classList.remove('picked');
    }
}
