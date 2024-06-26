// quote fade in effect on site loaded
window.addEventListener('DOMContentLoaded', () => {
    QuoteFadeInEffect();
    MainBoxesAnimation();
});

// quote fade in effect on start page
function QuoteFadeInEffect() {
    const quoteText = document.getElementById('quote-text');
    const authorText = document.getElementById('author-text');

    // Teilen Sie den Text in einzelne Buchstaben auf
    const quoteLetters = ["„", "D", "i", "e", " ", "b", "e", "s", "t", "e", " ", "B", "i", "l", "d", "u", "n", "g", " ", "f", "i", "n", "d", "e", "t", " ", "e", "i", "n", " ", "g", "e", "s", "c", "h", "e", "i", "t", "e", "r", " ", "M", "e", "n", "s", "c", "h", " ", "a", "u", "f", " ", "R", "e", "i", "s", "e", "n", "“", " "]
    const authorLetters = ["~", " ", "J", "o", "h", "a", "n", "n", " ", "W", "o", "l", "f", "g", "a", "n", "g", " ", "v", "o", "n", " ", "G", "o", "e", "t", "h", "e"]

    fadeInLetters = (letters, element) => {
        return new Promise((resolve) => {
            letters.forEach((letter, index) => {
                const span = document.createElement('span');
                span.textContent = letter;
                span.style.opacity = 0;

                element.appendChild(span);

                setTimeout(() => {
                    span.style.opacity = 1;

                    if (index === letters.length - 1) {
                        resolve();
                    };
                }, index * 10);
            });
        });
    };

    fadeInLetters(quoteLetters, quoteText)
        .then(() => {
            return fadeInLetters(authorLetters, authorText)
        });
};

// When page is loaded the main boxes get a fade in animation
function MainBoxesAnimation() {
    let boxes = [...mainBoxGrid.children];

    setTimeout(() => {
        let index = 0;
        let interval = setInterval(() => {
            boxes[index].style.opacity = "1";

            if (index >= boxes.length - 1) {
                clearInterval(interval);
                interval = null;
            };

            index++;
        }, 100);
    }, 300);
};

// search function
class search {
    constructor(baseURL) {
        this.baseURL = baseURL
        this.timerId;
        this.waitTime = 500;
    };

    // on start
    init = () => {
        this.DOM_events();
    };

    // load event listener
    DOM_events = () => {
        searchInput.addEventListener("input", (e) => {
            clearTimeout(this.timerId);
            this.timerId = null;

            let text = searchInput.value;
            let charlength = searchInput.value.length;
            let close = true;

            SearchResults_for_title.textContent = `Suchergebnisse für "${text}"`;

            if (charlength >= 1) {
                close = false;

                this.timerId = setTimeout(() => {
                    // get result after user didn't type for a time
                    this.full_display();

                    // activate spinner
                    this.spinner(true);

                    this.get_results(text, this.baseURL, search_fullDisplay_list);
                }, this.waitTime);

            } else {
                search_fullDisplay_Wrapper.style.display = "none";
                homepage_content.style.display = "flex";
            };

            this.search("dropdown", close, text);
        });

        closeResultsSectionBtn.addEventListener("click", () => {
            search_fullDisplay_Wrapper.style.display = "none";
            homepage_content.style.display = "flex";

            searchInput.value = null;
            this.search("dropdown", true, null);
        });

        search_form.addEventListener("submit", (e) => {
            let text = searchInput.value;

            // close and prevent
            e.preventDefault();
            this.search("dropdown", true, text);

            // user typed characters
            if (searchInput.value != 0) {
                // display result area
                this.search("full", false, text);

                // activate spinner
                this.spinner(true);

                // get result
                this.get_results(text, this.baseURL, search_fullDisplay_list);
            };
        });
    };

    search = (display_type, close, text) => {
        switch (display_type) {
            case "dropdown":
                this.dropdown_list(close, text);
                break;

            case "full":
                this.full_display(text);
                break;
        };
    };

    get_results = async(text, baseURL, parent_list) => {

        await fetch(baseURL + `/search/${text}`, {
            method: 'GET'
        })

        .catch(reason => console.log(reason))

        .then(async(res) => {
            const data = await res.json();
            this.display_results(data, parent_list);
        })
    };

    spinner = (status) => {
        search_fullDisplay_list.textContent = null;

        switch (status) {
            case true:
                let spinnerWrapper = document.createElement("div");
                let spinner = document.createElement("i");

                spinnerWrapper.className = "spinnerWrapper";
                spinner.className = "fa-solid fa-spinner loadingSpinner";
                spinner.style.animation = "spinnerAni 2s ease infinite";

                spinnerWrapper.appendChild(spinner)
                search_fullDisplay_list.appendChild(spinnerWrapper);
                break;

            case false:
                let loadingSpinner = document.querySelector(".spinnerWrapper");
                loadingSpinner && loadingSpinner.remove();
                search_fullDisplay_Wrapper.style.height = "max-content";
                break;
        };
    };

    dropdown_list = (close, text) => {
        searchBar_DropDownList_Wrapper.style.display = !close ? "flex" : "none";
    };

    full_display = (text) => {
        search_fullDisplay_Wrapper.style.display = "flex";
        homepage_content.style.display = "none";
    };

    display_results = (data, parent_list) => {
        this.spinner(false);
        parent_list.textContent = null; // reset

        if (data.length > 0) {

            for (const i of data) {
                let li = document.createElement("li");
                let a = document.createElement("a");
                a.textContent = i["name"];
                a.href = `/${i["route"]}`;

                li.appendChild(a);
                parent_list.appendChild(li);
            };

        } else { // display replace text
            let replaceText = document.createElement("p");
            replaceText.textContent = "Nichts gefunden!"
            parent_list.appendChild(replaceText);
        };
    };
};

let searchInstance = new search("http://localhost:8080");
searchInstance.init();