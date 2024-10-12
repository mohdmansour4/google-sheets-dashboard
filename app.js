// Your updated Google Sheets API key and Spreadsheet ID
const API_KEY = 'AIzaSyD6eAikKznWps9K8GcflqPy03-L7KTUaWE'; // Your new API Key
const SPREADSHEET_ID = '1bZIxAmb2-E3naVHbggvAs4nOAUi0J6XIcGMyU2Bmc5w'; // Your Spreadsheet ID
const RANGE = 'Drip & COTD!A12:Q'; // The range from A12 to Q12

// Function to initialize the Google API client
function initClient() {
    gapi.load('client', () => {
        gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        }).then(() => {
            getData(); // Call the function to get data once the client is initialized
        }).catch((error) => {
            console.error('Error loading GAPI client for API', error);
        });
    });
}

// Function to fetch data from the Google Sheet and filter it by the last 30 days
function getData() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
    }).then((response) => {
        const data = response.result.values; // Get the values from the response
        if (data && data.length > 0) {
            // Filter the data to only show rows where the date (column A) is within the last 30 days
            const filteredData = filterLast30Days(data);
            displayData(filteredData); // Display the filtered data
        } else {
            console.log('No data found.');
            $('#dashboard').html('<p>No data found in the specified range.</p>');
        }
    }).catch((error) => {
        console.error('Error fetching data', error);
    });
}

// Function to filter data for the last 30 days (assumes column A holds the date)
function filterLast30Days(data) {
    const today = new Date();
    const last30Days = new Date(today.setDate(today.getDate() - 30));
    
    return data.filter(row => {
        const dateStr = row[0]; // Assuming column A contains the date in each row
        const rowDate = new Date(dateStr);
        return rowDate >= last30Days; // Only include rows from the last 30 days
    });
}

// Function to display the filtered data (only showing columns A, B, D, G, L, N, Q)
function displayData(data) {
    let html = '<table border="1"><tr><th>Date</th><th>Employee Name</th><th>Column D</th><th>Column G</th><th>Column L</th><th>Column N</th><th>Column Q</th></tr>';
    data.forEach(row => {
        html += <tr>
                    <td>${row[0] || ''}</td> <!-- Column A: Date -->
                    <td>${row[1] || ''}</td> <!-- Column B -->
                    <td>${row[3] || ''}</td> <!-- Column D -->
                    <td>${row[6] || ''}</td> <!-- Column G -->
                    <td>${row[11] || ''}</td> <!-- Column L -->
                    <td>${row[13] || ''}</td> <!-- Column N -->
                    <td>${row[16] || ''}</td> <!-- Column Q -->
                </tr>;
    });
    html += '</table>';
    $('#dashboard').html(html); // Update the dashboard with the generated HTML
}

// Initialize the client when the document is ready
$(document).ready(function() {
    gapi.load('client', initClient); // Load the API client and initialize it
});
