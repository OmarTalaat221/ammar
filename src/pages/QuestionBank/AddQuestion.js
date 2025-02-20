import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { baseUrl, docUrl } from "../../utils/baseUrl";
import Loader from "../../components/loader";
import Toast from "../../components/toast";
import Modal from "../../components/modal";
import { IoClose } from "react-icons/io5";
import { CiCirclePlus } from "react-icons/ci";
function AddQuestion({ getFunction, openModal, setOpenModal }) {
  const [lessonData, setlessonData] = useState({
    question_text: "",
    question_exp_text: "",
    generation_id:'',
    unit_id:'',
    lesson_id:'',
  });
  const [lessons,setLessons]=useState([])
  const [toast, setToast] = useState(false);
  const [loading,setLoading]=useState(false)
  const [question_image,set_question_image]=useState()
  const [question_exp_voice,set_question_exp_voice]=useState()
  const [answersList,setAnswersList]=useState([
    {
      id:1,
      answer:'',
      status:false,
    }
  ])


  const [years, setYears] = useState(null);
  const [units,setUnits]=useState([])
  const getYears = async () => {
    try {
      const yearsData = await fetch(baseUrl + "select_genrations.php");
      const data = await yearsData?.json();
      console.log(data);
      if(Array.isArray(data)){
        setYears(data);
        if(data.length>0){
          setlessonData({...lessonData,generation_id:data[0].gen_id})
        }
      }
    } catch (err) {
      setYears([]);
    }
  };


  const getUnits = async () => {

    let data_to_send = {
      generation_id: lessonData?.generation_id,
    };

    try {
      const response = await fetch(docUrl + "/home/q_bank/get_all_units.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data_to_send),
      });

      const resData = await response.json();
      console.log(resData);

      console.log(response)
      if (Array.isArray(resData)) {
        if (resData.length === 0) {
          setUnits([]);
        } else {
          setUnits(resData);
          setlessonData({...lessonData,unit_id:resData[0].unit_id});
        }
      } else {
        console.error("Please try again later.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
    }
  };
  useEffect(()=>{
    getUnits()
  },[lessonData?.generation_id])


  const getLessons = async () => {

    let data_to_send = {
      unit_id: lessonData?.unit_id,
    };

    try {
      const response = await fetch(docUrl + "/home/q_bank/get_unit_lesson.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data_to_send),
      });

      const resData = await response.json();
      console.log(resData);

      console.log(response)
      if (Array.isArray(resData)) {
        if (resData.length === 0) {
          setLessons([]);
        } else {
          setLessons(resData);
          setlessonData({...lessonData,lesson_id:resData[0].lesson_id});
        }
      } else {
        console.error("Please try again later.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
    }
  };

  useEffect(() => {
    getLessons();
  }, [lessonData?.unit_id]);


  useEffect(()=>{
    getYears()
  },[])
const {id} = useParams()
  const saveNewUnit = async(e) => {
  console.log(e.preventDefault())
  setLoading(true)

    try {
      // رفع الصورة الواحدة
      const formDataImage = new FormData();
      formDataImage.append('image', question_image); // تأكد أن `imageFile` هو ملف الصورة الواحد

      const imageResponse = await axios.post(`${docUrl}/home/image_uplouder.php`, formDataImage);
      // console.log(imageResponse)
      // return
      const image = imageResponse.data; // الحصول على رابط أو مسار الصورة

      // رفع ملف الصوت الواحد
      const formDataAudio = new FormData();
      formDataAudio.append('file_attachment', question_exp_voice); // تأكد أن `audioFile` هو الملف الصوتي المفرد

      const audioResponse = await axios.post(`${docUrl}/home/q_bank/upload_voices.php`, formDataAudio);
      // console.log(audioResponse) ;
      // return
      const audio = audioResponse.data; // الحصول على رابط أو مسار الملف الصوتي

      // تجهيز بيانات الطلب النهائي بعد رفع الصورة والصوت
      const requestData = {
        question_text:lessonData.question_text,
        question_exp_text:lessonData?.question_exp_text,
        question_valid_answer:answersList&&answersList.filter(it=>it.status)[0].answer,
        question_answers:answersList.map(it=>it.answer).join('//CAMP//'),
        question_image:image,  // إدراج الصورة هنا
        question_exp_voice:audio,  // إدراج الصوت هنا
        lesson_id:lessonData?.lesson_id,
        sent_lesson:true,
        generation_id:lessonData?.generation_id
      };

      console.log(requestData);
      // return
      // إرسال الطلب النهائي إلى السيرفر
      await axios.post(`${docUrl}/home/q_bank/add_question.php`, { ...requestData });

      // استدعاء الدالة بعد الإضافة
      getFunction();
      // toast.success("Successfully added!");

    } catch (error) {
      console.error(error);
      // toast.error("Failed to add new item.");
    } finally {
      setOpenModal(false);
  setLoading(false)
    }

  };

  return (
    <Modal
      close={setOpenModal}
      footer={false}
      title={"إضافه سؤال"}
      visible={openModal}
    >
      <form onSubmit={(e) => saveNewUnit(e)} className="animated-form">
        <div className="form-group">
          <label htmlFor="packageName" className="form-label">
          نص السؤال
          </label>
          <input
            type="text"
            id="packageName"
            placeholder="نص السؤال"
            onChange={(e) => setlessonData({ ...lessonData, question_text: e.target.value })}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="packageName" className="form-label">
          توضيح السؤال
          </label>
          <textarea
            onChange={(e) => setlessonData({ ...lessonData, question_exp_text: e.target.value })}
            className="form-input"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="packageName" className="form-label">
            إختر الصف
          </label>
          <select
            value={lessonData?.generation_id}
            onChange={(e)=>{
              setlessonData({...lessonData,generation_id:e.target.value})
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
            إختر الوحده
          </label>
          <select
            value={lessonData?.unit_id}
            onChange={(e)=>{
              setlessonData({...lessonData,unit_id:e.target.value})
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
            إختر الدرس
          </label>
          <select
            value={lessonData?.lesson_id}
            onChange={(e)=>{
              setlessonData({...lessonData,lesson_id:e.target.value})
            }}
            className="form-input form-control"
          >
            {
              lessons&&lessons.map((it)=>{
                return <option value={it.lesson_id}>{it.lesson_name}</option>
              })
            }
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="packageName" className="form-label">
          صوره السؤال
          </label>
          <input
            type="file"
            id="packageName"
            placeholder="Enter question text"
            onChange={(e) => set_question_image(e.target.files[0])}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="packageName" className="form-label">
          صوت السؤال
          </label>
          <input
            type="file"
            id="packageName"
            placeholder="Enter question voice"
            onChange={(e) => set_question_exp_voice(e.target.files[0])}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label style={{
            display:'flex',
            alignItems:'center',
            justifyContent:'space-between'
           }} htmlFor="packageName" className="form-label">
            <p>الإجابات</p>
            <CiCirclePlus style={{color:'green',fontSize:'32px',cursor:'pointer'}} onClick={()=>{
              setAnswersList([...answersList,{
                id:answersList[answersList.length-1].id+1,
                answer:'',
                status:false
              }])
            }}/>
          </label>
          {
            answersList&&answersList.map((item,index)=>{
              return (
                <div key={index} className="my-2 d-flex align-items-center justify-content-between">
                  <div className="d-flex flex-column col-9">
                    <label htmlFor="">Answer</label>
                    <input onChange={(e)=>{
                      setAnswersList(answersList.map(it=>{
                        return {...it,answer:it.id==item.id?e.target.value:it.answer}
                      }))
                    }} name="answer" value={ item?.answer } className="form-label"/>
                  </div>
                  {

                    <p  className="col-1 text-center cursor-pointer m-0 p-0  d-flex gap-2">
                    {index!=0&&  <p className="btn btn-danger p-0 m-0" onClick={()=>{
                      setAnswersList(answersList.filter(it=>it.id!=item.id))
                    }}><IoClose style={{ color:'white',fontSize:'32px',cursor:'pointer' }}/></p>}
                      <input style={{width:'20px',height:'20px'}} onClick={()=>{
                        setAnswersList(answersList.map((it)=>{
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
              حفظ
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

export default AddQuestion;
