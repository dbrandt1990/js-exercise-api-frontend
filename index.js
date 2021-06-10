const EXERCISES_URL = "http://localhost:3000/api/v1/exercise"


document.addEventListener("DOMContentLoaded", () => {
    indexExercises()

    const newExerciseData = document.querySelector("#newExerciseForm")

    newExerciseData.addEventListener("submit", (e) => {
        createExerciseHandler(e)
    })
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

function createExerciseHandler(e) {
    e.preventDefault()
    let name = document.querySelector("#name").value
    let description = document.querySelector("#description").value
    let category = parseInt(document.querySelector("#category").value)

    postFetch(name, description, category)

}

function postFetch(name, description, category) {
    const data = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: name,
            description: description,
            category: category
        })
    }

    fetch(EXERCISES_URL, data)
        .then(response => response.json())
        .then(exercise => {

        })
}

