import refs from "./refs.js";

const { form, list, more } = refs;

console.log(form, list);

form.addEventListener("submit", (evt) => {
  evt.preventDefault();

  //Зачищаем список отрисовки
  list.innerHTML = "";
  // Сбрасываем параметр страницы
  fetchObject.resetPage();
  // Переменная хранит значение по каторому мы ищем кртинки
  let query = evt.target.elements.search.value;

  // Записысивые полученное значение из инпута в свойство объеката с запросом
  fetchObject.setQuery(query);
  // Делаем запрос без значению из инпута и отрисовываем первый ответ
  fetchObject.getFetch();
  // Открываем кнопку догрузки
  more.classList.remove("is-hidden");
  // Обнуляем значение интута
  form.reset();
});

const fetchObject = {
  // Ключ полученный при регистрации у Pexels.com
  apiKey: "563492ad6f91700001000001907cf3f14d36436880a9a744d767c5f5",

  // Статическая неизменяемая часть строки запроса
  baseUrl: "https://api.pexels.com/v1/search",

  // Переменная, указыающая порядковый номер набора картинок, который мы сейчас получаем
  page: 1,

  // Переменная, указывающая на количество найденных элементов по запросу на одной странице
  per_page: 3,

  query: "",

  setQuery(value) {
    return (this.query = value);
  },

  setPage() {
    return (this.page += 1);
  },

  resetPage() {
    return (this.page = 1);
  },

  getFetch() {
    // Вторая изменяемая часть строки запроса содержащая параметры согласно документации
    let queryParams = `?query=${this.query}&page=${this.page}&per_page=${this.per_page}`;

    // Готовая строка запроса
    let url = this.baseUrl + queryParams;

    // Объект настроек, в котором мы передаем ключ авторизации для запроса согласно документации
    let options = {
      method: "GET",
      headers: {
        Authorization: this.apiKey,
      },
      // body: {}
    };

    // Запрос, который будем обрабатывать методами then, так как он возвращает promise
    fetch(url, options)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        return data.photos;
      })
      .then((photos) => {
        generateGalery(photos, list);
      });
  },

  loadMore(button) {
    button.addEventListener("click", () => {
      console.log("Загрузить больше");
      this.setPage();
      console.log(this.page);
      this.getFetch();
    });
  },
};

fetchObject.loadMore(more);

function generateGalery(array, place) {
  const items = array
    .map((photo) => {
      return `<li><img src=${photo.src.tiny} alt=${photo.photographer}></li>`;
    })
    .join("");

  place.insertAdjacentHTML("beforeend", items);
}

function createButtonLoadMore(place) {
  const button = document.createElement("button");
  button.textContent = "More";
  button.classList.add("more");
  place.insertAdjacentElement("afterend", button);
}
