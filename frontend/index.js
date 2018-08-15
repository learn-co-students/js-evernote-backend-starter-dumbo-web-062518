document.addEventListener('DOMContentLoaded', function () {
  let notesJson = fetch('http://localhost:3000/api/v1/notes')
  .then(r => r.json())
  .then(renderNotes)

  function deleteNoteFetch(noteId){
    fetch(`http://localhost:3000/api/v1/notes/${noteId}`, {
      method: "DELETE"
    })
  }

  function postNoteFetch(noteObj) {
    fetch(`http://localhost:3000/api/v1/notes`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(noteObj)
    })
    .then(r => r.json())
    .then(console.log)
  }

  function editNoteFetch(noteId, noteObj) {
    fetch(`http://localhost:3000/api/v1/notes/${noteId}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(noteObj)
    })
    .then(r => r.json())
    .then(console.log)
  }

const newForm = document.querySelector("#newform")
newForm.addEventListener("submit", createUpdateNote)
const fullNote=document.querySelector('#fullNote')
fullNote.addEventListener('click', function (e) {
  if (e.target.value === 'edit') {
    editNote(e)
  }
})

  function renderNotes(notes) {
    const container = document.querySelector('#notes')
    notes.forEach(note => {
      const div = document.createElement('div')
      div.id = `${note.id}`
      const title = document.createElement('p')
      title.innerHTML = `
      <a href="#">${note.title}</a>
      <button class = "delete" value="delete" data-id=${note.id}>X</button>
      `;
      title.addEventListener('click', function (e) {
        if(e.target.value === 'delete') {
          deleteNote(e)
        }
        const id = e.target.parentElement.parentElement.getAttribute('id')

        fullNote.innerHTML = `
        <p id='current-title'>${note.title}</p>
        <p id='current-body'>${note.body}</p>
        <button class = "edit" value="edit" data-id=${note.id}>Edit</button>
        `
      })
      div.append(title)
      container.append(div)
    })
  }

function deleteNote(e){
  deleteNoteFetch(e.target.getAttribute("data-id"))
  e.target.parentElement.remove()
}

function createUpdateNote(e) {
  e.preventDefault()

  let noteTitle = document.querySelector("#newtitle").value
  let noteBody = document.querySelector("#newbody").value
  let noteID = document.querySelector("#hiddenField").value
  let noteObj = {title:noteTitle, body:noteBody}

  if (noteID === 'new') {
    postNoteFetch(noteObj)
    location.reload();
  } else {
    editNoteFetch(noteID, noteObj)
    location.reload();
  }
}

function editNote(e) {
  // console.log(e)
  document.querySelector("h3").innerText = "Edit Note"
  document.querySelector("#submit-btn").innerText = "Edit Note"
  // document.querySelector("#newform").id = "editform"
  const id = e.target.dataset.id
  document.querySelector("#hiddenField").value = id
  const title = document.querySelector("#current-title").innerText
  document.querySelector("#newtitle").value = title
  const body = document.querySelector("#current-body").innerText
  document.querySelector("#newbody").value = body
}

})
