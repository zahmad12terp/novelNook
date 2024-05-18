const readingSubjects = [
  "fantasy",
  "biography",
  "history",
  "self help",
  "psychology",
  "science",
  "philosophy",
  "art",
  "business",
  "politics",
  "travel",
  "food",
  "technology",
  "health",
  "nutrition",
  "fitness",
  "mental health",
  "education",
  "miscellaneous",
  "poetry",
  "short stories",
  "essays",
  "comics",
  "magazines"
];


function getRandomSubject(list_of_subjects) {
  const randomIndex = Math.floor(Math.random() * list_of_subjects.length);
  return list_of_subjects[randomIndex];
}

function getRandomObject(data) {
  const worksArray = data.works;
  const randomIndex = Math.floor(Math.random() * worksArray.length);
  return worksArray[randomIndex];
}

async function getDescription(isbn) {
  try {
    const response = await fetch(`https://openlibrary.org/books/${isbn}.json`);
    const data = await response.json();
    const bookDescription = data.description ? data.description.value : 'Not found';
    if (!bookDescription) throw new Error("Description not found");
    return bookDescription;
  } catch (error) {
    console.error('Error Getting book description:', error);
    return "Description not available";
  }
}

async function getBookCover(isbn) {
  const url = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch book cover');
    return response.url;
  } catch (error) {
    console.error('Error fetching book cover:', error);
    return null;
  }
}

async function getRandomBook() {
  const randomSubject = getRandomSubject(readingSubjects);
  console.log('Random Subject:', randomSubject);

  try {
    const response = await fetch(`https://openlibrary.org/subjects/${randomSubject}.json?details=false`);
    const data = await response.json();
    const bookToShow = getRandomObject(data);
    const { title, authors, subject, availability } = bookToShow;

    if (!availability || !availability.isbn) throw new Error('Book availability is undefined or ISBN is missing');

    const bookIsbn = availability.isbn;
    const bookDetailsPromise = getDescription(bookIsbn);
    const bookCoverPromise = getBookCover(bookIsbn);

    const [description, bookCover] = await Promise.all([bookDetailsPromise, bookCoverPromise]);
    const authorName = authors[0].name;
    const genre = subject[0];

    const bookData = {
      title,
      authorName,
      genre,
      description,
      bookCover,
      bookIsbn
    };

    console.log('Book Data:', bookData);
    return bookData;
  } catch (error) {
    console.error('Error fetching random book:', error);
    return null;
  }
}

function setBook(bookData) {
  if (!bookData) {
    console.error('No book data provided');
    return;
  }

  console.log('Book Data:', JSON.stringify(bookData, null, 2));

  document.getElementById('title').textContent = `Book Title: ${bookData.title}`;
  document.getElementById('author').textContent = `Book Author: ${bookData.authorName}`;
  document.getElementById('genre').textContent = `Book Genre: ${bookData.genre}`;
  document.getElementById('description').textContent = `Description: ${bookData.description}`;
  if (bookData.bookCover) {
    document.getElementById('book-cover').src = bookData.bookCover;
  } else {
    document.getElementById('book-cover').alt = 'No cover available';
  }
}

async function displayRandomBook() {
  const bookData = await getRandomBook();
  setBook(bookData);
}

// Call displayRandomBook to fetch and display a random book
displayRandomBook();