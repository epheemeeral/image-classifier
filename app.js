const imageElement = document.getElementById('image');
const uploadInput = document.getElementById('uploadImage');
const resultDiv = document.getElementById('result');
const predictButton = document.getElementById('predictBtn');

// Загрузка предобученной модели
let model;
mobilenet.load().then(loadedModel => {
    model = loadedModel;
    console.log('Модель успешно загружена');
});

// Обработка загрузки изображения
uploadInput.addEventListener('change', event => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        imageElement.src = reader.result;
        imageElement.style.display = 'block';
    };
    reader.readAsDataURL(file);
});

// Предсказание класса
predictButton.addEventListener('click', async () => {
    if (!model) {
        alert('Модель еще не загружена. Подождите.');
        return;
    }

    // Подготовка изображения
    const tfImg = tf.browser.fromPixels(imageElement).resizeBilinear([224, 224]).expandDims();
    
    // Классификация
    const predictions = await model.classify(tfImg);
    
    // Отображение результатов
    resultDiv.innerHTML = '';
    predictions.forEach(prediction => {
        const p = document.createElement('p');
        p.innerText = `${prediction.className}: ${(prediction.probability * 100).toFixed(2)}%`;
        resultDiv.appendChild(p);
    });
});

