import React, { useState } from "react";
import axios from "axios";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { docUrl } from "../../utils/baseUrl";
import Loader from "../../components/loader";
import Toast from "../../components/toast";
import Modal from "../../components/modal";
import { IoClose } from "react-icons/io5";
import { CiCirclePlus } from "react-icons/ci";
function AddQuestion({ getFunction, openModal, setOpenModal  , setToast  , toast}) {
  const [lessonData, setlessonData] = useState({
    question_text: "",
    question_exp_text: "",
  });
  // const [toast, setToast] = useState(false);
  const [loading,setLoading]=useState(false)
  const [question_image,set_question_image]=useState()
  const [question_exp_voice,set_question_exp_voice]=useState()
  const [answersList,setAnswersList]=useState([
    {
      id:1,
      answer:'',
      status:false,
    },
    {
      id:2,
      answer:"",
      status :false
    }
  ])
const {id} = useParams()

const saveNewUnit = async (e) => {
  e.preventDefault();
  setLoading(true);

  // Validation for all fields
  if (!lessonData.question_text) {
    setToast({ type: "error", message: "برجاء ادخال السؤال أولا!" });
    setLoading(false);
    return;
  }


  if (answersList.length === 0 || answersList.some((answer) => !answer.answer)) {
    setToast({ type: "error", message:  "برجاء ادخال جميع الإجابات!"  });
    setLoading(false);
    return;
  }


  if (answersList.length < 2 || answersList.filter(answer => answer.answer).length < 2) {
    setToast({ type: "error", message: "يجب أن يحتوي السؤال على إجابتين على الأقل!" });
    setLoading(false);
    return;
  }

  if (!answersList.some((answer) => answer.status)) {
    setToast({ type: "error", message: "برجاء اختيار إجابة صحيحة واحدة!" });
    setLoading(false);
    return;
  }

  try {
    // Upload image
    const formDataImage = new FormData();
    formDataImage.append("image", question_image);
    const imageResponse = await axios.post(`${docUrl}/home/image_uplouder.php`, formDataImage);
    const image = imageResponse.data;

    // Upload audio
    const formDataAudio = new FormData();
    formDataAudio.append("file_attachment", question_exp_voice);
    const audioResponse = await axios.post(`${docUrl}/home/q_bank/upload_voices.php`, formDataAudio);
    const audio = audioResponse.data;

    // Prepare request data
    const requestData = {
      question_text: lessonData.question_text,
      question_exp_text: lessonData.question_exp_text,
      question_valid_answer: answersList.find((it) => it.status)?.answer,
      question_answers: answersList.map((it) => it.answer).join("//CAMP//"),
      question_image: image,
      question_exp_voice: audio,
      lesson_id: id,
      sent_lesson: false,
    };

    // Submit data
    await axios.post(`${docUrl}/home/q_bank/add_question.php`, requestData);

    setToast({ type: "success", message: "تم اضافه سؤال بنجاح" });
    getFunction();

    // Reset form
    setAnswersList([{ id: 1, answer: "", status: false }]);
    set_question_image(null);
    set_question_exp_voice(null);
    setlessonData({ question_text: "", question_exp_text: "" });
  } catch (error) {
    console.error(error);
  } finally {
    setOpenModal(false);
    setLoading(false);
  }
};


//   const saveNewUnit = async(e) => {
//   console.log(e.preventDefault())
//   setLoading(true)

//     try {
//       // رفع الصورة الواحدة
//       if(lessonData?.question_text == "") {
//         setToast({type :"error",message:"برجاء ادخال السؤال أولا!"});
//         return
//       }

//       if(lessonData?.question_exp_text == "") {
//         setToast({type:"error",message : "برجاء ادخال توضيح للسؤال"});
//         return
//       }
      
//       if(!question_image) {
//         setToast({type:"error",message:"برجاء ادخال صورة أولا!"});
//         return
//       }

//       if(!question_exp_voice) {
//         setToast({type:"error",message:"برجاء ادخال ملف صوتي أولا!"});
//         return
//       }
      
//       const formDataImage = new FormData();
//       formDataImage.append('image', question_image); // تأكد أن `imageFile` هو ملف الصورة الواحد

//       const imageResponse = await axios.post(`${docUrl}/home/image_uplouder.php`, formDataImage);
//       // console.log(imageResponse)
//       // return
//       let image = imageResponse.data; // الحصول على رابط أو مسار الصورة

//       // رفع ملف الصوت الواحد
//       const formDataAudio = new FormData();
//       formDataAudio.append('file_attachment', question_exp_voice); // تأكد أن `audioFile` هو الملف الصوتي المفرد

//       const audioResponse = await axios.post(`${docUrl}/home/q_bank/upload_voices.php`, formDataAudio);
//       // console.log(audioResponse) ;
//       // return
//       let audio = audioResponse.data; // الحصول على رابط أو مسار الملف الصوتي

//       // تجهيز بيانات الطلب النهائي بعد رفع الصورة والصوت
//       let requestData = {
//         question_text:lessonData.question_text,
//         question_exp_text:lessonData?.question_exp_text,
//         question_valid_answer:answersList&&answersList.filter(it=>it.status)[0].answer,
//         question_answers:answersList?.map(it=>it.answer).join('//CAMP//'),
//         question_image:image,  // إدراج الصورة هنا
//         question_exp_voice:audio,  // إدراج الصوت هنا
//         lesson_id:id,
//         sent_lesson:false
//       };

//       console.log(requestData);
//       // return
//       // إرسال الطلب النهائي إلى السيرفر
//       await axios.post(`${docUrl}/home/q_bank/add_question.php`, { ...requestData });
      
//       setToast({type:"success",message:"تم اضافه سؤال بنجاح"})

//       // استدعاء الدالة بعد الإضافة
//       getFunction();
//       // toast.success("Successfully added!");

      

//       requestData = {
//         question_text:null,
//         question_exp_text:null,
//         question_valid_answer:null,
//         question_answers:null,
//         question_image:null,  // إدراج الصورة هنا
//         question_exp_voice:null,  // إدراج الصوت هنا
//         lesson_id:null,
//         sent_lesson:null
//       };
      
//     } catch (error) {
//       console.error(error);
//       // toast.error("Failed to add new item.");
//     } finally {
//       setOpenModal(false);
//   setLoading(false)
 
   
// setAnswersList([{
// id: null,
// answer: null,
// status: null,
// }])
// set_question_image(null)
// set_question_exp_voice(null)
// setlessonData(
// {
// ...lessonData,
// question_text:null,
//     question_exp_text:null,
// }
// )
//     }

//   };

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
            placeholder="توضيح السؤال"
            onChange={(e) => setlessonData({ ...lessonData, question_exp_text: e.target.value })}
            className="form-input"
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="packageName" className="form-label">
          صورة السؤال
          </label>
          <input
            type="file"
            accept="image/*"
            id="packageName"
            placeholder="Enter question text"
            onChange={(e) => set_question_image(e.target.files[0])}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="packageName" className="form-label">
          صوت التوضيح
          </label>
          <input
          accept="audio/*"
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
  answersList && answersList.map((item, index) => {
    return (
      <div key={index} className="my-2 d-flex align-items-center justify-content-between">
        <div className="d-flex flex-column col-9">
          <label htmlFor="">الإجابه</label>
          <input
            onChange={(e) => {
              setAnswersList(answersList.map(it => {
                return { ...it, answer: it.id === item.id ? e.target.value : it.answer };
              }));
            }}
            name="answer"
            value={item?.answer}
            className="form-label"
          />
        </div>
        <p className="col-1 text-center cursor-pointer m-0 p-0 d-flex gap-2">
          {index!=0  && (
            <p className="btn btn-danger p-0 m-0" onClick={() => {
              setAnswersList(answersList.filter(it => it.id !== item.id));
            }}>
              <IoClose style={{ color: 'white', fontSize: '32px', cursor: 'pointer' }} />
            </p>
          )}
          <input
            style={{ width: '20px', height: '20px' }}
            onClick={() => {
              setAnswersList(answersList.map((it) => {
                return { ...it, status: it.id === item.id ? !item.status : it.status };
              }));
            }}
            type="checkbox"
            checked={item.status}
          />
        </p>
      </div>
    );
  })
}

          {/* {
            answersList&&answersList.map((item,index)=>{
              return (
                <div key={index} className="my-2 d-flex align-items-center justify-content-between">
                  <div className="d-flex flex-column col-9">
                    <label htmlFor="">الإجابه</label>
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
          } */}
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
        {/* {toast && (
          <Toast message={toast?.message} type={toast?.type} onClose={setToast} />
        )} */}
      </form>
    </Modal>
  );
}

export default AddQuestion;
