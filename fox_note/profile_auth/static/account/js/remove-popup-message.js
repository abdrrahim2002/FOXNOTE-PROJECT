function closePopup(ID) {

  document.getElementById(ID).classList.add('popup-message-move');

  setTimeout(() => {
    document.getElementById(ID).remove();
  }, 250);
  
}
