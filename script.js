const dishes = {
    breakfast: {
        "Pancakes": ["Flour - 200g", "Milk - 250ml", "Eggs - 2"],
        "Omelette": ["Eggs - 2", "Milk - 50ml", "Salt - 1g"],
        "Poha": ["Poha - 120g", "Oil - 50ml", "Salt - 3g", "Turmeric Powder - 4g", "Onion - 100g"],
        "Pizza": ["Dough - 300g", "Cheese - 100g", "Tomato Sauce - 150ml"],
        "Pasta": ["Pasta - 200g", "Tomato Sauce - 100ml", "Cheese - 50g"],
        "Burger": ["Bun - 1", "Patty - 150g", "Lettuce - 20g"]
    },
    lunch: {
        "Khichdi": ["Rice - 150g", "Onion - 100g", "Tomato - 50g", "Potato - 70g", "Oil - 50ml", "Salt - 3g", "Water - 400ml"],
        "Chole Sabji": ["Chole - 70g", "Tomato - 50g", "Water - 200ml", "Onion - 100g", "Ginger-Garlic Paste - 10g"],
        "Dal Tadka": ["Toor Dal - 100g", "Onion - 50g", "Tomato - 50g", "Garlic - 10g", "Ghee - 20ml", "Salt - 3g", "Water - 300ml"],
        "Aloo Gobi": ["Potato - 100g", "Cauliflower - 150g", "Onion - 50g", "Tomato - 50g", "Oil - 30ml", "Salt - 3g", "Spices - 5g"],
        "Paneer Butter Masala": ["Paneer - 100g", "Tomato - 100g", "Onion - 50g", "Butter - 20g", "Cream - 30ml", "Salt - 3g", "Spices - 5g"],
        "Vegetable Pulao": ["Rice - 150g", "Carrot - 50g", "Peas - 50g", "Onion - 50g", "Oil - 30ml", "Salt - 3g", "Water - 350ml"],
        "Rajma Masala": ["Rajma - 100g", "Tomato - 50g", "Onion - 50g", "Ginger-Garlic Paste - 10g", "Oil - 30ml", "Salt - 3g", "Water - 250ml"],
        "Baingan Bharta": ["Brinjal - 200g", "Onion - 50g", "Tomato - 50g", "Garlic - 10g", "Oil - 30ml", "Salt - 3g", "Spices - 5g"],
        "Mix Veg Curry": ["Carrot - 50g", "Beans - 50g", "Peas - 50g", "Onion - 50g", "Tomato - 50g", "Oil - 30ml", "Salt - 3g"],
        "Palak Paneer": ["Palak - 200g", "Paneer - 100g", "Onion - 50g", "Tomato - 50g", "Garlic - 10g", "Salt - 3g", "Oil - 30ml"],
        "Sambar": ["Toor Dal - 100g", "Tamarind - 20g", "Drumstick - 50g", "Tomato - 50g", "Sambar Powder - 10g", "Salt - 3g", "Water - 300ml"],
        "Masoor Dal": ["Masoor Dal - 100g", "Onion - 50g", "Tomato - 50g", "Garlic - 10g", "Salt - 3g", "Water - 300ml", "Ghee - 20ml"]
    },
    drinks: {
        "Smoothie": ["Milk - 200ml", "Banana - 1", "Honey - 10g"],
        "Lemonade": ["Lemon - 1", "Water - 250ml", "Sugar - 50g"]
    },
    tea: {
        "Green Tea": ["Tea Leaves - 5g", "Water - 250ml"],
        "Masala Tea": ["Tea Leaves - 5g", "Milk - 200ml", "Spices - 2g"]
    },
    coffee: {
        "Espresso": ["Coffee - 15g", "Water - 100ml"],
        "Cappuccino": ["Coffee - 10g", "Milk - 150ml", "Foam - 50ml"]
    }
};

const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

document.getElementById('searchBar').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const results = document.getElementById('searchResults');
    results.innerHTML = '';
    for (let category in dishes) {
        for (let dish in dishes[category]) {
            if (dish.toLowerCase().includes(query)) {
                results.innerHTML += `<div class='dish' onclick='showIngredients("${category}", "${dish}")'>${dish}</div>`;
            }
        }
    }
});

function filterDishes(category) {
    const results = document.getElementById('searchResults');
    results.innerHTML = '';
    if (category === 'all') {
        for (let cat in dishes) {
            for (let dish in dishes[cat]) {
                results.innerHTML += `<div class='dish' onclick='showIngredients("${cat}", "${dish}")'>${dish}</div>`;
            }
        }
    } else {
        for (let dish in dishes[category]) {
            results.innerHTML += `<div class='dish' onclick='showIngredients("${category}", "${dish}")'>${dish}</div>`;
        }
    }
}

function showIngredients(category, dish) {
    const ingredients = dishes[category][dish];
    const people = prompt("Enter number of people:");

    if (!people || isNaN(people) || people <= 0) {
        alert("Please enter a valid number.");
        return;
    }

    const calculatedIngredients = ingredients.map(ing => {
        const parts = ing.split(' - ');
        const itemName = parts[0];
        const quantityPart = parts[1];

        const quantityMatch = quantityPart.match(/^([0-9.]+)\s*([a-zA-Z]*)$/);

        if (!quantityMatch) return `✅ ${itemName} - ${quantityPart} (unchanged)`;

        let [_, valueStr, unit] = quantityMatch;
        let value = parseFloat(valueStr);
        let newQuantity = value * people;

        if (unit === 'g' && newQuantity >= 1000) {
            newQuantity = (newQuantity / 1000).toFixed(2) + ' kg';
        } else if (unit === 'ml' && newQuantity >= 1000) {
            newQuantity = (newQuantity / 1000).toFixed(2) + ' L';
        } else {
            newQuantity = unit ? `${newQuantity} ${unit}` : `${newQuantity}`;
        }

        return `✅ ${itemName} - ${newQuantity}`;
    });

    const outputList = document.getElementById('outputList');
    outputList.innerHTML = `<h3>🛒 Calculated Ingredients: "${dish}" for ${people} people</h3>`;
    calculatedIngredients.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        outputList.appendChild(li);
    });

    document.getElementById('outputContainer').style.display = 'block';
    const shareButton = document.getElementById('shareButton');
    shareButton.style.display = 'block';
    shareButton.onclick = function () {
        shareOnWhatsApp(dish, people, calculatedIngredients);
    };

    addToHistory(dish);
}

function shareOnWhatsApp(dish, people, ingredients) {
    const message = `🛒 *Calculated Ingredients: "${dish}" for ${people} people*\n` + ingredients.join("\n");
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
}

function addToHistory(dish) {
    if (!searchHistory.includes(dish)) {
        searchHistory.push(dish);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        displaySearchHistory();
    }
}

function displaySearchHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    searchHistory.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = item;
        li.onclick = () => showIngredientsFromHistory(item);

        const btn = document.createElement('button');
        btn.textContent = 'Remove';
        btn.onclick = (e) => {
            e.stopPropagation();
            removeFromHistory(index);
        };

        li.appendChild(btn);
        historyList.appendChild(li);
    });
}

function showIngredientsFromHistory(dish) {
    for (let category in dishes) {
        if (dish in dishes[category]) {
            showIngredients(category, dish);
            return;
        }
    }
}

function removeFromHistory(index) {
    searchHistory.splice(index, 1);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    displaySearchHistory();
}

function clearHistory() {
    localStorage.removeItem('searchHistory');
    searchHistory.length = 0;
    displaySearchHistory();
}

document.getElementById('clearHistoryButton').onclick = clearHistory;

window.onload = () => {
    displaySearchHistory();
    filterDishes('all');
};
