const EXERCISES_URL = "http://localhost:3000/api/v1/exercise"


document.addEventListener("DOMContentLoaded", () => {
    indexExercises()
})

function indexExercises() {
    return fetch(EXERCISES_URL)
        .then(response => response.json())
        .then(exercises => {
            exercises.data.forEach(exercise => {

                markup = `<div id=${exercise.attributes.id}>${exercise.attributes.name}</div>`

                document.querySelector(`#${exercise.attributes.category.name}`).innerHTML += markup
            })

        })
}

