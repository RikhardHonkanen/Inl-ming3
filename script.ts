class Note {
  id: number = 0;
  text: string = "";
  done: boolean = false;
}

const noteTemplate = document.querySelector("#list-item") as HTMLTemplateElement;
const formText = document.querySelector("input")! as HTMLInputElement;
const footer = document.querySelector("footer")! as HTMLElement;
const checkAllButton = document.querySelector("#button")! as HTMLButtonElement;
const clearCompletedButton = document.getElementById("clearallcompleted")! as HTMLButtonElement;
const notes: Note[] = [];
let noteIndex: number = 0;
let noteText: string = formText.value;

loadLocalStorage();
function loadLocalStorage() {
  if (localStorage.length > 0) {    
    let sortingList: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      sortingList.push(localStorage.key(i)! + '$' + localStorage.getItem(localStorage.key(i)!));
    }
    sortingList.sort();

    for (let i = 0; i < sortingList.length; i++) {
      let textStart = sortingList[i].indexOf('$');
      let textEnd = sortingList[i].lastIndexOf('$');
      noteText = sortingList[i].substring(textStart + 1, textEnd);
      let noteDone: boolean = false;
      if (sortingList[i].substring(textEnd + 1) === "true") {
        noteDone = true;
      }
      let noteObject = new Note();
      noteObject.text = noteText;
      noteObject.done = noteDone;
      noteObject.id = noteIndex;
      notes.push(noteObject);

      createNote(noteObject);
      noteIndex++;
    }    
    updateCounter();
  }
};

const form = document.querySelector("form")! as HTMLFormElement;
form.onsubmit = (event) => {
  event.preventDefault();
  noteText = formText.value;

  if (noteText === "") {
    //Do nothing
  } else {
    let noteObject = new Note();
    noteObject.text = noteText;
    noteObject.done = false;
    noteObject.id = noteIndex;
    notes.push(noteObject);

    createNote(noteObject);
    noteIndex++;
    checkHash();
    updateCounter();
  }
};

function createNote(note: Note) {
  const noteNode = noteTemplate.content.firstElementChild!.cloneNode(
    true
  ) as HTMLElement;

  noteNode.querySelector("#todo")!.textContent = note.text;
  noteNode.setAttribute("id", note.id.toString()); 
  
  const notesList = document.querySelector("main")! as HTMLElement;
  notesList.append(noteNode);
  formText.value = "";

  const deleteButton = noteNode.querySelector("button")!;
  deleteButton.onclick = (event) => {
    let toRemove = notes.findIndex(
      (i) => i.id == parseInt(noteNode.getAttribute("id")!)
    );
    notes.splice(toRemove, 1);
    noteNode.remove();
    updateCounter();
  };  

  const checkBox = noteNode.querySelector("#boxcheck")! as HTMLInputElement;
  const todo = noteNode.querySelector("#todo") as HTMLElement;
  // This check is for when objects are passed in from loadLocalStorage()
  if (note.done === true) {
    checkBox.checked = true;
    todo.style.textDecoration = 'line-through';
    todo.style.opacity = '0.5';
  }

  checkBox.onclick = (event) => {
    let setDoneUndone = notes.findIndex(
      (i) => i.id == parseInt(noteNode.getAttribute("id")!)
    );
    if (checkBox.checked === true) {
      notes[setDoneUndone].done = true;
      todo.style.textDecoration = 'line-through';
      todo.style.opacity = '0.5';
    } 
    else {
      notes[setDoneUndone].done = false;
      todo.style.textDecoration = 'none';
      todo.style.opacity = '1';
    }      
    checkHash();
    updateCounter();
  };    
  
  noteNode.addEventListener("dblclick", editNote);
  function editNote() {
    // Remove event listener to prevent crash if double clicked again. Added back at the end of function.
    noteNode.removeEventListener("dblclick", editNote);

    // Creates a textbox. Extra div and attributes added to get CSS settings included
    let editForm = document.createElement("form");
    editForm.setAttribute("class", "parent");
    let div = document.createElement("div");
    div.setAttribute("class", "left-frame");

    let editTextBox = document.createElement("input") as HTMLInputElement;
    editTextBox.setAttribute("type", "text");
    editTextBox.setAttribute("class", "note");
    editTextBox.setAttribute("id", "todo");
    editTextBox.value = note.text;

    editForm.appendChild(div);
    editForm.appendChild(editTextBox);

    noteNode.replaceChildren(editForm);

    editTextBox.focus();

    editForm.addEventListener("submit", overwriteNote);
    editTextBox.addEventListener("blur", overwriteNote);

    function overwriteNote() {
      const newNoteNode = noteTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
      newNoteNode.querySelector("#todo")!.textContent = editTextBox.value;
      newNoteNode.setAttribute("id", note.id.toString());
      
      let noteToEdit = notes.findIndex((i) => i.id == note.id);      
      notes[noteToEdit].text = editTextBox.value;        

      // Some duplicate code for controls in here, looping back to createNote makes notes "jump around"
      const deleteButton = newNoteNode.querySelector("button")!;
      deleteButton.onclick = (event) => {
        let toRemove = notes.findIndex(
          (i) => i.id == note.id
        );
        notes.splice(toRemove, 1);
        newNoteNode.remove();
        updateCounter();
      };

      const todo = newNoteNode.querySelector("#todo") as HTMLElement;
      const checkBox = newNoteNode.querySelector("#boxcheck")! as HTMLInputElement;      
      if (note.done) {
        checkBox.checked = true;
        todo.style.textDecoration = 'line-through';
        todo.style.opacity = '0.5';
      }     
      checkBox.onclick = (event) => {
        let setDoneUndone = notes.findIndex(
          (i) => i.id === note.id
        );
        if (checkBox.checked === true) {
          notes[setDoneUndone].done = true;
          todo.style.textDecoration = 'line-through';
          todo.style.opacity = '0.5';
        } 
        else {
          notes[setDoneUndone].done = false;
          todo.style.textDecoration = 'none';
          todo.style.opacity = '1';
        }
        checkHash();
        updateCounter();
      };
  
      // Event listener removed to prevent conflicts between it and "onsubmit". Gets re-added when user edits a note.
      editTextBox.removeEventListener("blur", overwriteNote);
  
      noteNode.replaceChildren(newNoteNode);
      let parentDiv = noteNode.querySelector('.parent') as HTMLElement;
      parentDiv.style.width = '100%';
      noteNode.addEventListener("dblclick", editNote);
  
      updateCounter();
    }
  }
}

checkAllButton.addEventListener("click", trueCheckBoxes);
function trueCheckBoxes() {
  let checkedBox = <HTMLInputElement[]>(
    (<any>document.querySelectorAll("input[type=checkbox]"))
  );  
  let completed = 0;
  notes.forEach((element) => {
    if (element.done === true) {
      completed++;
    }
  });

  if (completed === notes.length) {
    checkedBox.forEach((checkbox) => {
      checkbox.checked = false;      
    });
    notes.forEach((element) => {
      element.done = false;
      let div = document.getElementById(element.id.toString()) as HTMLElement;
      let todo = div.querySelector('#todo') as HTMLElement;
      todo.style.textDecoration = 'none';
      todo.style.opacity = '1';
    });
  } 
  else {
    checkedBox.forEach((checkbox) => {
      checkbox.checked = true;
    });
    notes.forEach((element) => {
      element.done = true;
      let div = document.getElementById(element.id.toString()) as HTMLElement;
      let todo = div.querySelector('#todo') as HTMLElement;
      todo.style.textDecoration = 'line-through';
      todo.style.opacity = '0.5';
    });
  }  
  checkHash();
  updateCounter();
}

// "clicked" class is added and removed in these functions. This is to avoid loosing the border on active tab button when refreshing the page 
const showAllNotesButton = document.getElementById('show-all') as HTMLButtonElement;
showAllNotesButton.addEventListener('click', showAllNotes);
function showAllNotes() {
  showActiveNotesButton.removeAttribute("class");
  showCompletedNotesButton.removeAttribute("class");
  showAllNotesButton.setAttribute("class", "clicked");
  window.location.hash = "";
  notes.forEach((element) => {
    let div = document.getElementById(element.id.toString()) as HTMLElement;
    div.style.display = 'flex';
  })  
}

const showActiveNotesButton = document.getElementById('show-active') as HTMLButtonElement;
showActiveNotesButton.addEventListener('click', showActiveNotes);
function showActiveNotes() {
  showAllNotesButton.removeAttribute("class");
  showCompletedNotesButton.removeAttribute("class");
  showActiveNotesButton.setAttribute("class", "clicked");
  window.location.hash = "active";
  notes.forEach((element) => {
    let div = document.getElementById(element.id.toString()) as HTMLElement;
    if (element.done === true) {
      div.style.display = 'none';
    }
    else {
      div.style.display = 'flex';
    }
  })  
}

const showCompletedNotesButton = document.getElementById('show-completed') as HTMLButtonElement;
showCompletedNotesButton.addEventListener('click', showCompletedNotes) 
function showCompletedNotes() {
  showActiveNotesButton.removeAttribute("class");
  showAllNotesButton.removeAttribute("class");
  showCompletedNotesButton.setAttribute("class", "clicked");
  window.location.hash = "completed";
  notes.forEach((element) => {
    let div = document.getElementById(element.id.toString()) as HTMLElement;
    if (element.done === true) {
      div.style.display = 'flex';
    }
    else {
      div.style.display = 'none';
    }
  })
}

window.addEventListener('pageshow', checkHash);
window.addEventListener('hashchange', checkHash);

function checkHash() {
  let hash = window.location.hash;
  if (hash === "") {
    showAllNotes();
  }
  else if (hash === "#active") {
    showActiveNotes();    
  }
  else if (hash === "#completed") {
    showCompletedNotes();
  }
}

// Function iterates over a copy of notes array, since removing values in the original changes indexes
clearCompletedButton.onclick = (event) => {
  let notesCopy: Note[] = [];
  notes.forEach((element) => {
    notesCopy.push(element);
  })
  for (let i = 0; i < notesCopy.length; i++) {
    if (notesCopy[i].done == true) {
      let node = document.getElementById(notesCopy[i].id.toString());
      node!.remove();
      let toRemove = notes.findIndex(e => e.id == notesCopy[i].id);
      notes.splice(toRemove, 1);
    }    
  }
  updateCounter();
}

function updateCounter() {
  const counter = document.getElementById("items-left")! as HTMLElement;
  let count = notes.length; 
  
  if (count === 0) {
    footer.style.visibility = "hidden";
    checkAllButton.style.visibility = "hidden";
    clearCompletedButton.style.visibility = "hidden";
  } 
  else {
    footer.style.visibility = "visible";
    checkAllButton.style.visibility = "visible";
    clearCompletedButton.style.visibility = "hidden";

    notes.forEach((note) => {
      if (note.done === true) {
        count--;
      }
    });
    
    if (count < notes.length) {
      clearCompletedButton.style.visibility = "visible";
    }
    
    if (count === 1) {
      counter.textContent = "1 item left";
    }
    else if (count === notes.length) {
      counter.textContent = count + " items left";
      clearCompletedButton.style.visibility = "hidden";
    }
    else {
      counter.textContent = count + " items left";
    }
  }
  updateLocalStorage();
}

// Id is prepended to allow duplicate notes to be stored and to keep the order on reload. Removed in loadLocalStorage() 
function updateLocalStorage() {
  localStorage.clear();
  notes.forEach((element) => {    
    localStorage.setItem(element.id + '$' + element.text, element.done.toString());
  });
}