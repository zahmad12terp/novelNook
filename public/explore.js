let currentBookIndex = -1;
let bookHistory = [];

const readingSubjects = [
  "fantasy", "biography", "history", "self help", "psychology", "science", "philosophy",
  "art", "business", "politics", "travel", "food", "technology", "health", "nutrition",
  "fitness", "mental health", "education", "miscellaneous", "poetry", "short stories",
  "essays", "comics", "magazines", "mystery", "thriller", "romance", "young adult",
  "children", "horror", "drama", "adventure", "science fiction", "religion", "spirituality",
  "cookbooks", "gardening", "memoir", "true crime", "sports", "music", "crafts", "hobbies",
  "nature", "animals", "environment", "sociology", "anthropology", "linguistics",
  "economics", "law", "media", "photography", "theater", "dance", "architecture", "fashion",
  "design", "mathematics", "astronomy", "astrology", "folklore", "mythology", "computers",
  "programming", "literature", "writing", "language learning", "linguistics", "communication",
  "urban planning", "cultural studies", "fine arts", "graphic design", "web development",
  "data science", "machine learning", "artificial intelligence", "cybersecurity", "networking",
  "blockchain", "game development", "virtual reality", "augmented reality", "robotics",
  "nanotechnology", "biotechnology", "environmental science", "climate change", "geology",
  "oceanography", "marine biology", "ecology", "sustainability", "energy", "renewable energy",
  "green living", "sustainable agriculture", "permaculture", "wildlife conservation", "zoology",
  "astronomy", "cosmology", "astrophysics", "quantum physics", "particle physics", "string theory",
  "philosophy of science", "logic", "ethics", "metaphysics", "epistemology", "aesthetics",
  "existentialism", "phenomenology", "postmodernism", "feminist theory", "critical theory",
  "queer theory", "postcolonialism", "decolonial theory", "marxism", "liberalism", "conservatism",
  "feminism", "intersectionality", "race studies", "gender studies", "sexuality studies",
  "disability studies", "migration studies", "globalization", "international relations",
  "peace studies", "conflict resolution", "development studies", "human rights", "social justice",
  "political philosophy", "philosophy of mind", "consciousness studies", "neuroscience",
  "cognitive science", "psychiatry", "psychotherapy", "counseling", "positive psychology",
  "mindfulness", "meditation", "yoga", "alternative medicine", "holistic health", "nutrition",
  "wellness", "alternative lifestyles", "minimalism", "sustainability", "eco-friendly living",
  "veganism", "vegetarianism", "zero waste lifestyle", "sustainable fashion", "ethical consumerism",
  "fair trade", "social entrepreneurship", "nonprofit management", "corporate social responsibility",
  "social innovation", "community development", "youth development", "urban development", "rural development",
  "educational technology", "online learning", "educational psychology", "curriculum design",
  "pedagogy", "early childhood education", "primary education", "secondary education", "higher education",
  "adult education", "special education", "inclusive education", "educational leadership", "educational policy",
  "educational reform", "educational equity", "educational assessment", "educational research", "educational philosophy",
  "educational theory", "educational sociology", "educational history", "educational anthropology", "educational linguistics",
  "educational technology", "instructional design", "e-learning", "blended learning", "mobile learning",
  "game-based learning", "project-based learning", "peer-to-peer learning", "personalized learning",
  "adaptive learning", "machine learning", "artificial intelligence", "educational games", "educational apps",
  "educational software", "assessment tools", "learning analytics", "educational data mining", "learning sciences",
  "cognitive psychology", "behavioral psychology", "developmental psychology", "social psychology",
  "educational psychology", "positive psychology", "neuropsychology", "forensic psychology", "clinical psychology",
  "counseling psychology", "school psychology", "health psychology", "sport psychology", "community psychology",
  "cross-cultural psychology", "industrial-organizational psychology", "human factors psychology", "environmental psychology",
  "personality psychology", "abnormal psychology", "experimental psychology"
];

function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }
  return response.json();
}

async function getDescription(olid) {
  try {
    const response = await fetch(`https://openlibrary.org/works/${olid}.json`);
    const data = await response.json();
    console.log('Book data for description:', data.description);

    return data.description ? data.description.value : 'Description not found';
  } catch (error) {
    console.error('Error Getting book description:', error);
    return 'Description not found';
  }
}

async function getBookCover(isbn) {
  const url = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch book cover');
    }
    return response.url;
  } catch (error) {
    console.error('Error fetching book cover:', error);
    return ''; // Use a default cover image
  }
}

function getRandomObject(data) {
  const worksArray = data.works;
  const randomIndex = Math.floor(Math.random() * worksArray.length);
  return worksArray[randomIndex];
}

async function getRandomBook() {
  const randomSubject = getRandomElement(readingSubjects);
  console.log('Random Subject:', randomSubject);

  try {
    const data = await fetchJson(`https://openlibrary.org/subjects/${randomSubject}.json?details=false`);
    const bookToShow = getRandomObject(data);

    const { title, authors, subject } = bookToShow;
    if (!bookToShow.availability || !bookToShow.availability.isbn) {
      throw new Error('Book availability is undefined or ISBN is missing');
    }

    const bookOlid = bookToShow.availability.openlibrary_work;
    const bookIsbn = bookToShow.availability.isbn;
    const authorName = authors ? authors[0].name : 'Author not found';
    const genre = subject ? subject[0] : 'Genre not found';

    const description = await getDescription(bookOlid);
    const bookCover = await getBookCover(bookIsbn);

    const bookData = {
      title: title || 'Title not found',
      authorName,
      genre,
      description,
      bookCover,
      bookOlid,
      bookIsbn
    };

    return bookData;
  } catch (error) {
    console.error('Error fetching random book:', error);
    return getRandomBook(); // Retry fetching a random book
  }
}

function setBook(bookData) {
  if (!bookData) {
    console.error('No book data provided');
    return;
  }

  console.log('Book Data:', JSON.stringify(bookData, null, 2));

  document.getElementById('title').textContent = bookData.title;
  document.getElementById('author').textContent = `Author: ${bookData.authorName}`;
  document.getElementById('genre').textContent = `Genre: ${bookData.genre}`;
  document.getElementById('description').textContent = `Description: ${bookData.description}`;
  if (bookData.bookCover) {
    document.getElementById('book-cover').src = bookData.bookCover;
  } else {
    document.getElementById('book-cover').src = 'default_cover.jpg';
    document.getElementById('book-cover').alt = 'No cover available';
  }
}

async function displayRandomBook() {
  const bookData = await getRandomBook();
  bookHistory.push(bookData);
  currentBookIndex = bookHistory.length - 1;
  setBook(bookData);
}

document.getElementById('next-book').addEventListener('click', async () => {
  if (currentBookIndex < bookHistory.length - 1) {
    currentBookIndex++;
    setBook(bookHistory[currentBookIndex]);
  } else {
    await displayRandomBook();
  }
});

document.getElementById('prev-book').addEventListener('click', () => {
  if (currentBookIndex > 0) {
    currentBookIndex--;
    setBook(bookHistory[currentBookIndex]);
  }
});

// Function to store book data in Supabase
async function storeBookData(bookData) {
  const token = localStorage.getItem('token'); // Assuming you are using a JWT token for authentication
  if (!token) {
    alert('You need to be logged in to like a book.');
    return;
  }

  const payload = {
    olid: bookData.bookOlid,
    isbn: bookData.bookIsbn,
    book_title: bookData.title,
    book_genre: bookData.genre,
    book_description: bookData.description,
    book_author: bookData.authorName
  };

  try {
    const response = await fetch('/store-book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Failed to store book data');
    }

    alert('Book liked and added to your collection!');
  } catch (error) {
    console.error('Error storing book data:', error);
    alert('An error occurred while storing the book data.');
  }
}

document.querySelector('.like-button').addEventListener('click', async function () {
  const bookData = bookHistory[currentBookIndex];
  await storeBookData(bookData);
});

// Call displayRandomBook to fetch and display a random book on page load
window.onload = displayRandomBook;
