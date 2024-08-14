const getAllBooks = async () => {
  try {
    const response = await fetch("data/books.json");
    if (!response.ok) {
      throw new Error("Network error fetching books");
    }
    const books = await response.json();
    return books;
  } catch (error) {
    console.error(`Failed to fetch books: ${error}`);
    return [];
  }
};

const getBookById = async (id) => {
  try {
    const response = await fetch("data/books.json");
    if (!response.ok) {
      throw new Error("Network error fetching books");
    }
    const books = await response.json();
    const book = books.find((book) => book.id === id);
    if (!book) {
      throw new Error(`Book with id ${id} not found`);
    }
    return book;
  } catch (error) {
    console.error(`Failed to fetch book with id ${id}: ${error}`);
    return null;
  }
};
const getStarRating = (rating, count) => {
  const starRating = "★".repeat(rating);
  const emptyStarRating = "☆".repeat(5 - rating);
  return `${starRating}${emptyStarRating}(${count})`;
};

document.addEventListener("DOMContentLoaded", async function () {
  const books = await getAllBooks();
  const bookOfTheWeek = await getBookById(7);
  const bookOfTheWeekRating = getStarRating(
    bookOfTheWeek.rating,
    bookOfTheWeek.rating_count
  );

  if (bookOfTheWeek) {
    document.getElementById("book-of-the-week-review").textContent =
      bookOfTheWeek.quotes[0].quote;

    document.getElementById("book-of-the-week-review-source").textContent =
      bookOfTheWeek.quotes[0].source;

    document.getElementById("book-of-the-week-cover").src = bookOfTheWeek.image;

    document.getElementById("book-of-the-week-title").textContent =
      bookOfTheWeek.title;

    document.getElementById("book-of-the-week-author").textContent =
      bookOfTheWeek.author;

    document.getElementById("book-of-the-week-star-rating").textContent =
      bookOfTheWeekRating;

    document.getElementById(
      "book-of-the-week-current-price"
    ).textContent = `£${bookOfTheWeek.current_price}`;

    document.getElementById(
      "book-of-the-week-original-price"
    ).textContent = `New RRP £${bookOfTheWeek.original_price}`;
  }
});
