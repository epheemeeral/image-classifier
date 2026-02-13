const imageElement = document.getElementById('image');
const uploadInput = document.getElementById('uploadImage');
const resultDiv = document.getElementById('result');
const predictButton = document.getElementById('predictBtn');

predictButton.disabled = true;
resultDiv.innerHTML = 'Модель загружается...';

// Загружаем лёгкую версию MobileNet
let model;
mobilenet.load({version:1, alpha:0.25}).then(loadedModel => {
    model = loadedModel;
    resultDiv.innerHTML = 'Модель загружена ✅. Теперь можно распознавать изображения.';
    predictButton.disabled = false;
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
    if (!model) return; // кнопка уже заблокирована, так что можно просто return

    resultDiv.innerHTML = 'Идёт распознавание...';

    // Подготовка изображения
    const tfImg = tf.browser.fromPixels(imageElement)
        .resizeBilinear([224, 224])
        .expandDims()
        .toFloat()
        .div(tf.scalar(127))
        .sub(tf.scalar(1)); // нормализация, ускоряет точность

    // Классификация
    const predictions = await model.classify(tfImg);

    // Отображение результатов
    resultDiv.innerHTML = '';
    predictions.slice(0, 3).forEach(prediction => { // показываем топ-3
        const p = document.createElement('p');
        p.innerText = `${prediction.className}: ${(prediction.probability * 100).toFixed(2)}%`;
        resultDiv.appendChild(p);
    });
});


