// import React, { useState } from "react";
// import Modal from "../../modal";
// import axios from "axios";
// import Toast from "../../toast";
// import Loader from "../../loader";
// import { FaPlus, FaTrash } from "react-icons/fa";
// import "./style.css";
// import { useParams } from "react-router-dom";

// function AddLecture({ getFunction, openModal, setOpenModal , toast , setToast }) {
//   const [lectureData, setLectureData] = useState({
//     subject_name: "",
//     subject_image: null,
//     subject_description: "",
//     type: "new", // assuming 'new' type for demonstration
//     subject_id: 0,
//     loading: false,
//   });
//   const { lecture, pack, year, group } = useParams();

//   const handleImageChange = (e) => {
//     setLectureData({ ...lectureData, subject_image: e.target.files[0] });
//   };

//   const removeImage = () => {
//     setLectureData({ ...lectureData, subject_image: null });
//   };

//   const saveNewLecture = (e) => {
//     e.preventDefault();

//     let col_name = lectureData.subject_name.trim();

//     if (!col_name && lectureData.type === "new") {
//       setToast({ show: true, message: "يجب إدخال إسم المادة" });
//       return;
//     }

//     if (!lectureData?.loading) {
//       setLectureData({ ...lectureData, loading: true });

//       const formData = new FormData();
//       formData.append("subject_name", col_name);
//       if (lectureData.subject_image) {
//         formData.append("image", lectureData.subject_image, "avatar.png"); // assuming filename
//       }
//       formData.append("subject_description", lectureData.subject_description);
//       formData.append("package_id", pack); // Replace with actual package_id
//       formData.append("group_id", group); // Replace with actual group_id
//       formData.append("type", "new");
//       formData.append(
//         "subject_id",
//         lectureData.type === "new" ? "0" : lectureData.subject_id
//       );
//       formData.append("have_image", lectureData.subject_image ? "1" : "0");

//       axios
//         .post(
//           "https://camp-coding.online/Teacher_App_2024/Mahmoud_Ammar/doctor/home/add_leceture.php",
//           formData,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         )
//         .then((res) => {
//           console.log(res)
//           if (res.data !== "error") {
//             setToast({
//               type: "success",
//               show: true,
//               message: "تمت الإضافة بنجاح",
//             });
//             setOpenModal(false);
//             getFunction();
//             setLectureData({
//               subject_name: "",
//               subject_description: "",
//               subject_image: null,
//               type: "new",
//               subject_id: 0,
//               loading: false,
//               lec_arrangement:""
//             });
            
//           } else {
//             setToast({
//               show: true,
//               message: "حدث خطأ ما من فضلك حاول مره اخرى",
//             });
//           }
//         })
//         .catch((err) => {
//           setToast({ show: true, message: "حدث خطأ ما من فضلك حاول مره اخرى" });
//           console.error(err);
//         })
//         .finally(() => {
//           setLectureData({ ...lectureData, loading: false , subject_name:"",subject_description:"",subject_image: null,
//             type: "new",
//             subject_id: 0,
//           lec_arrangement:"" });
//         });
//     }
//   };

//   return (
//     <Modal
//       close={setOpenModal}
//       footer={false}
//       title={"اضافة محاضره"}
//       visible={openModal}
//     >
//       <form onSubmit={(e) => saveNewLecture(e)} className="animated-form">
//         <div className="form-group">
//           <label htmlFor="lectureName" className="form-label">
//             اسم المحاضره
//           </label>
//           <input
//             type="text"
//             value={lectureData.subject_name}
//             id="lectureName"
//             placeholder="ادخل اسم المحاضره"
//             onChange={(e) =>
//               setLectureData({ ...lectureData, subject_name: e.target.value })
//             }
//             className="form-input"
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="lecturenumber" className="form-label">
//             رقم المحاضره
//           </label>
//           <input
//             type="number"
//             onWheel={(e) => e.target.blur()}
//             id="lecturenumber"
//             value={lectureData.lec_arrangement}
//             placeholder="ادخل رقم المحاضره"
//             onChange={(e) =>
//               setLectureData({
//                 ...lectureData,
//                 lec_arrangement: e.target.value,
//               })
//             }
//             className="form-input"
//           />
//         </div>{" "}
//         {/* <div className="form-group">
//           <label htmlFor="lectureImage" className="form-label">
//             صوره المحاضره (اختياري)
//           </label>
//           <input
//             type="file"
//             id="lectureImage"
//             onChange={handleImageChange}
//             className="form-input"
//           />
//           {lectureData.image && (
//             <div className="image-preview">
//               <img
//                 src={URL.createObjectURL(lectureData.image)}
//                 alt="Lecture Preview"
//               />
//               <button
//                 type="button"
//                 onClick={removeImage}
//                 className="remove-image-btn"
//               >
//                 <FaTrash />
//               </button>
//             </div>
//           )}
//         </div> */}
//         <div className="form-group">
//           <label htmlFor="lectureDescription" className="form-label">
//             الوصف
//           </label>
//           <textarea
//           value={lectureData.subject_description}
//             id="lectureDescription"
//             placeholder="ادخل وصف المحاضره"
//             onChange={(e) =>
//               setLectureData({ ...lectureData, subject_description: e.target.value })
//             }
//             className="form-input"
//             rows="4"
//           />
//         </div>
//         <div className="form-footer">
//           {lectureData?.loading ? (
//             <Loader />
//           ) : (
//             <button type="submit" className="form-submit-btn">
//               حفظ
//             </button>
//           )}
//         </div>
//       </form>
//     </Modal>
//   );
// }

// export default AddLecture;


import React, { useState } from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";
import { FaPlus } from "react-icons/fa";
import "./style.css";
import { useParams } from "react-router-dom";
import { docUrl, secondUrl } from "../../../utils/baseUrl";

function AddLecture({ getFunction, openModal, setOpenModal , toast , setToast }) {
  const [dayData, setDayData] = useState({
    day_name: "",
    day_description: "",
    loading: false,
  });


  const { pack, group, lecture } = useParams();
  console.log(lecture);
  const saveNewDay = async (e) => {
    e.preventDefault();

    const { day_name, day_description } = dayData;

    if (day_name.trim() === "") {
      alert("يجب إدخال اسم المحاضره .");
      return;
    }

    setDayData({ ...dayData, loading: true });

    const formDataObj = new FormData();
    formDataObj.append("lec_title", day_name);
    formDataObj.append("lec_description", day_description);
    formDataObj.append("package_id", pack);
    formDataObj.append("group_id", group);
    formDataObj.append("lecture_price", "120");
    formDataObj.append("lec_sub_id", 28);
    formDataObj.append(
      "lec_arrangement ",
      dayData.lec_arrangement ? dayData.lec_arrangement : 0
    );

    try {
      const userData = JSON.parse(localStorage.getItem("moreenglishlogin"));
      formDataObj.append("user_id", userData?.user_id);
      const response = await fetch(docUrl+"/home/add_leceture.php", {
        method: "POST",
        body: JSON.stringify({
          lec_title: day_name,
          lec_descriprion: day_description,
          package_id: pack,
          group_id: group,
          lecture_price: "120",
          lec_sub_id: 28,
          lec_arrangement: dayData.lec_arrangement ? dayData.lec_arrangement : 0
        }),
      });

      const data = await response.text();
      setDayData({ ...dayData, loading: false });
console.log(data)
      if (data.trim() == '"success"') {
        setToast({type:"success",message:"تم اضافه المحاضره بنجاح"});
        setOpenModal(false);
        getFunction();
        setDayData({
          day_name: "",
    day_description: "",
    lec_arrangement:"",
    loading: false,
        })
        alert("تمت إضافة المحاضره بنجاح");
      } else {
        alert("حدث خطأ ما من فضلك حاول مره اخرى");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ ما من فضلك حاول مره اخرى");
    } finally {
      setDayData({ ...dayData, day_name: "",
        day_description: "",
        lec_arrangement:"",
        loading: false, });
    }
  };

  return (
    <>
    <Modal
      close={() => setOpenModal(false)}
      footer={false}
      title={"اضافة محاضره"}
      visible={openModal}
    >
      <form onSubmit={saveNewDay} className="animated-form">
        <div className="form-group">
          <label htmlFor="dayName" className="form-label">
             اسم المحاضره
          </label>
          <input
            type="text"
            id="dayName"
            placeholder="ادخل اسم المحاضره"
            value={dayData.day_name}
            onChange={(e) =>
              setDayData({ ...dayData, day_name: e.target.value })
            }
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="dayName" className="form-label">
            رقم المحاضره
          </label>
          <input
            type="number"
            onWheel={(e) => e.target.blur()}
            id="dayName"
            placeholder="ادخل رقم المحاضره"
            value={dayData.lec_arrangement}
            onChange={(e) =>
              setDayData({ ...dayData, lec_arrangement: e.target.value })
            }
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="dayDescription" className="form-label">
             وصف المحاضره
          </label>
          <input
            type="text"
            id="dayDescription"
            placeholder="ادخل وصف المحاضره"
            value={dayData.day_description}
            onChange={(e) =>
              setDayData({ ...dayData, day_description: e.target.value })
            }
            className="form-input"
          />
        </div>
        <div className="form-footer">
          {dayData.loading ? (
            <Loader />
          ) : (
            <button type="submit" className="form-submit-btn">
              حفظ
            </button>
          )}
        </div>

      </form>
    </Modal>
   <></>
    </>
  );
}

export default AddLecture;
