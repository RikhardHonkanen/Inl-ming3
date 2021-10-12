var Note = /** @class */ (function () {
    function Note() {
        this.index = 0;
        this.text = "";
        this.done = false;
    }
    return Note;
}());
var noteTemplate = document.querySelector("#list-item");
var notesList = document.querySelector("main");
var form = document.querySelector("form");
var formText = document.querySelector("input");
var counter = document.getElementById("items-left");
var notes = [];
var noteIndex = 0;
var editTextBox = document.createElement("input");
var noteText = formText.value;
var asideStyle = document.querySelector("aside");
var checkAllButton = document.querySelector("#button");
var completedButtonVisible = document.getElementById("clearallcompleted");
var override = false;
function loadLocalStorage() {
    if (localStorage.length > 0) {
        asideStyle.style.visibility = "visible";
        checkAllButton.style.visibility = "visible";
        for (var i = 0; i < localStorage.length; i++) {
            noteText = localStorage.key(i);
            var noteDone = false;
            if (localStorage.getItem(noteText) == "true") {
                noteDone = true;
            }
            var noteObject = new Note();
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
form.onsubmit = function (event) {
    event.preventDefault();
    var noteText = formText.value;
    if (noteText === "") {
        //Do nothing
    }
    else {
        var noteObject = new Note();
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
function createNote(noteText, noteIndex, noteDone) {
    var note = noteTemplate.content.firstElementChild.cloneNode(true);
    note.querySelector("#todo").textContent = noteText;
    note.setAttribute("id", noteIndex.toString());
    var deleteButton = note.querySelector("button");
    deleteButton.onclick = function (event) {
        var toRemove = notes.findIndex(function (i) { return i.index == parseInt(note.getAttribute("id")); });
        notes.splice(toRemove, 1);
        note.remove();
        updateCounter();
    };
    //Clear all "checked" notes
    completedButtonVisible.onclick = function (event) {
        var i = 0;
        var toRemove = notes.findIndex(function (i) { return i.index == parseInt(note.getAttribute("id")); });
        notes.forEach(function (element) {
            if (element.done === true) {
                notes.splice(toRemove, i);
                note.remove();
            }
        });
        updateCounter();
    };
    var checkBox = note.querySelector("#boxcheck");
    if (noteDone == true) {
        checkBox.checked = true;
    }
    checkBox.onclick = function (event) {
        var setDoneUndone = notes.findIndex(function (i) { return i.index == parseInt(note.getAttribute("id")); });
        if (checkBox.checked === true) {
            notes[setDoneUndone].done = true;
            completedButtonVisible.style.visibility = "visible";
        }
        else {
            notes[setDoneUndone].done = false;
        }
        updateCounter();
    };
    notesList.append(note);
    formText.value = "";
    note.addEventListener("dblclick", editNote);
    function editNote() {
        noteText = note.querySelector("#todo").textContent;
        noteIndex = parseInt(note.getAttribute("id"));
        note.replaceChildren();
        var editForm = document.createElement("form");
        editForm.setAttribute("class", "parent");
        var div = document.createElement("div");
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
            var newNote = noteTemplate.content.firstElementChild.cloneNode(true);
            newNote.querySelector("#todo").textContent = editTextBox.value;
            newNote.setAttribute("id", noteIndex.toString());
            var noteToEdit = notes.findIndex(function (i) { return i.index == noteIndex; });
            notes[noteToEdit].text = editTextBox.value;
            notes[noteToEdit].done = false;
            // Some duplicate code for controls in here, did not seem to work well just looping back to createNote
            var deleteButton = newNote.querySelector("button");
            deleteButton.onclick = function (event) {
                var toRemove = notes.findIndex(function (i) { return i.index == parseInt(note.getAttribute("id")); });
                notes.splice(toRemove, 1);
                newNote.remove();
                updateCounter();
            };
            var checkBox = newNote.querySelector("#boxcheck");
            checkBox.onclick = function (event) {
                var setDoneUndone = notes.findIndex(function (i) { return i.index == parseInt(note.getAttribute("id")); });
                if (checkBox.checked === true) {
                    notes[setDoneUndone].done = true;
                }
                else {
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
    var checkedBox = document.querySelectorAll("input[type=checkbox]");
    if (notes.length === 0) {
        // Do nothing
    }
    else {
        var completed_1 = 0;
        notes.forEach(function (element) {
            if (element.done == true) {
                completed_1++;
            }
        });
        if (completed_1 == notes.length) {
            checkedBox.forEach(function (checkbox) {
                checkbox.checked = false;
            });
            notes.forEach(function (element) {
                element.done = false;
            });
        }
        else {
            checkedBox.forEach(function (checkbox) {
                checkbox.checked = true;
            });
            notes.forEach(function (element) {
                element.done = true;
            });
        }
    }
    updateCounter();
}
function updateCounter() {
    var count = notes.length;
    if (count === 0) {
        asideStyle.style.visibility = "hidden";
        checkAllButton.style.visibility = "hidden";
        completedButtonVisible.style.visibility = "hidden";
    }
    else {
        asideStyle.style.visibility = "visible";
        checkAllButton.style.visibility = "visible";
        completedButtonVisible.style.visibility = "hidden";
        notes.forEach(function (note) {
            if (note.done === true) {
                count--;
            }
        });
        if (count < notes.length) {
            completedButtonVisible.style.visibility = "visible";
        }
        if (count === 1) {
            counter.textContent = "1 item left";
        }
        else if (count == notes.length) {
            counter.textContent = count + " items left";
            completedButtonVisible.style.visibility = "hidden";
        }
        else {
            counter.textContent = count + " items left";
        }
    }
    updateLocalStorage();
}
function updateLocalStorage() {
    localStorage.clear();
    notes.forEach(function (element) {
        localStorage.setItem(element.text, element.done.toString());
    });
}
