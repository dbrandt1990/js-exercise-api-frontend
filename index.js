const EXERCISES_URL = "http://localhost:3000/api/v1/exercise"
const ROUTINES_URL = "http://localhost:3000/api/v1/routine"
const CATEGORY_URL = "http://localhost:3000/api/v1/category"



document.addEventListener("DOMContentLoaded", () => {

    // populate dropdown menus in form

    let catergoryDropDown = document.querySelectorAll(".categorySelection")
    let exerciseDropDown = document.querySelectorAll(".exerciseSelection")
    let categories = Category.all
    for (category in categories) {
        console.log(category)
        let option = document.createElement("option")
        option.text = category.name
        option.value = category.id
        catergoryDropDown.add(option)
    }


    indexExercises()

    const newExerciseData = document.querySelector("#newExerciseForm")

    newExerciseData.addEventListener("submit", (e) => {
        createExerciseHandler(e)
    })

    let exerciseCard = document.querySelectorAll(".exercise-card")
    console.log(exerciseCard)

})

function indexExercises() {
    return fetch(EXERCISES_URL)
        .then(response => response.json())
        .then(exercises => {
            exercises.data.forEach(exercise => {
                renderExercise(exercise)
            })

        })

}

function renderExercise(exercise) {

    let exCard = document.createElement("div")
    let exName = document.createElement("strong")
    let exDesc = document.createElement("p")
    exCard.classList.add("exCard")
    exName.innerText = exercise.attributes.name
    exName.classList.add("exName")
    exDesc.innerText = exercise.attributes.description
    exDesc.style.display = "none"
    exName.addEventListener("mouseover", e => {
        e.preventDefault()
        exDesc.style.display = "block"
    })

    exName.addEventListener("mouseout", e => {
        e.preventDefault()
        exDesc.style.display = "none"
    })

    exCard.appendChild(exName)
    exCard.appendChild(exDesc)
    //only display description when exercise is hovered
    document.getElementById(exercise.attributes.category.name).appendChild(exCard)

}

function createExerciseHandler(e) {
    e.preventDefault()
    let name = document.querySelector("#name").value
    let description = document.querySelector("#description").value
    let category_id = parseInt(document.querySelector("#category").value)

    postFetch(name, description, category_id)

}

function postFetch(name, description, category_id) {
    const bodyData = { name, description, category_id }
    const data = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
    }

    fetch(EXERCISES_URL, data)
        .then(response => response.json())
        .then(exercise => {
            renderExercise(exercise.data)
        })
}

