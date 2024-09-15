export function validateCoordinates(input) {
    const clearInput = input.replace(/[\[\]\s]/g, '');
    const parts = clearInput.split(',');

    if (parts.length !== 2) {
        throw new Error('Координаты должны содержать два числа, разделенные запятой.');
    }

    const latitude = parseFloat(parts[0]);
    console.log(latitude);
    const longitude = parseFloat(parts[1]);
    console.log(longitude);

    if (isNaN(latitude) || isNaN(longitude)) {
        throw new Error('Широта и долгота должны быть числами.');
    }

    if (latitude < -90 || latitude > 90) {
        throw new Error('Широта должна быть в диапазоне от -90 до 90.');
    }

    if (longitude < -180 || longitude > 180) {
        throw new Error('Долгота должна быть в диапазоне от -180 до 180.');
    }

    return { 
        latitude, 
        longitude };
}

