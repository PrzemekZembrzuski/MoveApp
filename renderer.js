const DropFile = require('./Components/DropFile');
const Move = require('./Components/Move');

const dropFile = new DropFile();
const move = new Move();


dropFile.watch()
// document.querySelector('.tabs').addEventListener('click', e => {
//     const activeBox = document.querySelector('.is-active-box');
//     const activeTab = document.querySelector('li.is-active');
//     if (e.target.nodeName === 'A' && e.target.dataset.boxid !== activeBox.id) {
//         activeBox.classList.remove('is-active-box');
//         activeTab.classList.remove('is-active');
//         e.target.parentElement.classList.add('is-active');
//         document.querySelector(`#${e.target.dataset.boxid}`).classList.add('is-active-box')
//     }
// })
