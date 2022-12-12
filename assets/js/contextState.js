import { $ } from "./componentSelector.js";
import { getPosts, setPosts, getPostById, getPostByTitle } from "./storage.js";

// Our context

export const PageState = function () {
  let currentState = new HomePageState();

  this.init = function () {
    this.changeState(new HomePageState());
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

  this.displaySearchPosts = function (postTitle) {
    currentState.displaySearchPosts(postTitle);
  };
};

// HomePageState

export const HomePageState = function () {
  this.displayView = function () {
    $("[data-nav-home]").classList.add("nav__item--active");
    $("[data-nav-form]").classList.remove("nav__item--active");

    $("#mainContainer").innerHTML = "";

    const lastPostsContainerTemplate = $("#lastPostsContainerTemplate").content;
    $("#lastPostsContainer", lastPostsContainerTemplate).innerHTML = "";

    const postsContainerTemplate = $("#postsContainerTemplate").content;
    $("#allPostsContainer", postsContainerTemplate).innerHTML = "";

    this.lastPosts(getPosts()).forEach((post) => {
      $("#lastPostsContainer", lastPostsContainerTemplate).appendChild(
        this.createCard(post)
      );
    });

    this.remainingPosts(getPosts()).forEach((post) => {
      $("#allPostsContainer", postsContainerTemplate).appendChild(
        this.createCard(post)
      );
    });

    $("#mainContainer").appendChild(lastPostsContainerTemplate.cloneNode(true));
    $("#mainContainer").appendChild(postsContainerTemplate.cloneNode(true));
  };

  this.createCard = function (post) {
    const cardTemplate = $("#cardTemplate").content;
    $(".card__img", cardTemplate).setAttribute("src", post.img);
    $(".card__title", cardTemplate).textContent = post.title;
    $(".card__title", cardTemplate).setAttribute("data-post-id", post.id);
    $(".card__description", cardTemplate).textContent = post.description;
    $(".card__tags", cardTemplate).textContent = post.tags;

    return cardTemplate.cloneNode(true);
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

  this.displaySearchPosts = function (postTitle) {
    if (postTitle === "") {
      this.displayView();
      return;
    }

    const postsContainerTemplate = $("#postsContainerTemplate").content;
    $("#allPostsContainer", postsContainerTemplate).innerHTML = "";

    getPostByTitle(postTitle).forEach((post) => {
      $("#allPostsContainer", postsContainerTemplate).appendChild(
        this.createCard(post)
      );
    });

    $("#mainContainer").innerHTML = "";
    $("#mainContainer").appendChild(postsContainerTemplate.cloneNode(true));
  };
};

// FormPageState
export const FormPageState = function () {
  this.displayView = function () {
    $("[data-nav-form]").classList.add("nav__item--active");
    $("[data-nav-home]").classList.remove("nav__item--active");

    const formTemplate = $("#formPostTemplate").content;
    $("[data-input-title]", formTemplate).value = "";
    $("[data-input-image]", formTemplate).value = "";
    $("[data-input-tags]", formTemplate).value = "";
    $("[data-input-description]", formTemplate).textContent = "";

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
    return (
      title.trim() !== "" &&
      img.trim() !== "" &&
      description.trim() !== "" &&
      tags.trim() !== ""
    );
  };
};

// ViewPostState
export const ViewPostState = function () {
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
