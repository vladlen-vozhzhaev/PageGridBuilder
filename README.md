# PageGridBuilder

**PageGridBuilder** - это удобный конструктор страниц с системой сеток Bootstrap.

---

### Возможности:

- Создание блоков с сеткой
- Настройка ширины колонок в сетке
- Автоматическая адаптация сетки под мобильные устройства
- Широкие возможности редактирования текста. (смена шрифта, цвета, размера и т.д.)
- Добавление изображений, аудио и видео на страницу
- Добавление математики на страницу используя синтаксис [KaTex](https://katex.org/)

---

![PageGridBuilder_screenshot](https://vozhzhaev.ru/img/public/PageGridBuilder_screenshot.jpg?)

---

### Зависимости:

Для корректной работы получившейся в конструкторе страницы необходимо подключить к сайту следующие библиотеки:

#### Bootstrap 5

```html
<!-- CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
<!-- JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
```
### KaTex

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css">

### Как интегрировать конструктор на сайт?

#### Шаг №1

Добавьте на страницу, где планируете разместить конструктор, следующие скрипты:

```html
<link href="https://cdn.jsdelivr.net/npm/suneditor@latest/dist/css/suneditor.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/suneditor@latest/dist/suneditor.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/suneditor@latest/src/lang/ru.js"></script>
<script src="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js"></script>
<script src="js/PageGridBuilder.js"></script>
```
#### Шаг №2

Добавьте на страницу CSS:

```css
.edit-element:hover{
    border: chartreuse;
    background: aquamarine;
    cursor: pointer;
}
```
#### Шаг №3

Добавьте HTML элемент, в котором будет конструироваться страница, например так:

```html
<div class="container-fluid p-0 pe-3" id="pageGridContainer"></div>
```
#### Всё готово к работе

Для инициализации конструктора запустите метод init класса PageGridBuilder и передайте в качестве параметра элемент из шага №3:

```javascript
<script>
    const pageGridBuilder = PageGridBuilder.init(document.getElementById('pageGridContainer'));
</script>
```
Когда вам понадобится получить HTML код получившейся страницы, вызовите метод getHTML() объекта pageGridBuilder:

```javascript
<script>
    const stringHTML = pageGridBuilder.getHTML();
    console.log(stringHTML);
</script>
```
---
Что-то не получилось или не работает?

- просто напиши мне об этом на почту vladlen@vozhzhaev.ru