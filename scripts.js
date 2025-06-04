const prevButton = document.getElementById('prev-slide')
const nextButton = document.getElementById('next-slide')
const imageList = document.querySelector('.image-list')
const scrollW = 500

const blockButtons = ()=> {
    const maxScroll = imageList.scrollWidth - imageList.clientWidth
    prevButton.disabled = imageList.scrollLeft <=0
    nextButton.disabled = imageList.scrollLeft >= maxScroll
}

prevButton.addEventListener('click', () => {
    imageList.scrollBy({left: -scrollW, behavior: 'smooth'})
})

nextButton.addEventListener('click', () => {
    imageList.scrollBy({left: scrollW, behavior: 'smooth'})
})

imageList.addEventListener('scroll', ()=> {
    blockButtons()
})

window.addEventListener('load', () => {blockButtons()})