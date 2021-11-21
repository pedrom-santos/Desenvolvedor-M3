var cardsPerTime = 9;

//faz a requisição do JSON
function getJSON (url, callback) {
    
    fetch(url).then(function (response){ return response.json()}).then( function (output) { callback(output);});
    
};

function main () {
    
    getJSON('http://localhost:5000/products', function (getData) {  renderAll (getData); });

};
//chama as funções de renderização de produtos e filtros
function renderAll (data){
    
    renderProducts (data);
    renderFilterColors (data);
    renderFilterSizes (data);
    
}

document.getElementById('btn-more').onclick = function (){
    if(cardsPerTime <= 14){
        cardsPerTime += 3;
    }
    console.log(cardsPerTime);
    getJSON('http://localhost:5000/products', function (getData) {  renderProducts (getData); });

};

function renderProducts (data){

    
    const contentProducts = document.getElementById("content-main-products-area");
    contentProducts.innerHTML = "";

    data.slice(0,cardsPerTime).forEach (function (value, i) {
        let div = "";
        
        div += "<div class = 'card' id = 'content-products-card-area-"+ value.id +"'>";
        div += "<img src = '"+ value.image +"'>"
        div += "<p class = 'name' id = 'content-products-card-area-"+ value.id +"-name'>"+value.name+"</p>"
        div += "<p class = 'price' id = 'content-products-card-area-"+ value.id +"-price'>"+value.price.toLocaleString('pt-br', {style:'currency', currency:'BRL'})+"</p>"
        div += "<p class = 'parcelamento' id = 'content-products-card-area-"+ value.id +"-parcelamento'> até "+value.parcelamento[0]+"x de "+value.parcelamento[1].toLocaleString('pt-br', {style:'currency', currency:'BRL'})+"</p>"
        div += "<a class = 'btn-buy' href = '#' id = '"+ value.id +"'>COMPRAR<a>"
        div += "</div>"
        contentProducts.innerHTML += div; 
    });
}

function renderFilterColors (data) {
    var colors = {};
    let filterValue = {};  
    data.forEach(function(value,i){
        filterValue[i] = value.color;
    });
    
    filterValue = removeDuplicates(filterValue);

    filterValue.sort();
    colors = filterValue;
    renderFilters(filterValue, "content-main-filters-colors", "color-filter")

    return filterValue;
}

function renderFilterSizes (data) {
    
    let filterValue = [];  
    data.forEach(function(value,i){
        filterValue[i] = value.size;
    });
    
    var merged = [].concat.apply([], filterValue);
    
    filterValue = removeDuplicates(merged);
    filterValue.sort();
    console.log(filterValue);
    renderFilters(filterValue, "content-main-filters-sizes", "size-filter")

    return filterValue;
}

function renderFilters(data, id, name){
    let arrayLenght = Object.keys(data).length;

    for (let i = 0; i < arrayLenght; i++) {
        
        const contentFilter = document.getElementById(id);
        contentFilter.innerHTML += "<div class = 'filter'> <input type ='checkbox' id = '"+ data[i] +"' name = '"+ name +"' > <label for = '" + data[i]+ "' >" + data[i]+ "</label> </div>";
        
    };
}


function removeDuplicates (arr){
    
    let unique = [];
    let arrayLenght = Object.keys(arr).length;
    
    for (let i=0; i<arrayLenght; i++){
        if (!unique.includes(arr[i])){
            unique.push(arr[i]);
        };
    };

    return unique;    
}

document.getElementById('mais-recente').onclick = function (){
    
    getJSON('http://localhost:5000/products', function (getData) {  sortProducts (getData, 1, 1); });

};

document.getElementById('menor-preco').onclick = function (){
    
    getJSON('http://localhost:5000/products', function (getData) {  sortProducts (getData, -1, -1); });

};

document.getElementById('maior-preco').onclick = function (){
    
    getJSON('http://localhost:5000/products', function (getData) {  sortProducts (getData, 1, -1); });

};

//direction define se irá ordernar do maior para o menor ou o contrário sendo [1] a partir do maior e [-1] para menor
//criteria define se o critério do sort é por preço [-1] ou por data[1]
function sortProducts (data, direction, criteria){
    if(criteria === 1){
    data.sort(function (a, b) {
        if (a.date < b.date) {
            return 1*direction;
        }
        if (a.date > b.date) {
            return -1*direction;
        }
        return 0;
        });
    } else if (criteria === -1){
        data.sort(function (a, b) {
            if (a.price < b.price) {
                return 1*direction;
            }
            if (a.price > b.price) {
                return -1*direction;
            }
            return 0;
            });
    }
    console.log(data);
    renderProducts(data);
};

/*
document.getElementById('content-main-filters-sizes').onclick = function () {
    var filtros = [];
    let arr = [];  
    var markedCheckbox = document.getElementsByName('size-filter');  
    for (var checkbox of markedCheckbox) {  
      if (checkbox.checked) { 
        arr.push(checkbox.id);
      }
    }
    
    getJSON('http://localhost:5000/products', function (getData) {  filterProducts (getData, arr); });
} 


document.getElementById('content-main-filters-colors').onclick = function () {
    var filtros = [];
    let arr = [];  
    var markedCheckbox = document.getElementsByName('color-filter');  
    for (var checkbox of markedCheckbox) {  
        if (checkbox.checked){  
            arr.push(checkbox.id);
            
        }
    }
    getJSON('http://localhost:5000/products', function (getData) {  filterProducts (getData, arr); });
    
    
} 
var filtros = [];

function filterProducts (data, filters){
    
    var res = data.filter(function(item){
        return filters.includes(item.color)
    });
    console.log(filters[1]);
    
    console.log(res);
    
}
*/

document.getElementById('content-main-filters-sizes').onclick = function () {
    getFilters();
}
document.getElementById('content-main-filters-colors').onclick = function () {
    getFilters();
}
document.getElementById('content-main-filters-prices').onclick = function () {
    getFilters();
}

function getFilters () {
    var filtros = [];
    let arr = [];
    var colorFilterActive = false;
    var sizeFilterActive = false;
    var priceFilterActive = false;

    var markedCheckbox = document.getElementsByName('size-filter');  
    for (var checkbox of markedCheckbox) {  
        
        if (checkbox.checked) {
            sizeFilterActive = true;
             
            arr.push(String(checkbox.id));
            
        }
    }
    
    var markedCheckbox = document.getElementsByName('color-filter');  
    for (var checkbox of markedCheckbox) {  
        if (checkbox.checked){
            colorFilterActive = true;  
            arr.push(String(checkbox.id));
            
        }
    }

    var markedCheckbox = document.getElementsByName('price-range');  
    for (var checkbox of markedCheckbox) {  
        if (checkbox.checked){
            priceFilterActive = true;  
            arr.push(String(checkbox.id));
            
        }
    }
    
    
    console.log(arr);
    getJSON('http://localhost:5000/products', function (getData) {  filterProducts (getData, arr, sizeFilterActive, colorFilterActive, priceFilterActive); });

}

function filterProducts (data, filters, sizeFilterActive, colorFilterActive, priceFilterActive) {
    if(colorFilterActive){
        var data = data.filter(function(item){
            return filters.includes(item.color);
        });
    }
    if(sizeFilterActive){
        
            var data = data.filter(function(item){
                var confirma = false;
                var array = item.size;
                array.forEach (function (value, i) {
                    if(filters.includes(value)){
                        confirma = true;
                    }
                    
                })
                console.log(confirma);
                if(confirma){
                    return true;
                }
                return false;
                
            });
        
    }
    if(priceFilterActive){
        
        var data = data.filter(function(item){
            if (filters.includes('content-main-filters-prices-range-1')){
                return item.price >= 0 && item.price <=50;
            }
            if (filters.includes('content-main-filters-prices-range-2')){
                return item.price >= 51 && item.price <=150;
            }
            if (filters.includes('content-main-filters-prices-range-3')){
                return item.price >= 151 && item.price <=300;
            }
            if (filters.includes('content-main-filters-prices-range-4')){
                return item.price >= 301 && item.price <=500;
            }
            if (filters.includes('content-main-filters-prices-range-5')){
                return item.price > 1
            }

        });
    
}
    renderProducts(data);
    console.log(data);
}

document.getElementById('btn-buy').onclick = function (){
    getJSON('http://localhost:5000/products', function (getData) {  addProductsToBag (getData); });

};

function addProductsToBag (data) {
    
    var div = document.getElementById('header-content-bag-items');
    var item = "";

    item += "<div class = 'bag-item'>"
    item += "<img id = 'bag-item-image"+data.id+"'>"
    item += "<div class = 'bag-item'>"
    item += "<div class = 'bag-item'>"
    item += "</div>"

};


/*
document.getElementById('content-main-filters-colors').onclick = function() {
    let arr = [];  
    var markedCheckbox = document.getElementsByName('color-filter');  
    for (var checkbox of markedCheckbox) {  
      if (checkbox.checked)  
        arr.push(checkbox.id);
        
    } 
    console.log(arr);
}  */

main();
