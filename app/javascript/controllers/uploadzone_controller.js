import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="uploadzone"
export default class extends Controller {
  static targets = ["fileInput"];
  connect() {}

  trigger() {
    this.fileInputTarget.click();
  }
}
