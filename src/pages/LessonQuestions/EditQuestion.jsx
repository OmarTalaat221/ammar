// import React, { useState } from "react";
// import axios from "axios";
// import { FaPlus, FaTrash } from "react-icons/fa";
// import { useParams } from "react-router-dom";
// import { docUrl } from "../../utils/baseUrl";
// import Loader from "../../components/loader";
// import Toast from "../../components/toast";
// import Modal from "../../components/modal";
// import { CiCirclePlus } from "react-icons/ci";
// import { IoClose } from "react-icons/io5";
// import { deleteIcon } from "../../assets/svgIcons";

// function EditQuestion({ getFunction, openModal, setOpenModal,rowData,setRowData,imgEdit,setImgEdit, imgUrlEdit,setImgUrlEdit,edQuesList,editVoice,setEdQuesList,setEditVoice}) {
//   console.log(rowData)
//   const [untiData, setUntiData] = useState({
//     name: "",
//   });

//   const [toast, setToast] = useState(false);
//   const [loading,setLoading]=useState(false)

// const {id} = useParams()
//   const saveNewUnit = async(e) => {
//     e.preventDefault();

//     console.log(e.preventDefault())
//     setLoading(true)

//       try {
//         // رفع الصورة الواحدة
//         const formDataImage = new FormData();
//         formDataImage.append('image', imgEdit); // تأكد أن `imageFile` هو ملف الصورة الواحد

//         const imageResponse = await axios.post(`${docUrl}/home/image_uplouder.php`, formDataImage);
//         // console.log(imageResponse)
//         // return
//         const image = imageResponse.data; // الحصول على رابط أو مسار الصورة

//         // رفع ملف الصوت الواحد
//         const formDataAudio = new FormData();
//         formDataAudio.append('file_attachment', editVoice); // تأكد أن `audioFile` هو الملف الصوتي المفرد

//         const audioResponse = await axios.post(`${docUrl}/home/q_bank/upload_voices.php`, formDataAudio);
//         // console.log(audioResponse) ;
//         // return
//         const audio = audioResponse.data; // الحصول على رابط أو مسار الملف الصوتي

//         // تجهيز بيانات الطلب النهائي بعد رفع الصورة والصوت
//         const requestData = {
//           question_text:rowData.question_text,
//           question_exp_text:rowData?.question_exp_text,
//           question_valid_answer:edQuesList&&edQuesList.filter(it=>it.status)[0].answer,
//           question_answers:edQuesList.map(it=>it.answer).join('//CAMP//'),
//           question_image:imgEdit!=null?image:rowData?.question_image,  // إدراج الصورة هنا
//           question_exp_voice:editVoice!=null?audio:rowData?.question_exp_voice,  // إدراج الصوت هنا
//           lesson_id:id,
//           question_id:rowData?.question_id
//         };

//         console.log(requestData);
//         // return
//         // إرسال الطلب النهائي إلى السيرفر
//         await axios.post(`${docUrl}/home/q_bank/edit_ques.php`, { ...requestData });

//         // استدعاء الدالة بعد الإضافة
//         getFunction();
//         // toast.success("Successfully added!");
//         setOpenModal(false);
//         setLoading(false)
//         setEditVoice(null)
//         setImgEdit(null)
//         setImgUrlEdit('')
//       } catch (error) {
//         console.error(error);
//         // toast.error("Failed to add new item.");
//       } finally {
//         setOpenModal(false);
//     setLoading(false)
//     setEditVoice(null)
//     setImgEdit(null)
//     setImgUrlEdit('')
//       }

//   };



//   const deleteImg = () =>{
//     console.log(rowData.question_image);

//     setRowData(
//       {
//         ...rowData,
//         question_image:null
//       }
//     )

// setImgUrlEdit(null)
    
    
//   }


//   const deleteVoice = () =>{
//     console.log(rowData.question_exp_voice);

//     setRowData(
//       {
//         ...rowData,
//         question_exp_voice:null
//       }
//     )

// setEditVoice(null)
    
    
//   }

//   return (
//     <Modal
//       close={setOpenModal}
//       footer={false}
//       title={"تعديل السؤال"}
//       visible={openModal}
//     >
//       <div onSubmit={(e) => saveNewUnit(e)} className="animated-form">
//         <div className="form-group">
//           <label htmlFor="packageName" className="form-label">
//           نص السؤال
//           </label>
//           <input
//             value={rowData?.question_text}
//             type="text"
//             id="packageName"
//             placeholder="نص السؤال"
//             onChange={(e) => setRowData({ ...rowData, question_text: e.target.value })}
//             className="form-input"
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="packageName" className="form-label">
//           توضيح السؤال
//           </label>
//           <textarea
//           placeholder="توضيح السؤال"
//           value={rowData?.question_exp_text}
//             onChange={(e) => setRowData({ ...rowData, question_exp_text: e.target.value })}
//             className="form-input"
//           ></textarea>
//         </div>

//         {
//           imgEdit==null ?
//           <>
//            <img style={{width:'100px'}} src={rowData?.question_image} alt="" />
//            <button className="btn-danger" onClick={deleteImg} style={{width:"fit-content",display:"flex",justifyContent:"center",alignItems:"center",borderRadius:"50%",position:"absolute",top:"250px",right:"100px"}}>{deleteIcon}</button>
//           </>
         
//           :
//           <>
//           <button className="btn-danger" onClick={deleteImg} style={{width:"fit-content",display:"flex",justifyContent:"center",alignItems:"center",borderRadius:"50%",position:"absolute",top:"250px",right:"100px"}}>{deleteIcon}</button>

// <img style={{width:'100px'}} src={imgUrlEdit} alt="" />
//           </>
          
//         }
//         <div className="form-group">
//           <label htmlFor="packageName" className="form-label">
//           صورة السؤال
//           </label>
//           <input
//             type="file"
//             id="packageName"
//             placeholder="Enter question text"
//             onChange={(e) => {
//               setImgEdit(e.target.files[0])
//               setImgUrlEdit(URL.createObjectURL(e.target.files[0]))
//             }}
//             className="form-input"
//           />
//         </div>

//         {
//           rowData.question_exp_voice==null?
//          ""
         
//           :
//           <>
//           <audio controls>
//            <source src={rowData.question_exp_voice} type="audio/mpeg" />
//          </audio>
//             <button className="btn-danger" onClick={deleteVoice} style={{width:"fit-content",display:"flex",justifyContent:"center",alignItems:"center",borderRadius:"50%",position:"absolute",bottom:"565px",right:"320px"}}>{deleteIcon}</button>
          
           
//            </>
          
//         }
      


//         {/* <button className="btn-danger" onClick={deleteVoice} style={{width:"fit-content",display:"flex",justifyContent:"center",alignItems:"center",borderRadius:"50%",position:"absolute",bottom:"565px",right:"320px"}}>{deleteIcon}</button> */}

        
//         <div className="form-group">
//           <label htmlFor="packageName" className="form-label">
//           صوت التوضيح
//           </label>
//           <input
//             type="file"
//             id="packageName"
//             placeholder="Enter question voice"
//             onChange={(e) => setEditVoice(e.target.files[0])}
//             className="form-input"
//           />
//         </div>
//         <div className="form-group">
//           <label style={{
//             display:'flex',
//             alignItems:'center',
//             justifyContent:'space-between'
//            }} htmlFor="packageName" className="form-label">
//             <p>الإجابات</p>
//             <CiCirclePlus style={{color:'green',fontSize:'32px',cursor:'pointer'}} onClick={()=>{
//               setEdQuesList([...edQuesList,{
//                 id:edQuesList[edQuesList.length-1].id+1,
//                 answer:'',
//                 status:false
//               }])
//             }}/>
//           </label>
//           {
//             edQuesList&&edQuesList.map((item,index)=>{
//               return (
//                 <div key={index} className="my-2 d-flex align-items-center justify-content-between">
//                   <div className="d-flex flex-column col-9">
//                     <label htmlFor="">إجابه</label>
//                     <input onChange={(e)=>{
//                       setEdQuesList(edQuesList.map(it=>{
//                         return {...it,answer:it.id==item.id?e.target.value:it.answer}
//                       }))
//                     }} name="answer" value={ item?.answer } className="form-label"/>
//                   </div>
//                   {

//                     <p  className="col-1 text-center cursor-pointer m-0 p-0  d-flex gap-2">
//                     {true&&  <p className="btn btn-danger p-0 m-0" onClick={()=>{
//                       setEdQuesList(edQuesList.filter(it=>it.id!=item.id))
//                     }}><IoClose style={{ color:'white',fontSize:'20px',cursor:'pointer' }}/></p>}
//                       <input style={{width:'20px',height:'20px'}} onClick={()=>{
//                         setEdQuesList(edQuesList.map((it)=>{
//                           return {...it,status:it.id==item.id?!item.status:false}
//                         }))
//                       }} type="checkbox" checked={item.status}/>
//                     </p>
//                   }
//                 </div>
//               )
//             })
//           }
//         </div>

//         <div className="form-footer">
//           {loading ? (
//             <Loader />
//           ) : (
//             <button type="submit" className="form-submit-btn">
//               حفظ
//             </button>
//           )}
//         </div>
//         {toast && (
//           <Toast message={"Please fill out all required fields"} type={"error"} onClose={setToast} />
//         )}
//       </div>
//     </Modal>
//   );
// }

// export default EditQuestion;



// import React, { useState } from "react";
// import axios from "axios";
// import { FaPlus, FaTrash } from "react-icons/fa";
// import { useParams } from "react-router-dom";
// import { docUrl } from "../../utils/baseUrl";
// import Loader from "../../components/loader";
// import Toast from "../../components/toast";
// import Modal from "../../components/modal";
// import { CiCirclePlus } from "react-icons/ci";
// import { IoClose } from "react-icons/io5";
// import { deleteIcon } from "../../assets/svgIcons";

// function EditQuestion({
//   getFunction,
//   openModal,
//   setOpenModal,
//   rowData,
//   setRowData,
//   imgEdit,
//   setImgEdit,
//   imgUrlEdit,
//   setImgUrlEdit,
//   edQuesList,
//   editVoice,
//   setEdQuesList,
//   setEditVoice,
// }) {
//   const [toast, setToast] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const { id } = useParams();

//   const saveNewUnit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Image upload
//       const formDataImage = new FormData();
//       formDataImage.append("image", imgEdit);

//       const imageResponse = await axios.post(`${docUrl}/home/image_uplouder.php`, formDataImage);
//       const image = imageResponse.data;

//       // Audio upload
//       const formDataAudio = new FormData();
//       formDataAudio.append("file_attachment", editVoice);

//       const audioResponse = await axios.post(`${docUrl}/home/q_bank/upload_voices.php`, formDataAudio);
//       const audio = audioResponse.data;
      
//       if (rowData.question_text == "") {
//         setToast({ type: "error", message: "برجاء ادخال السؤال أولا!" });
//         setLoading(false);
//         return;
//       }
    
    
//       if (edQuesList.length === 0 || edQuesList.some((answer) => !answer.answer)) {
//         setToast({ type: "error", message:  "برجاء ادخال جميع الإجابات!"  });
//         setLoading(false);
//         return;
//       }
    
//       if (!edQuesList.some((answer) => answer.status)) {
//         setToast({ type: "error", message: "برجاء اختيار إجابة صحيحة واحدة!" });
//         setLoading(false);
//         return;
//       }

//       // Final request data
//       const requestData = {
//         question_text: rowData.question_text,
//         question_exp_text: rowData?.question_exp_text,
//         question_valid_answer: edQuesList?.find((it) => it.status)?.answer,
//         question_answers: edQuesList.map((it) => it.answer).join("//CAMP//"),
//         question_image: imgEdit ? image : rowData?.question_image,
//         question_exp_voice: editVoice ? audio : rowData?.question_exp_voice,
//         lesson_id: id,
//         question_id: rowData?.question_id,
//       };

//       await axios.post(`${docUrl}/home/q_bank/edit_ques.php`, requestData);

//       // Refresh, close modal, reset states
//       getFunction();
//       setOpenModal(false);
//       setLoading(false);
//       setEditVoice(null);
//       setImgEdit(null);
//       setImgUrlEdit("");
//     } catch (error) {
//       console.error(error);
//       setToast(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteImg = () => {
//     setRowData((prev) => ({ ...prev, question_image: null }));
//     setImgUrlEdit(null);
//   };

//   const deleteVoice = () => {
//     setRowData((prev) => ({ ...prev, question_exp_voice: null }));
//     setEditVoice(null);
//   };

//   return (
//     <Modal close={setOpenModal} footer={false} title="تعديل السؤال" visible={openModal}>
//       <form onSubmit={saveNewUnit} className="animated-form">
//         <div className="form-group">
//           <label htmlFor="questionText" className="form-label">نص السؤال</label>
//           <input
//             value={rowData?.question_text || ""}
//             type="text"
//             id="questionText"
//             placeholder="نص السؤال"
//             onChange={(e) => setRowData({ ...rowData, question_text: e.target.value })}
//             className="form-input"
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="questionExplanation" className="form-label">توضيح السؤال</label>
//           <textarea
//             placeholder="توضيح السؤال"
//             value={rowData?.question_exp_text || ""}
//             onChange={(e) => setRowData({ ...rowData, question_exp_text: e.target.value })}
//             className="form-input"
//           ></textarea>
//         </div>

//         <div className="form-group">
//           <label htmlFor="questionImage" className="form-label">صورة السؤال</label>
//           <input
//             type="file"
//             id="questionImage"
//             onChange={(e) => {
//               setImgEdit(e.target.files[0]);
//               setImgUrlEdit(URL.createObjectURL(e.target.files[0]));
//             }}
//             className="form-input"
//           />
//         </div>

//         {rowData.question_image !== "error" || rowData?.question_image !=="" ? (
//           <div style={{display:"flex",gap:"5px", alignItems:"center"}}>
//             <img style={{ width: "100px" }} src={imgEdit ? imgUrlEdit : rowData.question_image} alt="" />
//             <button
//               type="button"
//               className="btn-danger"
//               onClick={deleteImg}
//               style={{
//                 width: "fit-content",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 borderRadius: "10px",
//                 height:"fit-content"
//                 // position: "absolute",
//                 // top: "250px",
//                 // right: "100px",
//               }}
//             >
//               {deleteIcon}
//             </button>
//           </div>
//         ) : null}

//         <div className="form-group">
//           <label htmlFor="explanationVoice" className="form-label">صوت التوضيح</label>
//           <input
//             type="file"
//             id="explanationVoice"
//             onChange={(e) => setEditVoice(e.target.files[0])}
//             className="form-input"
//           />
//         </div>

//         {rowData.question_exp_voice !=="Error: No file data received." || rowData?.question_exp_voice !== "" && (
//           <div style={{display:"flex",alignItems:"center",gap:"5px"}}>
//             <audio controls>
//               <source src={rowData.question_exp_voice} type="audio/mpeg" />
//             </audio>
//             <button
//               type="button"
//               className="btn-danger"
//               onClick={deleteVoice}
//               style={{
//                 width: "fit-content",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 borderRadius: "10px",
//                 height:"fit-content"
//                 // position: "absolute",
//                 // bottom: "565px",
//                 // right: "320px",
//               }}
//             >
//               {deleteIcon}
//             </button>
//           </div>
//         )}

       

//         <div className="form-group">
//           <label htmlFor="answers" className="form-label" style={{ display: "flex", justifyContent: "space-between" }}>
//             <p>الإجابات</p>
//             <CiCirclePlus
//               style={{ color: "green", fontSize: "32px", cursor: "pointer" }}
//               onClick={() => {
//                 setEdQuesList((prevList) => [
//                   ...prevList,
//                   { id: prevList[prevList.length - 1].id + 1, answer: "", status: false },
//                 ]);
//               }}
//             />
//           </label>
//           {edQuesList?.map((item, index) => (
//             <div key={index} className="my-2 d-flex align-items-center justify-content-between">
//               <div className="d-flex flex-column col-9">
//                 <label>إجابه</label>
//                 <input
//                   onChange={(e) =>
//                     setEdQuesList((prevList) =>
//                       prevList.map((it) => (it.id === item.id ? { ...it, answer: e.target.value } : it))
//                     )
//                   }
//                   name="answer"
//                   value={item?.answer || ""}
//                   className="form-label"
//                 />
//               </div>
//               <div className="col-1 text-center cursor-pointer m-0 p-0 d-flex gap-2">
//                 <button
//                   type="button"
//                   className="btn btn-danger p-0 m-0"
//                   onClick={() => setEdQuesList((prevList) => prevList.filter((it) => it.id !== item.id))}
//                 >
//                   <IoClose style={{ color: "white", fontSize: "20px" }} />
//                 </button>
//                 <input
//                   style={{ width: "20px", height: "20px" }}
//                   onClick={() =>
//                     setEdQuesList((prevList) =>
//                       prevList.map((it) => ({ ...it, status: it.id === item.id ? !it.status : false }))
//                     )
//                   }
//                   type="checkbox"
//                   checked={item.status}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="form-footer">
//           {loading ? <Loader /> : <button type="submit" className="form-submit-btn">حفظ</button>}
//         </div>
//         {toast && <Toast message="Please fill out all required fields" type="error" onClose={() => setToast(false)} />}
//       </form>
//     </Modal>
//   );
// }

// export default EditQuestion;



import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";
import { CiCirclePlus } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { docUrl } from "../../utils/baseUrl";
import Loader from "../../components/loader";
import Toast from "../../components/toast";
import Modal from "../../components/modal";
import { deleteIcon } from "../../assets/svgIcons";

function EditQuestion({
  getFunction,
  openModal,
  setOpenModal,
  rowData,
  setRowData,
  imgEdit,
  setImgEdit,
  imgUrlEdit,
  setImgUrlEdit,
  edQuesList,
  editVoice,
  setEdQuesList,
  setEditVoice,
}) {
  const [toast, setToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const saveNewUnit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Image upload
      const formDataImage = new FormData();
      formDataImage.append("image", imgEdit);

      const imageResponse = await axios.post(`${docUrl}/home/image_uplouder.php`, formDataImage);
      const image = imageResponse.data;

      // Audio upload
      const formDataAudio = new FormData();
      formDataAudio.append("file_attachment", editVoice);

      const audioResponse = await axios.post(`${docUrl}/home/q_bank/upload_voices.php`, formDataAudio);
      const audio = audioResponse.data;

      if (!rowData.question_text) {
        setToast({ type: "error", message: "برجاء ادخال السؤال أولا!" });
        setLoading(false);
        return;
      }

      if (edQuesList.length === 0 || edQuesList.some((answer) => !answer.answer)) {
        setToast({ type: "error", message: "برجاء ادخال جميع الإجابات!" });
        setLoading(false);
        return;
      }

      if (!edQuesList.some((answer) => answer.status)) {
        setToast({ type: "error", message: "برجاء اختيار إجابة صحيحة واحدة!" });
        setLoading(false);
        return;
      }

      if (edQuesList.length < 2 || edQuesList.filter(answer => answer.answer).length < 2) {
        setToast({ type: "error", message: "يجب أن يحتوي السؤال على إجابتين على الأقل!" });
        setLoading(false);
        return;
      }

      // Final request data
      const requestData = {
        question_text: rowData.question_text,
        question_exp_text: rowData?.question_exp_text,
        question_valid_answer: edQuesList?.find((it) => it.status)?.answer,
        question_answers: edQuesList.map((it) => it.answer).join("//CAMP//"),
        question_image: imgEdit ? image : rowData?.question_image,
        question_exp_voice: editVoice ? audio : rowData?.question_exp_voice,
        lesson_id: id,
        question_id: rowData?.question_id,
      };
      console.log(requestData)

      await axios.post(`${docUrl}/home/q_bank/edit_ques.php`, requestData);

      // Refresh, close modal, reset states
      getFunction();
      setOpenModal(false);
      setEditVoice(null);
      setImgEdit(null);
      setImgUrlEdit("");
    } catch (error) {
      console.error(error);
      setToast({ type: "error", message: "حدث خطأ أثناء الحفظ!" });
    } finally {
      setLoading(false);
    }
  };

  const deleteImg = () => {
    setRowData((prev) => ({ ...prev, question_image: null }));
    setImgUrlEdit(null);
  };

  const deleteVoice = () => {
    setRowData((prev) => ({ ...prev, question_exp_voice: null }));
    setEditVoice(null);
  };

  useEffect(() => {
    console.log(rowData)
  },[rowData])

  return (
    <Modal close={setOpenModal} footer={false} title="تعديل السؤال" visible={openModal}>
      <form onSubmit={saveNewUnit} className="animated-form">
        <div className="form-group">
          <label htmlFor="questionText" className="form-label">نص السؤال</label>
          <input
            value={rowData?.question_text || ""}
            type="text"
            id="questionText"
            placeholder="نص السؤال"
            onChange={(e) => setRowData({ ...rowData, question_text: e.target.value })}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="questionExplanation" className="form-label">توضيح السؤال</label>
          <textarea
            placeholder="توضيح السؤال"
            value={rowData?.question_exp_text || ""}
            onChange={(e) => setRowData({ ...rowData, question_exp_text: e.target.value })}
            className="form-input"
          ></textarea>
        </div>

        <div className="form-group">
  <label htmlFor="questionImage" className="form-label">صورة السؤال</label>
  <input
    type="file"
    id="questionImage"
    onChange={(e) => {
      setImgEdit(e.target.files[0]);
      setImgUrlEdit(URL.createObjectURL(e.target.files[0]));
    }}
    className="form-input"
  />
</div>

{rowData.question_image && (
  <div style={{ display: "flex", gap: "5px", alignItems: "center", marginTop: "10px" }}>
    <img style={{ width: "100px", height: "100px", objectFit: "cover" }} src={rowData.question_image} alt="Question" />
    <button
      type="button"
      className="btn-danger"
      onClick={deleteImg}
      style={{ borderRadius: "10px", padding: "5px", marginLeft: "10px" }}
    >
      {deleteIcon}
    </button>
  </div>
)}

{/* صوت التوضيح */}
<div className="form-group" style={{ marginTop: "20px" }}>
  <label htmlFor="explanationVoice" className="form-label">صوت التوضيح</label>
  <input
    type="file"
    id="explanationVoice"
    onChange={(e) => setEditVoice(e.target.files[0])}
    className="form-input"
  />
</div>

{rowData.question_exp_voice && (
  <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "10px" }}>
    <audio controls>
      <source src={rowData.question_exp_voice} type="audio/mpeg" />
    </audio>
    <button
      type="button"
      className="btn-danger"
      onClick={deleteVoice}
      style={{ borderRadius: "10px", padding: "5px", marginLeft: "10px" }}
    >
      {deleteIcon}
    </button>
  </div>
)}


        <div className="form-group">
          <label htmlFor="answers" className="form-label" style={{ display: "flex", justifyContent: "space-between" }}>
            <p>الإجابات</p>
            <CiCirclePlus
              style={{ color: "green", fontSize: "32px", cursor: "pointer" }}
              onClick={() => setEdQuesList((prevList) => [...prevList, { id: prevList.length + 1, answer: "", status: false }])}
            />
          </label>
          {edQuesList.map((item, index) => (
            <div key={index} className="my-2 d-flex align-items-center justify-content-between">
              <input
                type="text"
                placeholder="إجابه"
                value={item.answer}
                onChange={(e) =>
                  setEdQuesList((prevList) =>
                    prevList.map((it) => (it.id === item.id ? { ...it, answer: e.target.value } : it))
                  )
                }
                className="form-input col-9"
              />
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setEdQuesList((prevList) => prevList.filter((it) => it.id !== item.id))}
                >
                  <IoClose style={{ color: "white", fontSize: "20px" }} />
                </button>
                <input
                  type="checkbox"
                  checked={item.status}
                  onChange={() =>
                    setEdQuesList((prevList) =>
                      prevList.map((it) => ({ ...it, status: it.id === item.id ? !it.status : false }))
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <div className="form-footer">
          {loading ? <Loader /> : <button type="submit" className="form-submit-btn">حفظ</button>}
        </div>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(false)} />}
      </form>
    </Modal>
  );
}

export default EditQuestion;
