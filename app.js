var budgetController = ( function(){
    var Income=function(id,amount,description){
        this.id=id,
        this.amount=amount,
        this.description=description
    };
    var Expenses=function(id,amount,description){
        this.id=id,
        this.amount=amount,
        this.description=description,
        this.percenatge=-1;
    };
    Expenses.prototype.calcPercenatge=function(totalIncome){
        if(totalIncome>0){
            this.percenatge=Math.round((this.amount/totalIncome)*100);
        }
    };    
    Expenses.prototype.getPercentage=function(){
            return this.percenatge;
    };
    
    var calculateTotal=function(type){
        var sum=0;
        data.allItems[type].forEach(function(current){
            sum+=current.amount;
        });
        data.total[type]=sum;
        
    };
    var data={
        allItems:{
            inc:[],
            exp:[]
        },
        total:{
            inc:0,
            exp:0
        },
        budget:0,
        percenatge:0
        
    };
    return{
        addItem: function(type,description,amount){
            var newItem,ID;
        
            if(data.allItems[type].length > 0){
                ID=data.allItems[type][data.allItems[type].length-1].id+1;
            }
            else{
                ID=0;
            }
            if(type === 'inc'){
                newItem=new Income(ID,amount,description);
                

            }
            else if(type ==='exp'){
                newItem=new Expenses(ID,amount,description);
            }
            data.allItems[type].push(newItem);

           
            return newItem;

        },
        calculateBudget:function(){
            calculateTotal('exp');
            calculateTotal('inc');
            data.budget=data.total.inc-data.total.exp;
            if(data.total.inc>0){
                data.percenatge=Math.round((data.total.exp/data.total.inc)*100);
            }
            else{
                data.percenatge=-1;
            }
            
        },
        getBudget:function(){
            return{
                income:data.total.inc,
                expenditure:data.total.exp,
                budget:data.budget,
                percenatge:data.percenatge
            }
        },
        deleteItem:function(id,type){
            var IDS;
            IDS=data.allItems[type].map(function(current){
                return current.id;
            });
            index=IDS.indexOf(id);
            if(index!==-1){
                data.allItems[type].splice(index,1);
            }
        },
        calculatePercenatges:function(){
            data.allItems.exp.forEach(function(current){
                current.calcPercenatge(data.total.inc);
            })
        },
        getPercentages:function(){
            var temp=data.allItems.exp.map(function(current){
                return current.getPercentage();
            });
            return temp;
        },
        testing:function(){
            console.log(data);
        }
        
    };  
})();


var UIController=(function(){
    var DOMStrings={
        type:".add__type",
        desc:".add__description",
        value:".add__value",
        add: ".add__btn",
        income:".income__list",
        expenses:".expenses__list",
        budget:".budget__value",
        budget_inc:".budget__income--value",
        budget_exp: ".budget__expenses--value",
        percenatge: ".budget__expenses--percentage",
        container:".container",
        percenatgeLabel:".item__percentage",
        month:".budget__title--month"
    };
    var formatNumber=function(num,type){
        var splitNum;
        num=Math.abs(num);
        num=num.toFixed(2);
        splitNum=num.split(".");
        int =splitNum[0];
        dec=splitNum[1];
        if(int.length>3){
            int=int.substr(0,int.length-3)+","+int.substr(int.length-3,3);
        }   
        return (type==='inc'? '+':'-') + int+"."+dec;
    };
    var nodeListForEach=function(list,callback){
        for(var i=0;i<list.length;i++){
            callback(list[i],i);
        }
    };
    return{

    getInput: function(){

    
    return{

    
    type:document.querySelector(DOMStrings.type).value,
    desc:document.querySelector(DOMStrings.desc).value,
    value:parseFloat(document.querySelector(DOMStrings.value).value)
    }
},
    displayBudget:function(obj){
        var type;
        obj.budget>0?type='inc':type='exp';
        document.querySelector(DOMStrings.budget).textContent=formatNumber(obj.budget,type);
        document.querySelector(DOMStrings.budget_inc).textContent=formatNumber(obj.income,'inc');
        document.querySelector(DOMStrings.budget_exp).textContent=formatNumber(obj.expenditure,'exp');

        if(obj.percenatge>0){
            document.querySelector(DOMStrings.percenatge).textContent=obj.percenatge+"%";
        }
        else{
            document.querySelector(DOMStrings.percenatge).textContent="------";
        }


    },
    deleteListItem:function(ID){
        var temp= document.getElementById(ID);
       temp.parentNode.removeChild(temp);

    },
    addListItem: function(obj,type){
        var html,element;
        if(type==='exp'){
            element=DOMStrings.expenses;
            html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>';

        }
        else if(type==='inc'){
            element=DOMStrings.income;
            html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

        }
        newHtml=html.replace('%id%',obj.id);
        newHtml=newHtml.replace('%desc%',obj.description);
        newHtml=newHtml.replace('%value%',formatNumber(obj.amount,type));
        document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

    },
    displayPercentages:function(percenatges){
        var fields=document.querySelectorAll(DOMStrings.percenatgeLabel);
        var nodeListForEach=function(list,callback){
            for(var i=0;i<list.length;i++){
                callback(list[i],i);
            }
        }
        nodeListForEach(fields,function(current,index){
          if(percenatges[index]>0){
                current.textContent=percenatges[index]+"%";
          }
          else{
            current.textContent="---"
          }
        })
    },
    changedType:function(){
        var fields=document.querySelectorAll(DOMStrings.type+","+DOMStrings.desc+","+DOMStrings.value);
        nodeListForEach(fields,function(cur){
            cur.classList.toggle('red-focus');
        });
        document.querySelector(DOMStrings.add).classList.toggle('red');
    },
    displayYear:function(){
        var date=new Date();
        document.querySelector(DOMStrings.month).textContent=date.getFullYear();
    },
    clearFields:function(){
        var fields;
        fields=document.querySelectorAll(DOMStrings.desc+", "+DOMStrings.value);
        fields=Array.prototype.slice.call(fields);
        fields.forEach(function(current,index,arr){
            current.value="";
        });
    },

    getDOMStrings: function(){
        return DOMStrings;
    }
};


})();

var controller= (function(bugCntrl,UICntrl)
{
  var DOM=UICntrl.getDOMStrings();
    var setEventListner=function(){
        document.querySelector(DOM.add).addEventListener("click",ctrlAddItem);
        document.addEventListener('keypress',function(e){
            if(e.keyCode===13 || e.which===13){
                ctrlAddItem();
            
            }
        });
        document.querySelector(DOM.container).addEventListener("click",ctrlDltItem);
        document.querySelector(DOM.type).addEventListener('change',UICntrl.changedType);
    };
    var updateBudget=function(){
        bugCntrl.calculateBudget();
       var budget= bugCntrl.getBudget();
        UICntrl.displayBudget(budget);
        updatePercentages();
    };
    var updatePercentages=function(){
         bugCntrl.calculatePercenatges();
         var percenatges=bugCntrl.getPercentages();
        UICntrl.displayPercentages(percenatges);
    };
    var ctrlDltItem=function(event){
        var itemId;
        itemId=event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemId){
            splitID=itemId.split("-");
            type=splitID[0];
            ID=parseInt(splitID[1]);
            bugCntrl.deleteItem(ID,type);
            UICntrl.deleteListItem(itemId);
            updateBudget();
            updatePercentages();
        }

    };
    var ctrlAddItem=function(){
        var input,newItem;
        input= UICntrl.getInput();
        if(input.value!==0 && input.desc!==" " && !isNaN(input.value)){

      
        newItem=bugCntrl.addItem(input.type,input.desc,input.value);
        UICntrl.addListItem(newItem,input.type);
        UICntrl.clearFields();
        updateBudget();
        updatePercentages();
    }};
    return{
        init:function(){
            console.log("Event listner was called");
            UICntrl.displayYear();
            UICntrl.displayBudget({
                income:0,
                expenditure:0,
                budget:0,
                percenatge:-1
            });
            return setEventListner;
        }
    };
    
})(budgetController,UIController); 

controller.init().call();