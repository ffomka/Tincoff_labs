class Card {
    constructor(id, name, provider, src, desc) {
        this.id = id;
        this.name = name;
        this.provider = provider;
        this.src = src;
        this.desc = desc;
    }
}

async function fetchProfile(){
    try {
        let user = await fetch('http://localhost:3000/profile').then( (response) =>  response.json());
        document.getElementById('profile').textContent = user.group + " " + user.name;
    } catch (err) {
        alert("can't fetch author" + err);
    }
}



function renderCards(cardsArray) {
        //let cardsArray = await fetch('http://localhost:3000/posts').then( (response) =>  response.json());
    //let cardsArray = JSON.parse(window.localStorage.getItem("cards"));

    if (cardsArray === null)
        return;

    for (let card of cardsArray) {
        const cardDiv = document.createElement("div");
        cardDiv.id = `card${card.id}`;
        cardDiv.setAttribute('class', "card flex align-start col");
        document.getElementsByClassName("cards-list flex align-start")[0].appendChild(cardDiv);

        const idEditDiv = document.createElement("div");
        idEditDiv.id = `idEdit${card.id}`;
        idEditDiv.setAttribute('class', "row width-100 flex space-between");
        document.getElementById(`card${card.id}`).appendChild(idEditDiv);

        const cardId = document.createElement("span");
        cardId.id = `cardId${card.id}`;
        cardId.textContent = `id: ${card.id}`;
        cardId.setAttribute('class', "roboto font-15px height-28px dark-main");
        document.getElementById(`idEdit${card.id}`).appendChild(cardId);

        const cardEdit = document.createElement("span");
        cardEdit.id = `cardEdit${card.id}`;
        cardEdit.textContent = "Изменить";
        cardEdit.addEventListener('click', preEdit);
        cardEdit.setAttribute('class', "roboto font-15px height-28px dark-main pointer card__edit");
        document.getElementById(`idEdit${card.id}`).appendChild(cardEdit);

        const cardContentDiv = document.createElement("div");
        cardContentDiv.id = `cardContent${card.id}`;
        cardContentDiv.setAttribute('class', "flex row card__img-text-wrap");
        document.getElementById(`card${card.id}`).appendChild(cardContentDiv);

        const cardImg = document.createElement("img");
        cardImg.id = `cardImg${card.id}`;
        cardImg.src = `${card.src}`;
        cardImg.alt = `${card.name}`;
        document.getElementById(`cardContent${card.id}`).appendChild(cardImg);

        const cardSubContentDiv = document.createElement("div");
        cardSubContentDiv.id = `cardSubContent${card.id}`;
        cardSubContentDiv.setAttribute('class', "flex col");
        document.getElementById(`cardContent${card.id}`).appendChild(cardSubContentDiv);

        const cardName = document.createElement("span");
        cardName.id = `cardName${card.id}`;
        cardName.textContent = card.name;
        cardName.setAttribute('class', "roboto card__title height-28px dark-main");
        document.getElementById(`cardSubContent${card.id}`).appendChild(cardName);

        const cardProvider = document.createElement("span");
        cardProvider.id = `cardName${card.id}`;
        cardProvider.textContent = card.provider;
        cardProvider.setAttribute('class', "roboto font-15px dark-main card__provider");
        document.getElementById(`cardSubContent${card.id}`).appendChild(cardProvider);

        const cardDescription = document.createElement("span");
        cardDescription.id = `cardDescription${card.id}`;
        cardDescription.textContent = card.desc;
        cardDescription.setAttribute('class', "roboto font-15px height-28px dark-main");
        document.getElementById(`card${card.id}`).appendChild(cardDescription);
    }
}

async function fetchCards () {
    try {
        let cards = await fetch('http://localhost:3000/posts').then( (response) =>  response.json());
        //for (let card of (await cards ? await cards : []) ){
         //   drawCard(card);
        //}
	renderCards(cards)
    } catch (err) {
        alert("can't fetch cards" + err);
    }
}


function preEdit(event) {
    let id = event.target.id.substring(8);
    let cardsArray = JSON.parse(window.localStorage.getItem("cards"));
    let card = cardsArray.find(x => Number(x.id) === Number(id));
    document.getElementsByName('id')[0].value = card.id;
    document.getElementsByName('id')[0].classList.add('hide');
    document.getElementsByName('name')[0].value = card.name;
    document.getElementsByName('provider')[0].value = card.provider;
    document.getElementsByName('imgLink')[0].value = card.src;
    document.getElementsByName('description')[0].value = card.desc;
    document.getElementById("approveBtn").idx = cardsArray.findIndex(x => Number(x.id) === Number(id));
    document.getElementById("deleteBtn").idx = cardsArray.findIndex(x => Number(x.id) === Number(id));
}


function isFormEmpty() {
    return isInputEmpty("id") || isInputEmpty("name") || isInputEmpty("provider") || isInputEmpty("imgLink") || isInputEmpty("description");
}


function isInputEmpty(key) {
    return document.getElementsByName(key)[0].value === "";
}


function validateForm(cardsArray, isCreate) {
    if (isFormEmpty()) {
        alert("fill all the input fields please");
        return false;
    }

    let id = document.getElementsByName("id")[0].value;

    if (isNaN(id) || isNaN(parseInt(id))) {
        alert("id must bu num");
        return false;
    }

    if (cardsArray.some(x => Number(x.id) === Number(id)) && isCreate) {
        alert("id must be unique");
        return false;
    }

    return true;
}


async function editCard(event) {
    let card = serializeForm(applicantForm, new Card());
    try {
        await fetch(`http://localhost:3000/posts/${event.target.editId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
            body: JSON.stringify(card)
        }).then(() => {
            document.getElementById('submit-button').classList.remove('invisible');
            document.getElementById('edit-button').classList.add('invisible');
            location.reload();
        })
    } catch (err) {
        alert(err);
    }
    
}

function serializeCard() {
    return new Card(
        document.getElementsByName('id')[0].value,
        document.getElementsByName('name')[0].value,
        document.getElementsByName('provider')[0].value,
        document.getElementsByName('imgLink')[0].value,
        document.getElementsByName('description')[0].value
    );
}


async function deleteCard(event) {
    try {
        await fetch(`http://localhost:3000/posts/${event.target.delId}`, {
            method: 'DELETE'
        }).then(() => location.reload())
    } catch (err) {
        alert(err);
    }
    
}

function clearForm() {
    document.getElementsByName('id')[0].value = "";
    document.getElementsByName('id')[0].classList.remove('hide');
    document.getElementsByName('name')[0].value = "";
    document.getElementsByName('provider')[0].value = "";
    document.getElementsByName('imgLink')[0].value = "";
    document.getElementsByName('description')[0].value = "";
    document.getElementById("approveBtn").idx = undefined;
    document.getElementById("deleteBtn").idx = undefined;
}


function handOutCards() {
    updateLocalStorage(
        [
            new Card(1, "kalash", "valve corp", "https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5k5SDnvnzIITZk2pH8Ysp3ujArYj02QG3-ks4MmHzdYOTcAc3MlCG-lC9kL_o0MO8tJzJzCExpGB8suUG-IwZ/96fx96fdpx2x?allow_animated=1", "nice"),
        ]
    );
}


function updateLocalStorage(cardsArray) {
    window.localStorage.clear();
    window.localStorage.setItem('cards', JSON.stringify(cardsArray));
    location.reload();
}


const handOutBtn = document.getElementById('handOutBtn');
handOutBtn.addEventListener('click', fetchCards);
function fetchAll() {
fetchProfile();
fetchCards();
}


window.onload = fetchAll;
