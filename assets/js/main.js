import { $ } from "./componentSelector.js";
import {
  PageState,
  ViewPostState,
  FormPageState,
  HomePageState,
} from "./contextState.js";
import { debounce } from "./debouce.js";
import { deletePost, getPostById } from "./storage.js";

(() => {
  // Initial State
  const page = new PageState();
  page.displayView();

  // Event Listener

  $("[data-nav-home]").addEventListener("click", () => {
    page.changeState(new HomePageState());
    page.displayView();
  });

  $("[data-nav-form]").addEventListener("click", () => {
    page.changeState(new FormPageState());
    page.displayView();
  });

  const searchPostDebounce = debounce(page.displaySearchPosts);

  $("[data-search-input]").addEventListener("input", (e) => {
    searchPostDebounce(e.target.value);
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
        page.changeState(new HomePageState());
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
        page.changeState(new HomePageState());
        page.displayView();
      }
    }

    e.stopPropagation();
  });
})();
