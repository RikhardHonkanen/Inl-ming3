var Note = /** @class */ (function () {
    function Note() {
    }
    return Note;
}());
var noteTemplate = document.querySelector('#list-item');
var notesList = document.querySelector('main');
var form = document.querySelector('form');
var formText = document.querySelector('input');
var counter = document.getElementById('items-left');
var notes = [];
var noteIndex = 0;
form.onsubmit = function (event) {
    event.preventDefault();
    noteIndex++;
    var noteText = formText.value;
    var noteObject = new Note();
    noteObject.text = noteText;
    noteObject.done = false;
    noteObject.index = noteIndex;
    notes.push(noteObject);
    createNote(noteText, noteIndex);
};
function createNote(noteText, noteIndex) {
    var note = noteTemplate.content.firstElementChild.cloneNode(true);
    note.querySelector('#todo').textContent = noteText;
    note.setAttribute('id', noteIndex.toString());
    var deleteButton = note.querySelector('button');
    deleteButton.onclick = function (event) {
        var toRemove = notes.findIndex(function (i) { return i.index == parseInt(note.getAttribute('id')); });
        notes.splice(toRemove, 1);
        note.remove();
        updateCounter();
    };
    notesList.append(note);
    formText.value = '';
    note.addEventListener('dblclick', function editNote() {
        noteText = note.querySelector('#todo').textContent;
        note.replaceChildren();
        var editForm = document.createElement('form');
        editForm.setAttribute('class', 'parent');
        var div = document.createElement('div');
        div.setAttribute('class', 'left-frame');
        var spacerBox = document.createElement('input');
        spacerBox.setAttribute('type', 'checkbox');
        spacerBox.setAttribute('id', 'checkbox');
        spacerBox.setAttribute('style', 'opacity: 0');
        var editTextBox = document.createElement('input');
        editTextBox.setAttribute('type', 'text');
        editTextBox.setAttribute('class', 'note');
        editTextBox.value = noteText;
        note.appendChild(editForm);
        editForm.appendChild(div);
        div.appendChild(spacerBox);
        editForm.appendChild(editTextBox);
        editTextBox.focus();
        editForm.addEventListener('submit', restoreNote);
        editTextBox.addEventListener('blur', restoreNote);
        function restoreNote() {
            var newNote = noteTemplate.content.firstElementChild.cloneNode(true);
            newNote.querySelector('#todo').textContent = editTextBox.value;
            var deleteButton = newNote.querySelector('button');
            deleteButton.onclick = function (event) {
                var toRemove = notes.findIndex(function (i) { return i.index == parseInt(note.getAttribute('id')); });
                notes.splice(toRemove, 1);
                newNote.remove();
                updateCounter();
            };
            editTextBox.removeEventListener('blur', restoreNote);
            note.replaceChildren(newNote);
        }
    });
    updateCounter();
}
function updateCounter() {
    var count = notes.length;
    if (count == 1) {
        counter.textContent = count + 'item left';
    }
    else if (count == 0) {
        counter.textContent = '';
    }
    else {
        counter.textContent = count + 'items left';
    }
}
