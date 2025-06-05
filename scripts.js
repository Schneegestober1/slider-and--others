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
const passError = document.getElementById('pass-error');
const fioInput = document.getElementById('fio');
const errorIcon = document.querySelector('#fio + .fa-solid'); 

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