import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import AddVideo from "../../../components/days/videos/add";
import DeleteVideo from "../../../components/days/videos/delete";
import EditVideo from "../../../components/days/videos/edit";
import PdfOpen from "../../../components/days/videos/pdf";
import ShowHideVideo from "../../../components/days/videos/showHide";
import DropMenu from "../../../components/dropmenu";
import CustomTable from "../../../components/table";
import "./style.css";
import Toast from "../../../components/toast";
import Modal from "../../../components/modal";
import Loader from "../../../components/loader";
import { docUrl } from "../../../utils/baseUrl";
import { FaTrash } from "react-icons/fa";

function Videos() {
  const [toast , setToast] = useState(false);
  const [videos, setVideos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [selectedLecture , setSelectedLecture] = useState({});
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openShowHideModal, setOpenShowHideModal] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [rowData , setRowData] = useState({});
  const [img , setImg] = useState("");
  const [imgFile , setImgFile] = useState(null);
  const [videoRes,setVideoRes] = useState("");
  const { lecture, pack, yearId, group, lec_videos_ids, day , lec_id } = useParams();
const location = useLocation()
  const [getNew, setGetNew] = useState(null)
  const [videoData] = useSearchParams();

  console.log(day);

  useEffect(() => {
    if(videoData?.get("lec_videos_ids")&&!videoData?.get("lec_videos_ids") != null){
    setGetNew(videoData?.get("lec_videos_ids"))
  }}, [location.pathname, videoData?.get("lec_videos_ids")]);
  useEffect(()=>{
    getAllMyVediosFor()

  },[getNew])

  function handleGetAllLectures() {
    const data_send = {
      package_id : pack
    }
    axios.post(docUrl +"/home/select_lectures.php",data_send)
    .then(res => {
      if(res?.data) {
        setSelectedLecture(res?.data?.find(item => item?.lec_id == lec_id))
      }
    }).catch(e => console.log(e))
  }

  useEffect(() => {
    handleGetAllLectures();
  } , [])

  useEffect(() => {
    setGetNew(selectedLecture?.lec_videos_ids)
  } , [selectedLecture])


  const getAllMyVediosFor = async () => {
    setIsPageLoading(true);
    const data_to_send = {
      ids: getNew ,
    };
    

    try {
      const response = await axios.post(
        "https://camp-coding.online/Teacher_App_2024/Mahmoud_Ammar/doctor/home/select_videos_lec.php",
        data_to_send
      );

      console.log(response.data);
      setIsPageLoading(false);

      if (Array.isArray(response.data) && response.data.length !== 0) {
        const allData = response.data.map((item) => ({
          ...item,
          key: item.video_id,
          name: item.video_title,
          image: item.video_image_link,
          description: item.video_description,
          link: item.video_link,
          pdfLink: item.attach_pdf,
          deleteLoading: false,
          editLoading: false,
          hidden: false,
        }));
        setVideos(allData);
      } else {
        setVideos([]);
      }
    } catch (err) {
      console.error(err);
      setIsPageLoading(false);
    }
  };

  const columns = [
    {
      key: "name",
      title: "Video Name",
      dataIndex: "name",
      search: true,
    },
    {
      key: "image",
      title: "Image",
      dataIndex: "video_image_link",
      render: (text , row) => {
        console.log(row);
        return (
          <img src={row?.video_image_link || "https://camp-coding.online/Teacher_App_2024/Ahmed_Rabiea/img/rabiea.jpeg"} alt="Video" width="50" className="video-image" />
        )
      },
    },
    {
      key: "description",
      title: "Description",
      dataIndex: "description",
      render: (text) => <p className="video-description">{text}</p>,
    },
    {
      key: "actions",
      title: "Actions",
      dataIndex: "actions",
      render: (text, row) => (
        <div className="actions-btns">

        <div
          className="open-btn c-pointer text-primary"
          onClick={() => {
            console.log(row);
            setOpenEditModal(row);
            setRowData(row);
          }}
        >
          <div className="btn btn-warning" >Edit</div>

        </div>

        <div
          className="open-btn c-pointer text-primary"
         
        >
          <div className="btn btn-danger" onClick={() => {
            console.log(row)
            setRowData(row)
            setOpenDeleteModal(true)
          }} >Delete</div>

        </div>
        {/* <div
          className="open-btn c-pointer text-primary"
          onClick={() => window.open(row.link, "_blank")}
        >
          <div className="btn btn-primary">Watch</div>
        </div> */}
          <div
            className="open-btn c-pointer text-primary"
            onClick={() => {
              console.log(row)
              setPdfOpen(row)
            }}
          >
            <div className="btn btn-dark">PDF</div>
          </div>
        {/* <div
          className="open-btn c-pointer text-primary"
          onClick={() =>
            navigate(
              `/Videos/${row?.key}/score`
            )
          }
        >
          <div className="btn btn-success">Score</div>
        </div> */}
        <div
          className="open-btn c-pointer text-primary"
          onClick={() =>
            navigate(
              `/years/${yearId}/groups/${group}/Packages/${pack}/lectures/${lecture}/days/${row?.key}/quiz?type=vid`
            )
          }
        >
          <div className="btn btn-primary">Quiz</div>
        </div>
      </div>
      ),
    },
  ];


  function handleDeleteVideo() {
    const data_send  ={
      video_id : rowData?.video_id
    }
    axios.post(docUrl + "/home/delete_video.php",data_send)
    .then(res => {
      if(res?.data == "success") {
        setToast({type:"success",message:"تم الحذف بنجاح"});
        getAllMyVediosFor();
        setRowData({})
      }else {
        setToast({type:"error",message:"هناك خطأ ما"});
      }
    }).catch(e => console.log(e))
    .finally(() => setOpenDeleteModal(false))

  }

  function handleEditVideo(e) {
    e.preventDefault();
  
    // Validate required fields
    if (!rowData.video_title) {
      setToast({ type: "error", message: "يرجى ملء جميع الحقول الإلزامية" });
      return;
    }

    const updateVideoData = (imageLink = null) => {
      const dataToSend = {
        video_title : rowData?.video_title,
        video_description : rowData?.video_description || "",
        viemo_id : rowData?.video_player_id,
        video_id :rowData?.video_id,
        video_image_link: imageLink || rowData.video_image_link, // Use new image link if available
      };
  
      axios
        .post(docUrl + "/home/edit_video_data.php", dataToSend)
        .then((res) => {
          if (res?.data === "success") {
            setToast({ type: "success", message: "تم التعديل بنجاح" });
            getAllMyVediosFor();
            setOpenEditModal(false);
          } else {
            setToast({ type: "error", message: "هناك خطأ ما أثناء التعديل" });
          }
        })
        .catch(() => {
          setToast({ type: "error", message: "خطأ أثناء الاتصال بالخادم" });
        })
        .finally(() => setOpenEditModal(false));
    };
  
    if (imgFile) {
      // Upload the image if a new one is selected
      const formData = new FormData();
      formData.append("image", imgFile);
  
      axios
        .post(docUrl + "/home/image_uplouder.php", formData)
        .then((res) => {
          if (res?.data) {
            updateVideoData(res.data); // Use uploaded image link
          } else {
            setToast({ type: "error", message: "فشل رفع الصورة" });
          }
        })
        .catch(() => {
          setToast({ type: "error", message: "خطأ أثناء رفع الصورة" });
        });
    } else {
      // If no new image is selected, update directly
      updateVideoData();
    }
  }

  
  return (
    <div className="videos">
      <div className="tablePageHeader">
        <h1 className="pageTitle">Videos</h1>
        <button
          className="btn btn-success"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          اضافة فيديو
        </button>
      </div>
      <CustomTable dataSource={videos} columns={columns} />
      <AddVideo
      setGetNew={setGetNew}
      toast={toast}
      setToast={setToast}
        getFunction={getAllMyVediosFor}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />

      <Modal visible={openDeleteModal} close={setOpenDeleteModal} title={"حذف فيديو"}>
        <h3>هل تريد حذف هذا الفيديو؟</h3>
        <div className="d-flex gap-3">
          <button className="btn btn-primary" onClick={handleDeleteVideo}>تأكيد</button>
          <button className="btn btn-danger" onClick={() => setOpenDeleteModal(false)}>إلغاء</button>
        </div>
      </Modal>

      <Modal visible={openEditModal} close={setOpenEditModal} title={"تعديل الفيديو"}>
      <form onSubmit={handleEditVideo} className="animated-form">
        <div className="form-group">
          <label htmlFor="videoTitle" className="animated-label">
            عنوان الفيديو
          </label>
          <input
            type="text"
            id="videoTitle"
            placeholder="عنوان الفيديو"
            value={rowData.video_title}
            onChange={(e) =>
              setRowData({ ...rowData, video_title: e.target.value })
            }
            className="animated-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="viemoId" className="animated-label">
            رقم الفيديو (Vimeo ID)
          </label>
          <input
            type="text"
            id="viemoId"
            placeholder="Vimeo ID"
            value={rowData.video_player_id}
            onChange={(e) =>
              setRowData({ ...rowData, video_player_id: e.target.value })
            }
            className="animated-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="videoDescription" className="animated-label">
            الوصف
          </label>
          <textarea
            id="videoDescription"
            placeholder="الوصف"
            value={rowData.video_description}
            onChange={(e) =>
              setRowData({ ...rowData, video_description: e.target.value })
            }
          ></textarea>
        </div>
        
        {/* <div className="form-group">
          <label htmlFor="videoImage" className="animated-label">
            ادخل لينك الصوره
          </label>
          <input
            type="file"
            accept="image/*"
            id="videoImage"
            placeholder="لينك الصوره"
            onChange={(e) =>
             {
              setImg(URL.createObjectURL(e.target.files[0]))
              setImgFile(rowData?.video_image_link || e.target.files[0])
             }
            }
            className="animated-input"
          />
        </div> */}

<div className="form-group">
  <label htmlFor="videoImage" className="animated-label">ادخل صورة الفيديو</label>
  <input
    type="file"
    accept="image/*"
    id="videoImage"
    onChange={(e) => {
      const file = e.target.files[0];
      setImg(URL.createObjectURL(file)); // Show preview
      setImgFile(file);
    }}
    className="animated-input"
  />
  {
   <div className="d-flex gap-3 align-items-center">
     <img src={rowData?.video_image_link || "https://camp-coding.online/Teacher_App_2024/Ahmed_Rabiea/img/rabiea.jpeg" } style={{width:"80px",height:"80px"}} alt="Preview" className="image-preview" />
     <FaTrash style={{color:"red"}} onClick={() => {
      setRowData({...rowData , video_image_link : null})
     }}/>
   </div>
  }
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

      {/* <EditVideo getFunction={getAllMyVediosFor} openModal={openEditModal} setOpenModal={setOpenEditModal} /> */}
      {/* <DeleteVideo
        toast={toast}
        setToast={setToast}
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
      /> */}
      <ShowHideVideo
        openModal={openShowHideModal}
        setOpenModal={setOpenShowHideModal}
      />
      <PdfOpen getFunction={getAllMyVediosFor} openModal={pdfOpen} setOpenModal={setPdfOpen} />

      {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(false)}
          />
        )}
    </div>
  );
}

export default Videos;
