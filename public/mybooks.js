document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('token'); // Assuming you are using a JWT token for authentication
    if (!token) {
      alert('You need to be logged in to view your book collection.');
      return;
    }
  
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
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${book.book_title}</td>
          <td>${book.book_author}</td>
          <td>${book.book_genre}</td>
          <td>${book.book_description}</td>
          <td>${book.isbn}</td>
        `;
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Error fetching book collection:', error);
      alert('An error occurred while fetching your book collection.');
    }
  });
  