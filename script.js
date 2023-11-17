function selectYearOption(selectedButton) {
    // First remove 'selected' class from all options if any
    document.querySelectorAll('.year-option').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Add 'selected' class to the clicked button
    selectedButton.classList.add('selected');
}

// A variable to keep track of the number of attempts
let attempts = 0;

window.onload = function() {
    
    // localStorage.removeItem('instructionsSeen');
    if (!localStorage.getItem('instructionsSeen')) {
        showInstructionsOverlay();
    }
    fetch('database.json')
        .then(response => response.json())
        .then(data => {
            // Store the correct option and explanation text
            correctOption = data[0].correct_option;
            explanationText = data[0].explanation_text;

            // Set the image source from the JSON data
            document.getElementById('event-image').src = data[0].link_to_image;

            // Populate the options grid
            const optionsGrid = document.querySelector('.options-grid');
            optionsGrid.innerHTML = ''; // Clear existing options

            // Create buttons for each option
            data[0].options.forEach(year => {
                const button = document.createElement('button');
                button.textContent = year;
                button.classList.add('year-option');
                button.addEventListener('click', function() {
                    selectYearOption(this); // Pass the clicked button to the function
                });
                optionsGrid.appendChild(button);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
};

function showInstructionsOverlay() {
    document.getElementById('instructions-overlay').classList.remove('hidden');
}

document.getElementById('close-instructions').addEventListener('click', function() {
    document.getElementById('instructions-overlay').classList.add('hidden');
    // Optionally set a flag so the instructions don't show again
    localStorage.setItem('instructionsSeen', 'true');
});

document.getElementById('submit-button').addEventListener('click', function() {
    const selectedYear = document.querySelector('.year-option.selected');
    if (selectedYear) {
        if (selectedYear.textContent === correctOption) {
            showOverlay("Congratulations!", explanationText);
        } else {
            selectedYear.classList.add('incorrect');
            selectedYear.classList.remove('selected');

            // Increment the attempt counter
            attempts++;

            // Check if it was the second attempt
            if (attempts === 2) {
                // Call showOverlay with the incorrect message and empty explanation
                showOverlay("Incorrect.", explanationText);
                // Reset attempts for the next round
                attempts = 0;
            }
        }
    } else {
        alert('Please select a year.');
    }
});

// Function to show the overlay
function showOverlay(resultMessage, explanation) {
    document.getElementById('result-text').textContent = resultMessage;
    document.getElementById('explanation-text').textContent = explanation;
    document.getElementById('win-overlay').classList.remove('hidden');
}

// Function to hide the overlay
function hideOverlay() {
    document.getElementById('win-overlay').classList.add('hidden');
}

// Event listener for the close button
document.getElementById('close-overlay').addEventListener('click', hideOverlay);