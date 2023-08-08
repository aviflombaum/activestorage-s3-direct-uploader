import { Controller } from "@hotwired/stimulus";
import { DirectUpload } from "@rails/activestorage";
import { post } from "@rails/request.js";

class Upload {
  constructor(file) {
    // Here's where we will instantiate the DirectUpload instance.
  }

  process() {
    // Here's where we will actually kick off the upload process.
    console.log(this);
  }
}

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
    [...files].forEach((f) => {
      new Upload(f).process();
    });
  }

  uploadFile(file) {
    const upload = new DirectUpload(file, "/rails/active_storage/direct_uploads");

    this.insertUpload(upload);

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

  insertUpload(upload) {
    const fileUpload = document.createElement("div");

    fileUpload.id = `upload_${upload.id}`;
    fileUpload.className = "p-3 border-b";

    fileUpload.textContent = upload.file.name;

    const progressWrapper = document.createElement("div");
    progressWrapper.className = "relative h-4 overflow-hidden rounded-full bg-secondary w-[100%]";
    fileUpload.appendChild(progressWrapper);

    const progressBar = document.createElement("div");
    progressBar.className = "progress h-full w-full flex-1 bg-primary";
    progressBar.style = "transform: translateX(-100%);";
    progressWrapper.appendChild(progressBar);

    const uploadList = document.querySelector("#uploads");
    uploadList.appendChild(fileUpload);
  }
}
