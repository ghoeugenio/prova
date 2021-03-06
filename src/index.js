(function($, win, doc){
    "use strict";

    var app = (function(){

        var rules = new XMLHttpRequest();
        var $buttonsSelectGame = $('[data-js="buttonsSelectGame"]').get();
        var $typeRule = [];
        var currentGame = {};
        var $numbers = $('[data-js="numbers"]').get();
        var $completeGame = $('[data-js="completeGame"]');
        var $clearGame = $('[data-js="clearGame"]');
        var $addToCart = $('[data-js="addToCart"]');
        var $saveCart = $('[data-js="saveCart"]');
        var $cart = $('[data-js="cart"]').get();
        var $priceCart = $('[data-js="totalPrice"]').get();
        var totalPrice = 0;
        var gameRules = [];

        return {
            init: function init(){
                rules.open('GET', '/src/games.json');
                rules.send();
                rules.addEventListener('readystatechange', this.showGameSelect, false);
                app.initEvents();
            },

            initEvents: function initEvents(){
                $completeGame.on('click', app.doAleatoryBet);
                $clearGame.on('click', app.clearNumbers);
                $addToCart.on('click', app.addToCart);
                app.showPrice(0);
                $saveCart.on('click', app.saveCart);
            },

            setButtonGameType: function setButtonGameType(){
                for(var i = 0; i < gameRules.types.length; i++){
                    $buttonsSelectGame[0].appendChild(app.createInput(i));
                    $buttonsSelectGame[0].appendChild(app.createLabel(i));
                }
                app.setTypeRule();
            },

            setTypeRule: function setTypeRule(){
                $typeRule = $('[data-js="radio"]').get();
            },

            createInput: function createInput(i){
                var input = doc.createElement('input');
                input.setAttribute('data-js', 'radio');
                input.setAttribute('type', 'radio');
                input.setAttribute('id', 'radio' + i);
                input.setAttribute('name', 'radios');
                input.setAttribute('value', i);
                if(i === 0){
                    input.setAttribute('checked', 'true');  
                }  
                input.addEventListener('click', function(){
                    app.loadGame();
                });
                input.addEventListener('change', function(){
                    var buttonActive = doc.getElementById('label' + i);
                    var label = doc.getElementsByName('label');
                    for(var j = 0; j < gameRules.types.length; j++){
                        label[j].style.backgroundColor = '#fff';
                        label[j].style.color = gameRules.types[j].color;
                    }
                    buttonActive.style.backgroundColor = gameRules.types[i].color;
                    buttonActive.style.color = '#fff';                    
                });
                return input;
            },

            createLabel: function createLabel(i){
                var label = doc.createElement('label');
                label.setAttribute('id', 'label' + i);
                label.setAttribute('for', 'radio' + i);
                label.setAttribute('name', 'label');
                label.style.backgroundColor = '#fff';
                label.style.border = '2px solid ' + gameRules.types[i].color;
                label.style.color = gameRules.types[i].color;
                label.textContent = gameRules.types[i].type;
                if(i === 0){
                    label.style.backgroundColor = gameRules.types[i].color;
                    label.style.color = '#fff'; 
                }
                return label;
            },

            showGameSelect: function showGameSelect(){
                if(rules.readyState === XMLHttpRequest.DONE)
                     if(rules.status === 200)
                        app.setGameRules();
            },

            setGameRules: function setGameRules(){
                gameRules = JSON.parse(rules.responseText);
                app.setButtonGameType();
                app.loadGame();
            },

            selectGame: function selectGame(){
                var index = Array.prototype.findIndex.call($typeRule, function(item){
                    return item.checked;
                });
                currentGame = gameRules.types[index];
            },

            loadGame: function loadGame(){
                var index = app.selectGame();
                $('[data-js="title"]').get()[0].textContent = currentGame.type.toUpperCase();
                $('[data-js="description"]').get()[0].textContent = currentGame.description;
                app.listNumbers(index);
            },

            listNumbers: function listNumbers(index){
                $numbers[0].innerHTML = null;
                var size = currentGame.range;
                for(var i = 1; i <= size; i++){
                    var number = app.doNumber(i);
                    var label = app.doLabel(i);
                    $numbers[0].appendChild(number);
                    $numbers[0].appendChild(label);
                }
            },

            doNumber: function doNumber(i){
                var number = doc.createElement('input');
                number.setAttribute('type', 'checkbox');
                number.setAttribute('data-js', 'checkbox');
                number.setAttribute('id', 'checkbox' + i);
                number.setAttribute('name', 'checkboxs');
                number.setAttribute('value', i);
                return number;
            },

            doLabel: function doLabel(i){
                var label = doc.createElement('label');
                label.setAttribute('for', 'checkbox' + i);
                label.appendChild(doc.createTextNode(i));
                return label;
            },

            doAleatoryBet: function doAleatoryBet(){
                var listCheck = $('[data-js="checkbox"]').get();                
                var sizeOfGameType = currentGame["max-number"];
                var arrayOfSelectNumbers = Array.prototype.filter.call(listCheck, function(item){
                    if(item.checked)
                        return item;
                });
                if(arrayOfSelectNumbers.length >= sizeOfGameType)
                    return win.alert('N??meros j?? completados!');
                var valueAleatory = 0;
                var j = 0;
                while(j < (sizeOfGameType - arrayOfSelectNumbers.length)){
                    valueAleatory = Math.floor(Math.random() * listCheck.length);
                    if(listCheck[valueAleatory].checked === false){
                        listCheck[valueAleatory].checked = true;
                        j++;
                    }
                }
            },

            clearNumbers: function clearNumbers(){
                var listCheck = $('[data-js="checkbox"]').get();
                var aux = Array.prototype.findIndex.call(listCheck, function(item){
                    return item.checked;
                });
                if(aux === -1)
                    return win.alert('Nenhum n??mero selecionado!');
                for(var j = 0; j < listCheck.length; j++)
                    listCheck[j].checked = false;
            },

            addToCart: function addToCart(){
                var array = app.selectNumbers();
                var index = app.selectGame();
                var currentNumbers = currentGame["max-number"] - array.length;
                if(currentNumbers < 0){
                    return win.alert('O jogo ' + currentGame.type +
                    ' s?? permite assinalar ' + currentGame["max-number"] +
                    ' n??meros...\nRemova ' + Math.abs(currentNumbers) +
                    (Math.abs(currentNumbers) === 1 ? ' n??mero!':' n??meros!'));
                }
                if(array.length < currentGame["max-number"]){
                    var option = win.confirm(
                    (Math.abs(currentNumbers) === 1 ? 'Falta ' + (Math.abs(currentNumbers)) + ' n??mero.':
                    'Faltam ' + (Math.abs(currentNumbers)) + ' n??meros.') + 
                    '...\nDeseja completar automaticamente?');
                    if(option){
                        return app.doAleatoryBet();
                    }
                    return;   
                }
                app.clearNumbers();
                var numbersForCart = array.toString().replace(/\D+[,]/g, '');
                app.showPrice((currentGame.price));
                app.showInCart(numbersForCart);
            },

            selectNumbers: function selectNumbers(){
                var listCheck = $('[data-js="checkbox"]').get();
                var selectNumbers = [];
                for(var j = 0; j < listCheck.length; j++){
                    if(listCheck[j].checked)
                        selectNumbers.push(listCheck[j].value)
                }
                return selectNumbers;
            },

            showInCart: function showInCart(numbersForCart){
                var container = doc.createElement('div');
                container.setAttribute('data-js', 'shopCart');
                container.setAttribute('class', 'shopCart');
                container.appendChild(app.buttonCart());
                container.appendChild(app.textCart(numbersForCart));
                $cart[0].appendChild(container);
            },

            buttonCart: function buttonCart(){
                var button = doc.createElement('button');
                var img = doc.createElement('img');
                button.setAttribute('value', currentGame.price);
                img.setAttribute('src', '../src/assets/trash.png');
                button.appendChild(img);
                button.style.borderRight = "3px solid " + currentGame.color;
                button.addEventListener('click', function(){
                    app.showPrice((-1 * +button.value));
                    $cart[0].removeChild(button.parentNode);
                })
                return button;
            },

            textCart: function textCart(numbersForCart){
                var textDiv = doc.createElement('div');
                var numbers = doc.createElement('p');
                var price = doc.createElement('p');
                var typeAndPrice = doc.createElement('div');
                var cartTypeGame = app.cartTypeGame();
                textDiv.setAttribute('class', 'textCart');
                textDiv.style.display = 'inline-block';
                numbers.textContent = numbersForCart;
                price.textContent = 'R$ ' + currentGame.price.toFixed(2).toString().replace(/[.]/, ','); 
                price.style.color = '#707070';
                price.style.fontFamily = 'Helvetica';
                typeAndPrice.appendChild(cartTypeGame);
                typeAndPrice.appendChild(price);
                textDiv.appendChild(numbers);
                textDiv.appendChild(typeAndPrice);
                return textDiv;
            },

            cartTypeGame: function cartTypeGame(){
                var typeGame = doc.createElement('p');
                typeGame.textContent = currentGame.type;
                typeGame.style.color = currentGame.color;
                typeGame.setAttribute('class', 'typeGameCart');
                return typeGame;
            },

            saveCart: function saveCart(){
                if(totalPrice === 0)
                    return win.alert('Carrinho vazio! Fa??a sua aposta.');
                $cart[0].innerHTML = null;
                app.showPrice((-1 * totalPrice));
                win.alert('Aposta feita com sucesso, boa sorte!');
                //api.post
            },

            showPrice: function showPrice(value){
                totalPrice += value;
                $priceCart[0].textContent = totalPrice.toFixed(2).toString().replace(/[.]/, ','); 
                if(totalPrice === 0)
                    app.showCartEmpty();
                else if($('[data-js="empty"]').get()[0])
                    $cart[0].innerHTML = null;
            },

            showCartEmpty: function showCartEmpty(){
                var empty = doc.createElement('div');
                var textEmpty = doc.createElement('p')
                empty.setAttribute('class', 'empty');
                empty.setAttribute('data-js', 'empty');
                textEmpty.textContent = 'EMPTY';
                empty.appendChild(textEmpty);
                $cart[0].appendChild(empty);
            }
        }
    })();

    app.init();
})(window.DOM, window, document);