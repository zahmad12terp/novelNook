document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('token'); // Assuming you are using a JWT token for authentication
    if (!token) {
        alert('You need to be logged in to view your book collection.');
        return;
    }

    // Decode the token to get user information
    const payload = JSON.parse(atob(token.split('.')[1]));
    const username = payload.username; // Extract the username from the payload

    try {
        const response = await fetch('/mybooks', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch book collection');
        }

        const books = await response.json();
        const tableBody = document.querySelector('#books-table tbody');
        tableBody.innerHTML = '';

        books.forEach(book => {
            const amazonUrl = `https://www.amazon.com/s?i=stripbooks&rh=p_66%3A${book.isbn}&s=relevanceexprank&Adv-Srch-Books-Submit.x=30&Adv-Srch-Books-Submit.y=11&unfiltered=1&ref=sr_adv_b`;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><a href="${amazonUrl}" target="_blank">${book.book_title}</a></td>
                <td>${book.book_author}</td>
                <td>${book.book_genre}</td>
                <td>${book.book_description}</td>
                <td>${book.isbn}</td>
                <td><i class="fas fa-trash delete-icon" data-isbn="${book.isbn}" style="cursor: pointer;"></i></td>
            `;
            tableBody.appendChild(row);
        });

        // Add event listeners to delete icons
        const deleteIcons = document.querySelectorAll('.delete-icon');
        deleteIcons.forEach(icon => {
            icon.addEventListener('click', async function () {
                const isbn = this.getAttribute('data-isbn');
                try {
                    const response = await fetch('/delete-book', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ username: username, isbn: isbn }) // Use the extracted username
                    });

                    if (!response.ok) {
                        throw new Error('Failed to delete book');
                    }

                    alert('Book deleted successfully.');
                    // Refresh the page or remove the row from the table
                    this.closest('tr').remove();
                } catch (error) {
                    console.error('Error deleting book:', error);
                    alert('An error occurred while deleting the book.');
                }
            });
        });
    } catch (error) {
        console.error('Error fetching book collection:', error);
        alert('An error occurred while fetching your book collection.');
    }
});
