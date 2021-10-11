class Note {
  index: number = 0;
  text: string = "";
  done: boolean = false;
}

const noteTemplate = document.querySelector(
  "#list-item"
) as HTMLTemplateElement;
const notesList = document.querySelector("main")! as HTMLElement;
const form = document.querySelector("form")! as HTMLFormElement;
const formText = document.querySelector("input")! as HTMLInputElement;
const counter = document.getElementById("items-left")! as HTMLElement;
const notes: Note[] = [];
let noteIndex: number = 0;
let editTextBox = document.createElement("input")! as HTMLInputElement;
let noteText: string = formText.value;
const asideStyle = document.querySelector("aside")! as HTMLElement;
const checkAllButton = document.querySelector("#button")! as HTMLButtonElement;
const completedButtonVisible = document.getElementById("clearallcompleted")! as HTMLButtonElement;
let override: boolean = false;

function loadLocalStorage() {
  if (localStorage.length > 0) {
    asideStyle.style.visibility = "visible";
    checkAllButton.style.visibility = "visible";

    for (let i = 0; i < localStorage.length; i++) {
      noteText = localStorage.key(i)!;
      let noteDone: boolean = false;
      if (localStorage.getItem(noteText!) == "true") {
        noteDone = true;
      }

      let noteObject = new Note();
      noteObject.text = noteText;
      noteObject.done = noteDone;
      noteObject.index = noteIndex;
      notes.push(noteObject);
      noteIndex++;

      createNote(noteText, noteIndex, noteDone);
    }
  }
}
loadLocalStorage();

form.onsubmit = (event) => {
  event.preventDefault();
  let noteText: string = formText.value;

  if (noteText === "") {
    //Do nothing
  } else {
    let noteObject = new Note();
    noteObject.text = noteText;
    noteObject.done = false;
    noteObject.index = noteIndex;
    notes.push(noteObject);

    asideStyle.style.visibility = "visible";
    checkAllButton.style.visibility = "visible";

    createNote(noteText, noteIndex, false);
    noteIndex++;
    updateCounter();
  }
};

function createNote(noteText: string, noteIndex: number, noteDone: boolean) {
  const note = noteTemplate.content.firstElementChild!.cloneNode(
    true
  ) as HTMLElement;

  note.querySelector("#todo")!.textContent = noteText;
  note.setAttribute("id", noteIndex.toString());

  const deleteButton = note.querySelector("button")!;
  deleteButton.onclick = (event) => {
    let toRemove = notes.findIndex(
      (i) => i.index == parseInt(note.getAttribute("id")!)
    );
    notes.splice(toRemove, 1);
    note.remove();
    updateCounter();
  };

  //Clear all "checked" notes
completedButtonVisible.onclick = (event) => {
  let i: number = 0;
  let toRemove = notes.findIndex(
    (i) => i.index == parseInt(note.getAttribute("id")!)
  );
  notes.forEach((element) => {
    if (element.done === true) {
      notes.splice(toRemove, i);
      note.remove();
    }
  });
  updateLocalStorage();
  updateCounter();
}

  const checkBox = note.querySelector("#boxcheck")! as HTMLInputElement;
  if (noteDone == true) {
    checkBox.checked = true;
  }
  checkBox.onclick = (event) => {
    let setDoneUndone = notes.findIndex(
      (i) => i.index == parseInt(note.getAttribute("id")!)
    );
    if (checkBox.checked === true) {
      notes[setDoneUndone].done = true;
      completedButtonVisible.style.visibility = "visible";
    } else {
      notes[setDoneUndone].done = false;
    }
    updateCounter();
  };

  notesList.append(note);
  formText.value = "";

  note.addEventListener("dblclick", editNote);
  function editNote() {
    noteText = note.querySelector("#todo")!.textContent!;
    noteIndex = parseInt(note.getAttribute("id")!);
    note.replaceChildren();

    let editForm = document.createElement("form");
    editForm.setAttribute("class", "parent");
    let div = document.createElement("div");
    div.setAttribute("class", "left-frame");
    editTextBox.setAttribute("type", "text");
    editTextBox.setAttribute("class", "note");
    editTextBox.value = noteText;
    note.appendChild(editForm);
    editForm.appendChild(div);
    editForm.appendChild(editTextBox);
    editTextBox.focus();
    editForm.addEventListener("submit", restoreNote);
    editTextBox.addEventListener("blur", restoreNote);

    function restoreNote() {
      const newNote = noteTemplate.content.firstElementChild!.cloneNode(
        true
      ) as HTMLElement;
      newNote.querySelector("#todo")!.textContent = editTextBox.value;
      newNote.setAttribute("id", noteIndex.toString());

      let noteToEdit = notes.findIndex((i) => i.index == noteIndex);
      notes[noteToEdit].text = editTextBox.value;
      notes[noteToEdit].done = false;

      // Some duplicate code for controls in here, did not seem to work well just looping back to createNote
      const deleteButton = newNote.querySelector("button")!;
      deleteButton.onclick = (event) => {
        let toRemove = notes.findIndex(
          (i) => i.index == parseInt(note.getAttribute("id")!)
        );
        notes.splice(toRemove, 1);
        newNote.remove();
        updateCounter();
      };

      const checkBox = newNote.querySelector("#boxcheck")! as HTMLInputElement;
      checkBox.onclick = (event) => {
        let setDoneUndone = notes.findIndex(
          (i) => i.index == parseInt(note.getAttribute("id")!)
        );
        if (checkBox.checked === true) {
          notes[setDoneUndone].done = true;
        } else {
          notes[setDoneUndone].done = false;
        }
        updateCounter();
      };

      editTextBox.removeEventListener("blur", restoreNote);

      note.replaceChildren(newNote);
      updateCounter();
    }
  }
}

checkAllButton.addEventListener("click", trueCheckBoxes);
function trueCheckBoxes() {
  let checkedBox = <HTMLInputElement[]>(
    (<any>document.querySelectorAll("input[type=checkbox]"))
  );
  if (notes.length === 0) {
    // Do nothing
  } 
  else {
    let completed = 0;
    notes.forEach((element) => {
      if (element.done == true) {
        completed++;
      }
    });
    if (completed == notes.length) {
      checkedBox.forEach((checkbox) => {
        checkbox.checked = false;
      });
      notes.forEach((element) => {
        element.done = false;
      });
    } 
    else {
      checkedBox.forEach((checkbox) => {
        checkbox.checked = true;
      });
      notes.forEach((element) => {
        element.done = true;
      });
    }
  }
  override = true;
  updateCounter();
}

function updateCounter() {
  let count = notes.length;
  
  //Overrides the normal behavior that would make completedButtonVisible hidden
  if (override === true) {
    completedButtonVisible.style.visibility = "visible";
    override = false;
  }

  if (count === 0) {
    asideStyle.style.visibility = "hidden";
    checkAllButton.style.visibility = "hidden";
    completedButtonVisible.style.visibility = "hidden";
  } 
  else {
    notes.forEach((note) => {
      if (note.done === true) {
        count--;
      }
    });
    if (count === 1) {
      counter.textContent = "1 item left";
    }
    else if (count == notes.length) {
      counter.textContent = count + " items left";
      completedButtonVisible.style.visibility = "hidden";
    }
    else {
      counter.textContent = count + " items left";
      count++;
    }
  }
  updateLocalStorage();
}


function updateLocalStorage() {
  localStorage.clear();
  notes.forEach((element) => {
    localStorage.setItem(element.text, element.done.toString());
  });
}


