import { renderer } from './../main.js';

let isDarkMode = false;

export function switchBackgroundColor() {
    const modeText = document.getElementById('modeText');
    const checkbox = document.getElementById('modeSwitch');

    if (renderer) {
        if (checkbox.checked) {
            renderer.setClearColor(0x37474F, 1); // Dark mode color
            modeText.textContent = 'Dark Mode';
            isDarkMode = true;
        } else {
            renderer.setClearColor(0xFAFAFA, 1); // Light mode color
            modeText.textContent = 'Light Mode';
            isDarkMode = false;
        }
    }
}
