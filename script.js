
const questions = [
    {
        id: 'gender',
        title: 'Для кого выбираем подарок?',
        options: [
            { value: 'female', label: 'Девушке / Женщине', icon:'img/woman.png' },
            { value: 'male', label: 'Парню / Мужчине', icon:'img/businesman.png' }
        ]
    },
    {
        id: 'age',
        title: 'Примерный возраст?',
        options: [
            { value: 'child', label: 'Ребёнок (до 14)', icon:'img/kid.png' },
            { value: 'teen', label: 'Подросток (14-18)', icon:'img/man.png' },
            { value: 'adult', label: 'Взрослый (18-55)', icon:'img/businesman.png' },
            { value: 'senior', label: 'Старше 55', icon:'img/ded.png' }
        ]
    },
    {
        id: 'occasion',
        title: 'Какой праздник отмечаем?',
        options: [
            { value: 'birthday', label: 'День рождения', icon:'img/cake.png' },
            { value: 'newyear', label: 'Новый год', icon:'img/elka.png' },
            { value: 'valentine', label: '14 Февраля', icon:'img/heart.png' },
            { value: 'other', label: 'Просто так / Другое', icon:'img/gift.png' }
        ]
    },
    {
        id: 'relation',
        title: 'Кем вы приходитесь получателю?',
        options: [
            { value: 'partner', label: 'Вторая половинка', icon:'img/heart.png' },
            { value: 'friend', label: 'Друг / Подруга', icon:'img/best.png'},
            { value: 'family', label: 'Родственник', icon:'img/house.png' },
            { value: 'colleague', label: ' Коллега', icon:'img/bag.png' }
        ]
    },
    {
        id: 'budget',
        title: 'Какой бюджет планируете?',
        options: [
            { value: 'low', label: 'До 2 000 ₽', icon:'img/money1.png' },
            { value: 'medium', label: ' 2 000 - 5 000 ₽', icon:'img/money2.png' },
            { value: 'high', label: '5 000 - 15 000 ₽', icon:'img/money3.png' },
            { value: 'premium', label: ' Более 15 000 ₽', icon:'img/money4.png' }
        ]
    }
];

let currentStep = 0;
const answers = {};

const titleEl = document.getElementById('title');
const optionsContainer = document.getElementById('optionsContainer');
const backBtn = document.getElementById('backBtn');
const stepCounter = document.getElementById('stepCounter');
const progressBar = document.getElementById('progressBar');
const card = document.getElementById('card');
const finalCard = document.getElementById('finalCard');
const loader = document.getElementById('loader');
const loaderText = document.getElementById('loaderText');

const ozonBtn = document.getElementById('ozonBtn');
const wbBtn = document.getElementById('wbBtn');
const restartBtn = document.getElementById('restartBtn');

function init() {
    currentStep = 0;
    for (let key in answers) delete answers[key];
    card.style.display = 'block';
    finalCard.style.display = 'none';
    loader.style.display = 'none';
    progressContainer.style.display = 'block';
    renderQuestion(currentStep);
    updateProgress();
    updateNavButtons();
}

function renderQuestion(step) {
    const question = questions[step];
    titleEl.textContent = question.title;
    optionsContainer.innerHTML = '';
    question.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.dataset.value = option.value;
      
        const contentWrapper = document.createElement('div');
        contentWrapper.style.display = 'flex';
        contentWrapper.style.alignItems = 'center';
        contentWrapper.style.gap = '12px';
   
        const img = document.createElement('img');
        img.src = option.icon;
        img.alt = option.label;
        img.style.width = '28px';
        img.style.height = '28px';
        img.style.objectFit = 'contain';
       
        const textSpan = document.createElement('span');
        textSpan.textContent = option.label;
     
        contentWrapper.appendChild(img);
        contentWrapper.appendChild(textSpan);
        btn.appendChild(contentWrapper);
        if (answers[question.id] === option.value) {
            btn.classList.add('selected');
        }
        btn.addEventListener('click', () => selectOption(question.id, option.value, btn));
        optionsContainer.appendChild(btn);
    });
}

function selectOption(questionId, value, btnElement) {
    answers[questionId] = value;
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    btnElement.classList.add('selected');
    
    if (currentStep < questions.length - 1) {
        setTimeout(() => {
            currentStep++;
            renderQuestion(currentStep);
            updateProgress();
            updateNavButtons();
        }, 200);
    } else {
        setTimeout(() => {
            showFinalScreen();
        }, 400);
    }
}

function showFinalScreen() {
    card.style.display = 'none';
    progressContainer.style.display = 'none';
    finalCard.style.display = 'block';
}

function goBack() {
    if (currentStep > 0) {
        currentStep--;
        renderQuestion(currentStep);
        updateProgress();
        updateNavButtons();
    }
}

function updateProgress() {
    const percent = ((currentStep + 1) / questions.length) * 100;
    progressBar.style.width = `${percent}%`;
    stepCounter.textContent = `${currentStep + 1} / ${questions.length}`;
}
function updateNavButtons() {
    backBtn.disabled = currentStep === 0;
}

function redirectTo(marketplace) {
    finalCard.style.display = 'none';
    loader.style.display = 'block';
    loaderText.textContent = marketplace === 'ozon' ? 'Открываем Ozon...' : 'Открываем Wildberries...';
    const url = marketplace === 'ozon' ? buildOzonUrl() : buildWbUrl();
    setTimeout(() => {
        window.open(url, '_blank');
        loader.style.display = 'none';
        finalCard.style.display = 'block';
    }, 1500);
}

function buildOzonUrl() {
    let searchQuery = '';
  
    if (answers.gender === 'female') {
        if (answers.occasion === 'valentine' || answers.relation === 'partner') {
            searchQuery = 'подарок девушке';
        } else if (answers.age === 'child') {
            searchQuery = 'подарок для девочек до 14 лет';
        } else if (answers.age === 'teen') {
            searchQuery = 'подарок девушке подростку';
        } else if (answers.age === 'senior') {
            searchQuery = 'подарок женщине';
        } else {
            searchQuery = 'подарок девушке';
        }
    } else {
        if (answers.age === 'child') {
            searchQuery = 'игрушки для мальчиков до 14 лет';
        } else if (answers.age === 'teen') {
            searchQuery = 'подарок парню подростку';
        } else if (answers.age === 'senior') {
            searchQuery = 'подарок мужчине';
        } else {
            searchQuery = 'подарок мужчине';
        }
    }
   
    if (answers.occasion === 'birthday') {
        searchQuery = 'день рождения ' + searchQuery;
    } else if (answers.occasion === 'newyear') {
        searchQuery = 'новый год ' + searchQuery;
    } else if (answers.occasion === 'valentine') {
        searchQuery = '14 февраля ' + searchQuery;
    }

    let priceFilter = '';
    switch (answers.budget) {
        case 'low':
            priceFilter = '&price=0-2000';
            break;
        case 'medium':
            priceFilter = '&price=2000-5000';
            break;
        case 'high':
            priceFilter = '&price=5000-15000';
            break;
        case 'premium':
            priceFilter = '&price=15000-100000';
            break;
    }
    return `https://www.ozon.ru/search/?text=${encodeURIComponent(searchQuery)}${priceFilter}&sorting=rating`;
}

function buildWbUrl() {
    let searchQuery = '';

    if (answers.gender === 'female') {
        if (answers.occasion === 'valentine' || answers.relation === 'partner') {
            searchQuery = 'подарок на 14 февраля девушке';
        } else if (answers.age === 'child') {
            searchQuery = 'игрушки для девочек до 14 лет';
        } else if (answers.age === 'teen') {
            searchQuery = 'подарок девушке подростку';
        } else if (answers.age === 'senior') {
            searchQuery = 'подарок женщине';
        } else {
            searchQuery = 'подарок девушке';
        }
    } else {
        if (answers.age === 'child') {
            searchQuery = 'игрушки для мальчиков до 14 лет';
        } else if (answers.age === 'teen') {
            searchQuery = 'подарок парню подростку';
        } else if (answers.age === 'senior') {
            searchQuery = 'подарок мужчине';
        } else {
            searchQuery = 'подарок мужчине';
        }
    }
   
    if (answers.occasion === 'birthday') {
        searchQuery = 'день рождения ' + searchQuery;
    } else if (answers.occasion === 'newyear') {
        searchQuery = 'новый год ' + searchQuery;
    } else if (answers.occasion === 'valentine') {
        searchQuery = '14 февраля ' + searchQuery;
    }
   
    let priceFrom = '';
    let priceTo = '';
    switch (answers.budget) {
        case 'low':
            priceFrom = '0';
            priceTo = '2000';
            break;
        case 'medium':
            priceFrom = '2000';
            priceTo = '5000';
            break;
        case 'high':
            priceFrom = '5000';
            priceTo = '15000';
            break;
        case 'premium':
            priceFrom = '15000';
            priceTo = '100000';
            break;
    }
    let url = `https://www.wildberries.ru/catalog/0/search.aspx?search=${encodeURIComponent(searchQuery)}`;
    if (priceFrom && priceTo) {
        url += `&priceU=${priceFrom}00;${priceTo}00`;
    }
    url += '&sort=popular';
    return url;
}

function restart() {
    init();
}

backBtn.addEventListener('click', goBack);
ozonBtn.addEventListener('click', () => redirectTo('ozon'));
wbBtn.addEventListener('click', () => redirectTo('wb'));
restartBtn.addEventListener('click', restart);

init();
