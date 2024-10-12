function displayData(data) {
    console.log("Displaying data..."); // Debugging log
    let html = '<table border="1"><tr><th>Date</th><th>Employee Name</th><th>Column D</th><th>Column G</th><th>Column L</th><th>Column N</th><th>Column Q</th></tr>';
    
    data.forEach(row => {
        const columnQ = row[16] || ''; // Column Q value (text)

        // Apply green color only if the text matches "ضمن المدى المستهدف للمحصول"
        let color = '';
        if (columnQ.includes('ضمن المدى المستهدف للمحصول')) {
            color = 'green'; // Apply green color
        }

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
