const inputMode = document.querySelector('.input-mode');
const recordMode = document.querySelector('.record-mode');

export function switchBtnMode() {
    if (recordMode.style.display === 'none') {
        inputMode.style.display = 'none';    
        recordMode.style.display = 'flex';  
    } else {
        inputMode.style.display = 'flex';   
        recordMode.style.display = 'none';  
    }
}
