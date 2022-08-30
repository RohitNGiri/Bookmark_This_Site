const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

//creating an array to save an bookmarks
let bookmarks = [];
// show modal, focus on Input 

function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}


//Get bookmarks from the local storage if available

function fetchBookmarks() {
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        bookmarks = [
            {
                name: 'Example',
                url: 'https://google.com',
            },
        ];
        // to save the item in the local storage in JSON formate //
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    //console.log(bookmarks);
    buildBookmarks();
}

//modal event listener

modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));

//Validate Form
function validate(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if (!urlValue || !nameValue) {
        alert('Please Enter the Values for both fields');
        return false;
    }
    if (!urlValue.match(regex)) {
        alert('Please provide a valid web address');
        return false;
    }
    return true;
}

// build bookmarks DOM

function buildBookmarks() {

    //Remove all bookmarks elements
    bookmarksContainer.textContent = '';

    //build items
    bookmarks.forEach((bookmark) => {
        const { name, url } = bookmark;
        //console.log(name,url);

        // item
        const item = document.createElement('div');
        item.classList.add('item');

        //Close Icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);

        //favicon/ link container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');

        //favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `favicon.png`);
        favicon.setAttribute('alt', 'Favicon');

        //Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', 'blank');
        link.textContent = name;

        //Appends to bookmarks container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);


    });
}





//Delete book from the list

function deleteBookmark(url) {
    bookmarks.forEach((bookmark, i) => {
        if (bookmark.url === url) {
            bookmarks.splice(i, 1);
        }
    });

    //update bookmarks array in localStorage, re-populate DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}










//window.addEventListener('click', (e) => console.log(e.target));

window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));


//handles data from the modal to add bookmarks in the website

function storeBookmark(e) {
    e.preventDefault();
    //console.log(e); display the event in the console
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if (!urlValue.includes('http://', 'https://')) {
        urlValue = `https://${urlValue}`;
    }
    //validation checking direct from the function

    if (!validate(nameValue, urlValue)) {
        return false;
    }

    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    console.log(JSON.stringify(bookmarks));
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();


}


// Event Listener
bookmarkForm.addEventListener('submit', storeBookmark);


//fetch bookmarks
fetchBookmarks();