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
var clearCompletedButton = document.getElementById("clearallcompleted");
loadLocalStorage();
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
            createNote(noteText, noteIndex, noteDone);
            noteIndex++;
        }
        updateCounter();
    }
}
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
    var checkBox = note.querySelector("#boxcheck");
    if (noteDone == true) {
        checkBox.checked = true;
    }
    checkBox.onclick = function (event) {
        var setDoneUndone = notes.findIndex(function (i) { return i.index == parseInt(note.getAttribute("id")); });
        if (checkBox.checked === true) {
            notes[setDoneUndone].done = true;
            clearCompletedButton.style.visibility = "visible";
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
            note.replaceWith(newNote);
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
//Clear all "checked" notes
clearCompletedButton.onclick = function (event) {
    var notesCopy = [];
    notes.forEach(function (element) {
        notesCopy.push(element);
    });
    var _loop_1 = function (i) {
        if (notesCopy[i].done == true) {
            var node = document.getElementById(notesCopy[i].index.toString());
            node.remove();
            var toRemove = notes.findIndex(function (e) { return e.index == notesCopy[i].index; });
            notes.splice(toRemove, 1);
        }
    };
    for (var i = 0; i < notesCopy.length; i++) {
        _loop_1(i);
    }
    updateCounter();
};
function updateCounter() {
    var count = notes.length;
    if (count === 0) {
        asideStyle.style.visibility = "hidden";
        checkAllButton.style.visibility = "hidden";
        clearCompletedButton.style.visibility = "hidden";
    }
    else {
        asideStyle.style.visibility = "visible";
        checkAllButton.style.visibility = "visible";
        clearCompletedButton.style.visibility = "hidden";
        notes.forEach(function (note) {
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
        else if (count == notes.length) {
            counter.textContent = count + " items left";
            clearCompletedButton.style.visibility = "hidden";
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
