import { docUrl, secondUrl } from "../baseUrl";

export const uploadPdf = async (file) => {
  const formData = new FormData();
  formData?.append("file_attachment", file);
  const response = await fetch(docUrl + "/home/upload_pdf.php", {
    method: "POST",
    body: formData,

  }).catch(e=>console.log(e));

  const url = await response.json();
  return url?.message;
};
