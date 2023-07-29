//movie search box id
let MoviesSearchBox = document.getElementById("searchBar");
// movie list body
let moviesListBody = document.querySelector("#search_filterMovies");
//movie information title
let movieInfoTitle = document.querySelector(".movieInfoTitle");
//movie rating id
let MovRating = document.querySelector(".MovRating");
// movie origin
let MovOrigin = document.querySelector(".MovOrigin");
//get searched movie main body
let movieInfo = document.getElementById("movieInfo");
movieInfo.style.display = "none";
// Get the modal element
const modal = document.getElementById("myModal");
// Get the button that opens the modal
const openModalButton = document.getElementById("openModalButton");
// Get the button that closes the modal
const closeModalButton = document.getElementById("closeModalButton");
// like movie ul id
const likedMovieUL = document.getElementById("liked-movies-list");
//add empty array to localstorage if not exist
if (localStorage.getItem("likedMovies") === null) {
  localStorage.setItem("likedMovies", JSON.stringify([]));
}
//using object destructuring to handle error if any for dislike movie handler
const MovDetail = {
  activeMovDetail: false,
  activeMovID: "",
};

let { activeMovDetail, activeMovID } = MovDetail;

//fetch movie data from IMDB API
const fetchMovieData = async (parameter, searchTerm) => {
  try {
    //url to fetch movie data
    const response = await fetch(
      `https://www.omdbapi.com/?${parameter}=${searchTerm}&apikey=9494c740`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json(); // Parse the response body as JSON data
    return data;
  } catch (error) {
    throw error; // Re-throw the error to be caught by the calling code
  }
};

//get search bar movie input text and and find data
const searchMovies = async () => {
  let searchTerm = MoviesSearchBox.value.trim();
  if (searchTerm.length > 1) {
    // get searched movie data
    await fetchMovieData("s", searchTerm)
      .then((data) => {
        let processedResult = data;
        // console.log("processedResult", processedResult);

        if (
          searchTerm.length > 6 &&
          processedResult.Response == "False" &&
          processedResult.Error == "Movie not found!"
        ) {
          createToast("error", processedResult.Error);
          return;
        }

        if (
          processedResult.Response == "True" &&
          parseInt(processedResult.totalResults) > 0
        ) {
          // send returned data to filtered movie list
          filteredMoviesData(processedResult);
          moviesListBody.classList.add("showFilter");
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err); // Re-throw the error to be caught by the calling code
      });
  } else {
    moviesListBody.classList.remove("showFilter");
    const element = document.getElementById("movieList");

    if (element) {
      element.remove();
    }
  }
};

//show render movie data to search list
const filteredMoviesData = (searchedMovies) => {
  // console.log("filteredMoviesData", searchedMovies);
  if (searchedMovies.Search) {
    // let MoviesList = searchedMovies.Search;
    const element = document.getElementById("movieList");

    if (element) {
      element.remove();
    }

    let ul = document.createElement("ul");
    ul.setAttribute("id", "movieList");
    moviesListBody.appendChild(ul);

    searchedMovies.Search.forEach(renderMovieList);

    //render movie search data dynamically based on search result
    function renderMovieList(element, index, arr) {
      // console.log("element", element);
      let li = document.createElement("li");
      li.setAttribute("id", `${element.imdbID}`);

      li.setAttribute("class", "movieItemList");
      li.setAttribute("onclick", `onDataClickListner(${element.imdbID})`);
      ul.appendChild(li);
      li.innerHTML = `<div class="movieBody">
        <div class="PosterTitle">
            <img src=${element.Poster} alt=${element.Title}>
            <p class="MovieTitle">${element.Title}</p>
        </div>
        <div class="MovieYear">         
         <p>${element.Year}</p> </div>
    </div> <hr>`;
    }
  }
};

// fetch movie data and show the selected movie details
const onDataClickListner = async (id) => {
  let Movieid;

  try {
    Movieid = id.getAttribute("id");
  } catch (error) {
    createToast("error", `Error Finding movie Try Searching For another Movie`);
    moviesListBody.classList.remove("showFilter");
    document.getElementById("movieList").remove();
    return;
  }
  //get the selected movie data and show details
  await fetchMovieData("i", Movieid)
    .then((data) => {
      //   console.log(Movieid);
      //   debugger;
      let detailedResult = data;
      //   console.log("data for movie fetched by id", detailedResult);
      const ulElement = document.getElementById("movieList");
      //   debugger;
      if (ulElement) {
        moviesListBody.classList.remove("showFilter");
        ulElement.remove();
      }
      // movie details
      movieInfoTitle.innerHTML = `<h2>${detailedResult.Title}</h2>    
    <p id="MovYear">
    <span>${detailedResult.Year}</span>
      . <span>${detailedResult.Runtime}</span>
      . <span>${detailedResult.Rated}</span>
      <span><i onclick="likeMovieHandler(this)" id="${Movieid}" class="fa-solid fa-heart"></i></span>     
    </p>`;

      MovRating.innerHTML = `<p>IMDB RATING</p>    
    <h3><i class="fa-solid fa-star"></i> ${detailedResult.Ratings[0].Value}</h3>`;

      MovOrigin.innerHTML = `<p>COUNTRY</p>    
    <h4><i class="fa-solid fa-globe"></i> ${detailedResult.Country}</h4>`;

      //get element id and add movie poster
      document.getElementById("MoviePoster").src = `${detailedResult.Poster}`;
      // movie plot
      document.getElementById(
        "AboutMov"
      ).innerHTML = `<p>${detailedResult.Plot}</p>`;
      // movie actors
      document.querySelector(
        ".actors"
      ).innerHTML = `<p>Actors: ${detailedResult.Actors}</p>`;
      //movie directors
      document.querySelector(
        ".director"
      ).innerHTML = `<p>Director: ${detailedResult.Director}</p>`;
      //movie writers
      document.querySelector(
        ".writer"
      ).innerHTML = `<p>Writer: ${detailedResult.Writer}</p>`;
      //movie language
      document.querySelector(
        ".language"
      ).innerHTML = `<p>Language: ${detailedResult.Language}</p>`;
      //movie genre
      document.querySelector(
        ".Genre"
      ).innerHTML = `<p>Genre: ${detailedResult.Genre}</p>`;
      //movie Awards
      document.querySelector(
        ".Awards"
      ).innerHTML = `<p>Awards: ${detailedResult.Awards}</p>`;
      //movie Box Office Collection
      document.querySelector(
        ".BoxOffice"
      ).innerHTML = `<p>BoxOffice Collection: ${detailedResult.BoxOffice}</p>`;
      isLiked(Movieid);
      movieInfo.style.display = "block";
      modal.style.display = "none";
      activeMovDetail = true;
      activeMovID = Movieid;
    })
    .catch((err) => {
      //   console.error("Error fetching data:", err);
      movieInfo.style.display = "none";
      activeMovDetail = false;
      activeMovID = "";
      createToast(
        "error",
        `Error finding movie please try again later or Search for another movie`
      );
      return;
    });
};

//check if the movie isLiked
function isLiked(id) {
  let likedMovieData = JSON.parse(localStorage.getItem("likedMovies"));

  let idExists = likedMovieData.some((item) => item.movieID === id);
  // console.log(idExists);
  let likedBtn = document.getElementById(`${id}`);

  idExists ? (likedBtn.style.color = "red") : (likedBtn.style.color = "white");
}

// Function to open the modal
function openModal() {
  // Clear all <li> elements by setting innerHTML to an empty string
  likedMovieUL.innerHTML = "";
  let likedMovieData = JSON.parse(localStorage.getItem("likedMovies"));
  // console.log(likedMovieData);
  if (likedMovieData != null) {
    likedMovieData.forEach(function (movie, index) {
      // Create a new <li> element
      const li = document.createElement("li");
      li.setAttribute("id", movie.movieID);
      // Set the content of the <li> (e.g., the movie title)
      li.innerHTML = `<div class="liked-movies-li">
    <div onclick="onDataClickListner(this)" id="${movie.movieID}" class="liked-movies-title">
      <img src="${movie.poster}" alt="${movie.title} poster">
      <p>${movie.title}</p>
    </div>
      <i onclick="strikeLikedBtnHandler(this)" data-liIndex="${index}" id="${movie.movieID}" class="fa-solid fa-heart"></i>
    </div>`;

      // Append the <li> to the <ul>
      likedMovieUL.appendChild(li);
    });
  }
  modal.style.display = "block";
}

// Function to close the modal
function closeModal() {
  modal.style.display = "none";
}

// Add event listener to the button that opens the modal
openModalButton.addEventListener("click", openModal);

// Add event listener to the button that closes the modal
closeModalButton.addEventListener("click", closeModal);

// Close the modal when clicking outside the modal content
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

//like  button handler
async function likeMovieHandler(id) {
  let movieID = id.getAttribute("id");
  // console.log(movieID);

  let likedMovies = JSON.parse(localStorage.getItem("likedMovies"));
  let idExists = likedMovies.some((item) => item.movieID === movieID);

  // console.log(likedMovies);

  if (idExists) {
    let movieTitle = likedMovies.find((item) => item.movieID == movieID);

    const indexToRemove = likedMovies.findIndex(
      (item) => item.movieID == movieID
    );
    // If the object is found (index is not -1), remove it from the array
    if (indexToRemove !== -1) {
      likedMovies.splice(indexToRemove, 1);
    }
    localStorage.setItem("likedMovies", JSON.stringify(likedMovies));
    createToast("success", `${movieTitle.title} Dislike successfully`);
    isLiked(movieID);
  } else {
    await fetchMovieData("i", movieID)
      .then((data) => {
        // console.log(data);
        let likedMovies = JSON.parse(localStorage.getItem("likedMovies")) || [];

        let newMovie = {
          poster: data.Poster,
          title: data.Title,
          movieID: movieID,
        };
        likedMovies.push(newMovie);
        localStorage.setItem("likedMovies", JSON.stringify(likedMovies));
        document.getElementById(`${movieID}`).style.color = "red";
        createToast("success", `${newMovie.title} liked successfully`);
      })
      .catch((err) => {
        createToast("error", `Failed to add movie to watchlist Try Again`);
        // console.log("error finding data", err);
      });
  }
}

//remove liked movie from list
function strikeLikedBtnHandler(id) {
  let movieID = id.getAttribute("id");
  let likeMovieIndex = id.getAttribute("data-liIndex");

  let likedMovies = JSON.parse(localStorage.getItem("likedMovies"));
  let movieTitle = likedMovies.find((item) => item.movieID == movieID);
  const indexToRemove = likedMovies.findIndex(
    (item) => item.movieID == movieID
  );
  // If the object is found (index is not -1), remove it from the array
  if (indexToRemove !== -1) {
    likedMovies.splice(indexToRemove, 1);
  }
  localStorage.setItem("likedMovies", JSON.stringify(likedMovies));

  if (likeMovieIndex >= 0 && likeMovieIndex < likedMovieUL.children.length) {
    likedMovieUL.removeChild(likedMovieUL.children[likeMovieIndex]);
  }
  createToast("success", `${movieTitle.title} Dislike successfully`);
  if (activeMovDetail === true && activeMovID === movieID) {
    isLiked(movieID);
  }
}
