import '../../styles/styles_for_detailed.css';
import Chart from 'chart.js/auto';

// Global variable to store points data
let globalPointsData = [];
let globalAnomalyPointsData = [];
let chart1, chart2, chart3; // Chart instances
let maxFrames = 0; // Maximum number of frames

// Function to be called from the main window
window.setPointsData = function(pointsData, anomalyPointsData) {
    globalPointsData = pointsData;
    globalAnomalyPointsData = anomalyPointsData;
    console.log("Received points data:", pointsData);
    console.log("Received anomaly points data:", anomalyPointsData);

    // Check if the data is valid before processing
    if (!globalPointsData || !globalAnomalyPointsData) {
        console.error('Invalid data received for charts');
        return;
    }

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
        borderColor: 'orange',
        fill: false
    };
    const yDataset = {
        label: 'Y Axis',
        data: yValues,
        borderColor: 'green',
        fill: false
    };
    const zDataset = {
        label: 'Z Axis',
        data: zValues,
        borderColor: '#3232a8',
        fill: false
    };

    // Arrays to store the anomaly values for each axis
    let xAnomalyValues = [];
    let yAnomalyValues = [];
    let zAnomalyValues = [];

    // Insert the anomaly points data into the arrays
    globalAnomalyPointsData.forEach((anomalyPoint, index) => {
        if (anomalyPoint) { // Check if anomalyPoint is not null
            xAnomalyValues.push({x: index, y: anomalyPoint[0]});
            yAnomalyValues.push({x: index, y: anomalyPoint[1]});
            zAnomalyValues.push({x: index, y: anomalyPoint[2]});
        }
    });

    const anomalyColor = 'red';

    // Preparing anomaly datasets for Chart.js with distinct styling
    const anomalyPointStyle = {
        pointRadius: 7, // Larger radius for anomaly points
        pointBackgroundColor: anomalyColor, // Different color for anomaly points
        pointBorderColor: anomalyColor,
        borderColor: anomalyColor,
        showLine: false, // Only show points, no line
    };

    const xAnomalyDataset = {
        label: 'X Axis Anomalies',
        data: xAnomalyValues,
        ...anomalyPointStyle,
    };

    const yAnomalyDataset = {
        label: 'Y Axis Anomalies',
        data: yAnomalyValues,
        ...anomalyPointStyle,
    };

    const zAnomalyDataset = {
        label: 'Z Axis Anomalies',
        data: zAnomalyValues,
        ...anomalyPointStyle,
    };

    // Create charts
    createCharts(xDataset, yDataset, zDataset, xAnomalyDataset, yAnomalyDataset, zAnomalyDataset);
}

// Function to create charts
function createCharts(xDataset, yDataset, zDataset, xAnomalyDataset, yAnomalyDataset, zAnomalyDataset) {
    // Check if chart elements exist in the DOM
    if (!document.getElementById('chart1') || !document.getElementById('chart2') || !document.getElementById('chart3')) {
        console.error('Chart elements not found in the DOM');
        return;
    }
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


    // Adding anomaly datasets
    chart1.data.datasets.push(xAnomalyDataset);
    chart2.data.datasets.push(yAnomalyDataset);
    chart3.data.datasets.push(zAnomalyDataset);

    // Update charts to render the new datasets
    chart1.update();
    chart2.update();
    chart3.update();

}

// Resize event listener
window.addEventListener('resize', function() {
    // Re-process the data and re-create the charts
    processDataAndCreateCharts();
});
