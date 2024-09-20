let names = [];

// Load names from localStorage or set default names
window.onload = function() {
    if (localStorage.getItem('names')) {
        names = JSON.parse(localStorage.getItem('names'));
    } else {
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
        localStorage.setItem('names', JSON.stringify(names));
    }
    updateButtons();
};

// Function to update button labels with stored names
function updateButtons() {
    for (let i = 0; i < names.length; i++) {
        document.querySelectorAll('.name-btn')[i].innerText =
