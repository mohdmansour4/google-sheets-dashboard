// Your updated Google Sheets API key and Spreadsheet ID
const API_KEY = 'AIzaSyD6eAikKznWps9K8GcflqPy03-L7KTUaWE'; // Your API Key
const SPREADSHEET_ID = '1bZIxAmb2-E3naVHbggvAs4nOAUi0J6XIcGMyU2Bmc5w'; // Your Spreadsheet ID
const RANGE = 'Drip & COTD!A12:Q'; // The range from A12 to Q (includes K)


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
        console.log("Raw Data from Google Sheets: ", data); // Log raw data from Google Sheets

        if (data && data.length > 0) {
            console.log("Data retrieved:", data);
            const filteredData = filterDataByDate(data);
            console.log("Filtered Data (after applying date filter): ", filteredData); // Log filtered data
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
    const startDateInput = document.getElementById('startDate') ? document.getElementById('startDate').value : null;
    const endDateInput = document.getElementById('endDate') ? document.getElementById('endDate').value : null;
    
    const today = new Date();
    const defaultStartDate = new Date(today.setDate(today.getDate() - 30)); // 30 days ago
    const startDate = startDateInput ? new Date(startDateInput) : defaultStartDate;
    const endDate = endDateInput ? new Date(endDateInput) : new Date(); // Default to today

    console.log(`Filtering data between ${startDate} and ${endDate}`);

    // Ensure the row date is correctly parsed and filter the data within the selected range
    const filteredData = data.filter(row => {
        const rowDateStr = row[0]; // Assuming column A contains the date as a string
        const rowDate = parseDate(rowDateStr); // Parse the date
        return rowDate >= startDate && rowDate <= endDate;
    });

    console.log("Filtered Data after date range:", filteredData); // Log the filtered data
    return filteredData;
}

// Helper function to parse the date from Google Sheets (adjust this to your format)
function parseDate(dateStr) {
    const dateParts = dateStr.split('/'); // Adjust this based on the actual date format in your sheet
    // Assuming the format is "MM/DD/YYYY" or "DD/MM/YYYY"
    if (dateParts.length === 3) {
        const month = parseInt(dateParts[0], 10) - 1; // JavaScript months are 0-based
        const day = parseInt(dateParts[1], 10);
        const year = parseInt(dateParts[2], 10);
        return new Date(year, month, day);
    }
    return new Date(dateStr); // Fallback for other date formats
}

// Function to display the filtered data (with conditional formatting)
function displayData(data) {
    console.log("Displaying data...");
    let html = '<table border="1" style="direction: rtl; text-align: center;"><tr><th>التاريخ</th><th>اسم الموظف</th><th>المحصول</th><th>نسبة التركيز TDS%</th><th>الفرع</th><th>الطحنة</th><th>التركيز المناسب TDS%</th><th>الاجراء</th></tr>';
    
    data.forEach((row, index) => {
        const columnQ = row[16] || ''; // Column Q value (text)
        const columnK = row[10] || ''; // New Column K value (adjust for zero-based index)
        let color = '';
        let textColor = '#000000'; // Setting text color to black as per the request

        if (columnQ.includes('تنعيم، خروج عالي عن المستهدف') || columnQ.includes('تخشين، خروج عالي عن المستهدف')) {
            color = '#f09c9c'; // Red color changed to #f09c9c
        } else if (columnQ.includes('تخشين، خروج بسيط عن المستهدف') || columnQ.includes('تنعيم، خروج بسيط عن المستهدف')) {
            color = '#6fc8b2'; // Yellow color changed to #6fc8b2
        } else if (columnQ.includes('ضمن المدى المستهدف للمحصول')) {
            color = '#bce1cd'; // Green color changed to #bce1cd
        }

        html += `<tr>
                    <td>${row[0] || ''}</td>
                    <td>${row[1] || ''}</td>
                    <td>${row[3] || ''}</td> <!-- Column D: المحصول -->
                    <td>${row[6] || ''}</td> <!-- Column G: نسبة التركيز TDS% -->
                    <td>${columnK || ''}</td> <!-- Column K: الفرع -->
                    <td>${row[11] || ''}</td> <!-- Column L: الطحنة -->
                    <td>${row[13] || ''}</td> <!-- Column N: التركيز المناسب TDS% -->
                    <td style="background-color:${color}; color:${textColor}; font-weight:bold;">${columnQ}</td> <!-- Column Q: الاجراء -->
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
    const applyFilterButton = document.getElementById('applyFilter');
    if (applyFilterButton) {
        applyFilterButton.addEventListener('click', () => {
            getData(); // Re-fetch and filter the data based on selected dates
        });
    }
});
