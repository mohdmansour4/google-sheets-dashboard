// Your updated Google OAuth client credentials
const CLIENT_ID = '1065961533552-4ukc1utf902uldqfq3nvcmrohjehbd2e.apps.googleusercontent.com'; // From your uploaded file
const API_KEY = 'AIzaSyD6eAikKznWps9K8GcflqPy03-L7KTUaWE'; // Your API key
const SPREADSHEET_ID = '1bZIxAmb2-E3naVHbggvAs4nOAUi0J6XIcGMyU2Bmc5w'; // Your Spreadsheet ID
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets'; // Full access to Google Sheets
const DISCOVERY_DOCS = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];

// Function to initialize the Google API client and handle OAuth2
function initClient() {
    gapi.load('client:auth2', () => {
        gapi.auth2.init({
            client_id: CLIENT_ID,
            scope: SCOPE,
        }).then(() => {
            gapi.client.init({
                apiKey: API_KEY,
                discoveryDocs: DISCOVERY_DOCS
            }).then(() => {
                updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
                gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
            }).catch((error) => {
                console.error('Error initializing Google API client:', error);
            });
        }).catch((error) => {
            console.error('Error initializing OAuth2:', error);
        });
    });
}

// Function to handle sign-in status
function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
        getData(); // Fetch data if signed in
    } else {
        gapi.auth2.getAuthInstance().signIn(); // Prompt the user to sign in
    }
}

// Function to fetch data from Google Sheets
function getData() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Drip & COTD!A12:S',
    }).then((response) => {
        const data = response.result.values;
        displayData(data);
    }).catch((error) => {
        console.error('Error fetching data:', error);
    });
}

// Function to update checkbox in Google Sheets
function updateCheckbox(row, value) {
    const rowNumber = row + 12; // Adjust to match the row in the Google Sheet (start from S12)
    const range = `Drip & COTD!S${rowNumber}`;

    gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: range,
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: [[value ? 'TRUE' : 'FALSE']]
        }
    }).then(response => {
        console.log('Checkbox successfully updated:', response);
        getData(); // Re-fetch the data to reflect the new checkbox value
    }).catch(error => {
        console.error('Error updating checkbox:', error);
    });
}

// Function to display the filtered and sorted data (with editable checkboxes)
function displayData(data) {
    console.log("Displaying data...");
    const sortedData = sortDataByDate(data);

    let html = '<table border="1" style="direction: rtl; text-align: center;">';
    html += '<tr><th>التاريخ</th><th>اسم الموظف</th><th>المحصول</th><th>نسبة التركيز TDS%</th><th>الفرع</th><th>الطحنة</th><th>التركيز المناسب TDS%</th><th>الاجراء</th><th>Column S (Checkbox)</th></tr>';

    sortedData.forEach((row, index) => {
        const columnS = row[18] === 'TRUE' ? true : false; // Checkbox value in Column S

        html += `<tr>
                    <td>${row[0] || ''}</td>
                    <td>${row[1] || ''}</td>
                    <td>${row[3] || ''}</td>
                    <td>${row[6] || ''}</td>
                    <td>${row[10] || ''}</td>
                    <td>${row[11] || ''}</td>
                    <td>${row[13] || ''}</td>
                    <td>${row[16] || ''}</td>
                    <td><input type="checkbox" ${columnS ? 'checked' : ''} onchange="updateCheckbox(${index}, this.checked)"></td>
                </tr>`;
    });

    html += '</table>';
    $('#dashboard').html(html);
    console.log("Data displayed successfully.");
}

// Function to sort data by date (newest to oldest)
function sortDataByDate(data) {
    return data.sort((a, b) => {
        const dateA = parseDate(a[0]); // Assuming column A is the date
        const dateB = parseDate(b[0]);
        return dateB - dateA; // Sort by date in descending order (newest first)
    });
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

// Initialize the client when the document is ready
$(document).ready(function() {
    console.log("Document is ready. Loading Google API client...");
    gapi.load('client:auth2', initClient); // Load the API client and initialize it

    // Set up event listener for the "Apply Filter" button
    const applyFilterButton = document.getElementById('applyFilter');
    if (applyFilterButton) {
        applyFilterButton.addEventListener('click', () => {
            getData(); // Re-fetch and filter the data based on selected dates
        });
    }
});
