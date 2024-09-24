const inputMode = document.querySelector('.input-mode');
const recordMode = document.querySelector('.record-mode');

export function switchBtnMode() {
    inputMode.classList.toggle('hidden');
    inputMode.classList.toggle('visible');
    
    recordMode.classList.toggle('hidden');
    recordMode.classList.toggle('visible');
}
