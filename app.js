// Your updated Google Sheets API key and Spreadsheet ID
const API_KEY = 'AIzaSyD6eAikKznWps9K8GcflqPy03-L7KTUaWE'; // Your API Key
const SPREADSHEET_ID = '1bZIxAmb2-E3naVHbggvAs4nOAUi0J6XIcGMyU2Bmc5w'; // Your Spreadsheet ID
const RANGE = 'Drip & COTD!A12:Q'; // The range from A12 to Q12

// Function to initialize the Google API client
function initClient() {
    console.log("Initializing Google API client...");
    gapi.load('client', () => {
        gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        }).then(() => {
            console.log("Google API client initialized successfully.");
            getData(); // Fetch data initially
        }).catch((error) => {
            console.error('Error initializing Google API client:', error);
        });
    });
}

// Function to fetch data from Google Sheets
function getData() {
    console.log("Fetching data from Google Sheets...");
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
    }).then((response) => {
        const data = response.result.values;
        if (data && data.length > 0) {
            console.log("Data retrieved:", data);
            const filteredData = filterDataByDate(data);
            displayData(filteredData); // Display filtered data
        } else {
            console.log('No data found.');
            $('#dashboard').html('<p>No data found in the specified range.</p>');
        }
    }).catch((error) => {
        console.error('Error fetching data:', error);
    });
}

// Function to filter data by date range (default last 30 days)
function filterDataByDate(data) {
    const startDateInput = document.getElementById('startDate').value;
    const endDateInput = document.getElementById('endDate').value;
    
    const today = new Date();
    const defaultStartDate = new Date(today.setDate(today.getDate() - 30)); // 30 days ago
    const startDate = startDateInput ? new Date(startDateInput) : defaultStartDate;
    const endDate = endDateInput ? new Date(endDateInput) : new Date(); // Default to today

    console.log(`Filtering data between ${startDate} and ${endDate}`);

    // Filter the data where the date in Column A is within the selected range
    return data.filter(row => {
        const rowDate = new Date(row[0]); // Assuming column A contains the date
        return rowDate >= startDate && rowDate <= endDate;
    });
}

// Function to display the filtered data (with conditional formatting)
function displayData(data) {
    console.log("Displaying data...");
    let html = '<table border="1"><tr><th>Date</th><th>Employee Name</th><th>Column D</th><th>Column G</th><th>Column L</th><th>Column N</th><th>Column Q</th></tr>';
    
    data.forEach((row, index) => {
        const columnQ = row[16] || ''; // Column Q value (text)
        let color = '';
        if (columnQ.includes('تنعيم، خروج عالي عن المستهدف') || columnQ.includes('تخشين، خروج عالي عن المستهدف')) {
            color = 'red';
        } else if (columnQ.includes('تخشين، خروج بسيط عن المستهدف') || columnQ.includes('تنعيم، خروج بسيط عن المستهدف')) {
            color = 'yellow';
        } else if (columnQ.includes('ضمن المدى المستهدف للمحصول')) {
            color = 'green';
        }

        html += `<tr>
                    <td>${row[0] || ''}</td>
                    <td>${row[1] || ''}</td>
                    <td>${row[3] || ''}</td>
                    <td>${row[6] || ''}</td>
                    <td>${row[11] || ''}</td>
                    <td>${row[13] || ''}</td>
                    <td style="background-color:${color}">${columnQ}</td>
                </tr>`;
    });

    html += '</table>';
    $('#dashboard').html(html);
    console.log("Data displayed successfully.");
}

// Initialize the client when the document is ready
$(document).ready(function() {
    console.log("Document is ready. Loading Google API client...");
    gapi.load('client', initClient); // Load the API client and initialize it

    // Set up event listener for the "Apply Filter" button
    document.getElementById('applyFilter').addEventListener('click', () => {
        getData(); // Re-fetch and filter the data based on selected dates
    });
});
