// Module patterns 
//Module one
var budgetController = (function(){

  // returnobject of our public methods
  return {
    publicFunction: function(){}
  }
})();





// Module two
var UIController = (function(){




  // public area
  return {
    publicCtrlfunction: function(){}
  }
})();








// Module three => the main area => it connects othr controllers

var controller = (function(budgetCtrl, UICtrlr){




})(budgetController, UIController);