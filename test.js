const puppeteer = require("puppeteer");
const fs = require("fs");

async function parseProductDetails(url) {
  console.log(`Початок парсингу товару: ${url}`);

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  try {
    const page = await browser.newPage();

    // Налаштування User-Agent
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    // Включаємо логування з браузера
    page.on("console", (msg) => console.log("БРАУЗЕР:", msg.text()));

    // Перехід на сторінку товару
    console.log("Відкриваємо сторінку товару...");
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // Почекаємо завантаження критичних елементів
    console.log("Чекаємо завантаження ключових елементів...");
    await page
      .waitForSelector(".product-price__big-color-red", { timeout: 30000 })
      .catch(() =>
        console.log("Не вдалося знайти елемент ціни, але продовжуємо")
      );

    // Парсимо детальну інформацію про товар
    console.log("Починаємо вилучення даних...");

    const productDetails = await page.evaluate(() => {
      // Допоміжна функція для безпечного отримання тексту
      function safeText(selector) {
        const element = document.querySelector(selector);
        return element ? element.textContent.trim() : null;
      }

      // Допоміжна функція для отримання тексту з усіх вибраних елементів
      function getAllTexts(selector) {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements).map((el) => el.textContent.trim());
      }

      console.log("Отримуємо основну інформацію...");

      // Збираємо основну інформацію
      const title = safeText("h1.title__font");
      const price = safeText(".product-price__big");
      const oldPrice = safeText(".product-price__small");
      const rating = safeText(".product-rating__value");
      const reviewCount = safeText(".product-rating__link");

      // Збираємо зображення
      console.log("Отримуємо зображення...");
      const images = Array.from(
        document.querySelectorAll("ul.simple-slider__list button img")
      ).map((img) => img.src);

      // Отримуємо опис
      console.log("Отримуємо опис товару...");
      const description = document.querySelector(
        ".product-about__description-content"
      )
        ? document
            .querySelector(".product-about__description-content")
            .innerHTML.trim()
        : null;

      // Виводимо детальну діагностику
      console.log("Діагностика елементів:");
      console.log("- Заголовок:", !!document.querySelector("h1.title__font"));
      console.log("- Ціна:", !!document.querySelector(".product-price__big"));
      console.log(
        "- Рейтинг:",
        !!document.querySelector(".product-rating__value")
      );
      console.log(
        "- Опис:",
        !!document.querySelector(".product-about__description-content")
      );
      console.log(
        "- Характеристики:",
        !!document.querySelector("rz-product-characteristics-list")
      );

      const attributesHtml = Array.from(
        document.querySelectorAll("dl.list div.item")
      );

      //attributesHtml.map((v) => console.log(v.innerHTML));

      // Отримуємо характеристики
      console.log("Отримуємо характеристики...");
      const attributes = [];
      attributesHtml.map((v) =>
        attributes.push({
          label: v.querySelector("dt.label span").textContent,
          text: v.querySelector("dd.value span").textContent,
        })
      );

      // Отримуємо доступність
      const availability = safeText("p.status-label");

      // Інформація про продавця
      const seller = safeText(".product-seller__name");

      // Категорії/хлібні крихти
      const breadcrumbs = getAllTexts(
        ".breadcrumbs__item>a, .breadcrumbs__item>span"
      )
        .filter((text) => text !== "/" && text !== "")
        .pop();

      // Коментарі/відгуки
      let reviews = [];
      const reviewElements = document.querySelectorAll(".comment");

      if (reviewElements.length > 0) {
        console.log(`Знайдено ${reviewElements.length} відгуків`);

        // Беремо тільки перші 5 відгуків для прикладу
        reviewElements.forEach((review, index) => {
          if (index >= 5) return;

          const authorName = review
            .querySelector(".comment__author-name")
            ?.textContent.trim();
          const date = review
            .querySelector(".comment__date")
            ?.textContent.trim();
          const rating = review
            .querySelector(".stars__rating")
            ?.textContent.trim();
          const text = review
            .querySelector(".comment__text")
            ?.textContent.trim();

          reviews.push({
            author: authorName,
            date,
            rating,
            text,
          });
        });
      }

      // Схожі товари (лише назви для прикладу)
      const similarProductsImages = Array.from(
        document.querySelectorAll(
          "rz-scroller div.wrap div.d-flex div.slide img.image"
        )
      ).map((v) => v.src);

      const similarProductsHref = Array.from(
        document.querySelectorAll(
          "rz-scroller div.wrap div.d-flex div.slide a.image"
        )
      ).map((v) => v.href);

      const similarProductsPrice = Array.from(
        document.querySelectorAll(
          "rz-scroller div.wrap div.d-flex div.slide div.price"
        )
      ).map((v) => v.textContent);

      const similarProductsTitle = Array.from(
        document.querySelectorAll(
          "rz-scroller div.wrap div.d-flex div.slide a.title"
        )
      ).map((v) => v.textContent);

      const similarProducts = [];

      for (i = 0; i < similarProductsImages.length; i++) {
        similarProducts.push({
          image: similarProductsImages[i],
          href: similarProductsHref[i],
          price: similarProductsPrice[i],
          title: similarProductsTitle[i],
        });
      }

      return {
        title,
        price,
        oldPrice,
        rating,
        reviewCount,
        availability,
        seller,
        images,
        breadcrumbs,
        description,
        attributes,
        reviews,
        similarProducts,
        url: window.location.href,
      };
    });

    console.log("Парсинг завершено успішно!");
    console.log("Заголовок товару:", productDetails.title);
    console.log("Ціна:", productDetails.price);

    console.log(JSON.stringify(productDetails));

    return productDetails;
  } catch (error) {
    console.error("Помилка під час парсингу:", error);
    return null;
  } finally {
    console.log("Закриваємо браузер...");
    await browser.close();
  }
}

// Функція для збереження результатів
function saveToFile(data, filename = "product-details.json") {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2), "utf8");
  console.log(`Результати збережено у файл ${filename}`);
}

// Запуск парсера
const productUrl =
  "https://rozetka.com.ua/ua/sleepingg_4820227286140/p334347586/";

parseProductDetails(productUrl)
  .then((data) => {
    if (data) {
    } else {
      console.log("Не вдалося отримати дані про товар.");
    }
  })
  .catch((error) => {
    console.error("Помилка при виконанні парсера:", error);
  });
