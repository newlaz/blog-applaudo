import { deletePost, getPostById, getPosts, setPosts } from "./storage.js";

// Custom Component Selector
const $ = (tagToSelect, nodeContainer = document) => {
  const selectedElement = nodeContainer.querySelectorAll(tagToSelect);

  if (selectedElement.length > 1) return selectedElement;
  else if (selectedElement.length === 1) return selectedElement[0];
  else return null;
};

// Our context

const PageState = function () {
  let currentState = new homePageState();

  this.init = function () {
    this.changeState(new homePageState());
  };

  this.changeState = function (state) {
    currentState = state;
  };

  this.displayView = function () {
    $("#mainContainer").innerHTML = "";
    currentState.displayView();
  };

  this.displaySinglePost = function (postId) {
    $("#mainContainer").innerHTML = "";
    currentState.displaySinglePost(postId);
  };

  this.savePost = function (post) {
    $("#mainContainer").innerHTML = "";
    currentState.savePost(post);
  };

  this.formValidation = function (post) {
    return currentState.formValidation(post);
  };

  this.editPost = function (postId) {
    $("#mainContainer").innerHTML = "";
    currentState.editPost(postId);
  };
};

// HomePageState

const homePageState = function () {
  this.displayView = function () {
    $("[data-nav-home]").classList.add("nav__item--active");
    $("[data-nav-form]").classList.remove("nav__item--active");

    const lastPostsContainerTemplate = $("#lastPostsContainerTemplate").content;
    $("#lastPostsContainer", lastPostsContainerTemplate).innerHTML = "";

    const postsContainerTemplate = $("#postsContainerTemplate").content;
    $("#allPostsContainer", postsContainerTemplate).innerHTML = "";

    const cardTemplate = $("#cardTemplate").content;

    this.lastPosts(getPosts()).forEach((post) => {
      $(".card__img", cardTemplate).setAttribute("src", post.img);
      $(".card__title", cardTemplate).textContent = post.title;
      $(".card__title", cardTemplate).setAttribute("data-post-id", post.id);
      $(".card__description", cardTemplate).textContent = post.description;
      $(".card__tags", cardTemplate).textContent = post.tags;

      $("#lastPostsContainer", lastPostsContainerTemplate).appendChild(
        cardTemplate.cloneNode(true)
      );
    });

    this.remainingPosts(getPosts()).forEach((post) => {
      $(".card__img", cardTemplate).setAttribute("src", post.img);
      $(".card__title", cardTemplate).textContent = post.title;
      $(".card__title", cardTemplate).setAttribute("data-post-id", post.id);
      $(".card__description", cardTemplate).textContent = post.description;
      $(".card__tags", cardTemplate).textContent = post.tags;

      $("#allPostsContainer", postsContainerTemplate).appendChild(
        cardTemplate.cloneNode(true)
      );
    });

    $("#mainContainer").appendChild(lastPostsContainerTemplate.cloneNode(true));
    $("#mainContainer").appendChild(postsContainerTemplate.cloneNode(true));
  };

  this.lastPosts = function (posts) {
    return posts
      .sort((postA, postB) => postB.createdAt.localeCompare(postA.createdAt))
      .splice(0, 5);
  };

  this.remainingPosts = function (posts) {
    return posts
      .sort((postA, postB) => postB.createdAt.localeCompare(postA.createdAt))
      .splice(6, posts.length);
  };
};

// FormPageState
const FormPageState = function () {
  this.displayView = function () {
    $("[data-nav-form]").classList.add("nav__item--active");
    $("[data-nav-home]").classList.remove("nav__item--active");

    const formTemplate = $("#formPostTemplate").content;

    $("#mainContainer").appendChild(formTemplate.cloneNode(true));
  };

  this.editPost = function (postId) {
    const post = getPostById(postId);

    const formTemplate = $("#formPostTemplate").content;

    $("[data-input-title]", formTemplate).value = post.title;
    $("[data-input-image]", formTemplate).value = post.img;
    $("[data-input-tags]", formTemplate).value = post.tags;
    $("[data-input-description]", formTemplate).textContent = post.description;

    $("#mainContainer").appendChild(formTemplate.cloneNode(true));
  };

  this.savePost = function (post) {
    const posts = getPosts();
    setPosts(posts, post);
  };

  this.formValidation = function ({ title, img, description, tags }) {
    return title !== "" && img !== "" && description !== "" && tags !== "";
  };
};

// ViewPostState
const ViewPostState = function () {
  this.displayView = function (post) {
    const postViewTemplate = $("#postViewTemplate").content;

    $(".post__img", postViewTemplate).setAttribute("src", post.img);
    $(".post__title", postViewTemplate).textContent = post.title;
    $(".post__tags", postViewTemplate).textContent = post.tags;
    $(".post__description", postViewTemplate).textContent = post.description;
    $("[data-form-delete]", postViewTemplate).setAttribute(
      "data-post-id",
      post.id
    );
    $("[data-form-edit]", postViewTemplate).setAttribute(
      "data-post-id",
      post.id
    );

    $("#mainContainer").appendChild(postViewTemplate.cloneNode(true));
  };

  this.displaySinglePost = function (post) {
    this.displayView(post);
  };
};

// Initial State
const page = new PageState();
page.displayView();

// Event Listener

$("[data-nav-home]").addEventListener("click", () => {
  page.changeState(new homePageState());
  page.displayView();
});

$("[data-nav-form]").addEventListener("click", () => {
  page.changeState(new FormPageState());
  page.displayView();
});

$("#mainContainer").addEventListener("click", (e) => {
  if (e.target.attributes["data-post-reference"]) {
    page.changeState(new ViewPostState());
    page.displaySinglePost(
      getPostById(e.target.attributes["data-post-id"].value)
    );
  } else if (e.target.attributes["data-form-save"]) {
    e.preventDefault();

    const objPost = {
      id: Date.now(),
      createdAt: new Date().toLocaleDateString(),
      title: $("[data-input-title]").value,
      img: $("[data-input-image]").value,
      tags: $("[data-input-tags]").value,
      description: $("[data-input-description]").value,
    };

    if (page.formValidation(objPost)) {
      page.savePost(objPost);
      page.changeState(new homePageState());
      page.displayView();
    } else {
      alert("You must complete the fields.");
    }
  } else if (e.target.attributes["data-form-edit"]) {
    const postId = e.target.attributes["data-post-id"].value;
    page.changeState(new FormPageState());
    page.editPost(postId);
    deletePost(postId);
  } else if (e.target.attributes["data-form-delete"]) {
    if (confirm("You sure, you want to delete this post?")) {
      deletePost(e.target.attributes["data-post-id"].value);
      page.changeState(new homePageState());
      page.displayView();
    }
  }

  e.stopPropagation();
});
