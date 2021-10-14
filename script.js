var Note = /** @class */ (function () {
    function Note() {
        this.id = 0;
        this.text = "";
        this.done = false;
    }
    return Note;
}());
var noteTemplate = document.querySelector("#list-item");
var formText = document.querySelector("input");
var footer = document.querySelector("footer");
var checkAllButton = document.querySelector("#button");
var clearCompletedButton = document.getElementById("clearallcompleted");
var notes = [];
var noteIndex = 0;
var noteText = formText.value;
loadLocalStorage();
function loadLocalStorage() {
    if (localStorage.length > 0) {
        var sortingList = [];
        for (var i = 0; i < localStorage.length; i++) {
            sortingList.push(localStorage.key(i) + '$' + localStorage.getItem(localStorage.key(i)));
        }
        sortingList.sort();
        for (var i = 0; i < sortingList.length; i++) {
            var textStart = sortingList[i].indexOf('$');
            var textEnd = sortingList[i].lastIndexOf('$');
            noteText = sortingList[i].substring(textStart + 1, textEnd);
            var noteDone = false;
            if (sortingList[i].substring(textEnd + 1) == "true") {
                noteDone = true;
            }
            var noteObject = new Note();
            noteObject.text = noteText;
            noteObject.done = noteDone;
            noteObject.id = noteIndex;
            notes.push(noteObject);
            createNote(noteObject);
            noteIndex++;
        }
        updateCounter();
    }
}
;
var form = document.querySelector("form");
form.onsubmit = function (event) {
    event.preventDefault();
    noteText = formText.value;
    if (noteText === "") {
        //Do nothing
    }
    else {
        var noteObject = new Note();
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
function createNote(note) {
    var noteNode = noteTemplate.content.firstElementChild.cloneNode(true);
    noteNode.querySelector("#todo").textContent = note.text;
    noteNode.setAttribute("id", note.id.toString());
    var notesList = document.querySelector("main");
    notesList.append(noteNode);
    formText.value = "";
    // formText.focus();
    var deleteButton = noteNode.querySelector("button");
    deleteButton.onclick = function (event) {
        var toRemove = notes.findIndex(function (i) { return i.id == parseInt(noteNode.getAttribute("id")); });
        notes.splice(toRemove, 1);
        noteNode.remove();
        updateCounter();
    };
    var checkBox = noteNode.querySelector("#boxcheck");
    var todo = noteNode.querySelector("#todo");
    // This check is for when objects are passed in from loadLocalStorage()
    if (note.done == true) {
        checkBox.checked = true;
        todo.style.textDecoration = 'line-through';
        todo.style.opacity = '0.5';
    }
    checkBox.onclick = function (event) {
        var setDoneUndone = notes.findIndex(function (i) { return i.id == parseInt(noteNode.getAttribute("id")); });
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
        var editForm = document.createElement("form");
        editForm.setAttribute("class", "parent");
        var div = document.createElement("div");
        div.setAttribute("class", "left-frame");
        var editTextBox = document.createElement("input");
        editTextBox.setAttribute("type", "text");
        // editTextBox.setAttribute("class", "note");
        editTextBox.setAttribute("id", "todo");
        editTextBox.value = note.text;
        editForm.appendChild(div);
        editForm.appendChild(editTextBox);
        noteNode.replaceChildren(editForm);
        editTextBox.focus();
        editForm.addEventListener("submit", overwriteNote);
        editTextBox.addEventListener("blur", overwriteNote);
        function overwriteNote() {
            var newNote = noteTemplate.content.firstElementChild.cloneNode(true);
            newNote.querySelector("#todo").textContent = editTextBox.value;
            newNote.setAttribute("id", note.id.toString());
            var noteToEdit = notes.findIndex(function (i) { return i.id == note.id; });
            notes[noteToEdit].text = editTextBox.value;
            // Some duplicate code for controls in here, looping back to createNote makes notes "jump around"
            var deleteButton = newNote.querySelector("button");
            deleteButton.onclick = function (event) {
                var toRemove = notes.findIndex(function (i) { return i.id == note.id; });
                notes.splice(toRemove, 1);
                newNote.remove();
                updateCounter();
            };
            var todo = newNote.querySelector("#todo");
            var checkBox = newNote.querySelector("#boxcheck");
            if (note.done) {
                checkBox.checked = true;
                todo.style.textDecoration = 'line-through';
                todo.style.opacity = '0.5';
            }
            checkBox.onclick = function (event) {
                var setDoneUndone = notes.findIndex(function (i) { return i.id == note.id; });
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
            noteNode.replaceChildren(newNote);
            var parentDiv = noteNode.querySelector('.parent');
            parentDiv.style.width = '100%';
            noteNode.addEventListener("dblclick", editNote);
            updateCounter();
        }
    }
}
checkAllButton.addEventListener("click", trueCheckBoxes);
function trueCheckBoxes() {
    var checkedBox = document.querySelectorAll("input[type=checkbox]");
    var completed = 0;
    notes.forEach(function (element) {
        if (element.done == true) {
            completed++;
        }
    });
    if (completed == notes.length) {
        checkedBox.forEach(function (checkbox) {
            checkbox.checked = false;
        });
        notes.forEach(function (element) {
            element.done = false;
            var div = document.getElementById(element.id.toString());
            var todo = div.querySelector('#todo');
            todo.style.textDecoration = 'none';
            todo.style.opacity = '1';
        });
    }
    else {
        checkedBox.forEach(function (checkbox) {
            checkbox.checked = true;
        });
        notes.forEach(function (element) {
            element.done = true;
            var div = document.getElementById(element.id.toString());
            var todo = div.querySelector('#todo');
            todo.style.textDecoration = 'line-through';
            todo.style.opacity = '0.5';
        });
    }
    checkHash();
    updateCounter();
}
// TODO: Notes flyttar sig inte om man t.ex. är i "Active" vyn och färdigmarkerar
// "clicked" class is added and removed in these functions so that the active tab can be highlighted in css. This to avoid loosing the border on buttons when refreshing the page 
var showAllNotesButton = document.getElementById('show-all');
showAllNotesButton.addEventListener('click', showAllNotes);
function showAllNotes() {
    showActiveNotesButton.removeAttribute("class");
    showCompletedNotesButton.removeAttribute("class");
    showAllNotesButton.setAttribute("class", "clicked");
    window.location.hash = "";
    notes.forEach(function (element) {
        var div = document.getElementById(element.id.toString());
        div.style.display = 'flex';
    });
}
var showActiveNotesButton = document.getElementById('show-active');
showActiveNotesButton.addEventListener('click', showActiveNotes);
function showActiveNotes() {
    showAllNotesButton.removeAttribute("class");
    showCompletedNotesButton.removeAttribute("class");
    showActiveNotesButton.setAttribute("class", "clicked");
    window.location.hash = "active";
    notes.forEach(function (element) {
        var div = document.getElementById(element.id.toString());
        if (element.done == true) {
            div.style.display = 'none';
        }
        else {
            div.style.display = 'flex';
        }
    });
}
var showCompletedNotesButton = document.getElementById('show-completed');
showCompletedNotesButton.addEventListener('click', showCompletedNotes);
function showCompletedNotes() {
    showActiveNotesButton.removeAttribute("class");
    showAllNotesButton.removeAttribute("class");
    showCompletedNotesButton.setAttribute("class", "clicked");
    window.location.hash = "completed";
    notes.forEach(function (element) {
        var div = document.getElementById(element.id.toString());
        if (element.done == true) {
            div.style.display = 'flex';
        }
        else {
            div.style.display = 'none';
        }
    });
}
window.addEventListener('pageshow', checkHash);
window.addEventListener('hashchange', checkHash);
function checkHash() {
    var hash = window.location.hash;
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
clearCompletedButton.onclick = function (event) {
    var notesCopy = [];
    notes.forEach(function (element) {
        notesCopy.push(element);
    });
    var _loop_1 = function (i) {
        if (notesCopy[i].done == true) {
            var node = document.getElementById(notesCopy[i].id.toString());
            node.remove();
            var toRemove = notes.findIndex(function (e) { return e.id == notesCopy[i].id; });
            notes.splice(toRemove, 1);
        }
    };
    for (var i = 0; i < notesCopy.length; i++) {
        _loop_1(i);
    }
    updateCounter();
};
// Logic improvements possible here?
function updateCounter() {
    var counter = document.getElementById("items-left");
    var count = notes.length;
    if (count === 0) {
        footer.style.visibility = "hidden";
        checkAllButton.style.visibility = "hidden";
        clearCompletedButton.style.visibility = "hidden";
    }
    else {
        footer.style.visibility = "visible";
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
// Id is prepended to allow duplicate notes to be stored and to keep the order on reload. Removed in loadLocalStorage() 
function updateLocalStorage() {
    localStorage.clear();
    notes.forEach(function (element) {
        localStorage.setItem(element.id + '$' + element.text, element.done.toString());
    });
}
