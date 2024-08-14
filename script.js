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

  // EventListener for the Carousel
  const carousel = document.getElementById("carousel");
  let currentIndex = 0;
  let itemWidth = 220;
  let itemsVisible = Math.floor(carousel.offsetWidth / itemWidth);
  let maxIndex = Math.ceil(books.length - itemsVisible);

  // Function to display books
  function displayBooks() {
    const fragment = document.createDocumentFragment();

    books.forEach((book) => {
      const carouselItem = document.createElement("div");
      carouselItem.classList.add("carousel-item");

      const img = document.createElement("img");
      img.src = book.image;
      img.alt = book.title;
      carouselItem.appendChild(img);

      const bookDetails = document.createElement("div");
      bookDetails.classList.add("book-details");

      const author = document.createElement("p");
      author.classList.add("author");
      author.textContent = book.author;
      bookDetails.appendChild(author);

      const title = document.createElement("p");
      title.classList.add("title");
      title.textContent = book.title;
      bookDetails.appendChild(title);

      const carouselItemPrice = document.createElement("div");
      carouselItemPrice.classList.add("carousel-item-price");

      const currentPrice = document.createElement("p");
      currentPrice.textContent = `From £${book.current_price}`;
      carouselItemPrice.appendChild(currentPrice);

      const originalPrice = document.createElement("p");
      const del = document.createElement("del");
      del.textContent = `£${book.original_price}`;
      originalPrice.appendChild(del);
      carouselItemPrice.appendChild(originalPrice);

      bookDetails.appendChild(carouselItemPrice);
      carouselItem.appendChild(bookDetails);

      fragment.appendChild(carouselItem);
    });

    while (carousel.firstChild) {
      carousel.firstChild.remove();
    }

    carousel.appendChild(fragment);
    updateCarousel();
  }

  function updateCarousel() {
    // Recalculate itemsVisible and maxIndex in case of a window resize
    itemsVisible = Math.floor(carousel.offsetWidth / itemWidth);
    maxIndex = Math.max(0, books.length - itemsVisible);

    // Ensure currentIndex is within the allowed range after recalculation
    if (currentIndex > maxIndex) {
      currentIndex = maxIndex;
    }

    const offset = -currentIndex * itemWidth;
    carousel.style.transform = `translateX(${offset}px)`;

    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");

    // Toggle visibility of the 'prev' button
    if (currentIndex === 0) {
      prevBtn.classList.add("hidden");
    } else {
      prevBtn.classList.remove("hidden");
    }

    // Toggle visibility of the 'next' button
    if (currentIndex >= maxIndex) {
      nextBtn.classList.add("hidden");
    } else {
      nextBtn.classList.remove("hidden");
    }

    // Disable/enable buttons based on the current index
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;
  }

  // Event listeners for navigation buttons
  document.getElementById("prev").addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  document.getElementById("next").addEventListener("click", () => {
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateCarousel();
    }
  });

  // Handle window resize
  window.addEventListener("resize", () => {
    updateCarousel();
  });

  // Display the books initially
  displayBooks();

  // EventListener for the book of the week

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
