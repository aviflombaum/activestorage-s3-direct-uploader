import { Controller } from "@hotwired/stimulus";
import { DirectUpload } from "@rails/activestorage";
import { post } from "@rails/request.js";

export default class extends Controller {
  static targets = ["fileInput"];
  connect() {
    this.element.addEventListener("dragover", this.preventDragDefaults);
    this.element.addEventListener("dragenter", this.preventDragDefaults);
  }

  disconnect() {
    this.element.removeEventListener("dragover", this.preventDragDefaults);
    this.element.removeEventListener("dragenter", this.preventDragDefaults);
  }

  preventDragDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  trigger() {
    this.fileInputTarget.click();
  }

  acceptFiles(event) {
    event.preventDefault();
    const files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    [...files].forEach(this.uploadFile);
  }

  uploadFile(file) {
    const upload = new DirectUpload(file, "/rails/active_storage/direct_uploads");
    upload.create((error, blob) => {
      if (error) {
        // Handle the error
      } else {
        const trackData = { track: { filename: blob.filename }, signed_blob_id: blob.signed_id };

        post("/tracks", {
          body: trackData,
          contentType: "application/json",
          responseKind: "json",
        });
      }
    });
  }
}
