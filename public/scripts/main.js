const formSubmitBtn = document.querySelector("button");
formSubmitBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  const formData = new FormData();
  const inputPics = document.querySelector("#bikeImages");
  console.log(inputPics.files);
  const modelBicycleInput = document.querySelector("#bikeName");
  const descBicycleInput = document.querySelector("#bikeDescription");
  console.log(modelBicycleInput.value, descBicycleInput.value);
  const phoneInput = document.querySelector("#phone");
  let idx = 0;
  for (const file of inputPics.files) {
    console.log(123, file);
    formData.append("file" + ++idx, file);
  }
  // console.log(inputPics.files);
  formData.append("files", inputPics.files);

  formData.append("model", modelBicycleInput.value);
  formData.append("desc", descBicycleInput.value);
  formData.append("phone", phoneInput.value);
  console.log(formData);

  const res = await axios.post("http://localhost:5000/bike", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  console.log(res);
});
