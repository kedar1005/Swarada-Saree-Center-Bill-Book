document.addEventListener('DOMContentLoaded', () => {
    const billForm = document.getElementById('billForm');
    const billDetails = document.getElementById('billDetails');
    const printBillBtn = document.getElementById('printBillBtn');
    const printAddressBtn = document.getElementById('printAddressBtn');
    const totalBillsElement = document.getElementById('totalBills');
    const totalAmountElement = document.getElementById('totalAmount');
    const searchBtn = document.getElementById('searchBtn');
    const searchResults = document.getElementById('searchResults');

    let totalBills = 0;
    let totalAmount = 0;

    // Handle Bill Generation
    billForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(billForm);

        const response = await fetch('/api/bills', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (data.success) {
            totalBills++;
            totalAmount += parseFloat(data.billAmount);

            totalBillsElement.textContent = totalBills;
            totalAmountElement.textContent = totalAmount.toFixed(2);

            const photo = data.productPhoto
                ? `<img src="${data.productPhoto}" alt="Product Photo" width="100">`
                : '';
            billDetails.innerHTML = `
                <div class="bill">
                    <h2>Swarada Saree Center</h2>
                    <p><strong>Name:</strong> ${data.customerName}</p>
                    <p><strong>Address:</strong> ${data.customerAddress}</p>
                    <p><strong>Phone:</strong> ${data.customerPhone}</p>
                    <p><strong>Date:</strong> ${data.billDate}</p>
                    <p><strong>Amount:</strong> ₹${data.billAmount}</p>
                    ${photo}
                </div>
            `;
            document.getElementById('billOutput').style.display = 'block';
        }
    });

    // Handle Print Bill
    printBillBtn.addEventListener('click', () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Bill</title>
                    <style>
                        .bill {
                            font-family: Arial, sans-serif;
                            margin: 20px;
                            padding: 20px;
                            border: 1px solid #ddd;
                            border-radius: 10px;
                            background-color: #f9f9f9;
                        }
                        .bill h2 {
                            text-align: center;
                            color: #333;
                        }
                        .bill p {
                            margin: 5px 0;
                        }
                    </style>
                </head>
                <body>
                    ${billDetails.innerHTML}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    });

    // Handle Print Address
    printAddressBtn.addEventListener('click', () => {
        const name = document.querySelector('#billDetails .bill p:nth-child(2)').textContent;
        const address = document.querySelector('#billDetails .bill p:nth-child(3)').textContent;
        const phone = document.querySelector('#billDetails .bill p:nth-child(4)').textContent;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Address</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 20px;
                        }
                        p {
                            margin: 5px 0;
                        }
                    </style>
                </head>
                <body>
                    <p>${name}</p>
                    <p>${address}</p>
                    <p>${phone}</p>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    });

    // Handle Search
    searchBtn.addEventListener('click', async () => {
        const query = document.getElementById('searchInput').value;

        const response = await fetch(`/api/search?name=${query}`);
        const results = await response.json();

        if (results.length > 0) {
            searchResults.innerHTML = results
                .map(
                    (customer) => `
                <div>
                    <p><strong>Name:</strong> ${customer.customerName}</p>
                    <p><strong>Phone:</strong> ${customer.customerPhone}</p>
                    <p><strong>Address:</strong> ${customer.customerAddress}</p>
                </div>`
                )
                .join('');
        } else {
            searchResults.innerHTML = '<p>No results found.</p>';
        }
    });
});
