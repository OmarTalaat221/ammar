// import React, { useState } from "react";
// import Modal from "../../../modal";
// import axios from "axios";
// import "./style.css";
// import Toast from "../../../toast";
// import Loader from "../../../loader";
// import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import { docUrl } from "../../../../utils/baseUrl";

// function AddVideo({ getFunction, openModal, setOpenModal , toast , setToast}) {
//   const { day, yearId } = useParams();
//   const [search] = useSearchParams()
//   const [imgFile , setImgFile] = useState("");
//   const [img , setImg] = useState(null);
//   const [videoData, setVideoData] = useState({
//     video_title: "",
//     viemo_id: "",
//     video_description: "",
//     video_image_link:
//       "",
//     lec_id: day,
//     generation_id: yearId,
//     loading: false,
//   });
// const navigate = useNavigate()
//   const saveNewVideo = async (e) => {
//     e.preventDefault();

//     if (videoData.video_title.trim() === "") {
//       setToast({ show: true, message: "الرجاء كتابة عنوان للفيديو" });
//       return;
//     }

//     if (videoData.viemo_id.trim() === "") {
//       setToast({ show: true, message: "الرجاء كتابة ال ID الخاص بالفيديو" });
//       return;
//     }

//     setVideoData({ ...videoData, loading: true });

//     const formData = new FormData();
//     formData.append("image",imgFile)

//     axios.post(`${docUrl}/home/image_uplouder.php`,formData)
//     .then(res => {
//       if(res?.data) {
//             const dataToSend = {
//       video_title: videoData.video_title,
//       lec_id: videoData.lec_id,
//       video_description: videoData.video_description || "",
//       viemo_id: videoData.viemo_id,
//       generation_id: videoData.generation_id,
//       video_image_link: res?.data,
//     type:"laptop"
//   };

//   console.log("vidDATA" , dataToSend)

//   axios.post(
//     "https://camp-coding.online/Teacher_App_2024/Mahmoud_Ammar/doctor/home/upload_video_data.php",
//     dataToSend
//   ).then(res => {
//     if(res?.data !="error") {
//       setToast({type:"success", show: true, message: "تمت الإضافة بنجاح" });
//       setOpenModal(false);
//       navigate("?lec_videos_ids="+res.data)
//       setVideoData({
//         video_title: "",
//         viemo_id: "",
//         video_description: "",
//         video_image_link:
//           "",
//         lec_id: day,
//         generation_id: yearId,
//         loading: false,
//       })
//       // window.location.reload()
//       getFunction();
//     }else {
//       setToast({ show: true, message: "حدث خطأ ما من فضلك حاول مره اخرى" }); 
//     }
//   }).catch(e => {
//     console.error(e);
//     setToast({ show: true, message: "حدث خطأ ما من فضلك حاول مره اخرى" });
//   }).finally(() => setVideoData({ ...videoData,  video_title: "",
//     viemo_id: "",
//     video_description: "",
//     video_image_link:
//       "",
//     lec_id: day,
//     generation_id: yearId,
//     loading: false,}))
//   // try {
//   //   const response = ;
//   //   console.log(response)
//   //   // return
//   //   if (response.data != 'error') {
//   //     setToast({type:"success", show: true, message: "تمت الإضافة بنجاح" });
//   //     setOpenModal(false);
//   //     navigate("?lec_videos_ids="+response.data)
//   //     window.location.reload()
//   //     getFunction();
//   //   } else {
//   //     setToast({ show: true, message: "حدث خطأ ما من فضلك حاول مره اخرى" });
//   //   }
//   // } catch (error) {
//   //   console.error(error);
//   //   setToast({ show: true, message: "حدث خطأ ما من فضلك حاول مره اخرى" });
//   // } finally {
//   //   setVideoData({ ...videoData, loading: false });
//   // }
   
//       }
//     }).catch(e => console.log(e))

//   //   const dataToSend = {
//   //     video_title: videoData.video_title,
//   //     lec_id: videoData.lec_id,
//   //     video_description: videoData.video_description || " ",
//   //     viemo_id: videoData.viemo_id,
//   //     generation_id: videoData.generation_id,
//   //     video_image_link: videoData.video_image_link,
//   //   type:"laptop"
//   // };

//   //   try {
//   //     const response = await axios.post(
//   //       "https://camp-coding.online/Teacher_App_2024/Mahmoud_Ammar/doctor/home/upload_video_data.php",
//   //       dataToSend
//   //     );
//   //     console.log(response)
//   //     // return
//   //     if (response.data != 'error') {
//   //       setToast({type:"success", show: true, message: "تمت الإضافة بنجاح" });
//   //       setOpenModal(false);
//   //       navigate("?lec_videos_ids="+response.data)
//   //       window.location.reload()
//   //       getFunction();
//   //     } else {
//   //       setToast({ show: true, message: "حدث خطأ ما من فضلك حاول مره اخرى" });
//   //     }
//   //   } catch (error) {
//   //     console.error(error);
//   //     setToast({ show: true, message: "حدث خطأ ما من فضلك حاول مره اخرى" });
//   //   } finally {
//   //     setVideoData({ ...videoData, loading: false });
//   //   }
//   };

//   return (
//     <>
//     <Modal
//       close={() => setOpenModal(false)}
//       footer={false}
//       title={"اضافة فيديو"}
//       visible={openModal}
//     >
//       <form onSubmit={saveNewVideo} className="animated-form">
//         <div className="form-group">
//           <label htmlFor="videoTitle" className="animated-label">
//             ادخل عنوان الفيديو
//           </label>
//           <input
//             type="text"
//             id="videoTitle"
//             placeholder="عنوان الفيديو"
//             value={videoData.video_title}
//             onChange={(e) =>
//               setVideoData({ ...videoData, video_title: e.target.value })
//             }
//             className="animated-input"
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="viemoId" className="animated-label">
//             ادخل رقم الفيديو (Vimeo ID)
//           </label>
//           <input
//           onWheel={(e) => e.target.blur()}
//             type="number"
//             id="viemoId"
//             placeholder="Vimeo ID"
//             value={videoData.viemo_id}
//             onChange={(e) =>
//               setVideoData({ ...videoData, viemo_id: e.target.value })
//             }
//             className="animated-input"
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="videoDescription" className="animated-label">
//             ادخل الوصف
//           </label>
//           <textarea
//             id="videoDescription"
//             placeholder="الوصف"
//             value={videoData.video_description}
//             onChange={(e) =>
//               setVideoData({ ...videoData, video_description: e.target.value })
//             }
//           ></textarea>
//         </div>
//         <div className="form-group">
//           <label htmlFor="videoImage" className="animated-label">
//             ادخل لينك الصوره
//           </label>
//           <input
//             type="file"
//             accept="image/*"
//             id="videoImage"
//             placeholder="لينك الصوره"
//             // value={videoData.video_image_link}
//             onChange={(e) =>
//              {
//               setImg(URL.createObjectURL(e.target.files[0]))
//               setImgFile(e.target.files[0])
//              }
//               // setVideoData({ ...videoData, video_image_link: e.target.value })
//             }
//             className="animated-input"
//           />
//         </div>
//         <div className="rowEndDiv">
//           {videoData.loading ? (
//             <Loader />
//           ) : (
//             <button type="submit" className="btn animated-btn btn-success">
//               حفظ
//             </button>
//           )}
//         </div>

//       </form>
//     </Modal>
//     <>
//     </>
//     </>
//   );
// }

// export default AddVideo;


import React, { useState } from "react";
import Modal from "../../../modal";
import axios from "axios";
import "./style.css";
import Toast from "../../../toast";
import Loader from "../../../loader";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { docUrl } from "../../../../utils/baseUrl";

function AddVideo({ getFunction, openModal, setOpenModal, toast, setToast  , setGetNew}) {
  const location = useLocation();
  const { lec_id, yearId } = useParams();
  const [search] = useSearchParams();
  const [imgFile, setImgFile] = useState("");
  const [img, setImg] = useState(null);
  const defaultImage = "https://camp-coding.online/Teacher_App_2024/Mahmoud_Ammar/doctor/home/images/1278756259_1731855706item_img.jpeg"; // رابط الصورة الافتراضية
  const [videoData, setVideoData] = useState({
    video_title: "",
    viemo_id: "",
    video_description: "",
    video_image_link: "",
    lec_id: lec_id,
    generation_id: yearId,
    loading: false,
  });
  const navigate = useNavigate();

  const saveNewVideo = async (e) => {
    e.preventDefault();

    if (videoData.video_title.trim() === "") {
      setToast({ show: true, message: "الرجاء كتابة عنوان للفيديو" });
      return;
    }

    if (videoData.viemo_id.trim() === "") {
      setToast({ show: true, message: "الرجاء كتابة ال ID الخاص بالفيديو" });
      return;
    }

    setVideoData({ ...videoData, loading: true });

    let imageLink = defaultImage;

    if (imgFile) {
      const formData = new FormData();
      formData.append("image", imgFile);

      try {
        const imgResponse = await axios.post(
          `${docUrl}/home/image_uplouder.php`,
          formData
        );
        if (imgResponse?.data) {
          imageLink = imgResponse.data;
        }
      } catch (error) {
        console.error("Image upload error:", error);
        setToast({ show: true, message: "فشل رفع الصورة، سيتم استخدام الصورة الافتراضية." });
      }
    }

    const dataToSend = {
      video_title: videoData.video_title,
      lec_id: videoData.lec_id,
      video_description: videoData.video_description || "",
      viemo_id: videoData.viemo_id,
      generation_id: videoData.generation_id,
      video_image_link: imageLink,
      type: "laptop",
    };

    try {
      const response = await axios.post(
        "https://camp-coding.online/Teacher_App_2024/Mahmoud_Ammar/doctor/home/upload_video_data.php",
        dataToSend
      );
      if (response?.data !== "error") {
        setToast({ type: "success", show: true, message: "تمت الإضافة بنجاح" });
        setOpenModal(false);
        setGetNew(response?.data)
        
        getFunction();
        setVideoData({
          video_title: "",
          viemo_id: "",
          video_description: "",
          video_image_link: "",
          lec_id: lec_id,
          generation_id: yearId,
          loading: false,
        });
      } else {
        setToast({ show: true, message: "حدث خطأ ما من فضلك حاول مرة أخرى" });
      }
    } catch (error) {
      console.error(error);
      setToast({ show: true, message: "حدث خطأ ما من فضلك حاول مرة أخرى" });
    } finally {
      setVideoData({ ...videoData, loading: false  , video_title:"",video_description:"" , viemo_id:"",video_image_link: ""});
    }
  };

  return (
    <>
      <Modal
        close={() => setOpenModal(false)}
        footer={false}
        title={"اضافة فيديو"}
        visible={openModal}
      >
        <form onSubmit={saveNewVideo} className="animated-form">
          <div className="form-group">
            <label htmlFor="videoTitle" className="animated-label">
              ادخل عنوان الفيديو
            </label>
            <input
              type="text"
              id="videoTitle"
              placeholder="عنوان الفيديو"
              value={videoData.video_title}
              onChange={(e) =>
                setVideoData({ ...videoData, video_title: e.target.value })
              }
              className="animated-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="viemoId" className="animated-label">
              ادخل رقم الفيديو (Vimeo ID)
            </label>
            <input
              onWheel={(e) => e.target.blur()}
              type="number"
              id="viemoId"
              placeholder="Vimeo ID"
              value={videoData.viemo_id}
              onChange={(e) =>
                setVideoData({ ...videoData, viemo_id: e.target.value })
              }
              className="animated-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="videoDescription" className="animated-label">
              ادخل الوصف
            </label>
            <textarea
              id="videoDescription"
              placeholder="الوصف"
              value={videoData.video_description}
              onChange={(e) =>
                setVideoData({
                  ...videoData,
                  video_description: e.target.value,
                })
              }
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="videoImage" className="animated-label">
              اختر صورة الفيديو
            </label>
            <input
              type="file"
              accept="image/*"
              id="videoImage"
              onChange={(e) => {
                setImg(URL.createObjectURL(e.target.files[0]));
                setImgFile(e.target.files[0]);
              }}
              className="animated-input"
            />
          </div>
          <div className="rowEndDiv">
            {videoData.loading ? (
              <Loader />
            ) : (
              <button type="submit" className="btn animated-btn btn-success">
                حفظ
              </button>
            )}
          </div>
        </form>
      </Modal>
    </>
  );
}

export default AddVideo;
