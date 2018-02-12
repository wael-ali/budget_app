// Module patterns 
// BUDGET CONTROOLER
var budgetController = (function(){

  // returnobject of our public methods

})();





// UI CONTROLLER
var UIController = (function(){
  // get all the DOM selectors we need
 var DOMstrings = {
  inputType: '.entry-type',
  inputDescription: '.add-description',
  inputValue: '.add-value',
  inputbtn: ".add-btn",
 }


  return {
    getinput: function(){
      return {
       type: document.querySelector(DOMstrings.inputType).value, // either inc or exp
       description: document.querySelector(DOMstrings.inputDescription).value,
       value: document.querySelector(DOMstrings.inputValue).value,
      }
    },
    getDOMstrings: function(){
      return DOMstrings;
    },
  };

})();








// Module three => the main area => it connects othr controllers
// GLOBAL APP CONTROLLER

var controller = (function(budgetCtrl, UICtrl){
  var DOM = UICtrl.getDOMstrings();

  var ctrlAddItem = function(){
      console.log('It works!');
      // get the field input 
      var input = UICtrl.getinput();
      console.log(input);
      // add the item to the budget controller

      // add the item to the UI

      // calculate the budget 

      // display the budget on the UI 

     
  };

  document.querySelector(DOM.inputbtn).addEventListener('click', function(){
    ctrlAddItem();
  });

  document.addEventListener('keypress', function(event){
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });





})(budgetController, UIController);