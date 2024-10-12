// Corrected API Key and Spreadsheet ID Declaration
const API_KEY = 'AIzaSyD6eAikKznWps9K8GcflqPy03-L7KTUaWE'; // Your Google API Key
const SPREADSHEET_ID = '1bZIxAmb2-E3naVHbggvAs4nOAUi0J6XIcGMyU2Bmc5w'; // Your Spreadsheet ID
const RANGE = 'Drip & COTD!A12:Q'; // The range from A12 to Q12

// Function to initialize the Google API client
function initClient() {
    console.log("Initializing Google API client..."); // Debugging log
    gapi.load('client', () => {
        gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        }).then(() => {
            console.log("Google API client initialized successfully."); // Debugging log
            getData(); // Call the function to get data once the client is initialized
        }).catch((error) => {
            console.error('Error initializing Google API client:', error); // Log any errors
        });
    });
}

// Function to fetch data from the Google Sheet
function getData() {
    console.log("Fetching data from Google Sheets..."); // Debugging log
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
    }).then((response) => {
        console.log("API Response:", response); // Log the entire API response
        const data = response.result.values;
        if (data && data.length > 0) {
            console.log("Data retrieved:", data); // Log the data received
            displayData(data); // Display the filtered data
        } else {
            console.log('No data found.');
            $('#dashboard').html('<p>No data found in the specified range.</p>');
        }
    }).catch((error) => {
        console.error('Error fetching data:', error); // Log the error in the console
    });
}

// Function to display the filtered data (with conditional formatting)
function displayData(data) {
    console.log("Displaying data..."); // Debugging log
    let html = '<table border="1"><tr><th>Date</th><th>Employee Name</th><th>Column D</th><th>Column G</th><th>Column L</th><th>Column N</th><th>Column Q</th></tr>';
    
    data.forEach((row, index) => {
        const columnQ = row[16] || ''; // Column Q value (text)
        console.log(`Row ${index + 1} data:`, row); // Log each row data

        // Determine the color based on the text in column Q
        let color = '';
        if (columnQ.includes('تنعيم، خروج عالي عن المستهدف') || columnQ.includes('تخشين، خروج عالي عن المستهدف')) {
            color = 'red'; // Apply red color for high deviation
        } else if (columnQ.includes('تخشين، خروج بسيط عن المستهدف') || columnQ.includes('تنعيم، خروج بسيط عن المستهدف')) {
            color = 'yellow'; // Apply yellow color for slight deviation
        } else if (columnQ.includes('ضمن المدى المستهدف للمحصول')) {
            color = 'green'; // Apply green color for within target range
        }
        
        console.log(`Row ${index + 1} color:`, color); // Log the chosen color

        html += `<tr>
                    <td>${row[0] || ''}</td> <!-- Column A: Date -->
                    <td>${row[1] || ''}</td> <!-- Column B -->
                    <td>${row[3] || ''}</td> <!-- Column D -->
                    <td>${row[6] || ''}</td> <!-- Column G -->
                    <td>${row[11] || ''}</td> <!-- Column L -->
                    <td>${row[13] || ''}</td> <!-- Column N -->
                    <td style="background-color:${color}">${columnQ}</td> <!-- Column Q with conditional formatting -->
                </tr>`;
    });

    html += '</table>';
    $('#dashboard').html(html); // Update the dashboard with the generated HTML
    console.log("Data displayed successfully."); // Debugging log
}

// Initialize the client when the document is ready
$(document).ready(function() {
    console.log("Document is ready. Loading Google API client...");
    gapi.load('client', initClient); // Load the API client and initialize it
});
