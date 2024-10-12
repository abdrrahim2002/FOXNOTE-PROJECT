

//for AJAX GET requset 'GET the profile notes'
function loadNotes() {
  const xhr = new XMLHttpRequest();

  xhr.open('GET', getProfileNotesUrl, true);

  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 400) {
      const data = JSON.parse(xhr.responseText);


      // Sort the data by creation_date
      data.notes.sort((a, b) => {
        // creation_date is in ISO format (e.g., "2024-08-29T14:12:00Z")
        const dateA = new Date(a.creation_date);
        const dateB = new Date(b.creation_date);

        return dateB - dateA;  // For ascending order (latest first)
        // return dateB - dateA;  // For descending order (earliest first)
      });

      console.log(data);

      const notes = document.getElementById('notes');

      notes.innerHTML = '';

      //all custum background color for the list elements
      const colorClasses = ['red-background', 'blue-background', 'brown-background', 'gray-background', 'orange-background'];
      // Function to get a random class from the list
      function getRandomClass() {
        const randomIndex = Math.floor(Math.random() * colorClasses.length);
        return colorClasses[randomIndex];
      }


      data.notes.forEach(function (note) {
        const noteDiv = document.createElement('div');

        let tagsList = '';

        note.tag.sort();

        note.tag.forEach(element => {
          tagsList += `<li class='${getRandomClass()}'>${element}</li>`;
        });



        noteDiv.id = `note-${note.id}`;
        noteDiv.className = 'note-container';

        noteDiv.innerHTML = `
          <h2>${note.title}</h2>
          <ul>${tagsList}</ul>
          <div class='quill-div'>
            <div id='quill-div-${note.id}' class='quill-content'></div>
          </div>
          <div class='buttons-edit-container'>
            <button id='edit-${note.id}' class='edit-button' onclick='checkEditing(event), editButton("quill-div-${note.id}", "note-${note.id}") '>
              <img src="../../static/note/image/edit.png" alt="Edit">
              <div class="tooltiptext">Edit</div>
            </button>
            <button id='cancel-${note.id}' class='cancel-button' onclick='cancelButton("quill-div-${note.id}", "note-${note.id}")'>cancel</button>
            <button id='update-${note.id}' class='update-button' onclick='updateNote("quill-div-${note.id}", "note-${note.id}")'>update</button>
            <button id='delete-${note.id}' class='delete-button' onclick='deleteNote("quill-div-${note.id}", "note-${note.id}")'>delete</button>
          </div>
          


          <div class="content">
            <label class="checkBox">
              <input type="checkbox" value = "${note.id}" id="select-check-box" class='select-check-box'>
              <div class="transition"></div>
            </label>
          </div>

          <span class='date-creation'>${note.creation_date.split('T')[0]}</span>
        `;

        notes.appendChild(noteDiv);

        //create the Quill
        const quill = new Quill(`#quill-div-${note.id}`, {
          modules: {
            toolbar: customToolbar //the name of the custom toolbar setting or module
          },
          theme: 'snow', //the theme of the style
          readOnly: true
        });

        //add the content of the note
        quill.root.innerHTML = note.content;

        //target the toolbar and make it hidden
        const toolbar = quill.getModule('toolbar').container;
        toolbar.classList.add('toolbar-hidden');

        tagsList = '';
      })

      //remove the show more button if the notes are fully shown
      const showMoreButton = document.getElementById('show-more');
      if (!data.has_more) {
        showMoreButton.style.display = 'none';
        if (data.notes.length > 0) {
          //message at the buttom of the note div
          const message = `
            <p id="end-showmore-message">✅ <span> All of your notes have been shown!</span></p>
          `;
          notes.insertAdjacentHTML('afterend', message); 
        }else {
          const message = `
          <div class='no-note-message'>
            <p id="end-showmore-message"><span> You don't have any notes, start make one!</span></p>
            <img src="../../static/note/image/pencil.png" alt="start edit">
          </div>
            `;
          notes.insertAdjacentHTML('afterend', message); 
        }

  
      } else {
        setTimeout(() => {
          showMoreButton.style.display = 'block';
        }, 200);

      }


    } else {
      alert('Error: could not load the notes')
    }
  };

  xhr.send();
}

loadNotes();

//************************************************************************** 
//AJAX request to load more notes when clicking in the show more button
function showMore() {
  //selecte the button
  const button = document.getElementById('show-more');

  //select the button data
  const offset = button.getAttribute('data-offset');

  //create a XMLHTTPREQUEST
  const xhr = new XMLHttpRequest();

  xhr.open('GET', `/note/load-more-notes?offset=${offset}`, true);
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

  const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
  xhr.setRequestHeader('X-CSRFToken', csrftoken);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 400) {
      const response = JSON.parse(xhr.responseText);

      if (response.status == 'success') {
        //target the main div of note 
        const noteContiner = document.getElementById('notes');

        //all custum background color for the list elements
        const colorClasses = ['red-background', 'blue-background', 'brown-background', 'gray-background', 'orange-background'];
        // Function to get a random class from the list
        function getRandomClass() {
          const randomIndex = Math.floor(Math.random() * colorClasses.length);
          return colorClasses[randomIndex];
        }

        response.notes.forEach(note => {
            
          //create new div inside the main div note
          const noteDiv = document.createElement('div');
          noteDiv.id = `note-${note.note_id}`;
          noteDiv.className = 'note-container'


          // Loop through the note_tags object
          const noteTags = note.note_tags;

          //create empty string to fill inside it the <li> of the tags
          let tagsListHtml = ``;

          //using Object.entries() to loop through the note tags 
          Object.entries(noteTags).forEach(([tagId, tagName]) => {
            console.log(`Tag ID: ${tagId}, Tag Name: ${tagName}`);

            //create new element list
            tagsListHtml += `<li class='${getRandomClass()}' value="${tagId}">${tagName}</li>`;

          });

          noteDiv.innerHTML = `
            <h2>${note.note_title}</h2>
            <ul id=tag-list>${tagsListHtml}</ul>
            <div class='quill-div'>
              <div id='quill-div-${note.note_id}' class='quill-content'></div>
            </div>
              <div class='buttons-edit-container'>
              <button id='edit-${note.note_id}' class='edit-button' onclick='editButton("checkEditing(event), quill-div-${note.note_id}", "note-${note.note_id}")'>
                <img src="../../static/note/image/edit.png" alt="Edit">
                <div class="tooltiptext">Edit</div>
              </button>
              <button id='cancel-${note.note_id}' class='cancel-button' onclick='cancelButton("quill-div-${note.note_id}", "note-${note.note_id}")'>cancel</button>
              <button id='update-${note.note_id}' class='update-button' onclick='updateNote("quill-div-${note.note_id}", "note-${note.note_id}")'>update</button>
              <button id='delete-${note.note_id}' class='delete-button' onclick='deleteNote("quill-div-${note.note_id}", "note-${note.note_id}")'>delete</button>
            </div>

            <div class="content">
              <label class="checkBox">
                <input type="checkbox" value = "${note.note_id}" id="select-check-box" class='select-check-box'>
                <div class="transition"></div>
              </label>
            </div>
            <span class='date-creation'>${note.creation_date.split('T')[0]}</span>
            `;

          //Inserts a node as the first child of an element.
          noteContiner.appendChild(noteDiv);

          //create the Quill
          const quill = new Quill(`#quill-div-${note.note_id}`, {
            modules: {
              toolbar: customToolbar //the name of the custom toolbar setting or module
            },
            theme: 'snow', //the theme of the style
            readOnly: true
          });

          //add the content of the note
          quill.root.innerHTML = note.note_content;

          //target the toolbar and make it hidden
          const toolbar = quill.getModule('toolbar').container;
          toolbar.classList.add('toolbar-hidden');


        })
        

      
        // Update the offset for the next batch
        button.setAttribute('data-offset', parseInt(offset) + 5);
        
        
        console.log(response.has_more);
        // Hide the button if no more notes are available


        //check if the selection buttun is working to show the checkbox
        //reavtivate the select button
        const selectButton = document.querySelector('.select-button');
        if (selectButton.disabled == true) {
          //target the select checkboxes to shows
          const checkboxes = document.querySelectorAll('.checkBox');

          checkboxes.forEach (checkbox => {
            checkbox.style.display = 'block';
          });
        }
        
        if (!response.has_more) {
          button.style.display = 'none';
          //message at the buttom of the note div
          const message = `
            <p id="end-showmore-message">✅ <span> All of your notes have been shown!</span></p>
          `;
          noteContiner.insertAdjacentHTML('afterend', message)
        }

      }

      
    } else {
      alert('faild show more notes')
    }
  };
  xhr.send();
}







//************************************************************************** 

//AJAX function using the PUT HTTP request 'update'
function updateNote(noteID, parentNoteID) {
  //target the quill note
  const quillNote = document.getElementById(noteID);
  const quill = Quill.find(quillNote);

  //target the updated title
  const noteDiv = document.getElementById(parentNoteID);
  const titleUpdate = noteDiv.querySelector('input');

  //target old title
  const oldTitle = noteDiv.querySelector('h2');

  //create an XMLHttpRequest with the method PUT
  const xhr = new XMLHttpRequest();
  xhr.open('PUT', `update-note/${parentNoteID.split('-')[1]}`, true);

  //create the csrf protocole
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  xhr.setRequestHeader('X-CSRFToken', csrfToken);
  xhr.setRequestHeader('Content-Type', 'application/json');

  //the respons while the request complaited
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 400) {
      const respons = JSON.parse(xhr.responseText);
      if (respons.message) {

        //make the quill note to reade only

        quill.disable();

        noteContent = quill.root.innerHTML;//update to the new note content

        oldTitle.innerHTML = titleUpdate.value;


        cancelButton(noteID, parentNoteID);

        //hide the overlay if he existed
        const overlay = document.querySelector('.form-overlay');
        overlay.classList.remove('active-overlay');

      } else {
        alert('Error: Could not update the note');
      }
    } else {
      alert('Error: Could not update the note');
    }
  };

  xhr.send(JSON.stringify({ content: quill.root.innerHTML , title: titleUpdate.value}));
}




//************************************************************************** 



//AJAX function using the DELETE HTTP request 'delete'
function deleteNote(noteID, parentNoteID) {
  //target the paent div
  const parentDiv = document.getElementById(parentNoteID);

  //target the quill note
  const quillNote = document.getElementById(noteID);
  const quill = Quill.find(quillNote);

  //create an XMLHttpRequest with the method PUT
  const xhr = new XMLHttpRequest();
  xhr.open('DELETE', `delete-note/${parentNoteID.split('-')[1]}`, true);

  //create the csrf protocole
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  xhr.setRequestHeader('X-CSRFToken', csrfToken);
  xhr.setRequestHeader('Content-Type', 'application/json');

  //the respons while the request complaited
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 400) {
      const respons = JSON.parse(xhr.responseText);
      if (respons.message) {


        noteContent = quill.root.innerHTML;
        cancelButton(noteID, parentNoteID);

        parentDiv.remove();

        //target the show more button and dicrese him 1 so there is no duplication

        const showMoreButton = document.getElementById('show-more');
        const offset = showMoreButton.getAttribute('data-offset');
        showMoreButton.setAttribute('data-offset', parseInt(offset) - 1);

      } else {
        alert('Error: Could not delete the note');
      }
    } else {
      alert('Error: Could not delete the note');
    }
  };
  xhr.send(JSON.stringify({ note_id: parentNoteID.split('-')[1] }));
}



//************************************************************************** 

//AJAX function using the POST HTTP request 'create note'
function createNote(event) {
  event.preventDefault();

  // Get the content from Quill and append it to FormData
  const quillTarget = document.getElementById('form-note');
  const quill = Quill.find(quillTarget);

  //past the content of the quill on the hidden input
  document.getElementById('note-content').value = quill.root.innerHTML; // or quill.getText() if you want plain text


  const divForm = document.getElementById('add-note-form');
  const formData = new FormData(divForm);

  // Get the CSRF token from the form
  const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/note/add-note', true);
  xhr.setRequestHeader('X-CSRFToken', csrftoken);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 400) {
      const response = JSON.parse(this.responseText);

      if (response.status == 'success') {
        
        //target the main div of note 
        const note = document.getElementById('notes');

        //create new div inside the main div note
        const noteDiv = document.createElement('div');
        noteDiv.id = `note-${response.note_id}`;
        noteDiv.className = 'note-container';


        // Loop through the note_tags object
        const noteTags = response.note_tags;

        //create empty string to fill inside it the <li> of the tags
        let tagsListHtml = ``;

        //all custum background color for the list elements
        const colorClasses = ['red-background', 'blue-background', 'brown-background', 'gray-background', 'orange-background'];
        // Function to get a random class from the list
        function getRandomClass() {
          const randomIndex = Math.floor(Math.random() * colorClasses.length);
          return colorClasses[randomIndex];
        }

        //using Object.entries() to loop through the note tags 
        Object.entries(noteTags).forEach(([tagId, tagName]) => {
          console.log(`Tag ID: ${tagId}, Tag Name: ${tagName}`);

          //create new element list
          tagsListHtml += `<li class='${getRandomClass()}' value="${tagId}">${tagName}</li>`;

        });

        noteDiv.innerHTML = `
          <h2>${response.note_title}</h2>
          <ul id=tag-list>${tagsListHtml}</ul>
          <div class='quill-div'>
            <div id='quill-div-${response.note_id}' class='quill-content'></div>
          </div>
            <div class='buttons-edit-container'>
            <button id='edit-${response.note_id}' class='edit-button' onclick='checkEditing(event), editButton("quill-div-${response.note_id}", "note-${response.note_id}")'>
              <img src="../../static/note/image/edit.png" alt="Edit">
              <div class="tooltiptext">Edit</div>
            </button>
            <button id='cancel-${response.note_id}' class='cancel-button' onclick='cancelButton("quill-div-${response.note_id}", "note-${response.note_id}")'>cancel</button>
            <button id='update-${response.note_id}' class='update-button' onclick='updateNote("quill-div-${response.note_id}", "note-${response.note_id}")'>update</button>
            <button id='delete-${response.note_id}' class='delete-button' onclick='deleteNote("quill-div-${response.note_id}", "note-${response.note_id}")'>delete</button>
          </div>

          <div class="content">
            <label class="checkBox">
              <input type="checkbox" value = "${response.note_id}" id="select-check-box" class='select-check-box'>
              <div class="transition"></div>
            </label>
          </div>

          <span class='date-creation'>${response.creation_date.split('T')[0]}</span>
          `;

        //Inserts a node as the first child of an element.
        note.prepend(noteDiv);

        //create the Quill
        const quill = new Quill(`#quill-div-${response.note_id}`, {
          modules: {
            toolbar: customToolbar //the name of the custom toolbar setting or module
          },
          theme: 'snow', //the theme of the style
          readOnly: true
        });

        //add the content of the note
        quill.root.innerHTML = response.note_content;

        //target the toolbar and make it hidden
        const toolbar = quill.getModule('toolbar').container;
        toolbar.classList.add('toolbar-hidden');


      //target the show more button and add him 1 so there is no duplication

      const showMoreButton = document.getElementById('show-more');
      const offset = showMoreButton.getAttribute('data-offset');
      showMoreButton.setAttribute('data-offset', parseInt(offset) + 1);

      //empty the note form
      emptyNoteForm();

      //close the form
      closeSearch ();

      //remove the first message where the user don't have any note
      const messageNoNote = document.querySelector('.no-note-message');
      messageNoNote.remove();

      //check if the selection buttun is working to show the checkbox
      //reavtivate the select button
      setTimeout(() => {
        const selectButton = document.querySelector('.select-button');
        if (selectButton.disabled == true) {
          //target the select checkboxes to shows
          const checkboxes = document.querySelectorAll('.checkBox');
  
          checkboxes.forEach (checkbox => {
            checkbox.style.display = 'block';
          });
        }
      }, 50);

      }



    } else {
      alert('could not add the new note');
    }

  };

  xhr.send(formData);
  //console.log(formData);
}




//************************************************************************** 
//function to empty the create new note form after submit it
function emptyNoteForm() {
  //select the elements
  const titleInput = document.querySelector('input#id_title') 
  const tagSelect = document.getElementById('id_tag');
  const quillForm = document.getElementById('form-note');
  const hiddenInput = document.getElementById('note-content');

  const addTagButton = document.querySelector('.add-tag-button');
  const tagForm = document.querySelector('.add-tag');
  const tagFormInput = tagForm.querySelector('#id_form-0-tag');



  //console.log(tagFormInput);

  //hide the tag add form and show the add button
  tagForm.style.display = 'none';
  addTagButton.style.display = 'block';



  //start empty each one
  //empty the title
  titleInput.value = '';

  //empty the selected tags
  for (let i = 0; i < tagSelect.options.length; i++) {
    const option = tagSelect.options[i];

    if (option.selected) {
      option.selected = !option.selected;
    }
  }

  //empty the quill
  const quill = Quill.find(quillForm);
  quill.root.innerHTML = '';

  //empty the hiddin input
  hiddenInput.innerHTML = '';

  //empty the add tag form input
  tagFormInput.value='';

}




//************************************************************************** 




//AJAX function using the POST HTTP request 'create tag'
function createTag(event) {
  event.preventDefault();

  const divForm = document.getElementById('add-tag-form');
  const formData = new FormData(divForm);


  // Get the CSRF token from the form
  const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;


  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/note/add-tag', true);
  xhr.setRequestHeader('X-CSRFToken', csrftoken);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 400) {

      const response = JSON.parse(this.responseText);

      if (response.status == 'success') {
        //select the list were the tags is
        const tagList = document.getElementById('id_tag');

        //add the new tag
        const newTag = document.createElement('option');
        newTag.value = response.new_tag_id;//give the new tag value
        newTag.text = response.new_tag_name;//give the new tag text

        // Add the new option to the tags select field
        tagList.add(newTag);

        // Optionally, select the new tag automatically
        tagList.value = response.new_tag_id;

        //empty the tag input form 
        emptyTagForm()
      }
    } else {
      alert('Error: could not add the new tag, please see if the tag is duplicated or you missed some field');
    }
  };

  xhr.send(formData);
  //console.log(formData);
}




//************************************************************************** 

//empty the tag text the user wrote
function emptyTagForm() {
  //select the necessery elements
  const tagInput = document.getElementById('id_form-0-tag');

  //empty the taginput
  tagInput.value = '';
}






//************************************************************************** 

var noteContent;
let activeEdit = false;

//function activate the edit button
function editButton(noteID, parentNoteID) {
  if (!activeEdit) {

    //store the note content


    //target the note
    const noteTarget = document.getElementById(noteID);
    const quill = Quill.find(noteTarget);

    //add the clss of quill-activate-editing to adjust the form
    noteTarget.classList.add('quill-activate-editing');

    //store the note content
    noteContent = quill.root.innerHTML;

    // Enable editing and apply the custom toolbar
    quill.enable();

    //select the parent div
    const parentNote = document.getElementById(parentNoteID);

    //target the edites button option : update, delete, cancel
    const updateButton = parentNote.querySelector('.update-button');
    const deleteButton = parentNote.querySelector('.delete-button');
    const cancelButton = parentNote.querySelector('.cancel-button');


    //make the target buttons visible
    updateButton.classList.add('show-edits-buttons');
    deleteButton.classList.add('show-edits-buttons');
    cancelButton.classList.add('show-edits-buttons');


    //disactivate the edite button 
    const editButton = parentNote.querySelector('.edit-button');
    editButton.disabled = true;



    //select the toolbar div of the parnet
    const toolbarChild = parentNote.querySelector('.ql-toolbar');
    toolbarChild.classList.remove('toolbar-hidden');
    toolbarChild.classList.add('toolbar-visible');


    //target the title
    const title = parentNote.querySelector('h2');

    //add an input to edite the title
    //console.log(`note target :${parentNote.innerHTML}`);
    const inputTitle = `
    <div class='update-title-form'>
      <input type="text" name="title" maxlength="300" required="" id="id_title" value="${title.innerText}">
    </div>

    `
    //hide the title
    title.style.visibility = 'hidden';


    title.insertAdjacentHTML('afterend', inputTitle);

    //create the window popup so if the user try to do somthing without save the edit it will show
    const popupWindow = `
    <div class="edit-window-popup">
      <span class="close-button" onclick="hideEditPopup()">&times;</span>
      <p>you are in the edit mode you can't do this until you save the edit or cancelit or if you like continue editing</p>
      <button class="cancel-edit" onclick='cancelButton("${noteID}", "${parentNoteID}")'>cancel edit</button>
      <button class="update-edit" onclick='updateNote("${noteID}", "${parentNoteID}")'>update editing</button>
      <button class="continue-edit" onclick='hideEditPopup ()'>continue editing</button>
      <img src="../../static/note/image/holding pencil with shadow.png" alt="edit image">
    </div>
    `;

    //target the body
    const footer = document.querySelector('footer');
    //put the window popup after the footer
    footer.insertAdjacentHTML('afterend', popupWindow);
  

    return activeEdit = true;
  } else {
  }
}


//************************************************************************** 



//function to cancel the edit
function cancelButton(noteID, parentNoteID) {

  //select the quill div
  const quillNote = document.getElementById(noteID);

  //remove the class that adjust the quill content for editing
  quillNote.classList.remove('quill-activate-editing');

  //select the quill
  const quill = Quill.find(quillNote);

  quill.disable();


  //targeting the parent note div
  const parentNote = document.getElementById(parentNoteID);

  //select the toolbar div of the parnet
  const toolbar = parentNote.querySelector('.ql-toolbar');

  //hide the toolbar
  toolbar.classList.remove('toolbar-visible');
  toolbar.classList.add('toolbar-hidden');

  //restore the note content
  quill.root.innerHTML = noteContent;

  
  //re enable the edite button
  const editButton = parentNote.querySelector('.edit-button');
  editButton.disabled = false;

  
  //remove the class that show the edits buttons
  //target the edites button option : update, delete, cancel
  const updateButton = parentNote.querySelector('.update-button');
  const deleteButton = parentNote.querySelector('.delete-button');
  const cancelButton = parentNote.querySelector('.cancel-button');


  //make the target buttons visible
  updateButton.classList.remove('show-edits-buttons');
  deleteButton.classList.remove('show-edits-buttons');
  cancelButton.classList.remove('show-edits-buttons');


  //target the input of the title
  const titleInputDiv = parentNote.querySelector('.update-title-form');
  const titleInput = parentNote.querySelector('input');
  titleInputDiv.remove();
  titleInput.remove();

  //reshow the title
  const title = parentNote.querySelector('h2');
  title.style.visibility = 'visible';



  //remove the windows popup 
  const popupWindow = document.querySelector('.edit-window-popup');
  popupWindow.remove();

  //hide the overlay if he existed
  const overlay = document.querySelector('.form-overlay');
  overlay.classList.remove('active-overlay');

  return activeEdit = false;


}



//****************************************************


//test for the form selecting multiple tag
document.getElementById('id_tag').addEventListener('mousedown', function (event) {
  event.preventDefault(); // Prevent the default behavior

  const option = event.target; // This is the <option> element

  // Toggle the selection state
  option.selected = !option.selected;//This line flips the selection state of the clicked option.
});



//****************************************************
//function for select all checkboxes to delete notes

function selectAll() {
  //select the main notes div
  const mainDiv = document.getElementById('notes');

  // Get all child elements of the main div
  const notesList = mainDiv.querySelectorAll('input[type="checkbox"]');

  // Loop through each element and check the checkbox
  notesList.forEach(element => {
    element.checked = true; // This checks (activates) the checkbox
  })

  //console.log(mainDiv.querySelectorAll('input[type="checkbox"]'));
}


//****************************************************
//function to cancel the checked checkboxes

function cancelSelection() {
  //select the main note div
  const mainDiv = document.getElementById('notes');

  //get all child elements of main div
  const notesList = mainDiv.querySelectorAll('input[type="checkbox"]');

  //loop through each element and uncheck the checkbox
  notesList.forEach(element => {
    element.checked = false; // This unchecks (activates) the checkbox
  })

  //hide the buttons 
  const deleteButton = document.querySelector('.delete-selection');
  const selectAllButton = document.querySelector('.select-all-selection');
  const cancelButton = document.querySelector('.cancel-selection');

  deleteButton.style.display = 'none';
  selectAllButton.style.display = 'none';
  cancelButton.style.display = 'none';

  //reavtivate the select button
  const selectButton = document.querySelector('.select-button');
  selectButton.disabled = false;

  //hide the checkboxes
  //target the select checkboxes to shows
  const checkboxes = document.querySelectorAll('.checkBox');

  checkboxes.forEach (checkbox => {
    checkbox.style.display = 'none';
  });

}


//****************************************************
//function to delete the selected checkboxes

function deleteSelect () {
  //select the main note div
  const mainDiv = document.getElementById('notes');

  //get all child elements of main div
  const notesList = mainDiv.querySelectorAll('input[type="checkbox"]');

  //create empty list to store the velue of checkboxes (i set the values to be the id of the note)
  const checkboxesList = [];

  //loop through each  checkbox
  notesList.forEach(element => {
    if (element.checked) { //check if the checkbox is active
      checkboxesList.push(element.value);//push it to the list
    }
  })

  //console.log(checkboxesList);

  const xhr = new XMLHttpRequest();

  xhr.open('POST', `/note/delete-selected-notes`, true);

  //create the csrf protocole
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  xhr.setRequestHeader('X-CSRFToken', csrfToken);
  xhr.setRequestHeader('Content-Type', 'application/json');

  

  xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 400) {
      //console.log(xhr.responseText)

      //loop through evry element inside checkboxList
      checkboxesList.forEach(element => {
      //target the selected note
      const noteDiv = document.getElementById(`note-${element}`);
      noteDiv.remove();//remove the div

      })

      //dicress the show more button when he delete multiple notes to avoude duplicate data
      const showMoreButton = document.getElementById('show-more');
      const offset = showMoreButton.getAttribute('data-offset');
      //console.log(`the list : ${checkboxesList} the length of the list ${checkboxesList.length} offset:${offset}` );
      showMoreButton.setAttribute('data-offset', parseInt(offset) - checkboxesList.length);
    } else {
      alert("Error: we can't delete the selected items");
    }
  };

  xhr.send(JSON.stringify(checkboxesList));

}



//****************************************************
//function to select witch one to search by TITLE or TAG or ADVINCE SEARCH 'both'

function toggleSearchFields() {
  const searchMode = document.getElementById('search-mode').value;
  document.getElementById('title-search').style.display = 'none';
  document.getElementById('tag-search').style.display = 'none';
  document.getElementById('advanced-search').style.display = 'none';

  if (searchMode === 'title') {
    document.getElementById('title-search').style.display = 'block';
  } else if (searchMode === 'tag') {
    document.getElementById('tag-search').style.display = 'block';
  } else if (searchMode === 'advanced') {
    document.getElementById('advanced-search').style.display = 'block';
  }
}

toggleSearchFields(); // Call on page load to set the initial state


//****************************************************
//function to hendele the search request and display the result
function searchResult(event) {
  event.preventDefault();// Prevent the form from submitting the traditional way

  const searchMode = document.getElementById('search-mode').value;
  let params = new URLSearchParams();
  let isValid = true;

  // Clear previous error messages
  document.querySelectorAll('.error-message').forEach((el) => {
    el.style.display = 'none';
  });

  //check the type of search we are doing
  if (searchMode === 'title') {
    const title = document.getElementById('title-input');
    const titleValue = title.value.trim();



    if (titleValue === '') {
      isValid = false;
      document.getElementById('title-error').textContent = 'This field must be filled out.';
      document.getElementById('title-error').style.display = 'block';
      return;
    }else {
      
      params.append('title', titleValue);
    }

  } else if (searchMode === 'tag') {
    const tag = document.getElementById('tag-input');
    const tagValue = tag.value.trim();



    if (tagValue === '') {
      isValid = false;
      document.getElementById('tag-error').textContent = 'This field must be filled out.';
      document.getElementById('tag-error').style.display = 'block';
    } else {
      
      params.append('tag', tagValue);
    }
    
  } else if (searchMode === 'advanced') {
    const title = document.getElementById('advanced-title-input');
    const tag = document.getElementById('advanced-tag-input');

    const titleValue = title.value.trim();
    const tagValue = tag.value.trim();



    if (titleValue === '') {
      isValid = false;
      document.getElementById('advanced-title-error').textContent = 'This field must be filled out.';
      document.getElementById('advanced-title-error').style.display = 'block';
      return;
    } else if (tagValue === '') {
      isValid = false;
      document.getElementById('advanced-tag-error').textContent = 'This field must be filled out.';
      document.getElementById('advanced-tag-error').style.display = 'block';
    } else {
      title.setCustomValidity('');
      tag.setCustomValidity('');
      params.append('title', titleValue);
      params.append('tag', tagValue);
    }


  }

  //console.log('params :' + params);

  //check if the params is not empty to run the GET request
  if (isValid && [...params].length > 0) {
    fetch(`/note/search-notes/?${params.toString()}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        //console.log(data);
        if (data.notes.length > 0) {
          const notes = document.getElementById('notes');

          notes.innerHTML = '';


          data.notes.forEach(function (note) {
            const noteDiv = document.createElement('div');

            let tagsList = '';

            note.note_tags.sort();

            note.note_tags.forEach(element => {
              tagsList += `<li>${element}</li>`;
            });



            noteDiv.id = `note-${note.note_id}`;
            noteDiv.className = 'note-container';

            noteDiv.innerHTML = `
              <h2>${note.note_title}</h2>
              <ul>${tagsList}</ul>
              <div class='quill-div'>
                <div id='quill-div-${note.note_id}' class='quill-content'></div>
              </div>
              <div class='buttons-edit-container'>
                <button id='edit-${note.note_id}' class='edit-button' onclick='checkEditing(event), editButton("quill-div-${note.note_id}", "note-${note.note_id}") '>
                  <img src="../../static/note/image/edit.png" alt="Edit">
                  <div class="tooltiptext">Edit</div>
                </button>
                <button id='cancel-${note.note_id}' class='cancel-button' onclick='cancelButton("quill-div-${note.note_id}", "note-${note.note_id}")'>cancel</button>
                <button id='update-${note.note_id}' class='update-button' onclick='updateNote("quill-div-${note.note_id}", "note-${note.note_id}")'>update</button>
                <button id='delete-${note.note_id}' class='delete-button' onclick='deleteNote("quill-div-${note.note_id}", "note-${note.note_id}")'>delete</button>
              </div>


              <div class="content">
                <label class="checkBox">
                  <input type="checkbox" value = "${note.note_id}" id="select-check-box" class='select-check-box'>
                  <div class="transition"></div>
                </label>
              </div>

              <span class='date-creation'>${note.creation_date.split('T')[0]}</span>

            `;


            notes.appendChild(noteDiv);

            //create the Quill
            const quill = new Quill(`#quill-div-${note.note_id}`, {
              modules: {
                toolbar: customToolbar //the name of the custom toolbar setting or module
              },
              theme: 'snow', //the theme of the style
              readOnly: true
            });

            //add the content of the note
            quill.root.innerHTML = note.note_content;

            //target the toolbar and make it hidden
            const toolbar = quill.getModule('toolbar').container;
            toolbar.classList.add('toolbar-hidden');

            tagsList = '';
          })

        }else if (data.notes.length == 0) {
          //console.log(data.notes.length);

          const notes = document.getElementById('notes');

          notes.innerHTML = `<h3>we can't find any notes sorry</h3>`;
        }




        
        //remove the show more button
        const showMoreButton = document.getElementById('show-more');
        showMoreButton.remove();

        //create a back button to back to the normal views to views all the notes and git out from the search mode

        const cancelSearchButton = document.createElement('button');
        cancelSearchButton.id = 'cancel-search-button';
        cancelSearchButton.innerText = 'Cancel Search';
        cancelSearchButton.addEventListener('click', function (){cancelSearchMode()});

        notes.appendChild(cancelSearchButton);

        //hide the search form
        closeSearch ();

      })
      .catch(error => console.error('Error:', error));
  }

  
}




//cancel search mode function
function cancelSearchMode() {
  //delete the cancel search button
  const cancelSearchButton = document.getElementById('cancel-search-button');
  cancelSearchButton.remove();

  //load the notes all of them
  loadNotes()

  //create the show more button
  const showMoreButton = document.createElement('button');
  showMoreButton.id = 'show-more';
  showMoreButton.innerHTML = 'load more';

  const showMoreButtonAtrribute = document.createAttribute('data-offset');
  showMoreButtonAtrribute.value = 3;
  showMoreButton.setAttributeNode(showMoreButtonAtrribute);
  
  showMoreButton.addEventListener('click', function () {showMore()});

  //target the notes div
  const notesDiv = document.getElementById('notes');

  //set the show more button after the noteDiv
  notesDiv.insertAdjacentElement('afterend', showMoreButton);

}