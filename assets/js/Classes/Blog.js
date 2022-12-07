import { UserInterface } from "./UI.js";
import { LoginState } from "./States.js";
// Main context

class Blog {
  #state;

  constructor() {
    this.state = new LoginState(this);

    UI = new UserInterface();

    UI.loginButton.addEventListener("click", this.clickLogin);
  }

  set changeState(state) {
    this.state = state;
  }

  clickLogin() {
    this.state.clickLogin();
  }

  displayInterface() {
    this.state.displayInterface();
  }

  clickPost() {
    this.state.clickPost();
  }

  goHome() {
    this.state.goHome();
  }
}
