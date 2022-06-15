const linkInfo = document.querySelector('#item-info');
const myModal = new bootstrap.Modal(document.getElementById('itemInfoModal'));

linkInfo.addEventListener('click', (e) => {
    e.preventDefault();
    myModal.show();
})