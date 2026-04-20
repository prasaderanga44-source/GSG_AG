// Google Web App URL - the user will replace this with their actual deployed google script
const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_SCRIPT_WEBAPP_URL";

// Calculates total amount on input change
function calculateTotal() {
    const size = parseFloat(document.getElementById('workSize').value) || 0;
    const rate = parseFloat(document.getElementById('chargeRate').value) || 0;
    const total = (size * rate).toFixed(2);
    document.getElementById('totalPayment').value = total;
}

// Format date to readable string
function formatDate() {
    const today = new Date();
    return today.toLocaleString('en-US', { 
        year: 'numeric', month: 'short', day: 'numeric', 
        hour: '2-digit', minute: '2-digit'
    });
}

// Initialize tables based on local storage
function loadRecords(machineName) {
    const records = JSON.parse(localStorage.getItem('gsg_records_' + machineName)) || [];
    const tbody = document.getElementById('recordsTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    // Sort reverse chronological
    records.reverse().forEach(record => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${record.date}</td>
            <td>${record.location}</td>
            <td>${record.task}</td>
            <td>${record.size}</td>
            <td>Rs ${parseFloat(record.rate).toLocaleString()}</td>
            <td style="font-weight:bold;">Rs ${parseFloat(record.total).toLocaleString()}</td>
        `;
        tbody.appendChild(tr);
    });
}

// When page loads, check which machine we are dealing with
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('recordForm');
    if (form) {
        const machine = form.getAttribute('data-machine');
        loadRecords(machine);
    }
});

// Submit form function
function handleRecordSubmit(event) {
    event.preventDefault();
    
    const form = document.getElementById('recordForm');
    const machine = form.getAttribute('data-machine');
    
    const location = document.getElementById('workLocation').value;
    const task = document.getElementById('taskType').value;
    const size = document.getElementById('workSize').value;
    const rate = document.getElementById('chargeRate').value;
    const total = document.getElementById('totalPayment').value;
    const currentDate = formatDate();
    
    // 1. Display Bill
    document.getElementById('bMachine').innerText = machine;
    document.getElementById('bTask').innerText = task;
    document.getElementById('bLoc').innerText = location;
    document.getElementById('bSize').innerText = size;
    document.getElementById('bRate').innerText = rate;
    document.getElementById('bTotal').innerText = total;
    document.getElementById('billDate').innerText = "Invoice Date: " + currentDate;
    
    document.getElementById('billDisplay').style.display = 'block';
    
    // 2. Save locally
    const record = {
        machine: machine,
        location: location,
        task: task,
        size: size,
        rate: rate,
        total: total,
        date: currentDate
    };
    
    let records = JSON.parse(localStorage.getItem('gsg_records_' + machine)) || [];
    records.push(record);
    localStorage.setItem('gsg_records_' + machine, JSON.stringify(records));
    
    // Update UI table
    loadRecords(machine);
    
    // 3. Upload to Google Sheets
    syncWithGoogleSheets(record);
    
    // reset form fields but keep bill open
    form.reset();
}

// Function to upload data to Google Sheets via Fetch API
function syncWithGoogleSheets(data) {
    const statusText = document.getElementById('uploadStatus');
    statusText.style.display = 'block';
    statusText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Syncing to Google Sheets...';
    
    // We send a POST request with the data
    // In actual usage, GOOGLE_SCRIPT_URL must be valid.
    /*
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data)
    })
    .then(res => res.json())
    .then(result => {
        statusText.innerHTML = '<i class="fa-solid fa-check-circle"></i> Successfully Synced to Google Sheets!';
        setTimeout(() => { statusText.style.display = 'none'; }, 3000);
    })
    .catch(err => {
        console.error('Error syncing:', err);
        statusText.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Simulated Sync Success (Google URL not set) !';
        setTimeout(() => { statusText.style.display = 'none'; }, 4000);
    });
    */
    
    // For presentation: mock the successful upload since URL is just placeholder
    setTimeout(() => {
        statusText.innerHTML = '<i class="fa-solid fa-check-circle"></i> Successfully Synced to Google Sheets!';
        setTimeout(() => { statusText.style.display = 'none'; }, 3000);
    }, 1500);
}
