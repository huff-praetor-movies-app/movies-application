import {deleteMovie, updateMovie, getMovie, createMovie, getMovies, getPoster} from "./moviesAPI.js";

const insert = document.querySelector('.cards')
const load = document.querySelector('#loading')
let id
let id2

let poster = getPoster('shrek 3')
console.log(poster);

function handleSearch() {
    const searchInput = document.querySelector('.form-control');
    const movieName = searchInput.value.toLowerCase();
    insert.innerHTML = ''
    load.showModal()
    getMovies().then(movies => {
        for (let movie of movies) {
            if (movie.title.toLowerCase().includes(movieName)) {
                id = movie.id;
                showSearchedMovie(id);
            } else if (movie.genre.toLowerCase().includes(movieName)) {
                id = movie.id;
                showSearchedMovie(id);
            }
        }
    });
    load.close();
}

function showSearchedMovie(id) {
    drawMovie(id)
}

const searchMovies = () => {
    const submitButton = document.querySelector('#submit');
    submitButton.addEventListener("click", (e) => {
        e.preventDefault();
        handleSearch()
    })
}
searchMovies()

const addNewMovie = () => {
    const addImage = document.querySelector('#addMovieImage');
    addImage.addEventListener("click", (e) => {
        e.preventDefault()
        document.querySelector('#create').showModal();
    })
}
addNewMovie();

const del = async (id) => {
    try {
        await deleteMovie(id)
        populateMovies()
    } catch (e) {
        console.error(e)
    }
}

const update = async (id, movie) => {
    try {
        await updateMovie(id, movie)
        populateMovies()
    } catch (e) {
        console.error(e)
    }
}
const create = async (movie) => {
    try {
        await createMovie(movie)
        populateMovies()
    } catch (e) {
        console.error(e)
    }
}
const populateMovies = () => {
    load.showModal()
    getMovies().then(movies => {
        insert.innerHTML = ''
        for (let i = 1; i <= movies.length; i++) {
            drawMovie(i)
        }
    })
}

populateMovies()

function updateForm(id) {
    load.showModal()
    let formTitle = document.querySelector('#update-title');
    let formRating = document.querySelector('#update-rating');
    let formGenre = document.querySelector('#update-genre');
    fetch("http://localhost:3000/movies/" + id).then(resp => resp.json()).then(movie => {
        formTitle.value = movie.title;
        formRating.value = movie.rating;
        formGenre.value = movie.genre;
        document.querySelector('#update').showModal();
        id2 = id
        load.close()
    })
}

document.querySelector('#cancelUpdate').addEventListener('click', () => {
    document.querySelector('#update').close()
})

//need to convert into a function --ira
document.querySelector('#submitUpdate').addEventListener("click", (event) => {
        event.preventDefault();
        document.querySelector('#update').close()
        let title = document.querySelector('#update-title').value;
        let rating = document.querySelector('#update-rating').value;
        if (rating >= 5) {
            rating = 5
        } else if (rating <= 0) {
            rating = 0
        } else if (isNaN(rating)) {
            rating = 0
        }
        let genre = document.querySelector('#update-genre').value;

    console.log(id)
        update(id2, {title, rating, genre, poster})
    }
)
document.querySelector('#createNewMovie').addEventListener("click", (event) => {
        event.preventDefault();
        document.querySelector('#create').close()
        let title = document.querySelector('#create-title').value;
        let rating = parseFloat(document.querySelector('#create-rating').value);
        if (rating >= 5) {
            rating = 5
        } else if (rating <= 0) {
            rating = 0
        } else if (isNaN(rating)) {
            rating = 0
        }
        let genre = document.querySelector('#create-genre').value;
        create({title, rating, genre})
    }
)


async function drawMovie(id)  {
   await getMovie(id).then(movie => {
        let div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `<h3 class=title>${movie.title}</h3>
                                <p>${movie.rating} of 5</p>
                               <p>${movie.genre}</p>`
        insert.appendChild(div)

        const image = document.createElement('img');
        image.setAttribute('src', 'img/icons8-edit-50.png');
        image.setAttribute(`data-id`, movie.id)
        image.setAttribute('id', 'edit-image')
        div.appendChild(image);

        const imageDelete = document.createElement('img');
        imageDelete.setAttribute('src', 'img/icons8-delete-50.png');
        imageDelete.setAttribute(`data-id`, movie.id)
        imageDelete.setAttribute('id', 'delete-image')
        div.appendChild(imageDelete);

        imageDelete.addEventListener("click", evt => {
            evt.preventDefault()
            evt.stopPropagation()
            id = evt.target.dataset.id;
            console.log(id);
            del(id)
        })

        image.addEventListener("click", evt => {
            evt.preventDefault()
            evt.stopPropagation()
            id = evt.target.dataset.id;
            console.log(id);
            updateForm(id)
        })
    });
    load.close();
}

document.querySelector('#cancelCreate').addEventListener('click', () => {
    document.querySelector('#create').close()
})