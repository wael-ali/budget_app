// Module patterns 
// BUDGET CONTROOLER
var budgetController = (function(){

  // returnobject of our public methods

})();





// UI CONTROLLER
var UIController = (function(){




  // public area

})();








// Module three => the main area => it connects othr controllers
// GLOBAL APP CONTROLLER

var controller = (function(budgetCtrl, UICtrlr){

  var ctrlAddItem = function(){
      console.log('It works!');
      // get the field input 

      // add the item to the budget controller

      // add the item to the UI

      // calculate the budget 

      // display the budget on the UI 

     
  };

  document.querySelector(".add-btn").addEventListener('click', function(){
    ctrlAddItem();
  });

  document.addEventListener('keypress', function(event){
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });





})(budgetController, UIController);