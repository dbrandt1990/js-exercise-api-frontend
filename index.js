const EXERCISES_URL = "http://localhost:3000/api/v1/exercise"
const ROUTINES_URL = "http://localhost:3000/api/v1/routines"
const CATEGORIES_URL = "http://localhost:3000/api/v1/category"



document.addEventListener("DOMContentLoaded", () => {

    indexExercises(addExercisesToDropDown)
    indexCategories(addCategoriesToDropDown)
    indexRoutines(renderRoutine)

    const newRoutineData = document.querySelector("#newRoutineForm")

    newRoutineData.addEventListener("submit", (e) => {
        createRoutineHandler(e)
    })

    const newExerciseData = document.querySelector("#newExerciseForm")

    newExerciseData.addEventListener("submit", (e) => {
        createExerciseHandler(e)
    })

    const filter = document.querySelector("#filter")

    filter.addEventListener("change", (e) => {
        e.preventDefault()
        let categoryId = e.target.value
        filterRoutines(categoryId)
    })
})

//filter feature

function filterRoutines(category) {
    let routines = document.querySelectorAll(".rCard")

    routines.forEach(e => {

        if (category == 0 || e.dataset.categoryId == category) {
            e.style.display = "inline"
        } else {
            e.style.display = "none"
        }
    })

}

//category stuff

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

//routines

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
    let rTitle = document.createElement("h3")
    let rContArr = routine.attributes.content.split(",")
    rCard.classList.add("rCard")
    //adding category to class to filter
    rCard.setAttribute("data-category-id", `${routine.attributes.category_id}`)
    rTitle.innerText = routine.attributes.title
    rTitle.classList.add("rTitle")

    rCard.appendChild(rTitle)

    routine.attributes.exercises.forEach((exercise, index) => {
        let renderedExercise = renderExercise(exercise, rContArr[index])
        rCard.appendChild(renderedExercise)
    })

    document.getElementById("routine-container").appendChild(rCard)
}


function createRoutineHandler(e) {
    e.preventDefault()
    let title = document.querySelector("#title").value
    let category_id = parseInt(document.querySelector("#routineCategory").value)
    //nodelists
    let exercises = document.querySelectorAll(".exerciseSelection")
    let sets = document.querySelectorAll(".sets")
    let reps = document.querySelectorAll(".reps")

    //content built by all values in nodelist
    let content = ``

    exercises.forEach((exercise, i) => {
        let exName = exercise.options[exercise.selectedIndex].text

        if (sets[i].value && reps[i].value) {
            content += `${exName}: ${sets[i].value} x ${reps[i].value}, `
        }
    })

    postRoutine(title, content, category_id)

    // reset the form
    document.forms["newRoutine"].reset()

}

function postRoutine(title, content, category_id) {
    const bodyData = { title, content, category_id }
    const data = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
    }

    fetch(ROUTINES_URL, data)
        .then(response => response.json())
        .then(routine => {
            renderRoutine(routine.data)
        })
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
        option.value = exercise.id
        dropDown.add(option)
    })


}

function renderExercise(exercise, name) {

    let exCard = document.createElement("div")
    let exName = document.createElement("strong")
    let exDesc = document.createElement("p")
    exCard.classList.add("exCard")
    exName.innerText = name
    exName.classList.add("exName")
    exDesc.innerText = exercise.description
    exDesc.classList.add("exDesc")
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
    let category_id = parseInt(document.querySelector("#newExerciseCategory").value)

    postExercise(name, description, category_id)

    // reset the form
    document.forms["newExercise"].reset()

}

function postExercise(name, description, category_id) {
    const bodyData = { name, description, category_id }
    const data = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
    }

    fetch(EXERCISES_URL, data)
        .then(response => response.json())
        .then(exercise => {
            addExercisesToDropDown(exercise.data)
            alert("Exercise Added")
        })
}

