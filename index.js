const EXERCISES_URL = "http://localhost:3000/api/v1/exercise"
const ROUTINES_URL = "http://localhost:3000/api/v1/routines"
const CATEGORIES_URL = "http://localhost:3000/api/v1/category"



document.addEventListener("DOMContentLoaded", () => {

    indexExercises(addExercisesToDropDown)
    // indexExercises(renderExercise)
    indexCategories(addCategoriesToDropDown)
    indexRoutines(renderRoutine)

    const newExerciseData = document.querySelector("#newExerciseForm")

    newExerciseData.addEventListener("submit", (e) => {
        createExerciseHandler(e)
    })

})

function indexCategories(method) {
    return fetch(CATEGORIES_URL)
        .then(response => response.json())
        .then(categories => {
            categories.forEach(category => method(category))
        }
        )
}

function addCategoriesToDropDown(category) {
    let catergoryDropDown = document.querySelectorAll(".categorySelection")
    catergoryDropDown.forEach(dropDown => {
        let option = document.createElement("option")
        option.text = category.name
        option.value = category.id
        dropDown.add(option)
    })


}

//routine stuff

function indexRoutines(method) {
    return fetch(ROUTINES_URL)
        .then(response => response.json())
        .then(routines => {
            routines.data.forEach(routine => method(routine))
        }
        )
}

function renderRoutine(routine) {

    let rCard = document.createElement("div")
    let rTitle = document.createElement("strong")
    let rCont = document.createElement("p")
    rCard.classList.add("rCard")
    rTitle.innerText = routine.attributes.title
    rTitle.classList.add("rTitle")
    rCont.innerText = routine.attributes.content

    rCard.appendChild(rTitle)
    rCard.appendChild(rCont)

    routine.attributes.exercises.forEach(exercise => {
        rCard.appendChild(renderExercise(exercise))
    })

    document.getElementById("routine-container").appendChild(rCard)
}

//exercise stuff

function indexExercises(method) {
    return fetch(EXERCISES_URL)
        .then(response => response.json())
        .then(exercises => {
            exercises.data.forEach(exercise => {
                method(exercise)
            })

        })

}

function addExercisesToDropDown(exercise) {
    let exerciseDropDown = document.querySelectorAll(".exerciseSelection")
    exerciseDropDown.forEach(dropDown => {
        let option = document.createElement("option")
        option.text = exercise.attributes.name
        option.value = exercise.attributes.id
        dropDown.add(option)
    })


}

function renderExercise(exercise) {

    let exCard = document.createElement("div")
    let exName = document.createElement("strong")
    let exDesc = document.createElement("p")
    exCard.classList.add("exCard")
    exName.innerText = exercise.name
    exName.classList.add("exName")
    exDesc.innerText = exercise.description
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

    return exCard

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

