import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { docUrl } from "../../utils/baseUrl";
import Modal from '../../components/modal/index';
import CustomTable from '../../components/table/index';
import Toast from "../../components/toast";


export default function Inquiries() {
    const {group_id} = useParams();
    const [toast , setToast] = useState(false);
    const [openModal , setOpenModal] = useState(false);
    const maxDuration = 180000; 
    const [audioFile, setAudioFile] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const [replyImg , setReplyImg] = useState(null);
    const [replyImgFile,setReplyImgFile] = useState("");
    const [inquiries , setInquiries] = useState([]);
    const [rowData , setRowData] = useState({});
    const [inquiriesData , setInquiriesData] = useState({
      reply_text : "",
      reply_image:"",
      reply_voice:"",
      inquiry_id:"",
      type:"",
    }) 
    const [isOn, setIsOn] = useState(rowData?.show_to_pablic == 0 ? false : true);

  const handleToggle = (id) => {
    console.log(isOn , id)
    const data_send = {
      inquiry_id : id, 
      show_to_pablic : isOn ==  false ? 1 : 0,
    }

    axios.post(docUrl + "/home/show_hide_replay_inquiry.php",data_send)
    .then(res => {
      if(res?.data == "success") {
        setToast({type:"success",message : "تمت العمليه بنجاح"})
        handleGetAllInquiries();
      }else {
        setToast({type:"error",message :"هناك خطأ ما"});
      }
    }).catch(e => console.log(e))
  };

    const columns = [
      {
        id:"inquiry_id",
        dataIndex:"inquiry_id",
        title:"#",
      },
      {
        id:"inquiry_image",
        dataIndex:"inquiry_image",
        title:"Inquiry Image",
        render: (text , row) => row?.inquiry_image && <img src={row?.inquiry_image} style={{width:"50px",height:"50px"}}/>
      },
      {
        id:"inquiry_text",
        dataIndex:"inquiry_text",
        title:"Inquiry Text",
      },
      {
        id:"inquiry_voice",
        dataIndex:"inquiry_voice",
        title:"Inquiry Voice",
        render:(text , row) => row?.inquiry_voice && <audio controls muted><source src={row?.inquiry_voice}></source></audio>
      },
      {
        id:"student_name",
        dataIndex:"student_name",
        title:"Student Name",
      },
      {
        id:"type",
        dataIndex:"type",
        title:"Type",
      },
      {
        id:"reply_text",
        dataIndex:"reply_text",
        title:"Reply Text",
      },
      {
        id:"reply_image",
        dataIndex:"reply_image",
        title:"Reply Image",
        render:(text , row) => row?.reply_image && <img src={row?.reply_image} style={{width:"50px",height:"50px"}}/>
      },
      {
        id:"reply_voice",
        dataIndex:"reply_voice",
        title:"Reply Voice",
        render :(text , row) => row?.reply_voice && <audio controls muted><source src={row?.reply_voice}></source></audio>
      },
      {
        id:"show_to_pablic",
        dataIndex:"show_to_pablic",
        title:"Show To Public",
        render:(text , row) => <p style={row?.show_to_pablic == 0 ? {color:"red"} : {color:"green"}}>{row?.show_to_pablic == 0 ? "مخفي" : "ظاهر"}</p>
      },
      {
        id:"show_to_student",
        dataIndex:"show_to_student",
        title:"Show To student",
        render:(text , row) => <p style={row?.show_to_student == 0 ? {color:"red"} : {color:"green"}}>{row?.show_to_student == 0 ? "مخفي" : "ظاهر"}</p>
      },
      {
        title:"show / hide Reply",
        render:(text , row) => <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          onClick={() => {
            setIsOn(!isOn)
            handleToggle(row?.inquiry_id)
          }}
          style={{
            width: "50px",
            height: "25px",
            borderRadius: "25px",
            backgroundColor: isOn ? "green" : "gray",
            position: "relative",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "white",
              position: "absolute",
              top: "50%",
              left: isOn ? "calc(100% - 20px)" : "0",
              transform: "translateY(-50%)",
              transition: "all 0.3s ease",
            }}
          ></div>
        </div>
        <span>{isOn ? "ظاهر" : "مخفي"}</span>
      </div>
      },
      {
        id:"Actions",
        title:"Actions",
        render:(text , row) => <div className="d-flex gap-3">
          <button className="btn btn-success" onClick={() => {
            console.log(row);
            setRowData(row);
            setOpenModal(true);
          }}>إضافه الرد</button>

<button className="btn btn-success" onClick={() => {
            console.log(row);
            setRowData(row);
            handleDeleteReply(row?.inquiry_id)
          }}>حذف الرد</button>
        
        </div>
      }
    ]

    function handleGetAllInquiries() {
        const data_send = {
            group_id : +group_id
        }

        axios.post(docUrl +"/home/select_inquiries.php",data_send)
        .then(res => {
          if(res?.data){
            setInquiries(res?.data)
          }
        }).catch(e => console.log(e))

    }

    useEffect(() => {
        handleGetAllInquiries()
    } , [])

    async function startRecording() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          alert("Your browser does not support audio recording.");
          return;
      }

      try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorderRef.current = new MediaRecorder(stream);
          audioChunksRef.current = [];

          mediaRecorderRef.current.ondataavailable = (event) => {
              audioChunksRef.current.push(event.data);
          };

          mediaRecorderRef.current.onstop = () => {
              const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
              setAudioFile(audioBlob);
              audioChunksRef.current = [];
          };

          mediaRecorderRef.current.start();
          setIsRecording(true);

          setTimeout(() => {
              if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                  stopRecording();
              }
          }, maxDuration);
      } catch (error) {
          console.error("Error accessing microphone:", error);
      }
  }

  function stopRecording() {
      if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
      }
  }

  function deleteRecording() {
    setAudioFile(null);
    audioChunksRef.current = [];
}

function handleSubmit() {
  // e.preventDefault();
  console.log(rowData);

  // Prepare the base data for sending
  const data_send = {
    reply_text: rowData?.reply_text || "",
    reply_image: "",
    reply_voice: "",
    inquiry_id: rowData?.inquiry_id,
    type: rowData?.type,
  };

  // Helper function to update data_send after uploads
  const sendFinalData = () => {
    axios.post(docUrl + "/home/add_replay_inquiry.php", data_send)
      .then((res) => {
        if(res?.data == "success") {
          setToast({type:"success",message:"تم الرد بنجاح"});
          handleGetAllInquiries();
          setOpenModal(false);
          setRowData({});
          setReplyImg(null);
          setAudioFile(null)
        }
        else {
          setToast({type:"error",message:"هناك خطأ ما"})
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setOpenModal(false))
  };

  // Upload image if available
  const uploadImage = replyImg
    ? axios.post(docUrl + "/home/image_uplouder.php", (() => {
        const formImgData = new FormData();
        formImgData.append("image", replyImg);
        return formImgData;
      })())
    : Promise.resolve({ data: "" }); // No image to upload

  // Upload audio if available
  const uploadAudio = audioFile
    ? axios.post(docUrl + "/home/podcast/upload_voices.php", (() => {
        const formAudioData = new FormData();
        formAudioData.append("file_attachment", audioFile);
        return formAudioData;
      })())
    : Promise.resolve({ data: "" }); // No audio to upload

  // Chain the upload processes and send the final request
  Promise.all([uploadImage, uploadAudio])
    .then(([imgRes, audioRes]) => {
      data_send.reply_image = imgRes?.data || "";
      data_send.reply_voice = audioRes?.data || "";
      sendFinalData();
    })
    .catch((err) => console.error("Error uploading files:", err));
}


function handleDeleteReply(id) {
  const data_send = {
    inquiry_id : id
  }

  axios.post(docUrl + "/home/delete_my_replay.php",data_send)
  .then(res => {
    if(res?.data == "success") {
      setToast({type:"success",message :"تم حذف الرد بنجاح"});
      handleGetAllInquiries();
      setOpenModal(false);
    }
  }).catch(e => console.log(e))
  .finally(() => setOpenModal(false))
}

function handleShowReplyToAll(id) {
  const data_send = {
    show_to_pablic : id ,
    show_to_pablic :1,
  }

  axios.post(docUrl +"/home/show_hide_replay_inquiry.php",data_send)
  .then(res => console.log(res))
}


  return (
    <div>
        <div className="tablePageHeader">
        <h1 className="pageTitle">الاستفسارات</h1>

      </div>

      <CustomTable columns={columns} dataSource={inquiries}/>

      <Modal visible={openModal} close={setOpenModal} title="إضافه استفسار">
        <div>
          
         {/* <div className="form-group">
            <button onClick={handleDeleteReply} className="btn btn-secondary">مسح الرد</button>
         </div> */}
        {/* <div className="form-group">
        <p className="btn btn-primary">اظهار الرساله للجميع</p>
        </div> */}

        <div className="form-group">
           <p style={{textAlign:"center",fontSize:"23px"}}>تصنيف الرسالة</p>
           <div style={{display:"flex",gap:"10px",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",gap:"7px",fontSize:"23px"}}>
                 <input type="radio" style={{width:"23px"}} name="type" onChange={(e) => setRowData({...rowData , type:e.target.value})} value="explain" className="form-input"/>
                 <label style={{fontSize:"23px"}}>شرح</label>
              </div>

              <div style={{display:"flex",gap:"7px",fontSize:"23px"}}>
                 <input style={{width:"23px"}} name="type" type="radio" value="solution" onChange={(e) => setRowData({...rowData , type:e.target.value})} className="form-input"/>
                 <label style={{fontSize:"23px"}}>حل</label>
              </div>

              <div style={{display:"flex",gap:"7px",fontSize:"23px"}}>
                 <input style={{width:"23px"}}  name="type" type="radio" value="questions" onChange={(e) => setRowData({...rowData , type:e.target.value})} className="form-input"/>
                 <label style={{fontSize:"23px"}}>أسئلة</label>
              </div>
           </div>
        </div>

        <div className="form-group">
          <input onChange={(e) => setRowData({...rowData , reply_text :e.target.value})} value={rowData?.reply_text} type="text" placeholder="اكتب الرد..."/>
        </div>

        <div className="form-group" style={{marginTop:"20px"}}>
          <label className="form-label" style={{fontSize:"18px"}}>اختر صوره</label>
          <input className="form-input" type="file" accept="image/*" onChange={(e) => setReplyImg(e.target.files[0])}/>
        </div>

        <div className="form-group" style={{marginTop:"20px"}}>
                        <label className="form-label" style={{fontSize:"18px"}}>Audio Recording</label>
                        {audioFile ? (
                <button className="btn btn-danger" type="button" onClick={deleteRecording}>
                    Delete Recording
                </button>
            ) : isRecording ? (
                <button className="btn btn-success" type="button" onClick={stopRecording}>
                    Stop Recording
                </button>
            ) : (
                <button className="btn btn-success" type="button" onClick={startRecording}>
                    Start Recording (3 min limit)
                </button>
            )}
                    </div>

                    {audioFile && (
                        <div>
                            <audio controls src={URL.createObjectURL(audioFile)}></audio>
                        </div>
                    )}
                    
                    <button onClick={handleSubmit} className="btn btn-primary mt-3">إضافة</button>
        </div>
      </Modal>

      {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(false)}
          />
        )}
    </div>
  )
}
