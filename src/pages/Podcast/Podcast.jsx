// import { useState } from "react";
// import Modal from "../../components/modal";
// import axios from "axios";
// import { docUrl } from "../../utils/baseUrl";
// import { useParams } from "react-router-dom";

// export default function Podcast() {
//     const {id} = useParams();
//     const [toast , setToast] = useState(false);
//     const [openModal, setOpenModal] = useState(false);
//     const [pdfFile, setPdfFile] = useState(null);
//     const [podcastData , setPodcastData] = useState({
//         title:"",
//         description:""
//     })
//    function handleGetAllPodcast(){

//    }


//     function handleAddPodcast(e) {
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append("voice", pdfFile);

//         axios.post(`${docUrl}/home/podcast/upload_voices.php`, formData)
//             .then(res =>{
//                 if(res?.data) {
//                     const data_send = {
//                         podcast_link : res?.data,
//                         ...podcastData,
//                         generation_id: +id
//                     }
//                     console.log(data_send)
//                     axios.post(docUrl + `/home/podcast/add_podacst.php`,data_send)
//                     .then(res => {
//                         if(res?.data == "success") {
//                              setToast({type:"success",message:res?.data})
//                              handleGetAllPodcast();
//                              setPodcastData({
//                                 title:"",
//                                 description:"",
//                                 generation_id:"",
//                                 podcast_link:"",
//                              })
//                              setPdfFile(null);
//                              setOpenModal(false);
//                         }
//                     }).catch(e => console.log(e))
//                     .finally(() => setOpenModal(false))
//                 }
//             })
//             .catch(err => console.error(err)); // Added error handling for better debugging
//     }

//     return (
//         <div>
//             <div className="tablePageHeader">
//                 <h1 className="pageTitle">Podcast</h1>
//                 <button
//                     className="btn btn-success"
//                     onClick={() => setOpenModal(true)}
//                 >
//                     Add Podcast
//                 </button>
//             </div>

//             <Modal visible={openModal} close={setOpenModal} title="Add Podcast">
//                 <form onSubmit={handleAddPodcast}>
//                     <div className="form-group">
//                          <label className="form-label">عنوان البودكاست</label>
//                          <input type="text" placeholder="عنوان البودكاست" onChange={(e) => setPodcastData({...podcastData , title:e.target.value})}/>
//                     </div>

//                     <div className="form-group">
//                          <label className="form-label">وصف البودكاست</label>
//                          <input type="text" placeholder="وصف البودكاست" onChange={(e) => setPodcastData({...podcastData , description:e.target.value})}/>
//                     </div>

//                     <div className="form-group">
//                         <label className="form-label">Audio</label>
//                         <input 
//                             onChange={(e) => setPdfFile(e.target.files[0])} 
//                             className="form-input" 
//                             type="file" 
//                             accept="audio/*" 
//                         />
//                     </div>

//                     <button className="btn btn-primary">Add</button>
//                 </form>
//             </Modal>
//         </div>
//     );
// }

import { useState, useRef, useEffect } from "react";
import Modal from "../../components/modal";
import axios from "axios";
import { docUrl } from "../../utils/baseUrl";
import { useParams } from "react-router-dom";
import Toast from "../../components/toast";
import TableContent from '../../components/table/index';

export default function Podcast() {
    const { id } = useParams();
    const [toast, setToast] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [podcastData, setPodcastData] = useState({ title: "", description: "" });
    const [audioFile, setAudioFile] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const [podcasts, setPodcasts] = useState([]);
    const maxDuration = 180000; // 3 minutes in milliseconds

    const columns = [
        {
            id:"#",
            dataIndex:"podcast_id"
        },
        {
            id:"title",
            title:"Title",
            dataIndex:"title"
        },
        {
            id:"description",
            title:"Description",
            dataIndex:"description",
        },
        {
            id:"podcast_link",
            title:"Podcast Audio",
            render:(text , row) => <audio controls>
                <source src={row?.podcast_link} />
            </audio>
        }
    ]

    function handleGetAllPodcast() {
        // Fetch podcast data logic here
    }

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

    function handleAddPodcast(e) {
        e.preventDefault();
        if (!audioFile) {
            alert("Please record audio first.");
            return;
        }

        const formData = new FormData();
        formData.append("file_attachment", audioFile);
        
        console.log(audioFile );

        axios.post(`${docUrl}/home/podcast/upload_voices.php`, formData)
            .then(res => {
                console.log(res)
                if (res?.data) {
                    const data_send = {
                        podcast_link: res?.data,
                        ...podcastData,
                        generation_id: +id
                    };
                    console.log(data_send);
                    axios.post(docUrl + `/home/podcast/add_podacst.php`, data_send)
                        .then(res => {
                            console.log(res)
                            if (res?.data == "success") {
                                setToast({ type: "success", message: res?.data });
                                handleGetAllPodcast();
                                setPodcastData({ title: "", description: "" });
                                setAudioFile(null);
                                setOpenModal(false);
                            }
                        })
                        .catch(e => console.error(e))
                        .finally(() => setOpenModal(false));
                }
            })
            .catch(err => console.error(err));
    }

    function handleGetAllPodcast() {
        const data_send = {
            generation_id : +id,
        }
        axios.post(docUrl+'/home/podcast/select_podcast.php',data_send)
        .then(res => {
            console.log(res)
            if(res?.data) {
                setPodcasts(res?.data)
            }
        }).catch(e => console.log(e))
        
    }

    useEffect(() => {
        handleGetAllPodcast()
    } , [])

    return (
        <div>
            <div className="tablePageHeader">
                <h1 className="pageTitle">Podcast</h1>
                <button
                    className="btn btn-success"
                    onClick={() => setOpenModal(true)}
                >
                    Add Podcast
                </button>
            </div>

            <Modal visible={openModal} close={setOpenModal} title="Add Podcast">
                <form onSubmit={handleAddPodcast}>
                    <div className="form-group">
                        <label className="form-label">عنوان البودكاست</label>
                        <input
                            type="text"
                            placeholder="عنوان البودكاست"
                            value={podcastData.title}
                            onChange={(e) => setPodcastData({ ...podcastData, title: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">وصف البودكاست</label>
                        <input
                            type="text"
                            placeholder="وصف البودكاست"
                            value={podcastData.description}
                            onChange={(e) => setPodcastData({ ...podcastData, description: e.target.value })}
                        />
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
                    <button type="submit" className="btn btn-primary" disabled={!audioFile}>
                        Add
                    </button>
                </form>
            </Modal>


            <TableContent dataSource={podcasts} columns={columns}/>
            {toast && (
          <Toast
            message={toast?.message}
            type={toast?.type}
            onClose={() => setToast(false)}
          />
        )}
        </div>
    );
}
