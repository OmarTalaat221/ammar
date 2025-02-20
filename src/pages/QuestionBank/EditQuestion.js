import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { baseUrl, docUrl } from "../../utils/baseUrl";
import Loader from "../../components/loader";
import Toast from "../../components/toast";
import Modal from "../../components/modal";
import { CiCirclePlus } from "react-icons/ci";
import { IoClose } from "react-icons/io5";

function EditQuestion({ getFunction, openModal, setOpenModal,rowData,setRowData,imgEdit,setImgEdit, imgUrlEdit,setImgUrlEdit,edQuesList,editVoice,setEdQuesList,setEditVoice}) {
  console.log(rowData)
  const [untiData, setUntiData] = useState({
    name: "",
  });
  const [lessons,setLessons]=useState([])
  const [units,setUnits]=useState([])
  const [years,setYears]=useState([])
  const [toast, setToast] = useState(false);
  const [loading,setLoading]=useState(false)

const {id} = useParams()
  const saveNewUnit = async(e) => {
    e.preventDefault();

    console.log(e.preventDefault())
    setLoading(true)

      try {
        // رفع الصورة الواحدة
        const formDataImage = new FormData();
        formDataImage.append('image', imgEdit); // تأكد أن `imageFile` هو ملف الصورة الواحد

        const imageResponse = await axios.post(`${docUrl}/home/image_uplouder.php`, formDataImage);
        // console.log(imageResponse)
        // return
        const image = imageResponse.data; // الحصول على رابط أو مسار الصورة

        // رفع ملف الصوت الواحد
        const formDataAudio = new FormData();
        formDataAudio.append('file_attachment', editVoice); // تأكد أن `audioFile` هو الملف الصوتي المفرد

        const audioResponse = await axios.post(`${docUrl}/home/q_bank/upload_voices.php`, formDataAudio);
        // console.log(audioResponse) ;
        // return
        const audio = audioResponse.data; // الحصول على رابط أو مسار الملف الصوتي

        // تجهيز بيانات الطلب النهائي بعد رفع الصورة والصوت
        const requestData = {
          question_text:rowData.question_text,
          question_exp_text:rowData?.question_exp_text,
          question_valid_answer:edQuesList&&edQuesList.filter(it=>it.status)[0].answer,
          question_answers:edQuesList.map(it=>it.answer).join('//CAMP//'),
          question_image:imgEdit!=null?image:rowData?.question_image,  // إدراج الصورة هنا
          question_exp_voice:editVoice!=null?audio:rowData?.question_exp_voice,  // إدراج الصوت هنا
          lesson_id:id,
          question_id:rowData?.question_id
        };

        console.log(requestData);
        // return
        // إرسال الطلب النهائي إلى السيرفر
        await axios.post(`${docUrl}/home/q_bank/edit_ques.php`, { ...requestData });

        // استدعاء الدالة بعد الإضافة
        getFunction();
        // toast.success("Successfully added!");

      } catch (error) {
        console.error(error);
        // toast.error("Failed to add new item.");
      } finally {
        setOpenModal(false);
    setLoading(false)
    setEditVoice(null)
    setImgEdit(null)
    setImgUrlEdit('')
      }

  };






  return (
    <Modal
      close={setOpenModal}
      footer={false}
      title={"Edit Lesson"}
      visible={openModal}
    >
      <form onSubmit={(e) => saveNewUnit(e)} className="animated-form">
        <div className="form-group">
          <label htmlFor="packageName" className="form-label">
          Question text
          </label>
          <input
            value={rowData?.question_text}
            type="text"
            id="packageName"
            placeholder="Enter question text"
            onChange={(e) => setRowData({ ...rowData, question_text: e.target.value })}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="packageName" className="form-label">
          Question Explination
          </label>
          <textarea
          value={rowData?.question_exp_text}
            onChange={(e) => setRowData({ ...rowData, question_exp_text: e.target.value })}
            className="form-input"
          ></textarea>
        </div>


        {/* <div className="form-group">
          <label htmlFor="packageName" className="form-label">
            Select Generation
          </label>
          <select
            value={rowData?.generation_id}
            onChange={(e)=>{
              setRowData({...rowData,generation_id:e.target.value})
            }}
            className="form-input form-control"
          >
            {
              years&&years.map((it)=>{
                return <option value={it.gen_id}>{it.doctor_name}</option>
              })
            }
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="packageName" className="form-label">
            Select Unit
          </label>
          <select
            value={rowData?.unit_id}
            onChange={(e)=>{
              setRowData({...rowData,unit_id:e.target.value})
            }}
            className="form-input form-control"
          >
            {
              units&&units.map((it)=>{
                return <option value={it.unit_id}>{it.unit_name}</option>
              })
            }
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="packageName" className="form-label">
            Select Lesson
          </label>
          <select
            value={rowData?.lesson_id}
            onChange={(e)=>{
              setRowData({...rowData,lesson_id:e.target.value})
            }}
            className="form-input form-control"
          >
            {
              lessons&&lessons.map((it)=>{
                return <option value={it.lesson_id}>{it.lesson_name}</option>
              })
            }
          </select>
        </div> */}


        {
          imgEdit==null?
          <img style={{width:'100px'}} src={rowData?.question_image} alt="" />
          :
          <img style={{width:'100px'}} src={imgUrlEdit} alt="" />
        }
        <div className="form-group">
          <label htmlFor="packageName" className="form-label">
          Question image
          </label>
          <input
            type="file"
            id="packageName"
            placeholder="Enter question text"
            onChange={(e) => {
              setImgEdit(e.target.files[0])
              setImgUrlEdit(URL.createObjectURL(e.target.files[0]))
            }}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="packageName" className="form-label">
          Question voice
          </label>
          <input
            type="file"
            id="packageName"
            placeholder="Enter question voice"
            onChange={(e) => setEditVoice(e.target.files[0])}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label style={{
            display:'flex',
            alignItems:'center',
            justifyContent:'space-between'
           }} htmlFor="packageName" className="form-label">
            <p>Answers</p>
            <CiCirclePlus style={{color:'green',fontSize:'32px',cursor:'pointer'}} onClick={()=>{
              setEdQuesList([...edQuesList,{
                id:edQuesList[edQuesList.length-1].id+1,
                answer:'',
                status:false
              }])
            }}/>
          </label>
          {
            edQuesList&&edQuesList.map((item,index)=>{
              return (
                <div key={index} className="my-2 d-flex align-items-center justify-content-between">
                  <div className="d-flex flex-column col-9">
                    <label htmlFor="">Answer</label>
                    <input onChange={(e)=>{
                      setEdQuesList(edQuesList.map(it=>{
                        return {...it,answer:it.id==item.id?e.target.value:it.answer}
                      }))
                    }} name="answer" value={ item?.answer } className="form-label"/>
                  </div>
                  {

                    <p  className="col-1 text-center cursor-pointer m-0 p-0  d-flex gap-2">
                    {true&&  <p className="btn btn-danger p-0 m-0" onClick={()=>{
                      setEdQuesList(edQuesList.filter(it=>it.id!=item.id))
                    }}><IoClose style={{ color:'white',fontSize:'32px',cursor:'pointer' }}/></p>}
                      <input style={{width:'20px',height:'20px'}} onClick={()=>{
                        setEdQuesList(edQuesList.map((it)=>{
                          return {...it,status:it.id==item.id?!item.status:false}
                        }))
                      }} type="checkbox" checked={item.status}/>
                    </p>
                  }
                </div>
              )
            })
          }
        </div>

        <div className="form-footer">
          {loading ? (
            <Loader />
          ) : (
            <button type="submit" className="form-submit-btn">
              Save
            </button>
          )}
        </div>
        {toast && (
          <Toast message={"Please fill out all required fields"} type={"error"} onClose={setToast} />
        )}
      </form>
    </Modal>
  );
}

export default EditQuestion;
