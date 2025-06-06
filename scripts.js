// Task 1

const prevButton = document.getElementById('prev-slide')
const nextButton = document.getElementById('next-slide')
const imageList = document.querySelector('.image-list')
const loader = document.getElementById('loader')
const scrollW = 500

const blockButtons = () => {
    const maxScroll = imageList.scrollWidth - imageList.clientWidth
    prevButton.disabled = imageList.scrollLeft <= 0
    nextButton.disabled = imageList.scrollLeft >= maxScroll
}

const fetchImages = async () => {
    loader.style.display = 'block' 
    try {
        const response = await fetch('https://picsum.photos/v2/list?page=1&limit=10')
        // https://jsonplaceholder.typicode.com/photos как будто не работает, заменил на https://picsum.photos/v2/list?page=1&limit=10
        const images = await response.json()
        console.log(images)

        images.forEach(i => {
            const img = document.createElement('img')
            img.src = `https://picsum.photos/id/${i.id}/300/200`
            img.alt = i.author
            imageList.appendChild(img)
        })
    } catch (error) {
        console.log('Ошибка!', error)
        imageList.innerHTML = '<p>Ошибка загрузки изображений.</p>'
    } finally {
        loader.style.display = 'none'
    }
}

const slider = async () => {
    await fetchImages()

    prevButton.addEventListener('click', () => {
        imageList.scrollBy({ left: -scrollW, behavior: 'smooth' })
    })

    nextButton.addEventListener('click', () => {
        imageList.scrollBy({ left: scrollW, behavior: 'smooth' })
    })

    imageList.addEventListener('scroll', blockButtons)

    blockButtons()
}

window.addEventListener('load', slider)

// Task 2
const fioError = document.getElementById('fio-error');
const fioInput = document.getElementById('fio');
const errorIcon = document.querySelector('#fio + .fa-solid'); 

const passError = document.getElementById('pass-error');
const passInput = document.getElementById('pass')
const passIcon = document.querySelector('#pass + .fa-solid')

function validateFio() {
    const fio = fioInput.value.trim();

    if (fio.length === 0) {
        fioError.innerHTML = 'Fio is required';
        fioInput.classList.add('error');
        errorIcon.style.display = 'block';
        return false;
    }

    if (fio.match(/\d/)) {
        fioError.innerHTML = 'Fio cannot contain numbers';
        fioInput.classList.add('error');
        errorIcon.style.display = 'block';
        return false;
    }

    if (!fio.match(/^[a-zA-Z\s]+$/)) {
        fioError.innerHTML = 'Use only letters';
        fioInput.classList.add('error'); 
        errorIcon.style.display = 'block';
        return false;
    }

    if (fio.replace(/\s/g, '').length === 0) { 
        fioError.innerHTML = 'Fio cannot be only spaces';
        fioInput.classList.add('error');
        errorIcon.style.display = 'block';
        return false;
    }

    fioError.innerHTML = '';
    fioInput.classList.remove('error');
    errorIcon.style.display = 'none';
    return true;
}

function validatePass() {
    const pass = passInput.value.trim()

    if (pass.length === 0) {
        passError.innerHTML = 'Password is required'
        passInput.classList.add('error')
        passIcon.style.display = 'block'
        return false
    }

    if (pass.replace(/\s/g, '').length === 0) {
        passError.innerHTML = 'Password cannot be only spaces'
        passInput.classList.add('error')
        passIcon.style.display = 'block'
        return false
    }

    if (pass.length < 8) {
        passError.innerHTML = 'Password must be at least 8 characters long'
        passInput.classList.add('error')
        passIcon.style.display = 'block'
        return false
    }
    
    if (!pass.match(/[a-zA-Z]/) || !pass.match(/\d/)) {
        passError.innerHTML = 'Password must contain at least one letter and one number'
        passInput.classList.add('error')
        passIcon.style.display = 'block'
        return false
    }

    if (!pass.match(/[!@#$%^&*(),.?":{}|<>]/)) {
        passError.innerHTML = 'Password must contain at least one special character'
        passInput.classList.add('error')
        passIcon.style.display = 'block'
        return false
    }

    passError.innerHTML = ''
    passInput.classList.remove('error')
    passIcon.style.display = 'none'
    return true
}

function validateForm(e) {
    const isFioValid = validateFio()
    const isPassValid = validatePass()

    if (!isFioValid || ! isPassValid) {
        e.preventDefault()
        return false
    }

    return true
}

// Task 3
const searchInput = document.getElementById('search')
const listItems = document.querySelectorAll('.list-item')
    console.log(listItems)
    searchInput.addEventListener('input', () => {
    const filter = searchInput.value.toLowerCase()

    listItems.forEach(item  => {
        const text = item.textContent.toLowerCase()
        item.style.display = text.includes(filter) ? 'list-item' : 'none'
    })

})

// Task 4

const API_URL = 'https://api.freecurrencyapi.com/v1/latest'
const API_KEY = 'fca_live_Wo8bEbi8aZVX2TRzHa9Gs1eXJQGsG4qwIy7ueWea'

const currencies = ['USD', 'EUR', 'JPY', 'CNY', 'CAD', 'CHF']
const baseCurrency = 'RUB'

const UPDATE_INTERVAL = 15 * 60 * 1000
const TIME_KEY = 'lastCurrencyUpdate'

const currencyList = document.getElementById('currency-list')
const timeAgoEl = document.getElementById('time-ago')
const loaderEl = document.getElementById('loader-currency');

function saveUpdateTime() {
    localStorage.setItem(TIME_KEY, Date.now())
}

function getMinutesAgo() {
    const lastUpdate = localStorage.getItem(TIME_KEY)

    if(!lastUpdate) return null

    const diffMs = Date.now() - Number(lastUpdate)
    return Math.floor(diffMs / 6000)
}

function showTimeAgo() {
    const minuteAgo = getMinutesAgo()

    if (minuteAgo === null) {
        timeAgoEl.textContent = 'только что'
    } else if (minuteAgo === 0) {
        timeAgoEl.textContent = 'менее минуты назад'
    } else {
        timeAgoEl.textContent = `${minuteAgo} мин назад`
    }
}

async function fetchCurrency() {
    try {
        loaderEl.style.display = 'block';  
        const response = await axios.get(API_URL, {
            params: {
                apikey: API_KEY,
                currencies: currencies.join(','),
                base_currency: baseCurrency,
            }
        })

        const rawCurr = response.data.data

        for (const [currency, value] of Object.entries(rawCurr)) {
            const rate = 1 / value
            const li = document.createElement('li')
            li.classList.add('currency-item')
            li.innerHTML = `<strong>${currency}</strong>: ${rate.toFixed(2)}`
            currencyList.appendChild(li)
        }

        saveUpdateTime()
        showTimeAgo()


    } catch (error) {
        console.error('Ошибка при получении курсов валют:', error)
        showTimeAgo();
    } finally {
        loaderEl.style.display = 'none'; 
    }
}

  showTimeAgo();

  fetchCurrency();

  setInterval(fetchCurrency, UPDATE_INTERVAL);

