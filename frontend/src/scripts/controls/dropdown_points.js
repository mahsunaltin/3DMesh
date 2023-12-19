/**
 * Populate the dropdown with the given frame points.
 * 
 * @param {Array} framePoints - The points for the current frame.
 */
export function populateDropdown(framePoints) {
    const dropdown = document.getElementById('point-selector');
    dropdown.innerHTML = ''; // Clear existing options

    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.value = -1;
    defaultOption.textContent = 'Select a point'; 
    dropdown.appendChild(defaultOption);
    
    // Add an option for each point
    framePoints.forEach((point, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `Point ${index}`;
        dropdown.appendChild(option);
    });
}