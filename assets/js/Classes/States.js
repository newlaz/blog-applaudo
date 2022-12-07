/*
 * "States is an abstract class that defines the interface for the concrete states that will be used in
 * the state pattern."
 */

export class States {
  _blog;

  constructor(blog) {
    if (this.constructor === States) {
      throw new Error("Abstract classes can't be instantiated.");
    }

    this._blog = blog;
  }

  clickLogin() {
    throw new Error("Method 'clickLogin()' must be implemented.");
  }

  displayInterface() {
    throw new Error("Method 'displayInterface()' must be implemented.");
  }

  clickPost() {
    throw new Error("Method 'displayInterface()' must be implemented.");
  }

  goHome() {
    throw new Error("Method 'goHome()' must be implemented.");
  }
}

export class LoginState extends States {
  clickLogin() {
    if (Authenticator === true) {
      // You can pase
      this._blog.changeState(new HomeState(this._blog));
    }
  }

  displayInterface() {
    // Login form UI
  }

  clickPost() {
    // You must be logged in to do so
  }

  goHome() {
    // You must be logged in to do so
  }
}

export class HomeState extends States {
  clickLogin() {
    // You're already logged
  }

  displayInterface() {
    // Load home page
  }

  clickPost() {
    // You must be logged in to do so
    this._blog.changeState(new PostState(this._blog));
  }

  goHome() {
    // You're already on Home
  }
}

export class PostState extends States {
  clickLogin() {
    // You're already logged
  }

  displayInterface() {
    // Load post page
  }

  clickPost() {
    // Edit Post
    this._blog.changeState(new EditPostState(this._blog));
  }

  goHome() {
    this._blog.changeState(new HomeState(this._blog));
    this._blog.displayInterface();
  }
}

export class EditPostState extends States {
  clickLogin() {
    // You're already logged
  }

  displayInterface() {
    // Load edit post page
  }

  clickPost() {
    // Save post
    this._blog.changeState(new PostState(this._blog));
  }

  goHome() {
    this._blog.changeState(new HomeState(this._blog));
    this._blog.displayInterface();
  }
}
