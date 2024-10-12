



//custom the quill toolbar element
let customToolbar = [
  //text style
  ['bold', 'italic', 'underline', 'strike'],

  //header
  [{ 'header': [1, 2, 3, 4, 5, false] }],


  // custom text size
  [{ 'size': ['small', false, 'large', 'huge'] }],

/* 
  //custom fonts
  [{ 'font': ['roboto', 'Playpen Sans'] }],
 */

  //bullet points style ....
  [{list:'ordered'}, {list:'bullet'}],

  //indentation
  [{indent:'+1'}, {indent:'-1'}],

  //allignment
  [{align:['', 'right',  'center']}],

  // text direction
  [{ 'direction': 'rtl' }],    

  //sub and super script
  [{script:'sub'}, {script:'super'}],

  //adding text color and highlight
  [{color:[]}, {background:[]}],

  //code type 
  ['blockquote'],

  //remove any modification such as 'bold' and 'italic'...etc
  ['clean']   

];






const quill = new Quill('#form-note', {
  modules:{
    toolbar: customToolbar //the name of the custom toolbar setting or module
  },
    theme: 'snow',
    placeholder: 'type here...'
});


