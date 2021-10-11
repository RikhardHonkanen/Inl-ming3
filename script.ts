class Note {
  index: number = 0;
  text: string = "";
  done: boolean = false;  
}

const noteTemplate = document.querySelector(
  "#list-item"
) as HTMLTemplateElement;
const notesList = document.querySelector("main")! as HTMLElement;
const form = document.querySelector("form")!;
const formText = document.querySelector("input")! as HTMLInputElement;
const counter = document.getElementById("items-left")!;
const notes: Note[] = [];
let noteIndex: number = 0;
let editTextBox = document.createElement("input")!;
let noteText: string = formText.value;
const asideStyle = document.getElementById("aside");
const checkAllButton = document.querySelector("#button") as HTMLButtonElement;

const note = noteTemplate.content.firstElementChild!.cloneNode(
  true
) as HTMLElement;

form.onsubmit = (event) => {
  event.preventDefault();
  let noteText: string = formText.value;

  if (noteText === "") {
    //Do nothing
  } 
  else {
    let noteObject = new Note();
    noteObject.text = noteText;
    noteObject.done = false;
    noteObject.index = noteIndex;
    notes.push(noteObject);

    createNote(noteText, noteIndex);
    noteIndex++;
    updateCounter();
  }
};

function createNote(noteText: string, noteIndex: number) {
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

  const checkBox = note.querySelector("#boxcheck")! as HTMLInputElement;
  checkBox.onclick = event => {
    
    for (let i = 0; i < notes.length; i++) {
      if (checkBox[i].checked === true) {
        notes[i].done = true;
        let number = notes[i];
        console.log(number + " is done");
      }
      else {
        notes[i].done = false;
        let number = notes[i];
        console.log(number + " is undone");
      }
    }
    updateCounter();
  }

  
  checkAllButton.addEventListener("click", TrueCheckBoxes);
  function TrueCheckBoxes() {
    
  var checkedBox = document.querySelectorAll('input:checked');

  if (checkedBox.length === 0) {
    // there are no checked checkboxes
    console.log('no checkboxes checked');
    checkBox.checked = !checkBox.checked;
      for (let i = 0; i < notes.length; i++) {
        notes[i].done = true;
      }
    }
  else if (checkedBox.length === checkBox.maxLength) {
    // there are some checked checkboxes
    console.log(checkedBox.length + ' checkboxes checked');
    checkBox.checked = !checkBox.checked;
    for (let i = 0; i < notes.length; i++) {
      notes[i].done = false;
    }
  } 

    for (let i = 0; i < notes.length; i++) {
      if (notes[i].done === true) {
        
      }
      else {
        checkBox.checked = true;
      }
    }
  }

  notesList.append(note);
  formText.value = "";

  note.addEventListener("dblclick", editNote);
  function editNote() {
    noteText = note.querySelector("#todo")!.textContent!;
    note.replaceChildren();

    let editForm = document.createElement("form");
    editForm.setAttribute("class", "parent");
    let div = document.createElement("div");
    div.setAttribute("class", "left-frame");
    // let spacerBox = document.createElement("input");
    // spacerBox.setAttribute("type", "checkbox");
    // spacerBox.setAttribute("id", "falsebox");
    // spacerBox.setAttribute("style", "opacity: 0");
    editTextBox.setAttribute("type", "text");
    editTextBox.setAttribute("class", "note");
    editTextBox.value = noteText;
    note.appendChild(editForm);
    editForm.appendChild(div);
    // div.appendChild(spacerBox);
    editForm.appendChild(editTextBox);
    editTextBox.focus();
    editForm.addEventListener("submit", restoreNote);
    editTextBox.addEventListener("blur", restoreNote);

    function restoreNote() {
      const newNote = noteTemplate.content.firstElementChild!.cloneNode(
        true
      ) as HTMLElement;
      newNote.querySelector("#todo")!.textContent = editTextBox.value;

      const deleteButton = newNote.querySelector("button")!;
      deleteButton.onclick = (event) => {
        let toRemove = notes.findIndex(
          (i) => i.index == parseInt(note.getAttribute("id")!)
        );
        notes.splice(toRemove, 1);
        newNote.remove();
        updateCounter();
      };
      editTextBox.removeEventListener("blur", restoreNote);

      note.replaceChildren(newNote);
      updateCounter();
    }
  }
}

function updateCounter() {
  let count = notes.length;

  for (let i = 0; i < notes.length; i++) {
    if (notes[i].done === true) {
      count--;
    }
  }
  
  if (count == 1) {
    
    counter.textContent = count + " item left";
    asideStyle.style.visibility = "visible";
    checkAllButton.style.visibility = "visible";

  } else if (count == 0) {
    
    counter.textContent = "";
    asideStyle.style.visibility = "hidden";
    checkAllButton.style.visibility = "hidden";

  } else {
    
    counter.textContent = count + " items left";
    asideStyle.style.visibility = "visible";
    checkAllButton.style.visibility = "visible";
  }
}