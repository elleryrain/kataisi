const formSubmitBtn = document.querySelector("button");
formSubmitBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  const formData = new FormData();
  const inputPics = document.querySelector("#bikeImages");
  console.log(inputPics.files);
  const modelBicycleInput = document.querySelector("#bikeName");
  const descBicycleInput = document.querySelector("#bikeDescription");
  console.log(modelBicycleInput.value, descBicycleInput.value);

  let idx = 0;
  for (const file of inputPics.files) {
    console.log(123, file);
    formData.append("file" + ++idx, file); // "files[]" для массива (опционально)
  }
  // console.log(inputPics.files);
  formData.append("files", inputPics.files);

  formData.append("model", modelBicycleInput.value);
  formData.append("desc", descBicycleInput.value);
  console.log(formData);

  const res = await axios.post("http://localhost:5000/bike", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  console.log(res);
});
