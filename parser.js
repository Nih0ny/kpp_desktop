const puppeteer = require("puppeteer");
const express = require("express");
const fs = require("fs");

const app = express();
const port = 3001;

async function parseRozetka() {
  const browser = await puppeteer.launch({
    headless: true,
  });

  try {
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    await page.goto("https://rozetka.com.ua/", {
      waitUntil: "networkidle2",
    });

    await page.waitForSelector("rz-goods-sections-best", { timeout: 20000 });

    const products = await page.evaluate(() => {
      const xpath =
        "/html/body/rz-app-root/div/div[1]/rz-main-page/div/main/rz-main-page-content/rz-goods-sections-best/div/rz-section-tiles-block-best/div[2]";

      const result = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );
      const targetElement = result.singleNodeValue;

      if (!targetElement) {
        return [];
      }

      const productCards = targetElement.querySelectorAll("rz-product-tile");
      const products = [];

      const cardsToAnalyze = Array.from(
        productCards.length > 0
          ? productCards
          : targetElement.querySelectorAll(".goods-tile")
      ).slice(0, 4);

      cardsToAnalyze.forEach((card) => {
        function getElementByXPath(element, xpath) {
          try {
            const result = document.evaluate(
              xpath,
              element,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            );
            return result.singleNodeValue;
          } catch (e) {
            console.log(`Помилка при пошуку за XPath ${xpath}:`, e.message);
            return null;
          }
        }

        const titleElement = getElementByXPath(card, "./div[2]/a[2]");

        const priceElement = getElementByXPath(
          card,
          "./div[2]/div[2]/rz-tile-price/div[2]"
        );

        const imageElement = getElementByXPath(card, "./div[2]/a[1]/img");

        const title = titleElement ? titleElement.innerText.trim() : null;
        const price = priceElement ? priceElement.innerText.trim() : null;
        const imageUrl = imageElement ? imageElement.src : null;
        const productUrl = titleElement ? titleElement.href : null;

        products.push({
          title,
          price,
          imageUrl,
          productUrl,
        });
      });

      const allProducts = [];
      Array.from(
        productCards.length > 0
          ? productCards
          : targetElement.querySelectorAll(".goods-tile")
      ).forEach((card) => {
        function getElementByXPath(element, xpath) {
          try {
            const result = document.evaluate(
              xpath,
              element,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            );
            return result.singleNodeValue;
          } catch (e) {
            return null;
          }
        }

        const titleElement = getElementByXPath(card, "./div[2]/a[2]");
        const priceElement = getElementByXPath(
          card,
          "./div[2]/div[2]/rz-tile-price/div[2]"
        );
        const imageElement = getElementByXPath(card, "./div[2]/a[1]/img");

        allProducts.push({
          title: titleElement ? titleElement.innerText.trim() : null,
          price: priceElement ? priceElement.innerText.trim() : null,
          imageUrl: imageElement ? imageElement.src : null,
          productUrl: titleElement ? titleElement.href : null,
        });
      });

      return allProducts;
    });

    return products;
  } catch (error) {
    console.error("КРИТИЧНА ПОМИЛКА при парсингу:", error);
    return [];
  } finally {
    await browser.close();
  }
}

async function parseProductDetails(url) {
  console.log(`Початок парсингу товару: ${url}`);

  const browser = await puppeteer.launch({
    headless: true,
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

    await page.evaluate(async () => {
      const distance = 100; // Кількість пікселів для прокрутки
      const delay = 200; // Затримка між прокрутками в мілісекундах

      const scrollHeight = document.body.scrollHeight;

      for (let i = 0; i < scrollHeight; i += distance) {
        window.scrollBy(0, distance); // Прокручувати на задану відстань
        await new Promise((resolve) => setTimeout(resolve, delay)); // Затримка між прокрутками
      }
    });

    // Почекаємо завантаження критичних елементів
    console.log("Чекаємо завантаження ключових елементів...");
    await page
      .waitForSelector("rz-product-tile", { timeout: 30000 })
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

      similarProductsImages.map((v) => console.log(v));

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

const cors = require("cors");
app.use(cors());

app.get("/parse-rozetka", async (req, res) => {
  try {
    const products = await parseRozetka();
    res.json(products); // Відправляємо результат у вигляді JSON
  } catch (error) {
    res.status(500).json({ error: "Не вдалося виконати парсинг" });
  }
});

app.get("/parse-rozetka-page", async (req, res) => {
  try {
    const product = await parseProductDetails(req.query.url);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Не вдалося виконати парсинг" });
  }
});

// Стартуємо сервер на порту 3000
app.listen(port, () => {
  console.log(`Сервер працює на http://localhost:${port}`);
});
