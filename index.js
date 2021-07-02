const EXERCISES_URL = "http://localhost:3000/api/v1/exercise"
const ROUTINES_URL = "http://localhost:3000/api/v1/routines"
const CATEGORIES_URL = "http://localhost:3000/api/v1/category"


//classes
class Fetch {
    indexCategories(method) {
        return fetch(CATEGORIES_URL)
            .then(response => response.json())
            .then(categories => {
                categories.forEach(category => method(category))
            }
            )
    }

    indexExercises(method) {
        return fetch(EXERCISES_URL)
            .then(response => response.json())
            .then(exercises => {
                exercises.data.forEach(exercise => {
                    method(exercise)
                })

            })
    }

    indexRoutines(method) {
        return fetch(ROUTINES_URL)
            .then(response => response.json())
            .then(routines => {
                routines.data.forEach(routine => method(routine))
            }
            )
    }

    postExercise(name, description, category_id) {
        const bodyData = { name, description, category_id }
        const data = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyData)
        }

        fetch(EXERCISES_URL, data)
            .then(response => response.json())
            .then(exercise => {
                dom.addExercisesToDropDown(exercise.data)
            })
    }

    postRoutine(title, content, category_id) {
        const bodyData = { title, content, category_id }
        const data = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyData)
        }

        fetch(ROUTINES_URL, data)
            .then(response => response.json())
            .then(routine => {
                dom.renderRoutine(routine.data)
            })
    }
}

class Dom {

    filterRoutines(category) {
        let routines = document.querySelectorAll(".rCard")

        routines.forEach(e => {

            if (category == 0 || e.dataset.categoryId == category) {
                e.style.display = "inline"
            } else {
                e.style.display = "none"
            }
        })

    }

    addCategoriesToDropDown(category) {
        let catergoryDropDown = document.querySelectorAll(".categorySelection")
        catergoryDropDown.forEach(dropDown => {
            let option = document.createElement("option")
            option.text = category.name
            option.value = category.id
            dropDown.add(option)
        })
    }

    addExercisesToDropDown(exercise) {
        let exerciseDropDown = document.querySelectorAll(".exerciseSelection")
        exerciseDropDown.forEach(dropDown => {
            let option = document.createElement("option")
            option.text = exercise.attributes.name
            option.value = exercise.id
            dropDown.add(option)
        })
    }

    renderExercise(exercise, name) {

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

    renderRoutine(routine) {
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
            let renderedExercise = dom.renderExercise(exercise, rContArr[index])
            rCard.appendChild(renderedExercise)
        })

        document.getElementById("routine-container").appendChild(rCard)
    }

    createExerciseHandler(e) {
        e.preventDefault()
        let name = document.querySelector("#name").value
        let description = document.querySelector("#description").value
        let category_id = parseInt(document.querySelector("#newExerciseCategory").value)

        db.postExercise(name, description, category_id)

        // reset the form
        document.forms["newExercise"].reset()

    }


    createRoutineHandler(e) {
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

        db.postRoutine(title, content, category_id)

        // reset the form
        document.forms["newRoutine"].reset()

    }
}

const db = new Fetch()
const dom = new Dom()

document.addEventListener("DOMContentLoaded", () => {

    db.indexExercises(dom.addExercisesToDropDown)
    db.indexCategories(dom.addCategoriesToDropDown)
    db.indexRoutines(dom.renderRoutine)

    const newRoutineData = document.querySelector("#newRoutineForm")

    newRoutineData.addEventListener("submit", (e) => {
        dom.createRoutineHandler(e)
    })

    const newExerciseData = document.querySelector("#newExerciseForm")

    newExerciseData.addEventListener("submit", (e) => {
        dom.createExerciseHandler(e)
    })

    const filter = document.querySelector("#filter")

    filter.addEventListener("change", (e) => {
        e.preventDefault()
        let categoryId = e.target.value
        dom.filterRoutines(categoryId)
    })
})

// //filter feature

// function filterRoutines(category) {
//     let routines = document.querySelectorAll(".rCard")

//     routines.forEach(e => {

//         if (category == 0 || e.dataset.categoryId == category) {
//             e.style.display = "inline"
//         } else {
//             e.style.display = "none"
//         }
//     })

// }

// //category stuff
// function indexCategories(method) {
//     return fetch(CATEGORIES_URL)
//         .then(response => response.json())
//         .then(categories => {
//             categories.forEach(category => method(category))
//         }
//         )
// }

// function addCategoriesToDropDown(category) {
//     let catergoryDropDown = document.querySelectorAll(".categorySelection")
//     catergoryDropDown.forEach(dropDown => {
//         let option = document.createElement("option")
//         option.text = category.name
//         option.value = category.id
//         dropDown.add(option)
//     })

// }

// //routine stuff
// function indexRoutines(method) {
//     return fetch(ROUTINES_URL)
//         .then(response => response.json())
//         .then(routines => {
//             routines.data.forEach(routine => method(routine))
//         }
//         )
// }

// function renderRoutine(routine) {
//     let rCard = document.createElement("div")
//     let rTitle = document.createElement("h3")
//     let rContArr = routine.attributes.content.split(",")
//     rCard.classList.add("rCard")
//     //adding category to class to filter
//     rCard.setAttribute("data-category-id", `${routine.attributes.category_id}`)
//     rTitle.innerText = routine.attributes.title
//     rTitle.classList.add("rTitle")

//     rCard.appendChild(rTitle)

//     routine.attributes.exercises.forEach((exercise, index) => {
//         let renderedExercise = renderExercise(exercise, rContArr[index])
//         rCard.appendChild(renderedExercise)
//     })

//     document.getElementById("routine-container").appendChild(rCard)
// }


// function createRoutineHandler(e) {
//     e.preventDefault()
//     let title = document.querySelector("#title").value
//     let category_id = parseInt(document.querySelector("#routineCategory").value)
//     //nodelists
//     let exercises = document.querySelectorAll(".exerciseSelection")
//     let sets = document.querySelectorAll(".sets")
//     let reps = document.querySelectorAll(".reps")

//     //content built by all values in nodelist
//     let content = ``

//     exercises.forEach((exercise, i) => {
//         let exName = exercise.options[exercise.selectedIndex].text

//         if (sets[i].value && reps[i].value) {
//             content += `${exName}: ${sets[i].value} x ${reps[i].value}, `
//         }
//     })

//     postRoutine(title, content, category_id)

//     // reset the form
//     document.forms["newRoutine"].reset()

// }

// function postRoutine(title, content, category_id) {
//     const bodyData = { title, content, category_id }
//     const data = {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(bodyData)
//     }

//     fetch(ROUTINES_URL, data)
//         .then(response => response.json())
//         .then(routine => {
//             renderRoutine(routine.data)
//         })
// }
// //exercise stuff

// function indexExercises(method) {
//     return fetch(EXERCISES_URL)
//         .then(response => response.json())
//         .then(exercises => {
//             exercises.data.forEach(exercise => {
//                 method(exercise)
//             })

//         })

// }

// function addExercisesToDropDown(exercise) {
//     let exerciseDropDown = document.querySelectorAll(".exerciseSelection")
//     exerciseDropDown.forEach(dropDown => {
//         let option = document.createElement("option")
//         option.text = exercise.attributes.name
//         option.value = exercise.id
//         dropDown.add(option)
//     })


// }

// function renderExercise(exercise, name) {

//     let exCard = document.createElement("div")
//     let exName = document.createElement("strong")
//     let exDesc = document.createElement("p")
//     exCard.classList.add("exCard")
//     exName.innerText = name
//     exName.classList.add("exName")
//     exDesc.innerText = exercise.description
//     exDesc.classList.add("exDesc")
//     exDesc.style.display = "none"
//     exName.addEventListener("mouseover", e => {
//         e.preventDefault()
//         exDesc.style.display = "block"
//     })

//     exName.addEventListener("mouseout", e => {
//         e.preventDefault()
//         exDesc.style.display = "none"
//     })

//     exCard.appendChild(exName)
//     exCard.appendChild(exDesc)

//     return exCard

// }

// function createExerciseHandler(e) {
//     e.preventDefault()
//     let name = document.querySelector("#name").value
//     let description = document.querySelector("#description").value
//     let category_id = parseInt(document.querySelector("#newExerciseCategory").value)

//     postExercise(name, description, category_id)

//     // reset the form
//     document.forms["newExercise"].reset()

// }

// function postExercise(name, description, category_id) {
//     const bodyData = { name, description, category_id }
//     const data = {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(bodyData)
//     }

//     fetch(EXERCISES_URL, data)
//         .then(response => response.json())
//         .then(exercise => {
//             addExercisesToDropDown(exercise.data)
//         })
// }

