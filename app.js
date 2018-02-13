// Module patterns 
// BUDGET CONTROOLER
var budgetController = (function(){

  var Expense = function(id, description, value){
    this.id = id; 
    this.description = description;
    this.value = value;
  }

  var Income = function(id, description, value){
    this.id = id; 
    this.description = description;
    this.value = value;
  }

var data = {
  allItems: {
    exp: [],
    inc: []
  },
  totals: {
    exp: 0,
    inc: 0
  }
}


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

  var setupEventListeners = function(){
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputbtn).addEventListener('click', function(){
      ctrlAddItem();
    });

    document.addEventListener('keypress', function(event){
      if (event.keyCode === 13 || event.which === 13) {
        event.preventDefault(); // prventing the enter key from also triggering a click event.
        ctrlAddItem();
      }
    });
  };

  

  var ctrlAddItem = function(){
      console.log('It works!');
      // get the field input 
      var input = UICtrl.getinput();
     
      // add the item to the budget controller

      // add the item to the UI

      // calculate the budget 

      // display the budget on the UI  
  };

  return {
    init: function(){
      setupEventListeners();
    },
  }
})(budgetController, UIController);

controller.init();