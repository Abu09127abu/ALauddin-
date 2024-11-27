// Function to format numbers with commas and suffixes
function formatNumbersWithSuffix() {
    // Get all elements containing numbers
    const elements = document.querySelectorAll('*:not(script)'); // Exclude script tags

    elements.forEach((element) => {
        const text = element.textContent.trim();

        // Match numbers in the text
        const numberMatch = text.match(/\d+/g);
        if (numberMatch) {
            numberMatch.forEach((num) => {
                const formattedNumber = formatNumber(Number(num));
                element.innerHTML = element.innerHTML.replace(num, `<b>${formattedNumber}</b>`);
            });
        }
    });
}

// Function to format number with commas and suffixes
function formatNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T'; // Trillions
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';  // Billions
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';  // Millions
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';  // Thousands
    return num.toLocaleString(); // Default with commas
}

// Run the function after the page loads
document.addEventListener('DOMContentLoaded', formatNumbersWithSuffix);