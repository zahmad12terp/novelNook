let current_bookData 
let previous_bookData 


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
  "personality psychology", "abnormal psychology", "experimental"]

let currentBookIndex = -1;
let bookHistory = [];

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
    console.log('Book data for description: ' + data.description)
    
    const bookDescription = data.description ? data.description.value : 'Not found';

    if (bookDescription === 'Not found' || bookDescription === undefined) {
      throw new Error("Description not found");
    }

    return bookDescription;
  } catch (error) {
    console.error('Error Getting book description 1:', error);
    return null; 
  }
}

async function getRandomBook() {
  const randomSubject = getRandomElement(readingSubjects);
  console.log('Random Subject:', randomSubject);

  try {
    const response = await fetch(`https://openlibrary.org/subjects/${randomSubject}.json?details=false`);
    const data = await response.json();

    const bookToShow = getRandomObject(data);
    const { title, authors, subject } = bookToShow;

    if (!bookToShow.availability || !bookToShow.availability.isbn) {
      throw new Error('Book availability is undefined or ISBN is missing');
    }

    const bookOlid = bookToShow.availability.openlibrary_work;
    const bookIsbn = bookToShow.availability.isbn;
    const authorName = authors[0].name;
    const genre = subject[0];

    const description = await getDescription(bookOlid);
    const bookCover = await getBookCover(bookIsbn);

    const bookData = {
      title,
      authorName,
      genre,
      description,
      bookCover,
      bookOlid,
      bookIsbn
    };
  } catch (error) {
    console.error('Error fetching random book:', error);
    return getRandomBook(); // Retry fetching a random book
  }
}

async function getBookCover(isbn) {
  const url = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch book cover');
    }
    const imageUrl = response.url;
    return imageUrl;
  } catch (error) {
    console.error('Error fetching book cover:', error);
    return 'public/book_cover.jpg'; // Replace with your placeholder image URL
  }
}

function setBook(bookData) {
  if (!bookData) {
    console.error('No book data provided');
    return;
  }

  current_bookData = bookData;
  console.log('Book Data:', JSON.stringify(bookData, null, 2));

  document.getElementById('title').textContent = `Book Title: ${bookData.title}`;
  document.getElementById('author').textContent = `Book Author: ${bookData.authorName}`;
  document.getElementById('genre').textContent = `Book Genre: ${bookData.genre}`;
  
  if (bookData.description && bookData.description !== 'Not found') {
    document.getElementById('description').textContent = `Description: ${bookData.description}`;
  } else {
    document.getElementById('description').textContent = '';
  }

  const bookCoverElement = document.getElementById('book-cover');
  if (bookData.bookCover) {
    bookCoverElement.src = bookData.bookCover;
  } else {
    bookCoverElement.src = 'book_cover.jpg'; // Replace with your placeholder image URL
    bookCoverElement.alt = 'No cover available';
  }
}

async function showNewBook() {
  const bookData = await displayRandomBook(); // Fetch new book data

  if (bookData) {
    previous_bookData = current_bookData
    console.log('The previous book data is:', previous_bookData);
  } else {
    console.log('No book data available for the new book.');
  }
}

function showPreviousBook() {

  if (previous_bookData) {
    setBook(previous_bookData);
    console.log('Displaying previous book data:', previous_bookData);
  } else {
    console.log('No previous book data available.');
  }
}

function clearDiv(divId) {
  document.getElementById(divId).textContent = '';
}

async function displayRandomBook() {
  const bookData = await getRandomBook();
  bookHistory.push(bookData);
  currentBookIndex = bookHistory.length - 1;
  setBook(bookData);
  return; 
}

// Call displayRandomBook to fetch and display a random book
displayRandomBook();
