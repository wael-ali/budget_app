// Module patterns 
// BUDGET CONTROOLER
var budgetController = (function(){

  var Expense = function(id, description, value){
    this.id           = id; 
    this.description  = description;
    this.value        = value;
  }

  var Income = function(id, description, value){
    this.id           = id; 
    this.description  = description;
    this.value        = value;
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

var createId = function(arr){
  // if not empty we need the last id + 1
  if(arr.length > 0){
    return arr[arr.length-1].id + 1;;
  }else{
    return 0;
  }
}







return {
  BudgetCtrlAddItem: function(input){
    var newItem, id;
      // creating the item object deppinding on its type
    if (input.type === 'inc') {
      id = createId(data.allItems.inc);
      newItem = new Income(id, input.description, input.value);
    }else if (input.type === 'exp'){
      id = createId(data.allItems.exp);
      newItem = new Expense(id, input.description, input.value);
    }
    // adding the item to the our data object
    data.allItems[input.type].push(newItem);
    // return the new item
    return newItem;
  },
  testing: function(){
    console.log(data);
  }
}


})();





// UI CONTROLLER -----------------------------------------------------------------
var UIController = (function(){
  // get all the DOM selectors we need
 var DOMstrings = {
  inputType:        '.entry-type',
  inputDescription: '.add-description',
  inputValue:       '.add-value',
  inputbtn:         ".add-btn",
  income_list:      '.income_list',
  expenses_list:    '.expenses_list'
 }


  return {
    getinput: function(){
      return {
       type:          document.querySelector(DOMstrings.inputType).value, // either inc or exp
       description:   document.querySelector(DOMstrings.inputDescription).value,
       value:         document.querySelector(DOMstrings.inputValue).value
      }
    },
    getDOMstrings: function(){
      return DOMstrings;
    },
    UICtrlAddItemTOList: function(obj, type){
      var html, newHtml, expId, incId, element;
      expId = 'expense-'+obj.id;
      incId = 'income-'+obj.id;
      // create HTML  string with placeholder text 
      html = '<div><div class="entry" id="%expense-id%"><span class="description left">%description%</span><span id="value-id" class="right">%value%<span class="percentage">20%</span><button class="dellete-btn">X</button></span></div></div>'
      // replace the placeholder text with actual data
      if (type === 'inc') {
        newHtml = html.replace('%expense-id%', incId);
        element = DOMstrings.income_list;
      }else if (type === 'exp') {
        newHtml = html.replace('%expense-id%', expId);
        element = DOMstrings.expenses_list;
      }
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);
      
      // Insert the HTML into the DOM.
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    }
  };

})();








// Module three => the main area => it connects othr controllers
// GLOBAL APP CONTROLLER --------------------------------------------------------------------------

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
      var newItem, input;
      // get the field input 
      input = UICtrl.getinput();
     
      // add the item to the budget controller
      newItem = budgetCtrl.BudgetCtrlAddItem(input);

      // add the item to the UI
      UICtrl.UICtrlAddItemTOList(newItem, input.type);

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