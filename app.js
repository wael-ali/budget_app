// Module patterns 
// BUDGET CONTROOLER
var budgetController = (function(){

  var Expense = function(id, description, value){
    this.id           = id; 
    this.description  = description;
    this.value        = value;
    this.percentage   = -1;//calcPercentage(this.value, data.totals.inc);
  }



  var getPercentage = function(exp){
    return calcPercentage(exp.value, data.totals.inc);
  };

  var Income = function(id, description, value){
    this.id           = id; 
    this.description  = description;
    this.value        = value;
  }

  // =================
  // private functions
  // ========================================= 
  var createId = function(arr){
    // if not empty we need the last id + 1
    if(arr.length > 0){
      return arr[arr.length-1].id + 1;;
    }else{
      return 0;
    }
  }


  var calculateTotal = function(type){
    var sum = 0;
    data.allItems[type].forEach(function(currentElement){
      sum += currentElement.value;
    });
    data.totals[type] = sum;
  };

  var calcPercentage = function(value,totalIncome){
    var per;
    if (totalIncome > 0) {
      per = Math.round((this.value / totalIncome) * 100);
    }else{
      per = -1;
    }
    return per;
  };

  // Private objects !....

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1,
  }
  // check if there is localStorage
  data = localStorage.getItem('sdata') ? JSON.parse(localStorage.getItem('sdata')) : data;
  





  // ================
  // public functions 
  // =========================================
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

    budgetCtrlDelleteItem: function(type, id){
      var ids, index;

      // id = 6
      // ids = [1,4,6,7,9] => we have to dellete the item which index is 2
      // get ids array of all the items in data structure in a type(exp/inc)
      ids = data.allItems[type].map(function(current_type_item){
        return current_type_item.id;
      });

      // getting the index of the item that we gonna dellete
      index = ids.indexOf(id); // retrurn -1 when it is not found
      if (index !== -1) {         
        data.allItems[type].splice(index, 1) // dellete array start at index contains one item after
      }
    },

    calculateBudget: function(){

      // calculate total income and expenses
      calculateTotal('inc');
      calculateTotal('exp');

      // calculat the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // calculate the percentage of income that we spent
      if (data.totals.inc > 0) { // prevent infinity value through dividing by zero 
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      }else{
        data.percentage = -1;
      }
    },

    calculatePercentage: function(dataObj){
      dataObj.allItems.exp.map(function(cur){
        calcPercentage(cur.value, data.totals.inc);
      });
    },



    getPercentages: function(data){
      var allPerc = data.allItems.exp.map(function(cur){
        return getPercentage(cur);
      });
      return allPerc;
    },

    getBudget: function(){
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      }
    },

    setLocalStorage: function(){
      
      localStorage.setItem('sdata', JSON.stringify(data));
    },
    getData: function(){
      return data;
    },
  }


})();




// ************************************************************
// UI controller                *
// ******************************
var UIController = (function(){
  // get all the DOM selectors we need
 var DOMstrings = {
  inputType:          '.entry-type',
  inputDescription:   '.add-description',

  inputValue:         '.add-value',
  inputbtn:           ".add-btn",

  income_list:        '.income_list',
  expenses_list:      '.expenses_list',

  total_income:       '.total-income',
  budget:             '.budget',

  total_expenses:     '.total_expenses',
  exp_perc:           '#exp_perc',

  items:               '.items-grid',
  exp_percentage:      '.exp_percentage',

  month:              '.month',
  saveDataLocaly:     '.save'
 }


  var formatNumber =  function(num, type) {
    var numSplit, int, dec;
    num = Math.abs(num);// get the absulute number 
    num = num.toFixed(2);// show the number with two desimale numbers 22.00 as string

    numSplit = num.split("."); // array off the integer and the decimal parts
    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); // input 23520, output 23,520
    }

    dec = numSplit[1];
    
    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
  }

  // forEach function to loop throuhg the nodelist
  var nodeListForEach = function(fieldslist, callBackFunction){

    for (var i = 0; i < fieldslist.length; i++) {
      callBackFunction(fieldslist[i], i);
    }
  };




  return {
    getinput: function(){
      return {
       type:          document.querySelector(DOMstrings.inputType).value, // either inc or exp
       description:   document.querySelector(DOMstrings.inputDescription).value,
       value:         parseFloat(document.querySelector(DOMstrings.inputValue).value)
      }
    },

    getDOMstrings: function(){
      return DOMstrings;
    },

    UICtrlAddItemTOList: function(obj, type){

      var html, newHtml, expId, incId, element;
      expId = 'exp-'+obj.id;
      incId = 'inc-'+obj.id;

      // create HTML  string with placeholder text 
      html = '<div><div class="entry" id="%expense-id%"><span class="description left">%description%</span><span class="right">%value%<span class="percentage">20%</span><div class="right"><button class="dellete-btn">X</button></div></span></div></div>'

      // replace the placeholder text with actual data
      if (type === 'inc') {
        newHtml = html.replace('%expense-id%', incId);
        newHtml = newHtml.replace('<span class="percentage">20%</span>','');
        element = DOMstrings.income_list;
      }else if (type === 'exp') {
        newHtml = html.replace('%expense-id%', expId);
        newHtml = newHtml.replace('<span class="percentage">20%</span>','<span class="percentage exp_percentage">20%</span>');
        element = DOMstrings.expenses_list;
      }

      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%',formatNumber(obj.value, type));
      
      // Insert the HTML into the DOM.
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    delleteListItem: function(selectorID){

        var el = document.getElementById(selectorID);
        el.parentNode.removeChild(el);
    },

    clearFields: function(){
      var fields, fieldsArr;


      fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);// this return a list of fiels not an Array.
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function(current, indes, array){
        current.value = "";
      });
      fields[0].focus();
    },

    displayBudget: function(obj){
      var type;
      obj.budget >= 0 ? type = 'inc' : type = 'exp';
      document.querySelector(DOMstrings.budget).textContent                     = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.total_income).textContent               = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMstrings.total_expenses).textContent             = formatNumber(obj.totalExp, 'exp');
      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.exp_perc).textContent  = obj.percentage + '%';
      }else{
        document.querySelector(DOMstrings.exp_perc).textContent  = '---';
      }
      
    },

    displayPercentages: function(percentages){
      var percentageNodes = document.querySelectorAll(DOMstrings.exp_percentage);

      // passing our callbackfunction to our foreach function depending on (function calls a function)
      nodeListForEach(percentageNodes, function(current, index){

        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        }else{
          current.textContent = '---';
        }
        
      });
    },

    displayMonth: function(){
      var now, year, month, months;
      now = new Date();
      year = now.getFullYear();
      months = ['Januray', 'February', 'March', 'April', 'May', 'June', 'Julay', 'August', 'September', 'October', 'November', 'December'];
      month = now.getMonth();
      document.querySelector(DOMstrings.month).textContent = months[month] + ' ' + year;
    },

    changeInputColor: function(){

      var fields = document.querySelectorAll(// return an Itemlist of nodes we cant use forEach
          DOMstrings.inputType + ','+
          DOMstrings.inputDescription + ',' +
          DOMstrings.inputValue + ',' +
          DOMstrings.inputbtn
      );

      nodeListForEach(fields, function(cur){
        cur.classList.toggle('exp-color');
      });
    },

    initializeInputType: function(){
      document.querySelector(DOMstrings.inputType).value = 'inc';
    }
  };


})();








// Module three => the main area => it connects othr controllers
// ************************************************************
// GLOBAL APP CONTROLLER        *       
// ******************************
var controller = (function(budgetCtrl, UICtrl){

  var setupEventListeners = function(){

    // getting the selectors from DOM using object variable in user interface controller (module)
    var DOM = UICtrl.getDOMstrings();

      // clicking the button O.K
    document.querySelector(DOM.inputbtn).addEventListener('click', function(){
      ctrlAddItem();
    });

      // Event for the return Key.
    document.addEventListener('keypress', function(event){
      if (event.keyCode === 13 || event.which === 13) {
        event.preventDefault(); // prventing the enter key from also triggering a click event.
        ctrlAddItem();
      }
    });

    // event for deleting an item useing the delegete technick in js.
    document.querySelector(DOM.items).addEventListener('click', ctrlDelleteItem);

    // change the color of the input acording to the input type
    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeInputColor);

    // save data localy
    document.querySelector(DOM.saveDataLocaly).addEventListener('click', budgetCtrl.setLocalStorage);
  };

  
  // update budget
  var updateBudget = function(){

    // calculate the budget 
    budgetCtrl.calculateBudget();

    // retrn budget
    var budget = budgetCtrl.getBudget();

    // display the budget on the UI 
    UICtrl.displayBudget(budget);
  }



  // update percentages
  var updatePercentages = function(){

    // calculate perdentages
    budgetCtrl.calculatePercentage(budgetCtrl.getData());

    // read percentages from the budgetcontroller
    var percentages = budgetCtrl.getPercentages(budgetCtrl.getData());
    // display the percentages
    UICtrl.displayPercentages(percentages);
  };



  // adding item methode
  var ctrlAddItem = function(){

    var newItem, input;

    // get the field input 
    input = UICtrl.getinput();
   
   if (input.description !== "" && !isNaN(input.value) && input.value > 0) { // input values authentication

      // add the item to the budget controller
      newItem = budgetCtrl.BudgetCtrlAddItem(input);

      // add the item to the UI
      UICtrl.UICtrlAddItemTOList(newItem, input.type);

      // clear the fields.
      UICtrl.clearFields();
    }

    // Calculate and update budget
    updateBudget();

    // update percentages
    updatePercentages();
  };



  // Delleting Item methode
  var ctrlDelleteItem = function(event){
    var itemId, type, ID;
    itemId = event.target.parentNode.parentNode.parentNode.id;

    if (itemId) {
      // inc-1
      var arr = itemId.split('-');
      type = arr[0],
      ID = parseInt(arr[1]);

      // dellete the item from the data structure (budgetcontroller function)
      budgetCtrl.budgetCtrlDelleteItem(type, ID);

      // dellete the item from the user interface
      UICtrl.delleteListItem(itemId);

      // update and show the budget 
      updateBudget();

      // update percentages
      updatePercentages();
    }
  };




  // ================
  // public functions 
  // =========================================
  return {
    init: function(){
      setupEventListeners();
      UICtrl.displayMonth();
      UICtrl.initializeInputType();
    },
    setDOM: function(){

      UICtrl.displayBudget(budgetCtrl.getBudget());

      var storedData = budgetCtrl.getData();

      storedData.allItems.inc.forEach(function(inc) {
        UICtrl.UICtrlAddItemTOList(inc, 'inc');
      })

      storedData.allItems.exp.forEach(function(exp) {
        UICtrl.UICtrlAddItemTOList(exp, 'exp');
        updatePercentages();
      })
      
    }
  }
})(budgetController, UIController);

// #*#--------------------------------#*#--------------------------------#*#
controller.init();
controller.setDOM();