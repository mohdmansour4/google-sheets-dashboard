// Function to fetch data from the Google Sheet and filter it by the last 30 days
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
