import '../../styles/styles_for_detailed.css';
import Chart from 'chart.js/auto';

// Global variable to store points data
let globalPointsData = [];
let chart1, chart2, chart3; // Chart instances
let maxFrames = 0; // Maximum number of frames

// Function to be called from the main window
window.setPointsData = function(pointsData) {
    globalPointsData = pointsData;
    console.log("Received points data:", pointsData);

    // Process the data and create charts
    processDataAndCreateCharts();
};

// Function to process data and create charts
function processDataAndCreateCharts() {
    // Destroy existing charts if they exist
    if (chart1) chart1.destroy();
    if (chart2) chart2.destroy();
    if (chart3) chart3.destroy();

    // Arrays to store the values for each axis
    let xValues = [];
    let yValues = [];
    let zValues = [];

    // Get the maximum number of frames
    maxFrames = globalPointsData.length;

    // Insert the points data into the arrays
    globalPointsData.forEach((point, index) => {
        xValues.push({x: index, y: point[0]});
        yValues.push({x: index, y: point[1]});
        zValues.push({x: index, y: point[2]});
    });

    // Preparing datasets for Chart.js
    const xDataset = {
        label: 'X Axis',
        data: xValues,
        borderColor: '#a83232',
        fill: false
    };
    const yDataset = {
        label: 'Y Axis',
        data: yValues,
        borderColor: '#32a832',
        fill: false
    };
    const zDataset = {
        label: 'Z Axis',
        data: zValues,
        borderColor: '#3232a8',
        fill: false
    };

    // Create charts
    createCharts(xDataset, yDataset, zDataset);
}

// Function to create charts
function createCharts(xDataset, yDataset, zDataset) {
    // Chart.js options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                min: 0,
                max: maxFrames - 1,
                ticks: {
                    stepSize: 1, // One tick per frame
                    callback: function(value, index, values) {
                        return `${value + 1}. Frame`;
                    },
                    autoSkip: true, // Allow skipping of ticks
                },
                title: {
                    display: true,
                    text: 'Time'
                },
            },
            y: {
                type: 'linear',
                position: 'left',
                title: {
                    display: true,
                    text: 'Position of Selected Point'
                }

            }
        }
    };

    // Creating the charts
    chart1 = new Chart(document.getElementById('chart1'), {
        type: 'line',
        data: { datasets: [xDataset] },
        options: {
            ...chartOptions, 
            scales: {
                ...chartOptions.scales, 
                y: {
                    ...chartOptions.scales.y, 
                    title: {
                        ...chartOptions.scales.y.title, 
                        text: 'Position of Selected Point in X Axis' 
                    }
                }
            }
        }
    });

    chart2 = new Chart(document.getElementById('chart2'), {
        type: 'line',
        data: { datasets: [yDataset] },
        options: {
            ...chartOptions, 
            scales: {
                ...chartOptions.scales, 
                y: {
                    ...chartOptions.scales.y, 
                    title: {
                        ...chartOptions.scales.y.title, 
                        text: 'Position of Selected Point in Y Axis' 
                    }
                }
            }
        }
    });

    chart3 = new Chart(document.getElementById('chart3'), {
        type: 'line',
        data: { datasets: [zDataset] },
        options: {
            ...chartOptions, 
            scales: {
                ...chartOptions.scales, 
                y: {
                    ...chartOptions.scales.y, 
                    title: {
                        ...chartOptions.scales.y.title, 
                        text: 'Position of Selected Point in Z Axis' 
                    }
                }
            }
        }
    });


}

// Resize event listener
window.addEventListener('resize', function() {
    // Re-process the data and re-create the charts
    processDataAndCreateCharts();
});
