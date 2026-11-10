const body = document.querySelector("body");
const darkmodeBtn = body.querySelector(".dark-theme-btn");
const form = body.querySelector("form");
const search = body.querySelector("#search");
const username = body.querySelector(".username")
const date = body.querySelector(".date");
const bio = body.querySelector(".biography");
const total_Repos = body.querySelector(".total-repos");
const total_Followers = body.querySelector(".total-followers");
const total_Following = body.querySelector(".total-following");
const address = body.querySelector(".address"); 
const links = body.querySelector(".links");
const social = body.querySelector(".social");
const work = body.querySelector(".work");
const avatar = body.querySelector(".avatar");
const themeToggle = body.querySelector("#theme-toggle");

const array = localStorage.getItem("theme");
const storage = array ? JSON.parse(array) : ["light"];

// DARK THEME TOGGLE 
darkmodeBtn.addEventListener("click", () => {

    storage[0] === "light" ? storage[0] = "dark" : storage[0] = "light";
    themeMode();

    localStorage.setItem("theme", JSON.stringify(storage));
});

const container = body.querySelector('.container');
const dark = body.querySelector(".dark");
themeMode();

function themeMode() {
    if (storage[0] === "dark") {
    body.classList.add("active");
    dark.textContent = "Light";
    themeToggle.classList.remove("fa-moon");
    themeToggle.classList.add("fa-sun");

    } else if (storage[0] === "light") {
    body.classList.remove("active");
    dark.textContent = "Dark";
    themeToggle.classList.remove("fa-sun");
    themeToggle.classList.add("fa-moon");
    }
}

const userNotFound_msg = body.querySelector(".not-found-message");
const searchBtn = body.querySelector('.search-btn');

// FORM SUBMISSION FUNCTION 
form.addEventListener("submit", (e) => {

e.preventDefault();

const username_input = search.value.trim();

if (username_input === "") return;

const usernamePattern = /^[a-z\d-]{1,39}$/i;

if (!usernamePattern.test(username_input)) {
    userOffline(false);
    userNotFound(true);
    userNotFound_msg.textContent = "Usernames can only have letters, numbers and hyphens.";
    return;
}
searchBtn.disabled = true;

getUser(username_input);
})

const mainData = {
    jsonData: null
}

// FETCH USER DATA 
async function getUser(username_input) {

mainData.jsonData = null;

try {
const response = await fetch(`https://api.github.com/users/${username_input}`);
const data = await response.json();

if (!response.ok) {
   userNotFound(true);
   userOffline(false);
   userNotFound_msg.textContent = data.message;
   return;
}
 mainData.jsonData = data;

} catch(error) {
 console.log(error);
 userOffline(true);
 userNotFound(false);
 return;
} finally {
 searchBtn.disabled = false;
}

userNotFound(false);
userOffline(false);
if (!mainData.jsonData) return;

setProfile();
}

// USER OFFLINE FUNCTION 
function userOffline(offline) {
offline === true ? container.classList.add("offline-active") : container.classList.remove("offline-active");
}

// USER NOT FOUND FUNCTION 
function userNotFound(notFound) {
notFound === true ? container.classList.add("not-found-active") : container.classList.remove("not-found-active");
}

const profileName = body.querySelector(".profile-name");
// PROFILE RENDER FOR USER 
function setProfile() {
const joined = "Joined";
const joinedDate = new Date(mainData.jsonData.created_at);

profileName.textContent = mainData.jsonData.name === null ? mainData.jsonData.login : mainData.jsonData.name;
username.textContent = `@${mainData.jsonData.login}`;
bio.textContent = mainData.jsonData.bio;
total_Followers.textContent = mainData.jsonData.followers;
total_Following.textContent = mainData.jsonData.following;
total_Repos.textContent = mainData.jsonData.public_repos;
avatar.src = mainData.jsonData.avatar_url;
date.textContent = `${joined} ${joinedDate.toLocaleDateString("en-US", {
    dateStyle: "long",
})}`;
address.textContent = mainData.jsonData.location === null ? "Not Available" : mainData.jsonData.location;

if (mainData.jsonData.blog === "") {
    links.textContent = "Not Available";
    links.removeAttribute("href");
} else {
    links.textContent = mainData.jsonData.blog;
    links.href = mainData.jsonData.blog;
}

if(mainData.jsonData.twitter_username === null) {
    social.textContent = "Not Available";
    social.removeAttribute("href");
} else {
    social.textContent = mainData.jsonData.twitter_username
    social.href = `https://twitter.com/${mainData.jsonData.twitter_username}`;
}

work.textContent = mainData.jsonData.company === null ? "Not Available" : mainData.jsonData.company;
}