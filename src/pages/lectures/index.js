import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  days
} from "../../assets/svgIcons";
import AddLecture from "../../components/Lectures/add";
import DeleteLecture from "../../components/Lectures/delete";
import EditLecture from "../../components/Lectures/edit";
import ShowHideLectures from "../../components/Lectures/showHide";
import CustomTable from "../../components/table";
import { docUrl, secondUrl } from "../../utils/baseUrl";
import "./style.css";
import Modal from "../../components/modal";
import axios from "axios";
import Toast from "../../components/toast";
import Loader from "../../components/loader";
import { FaTrash } from "react-icons/fa";

function Lectures() {
  const [toast , setToast] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openShowHideModal, setOpenShowHideModal] = useState(false);
  const [initialLectureData, setInitialLectureData] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [rowData , setRowData] = useState({});
  const [allLectures , setAllLectures] = useState([]);

  const columns = [
    {
      key: "lec_title",
      title: "Lecture Name",
      dataIndex: "lec_title",
      search: true,
    },
    {
      key: "lec_cover_link",
      title: "Image",
      dataIndex: "lec_cover_link",
      render: (row) => {
        console.log(row);
        return (
          <img
            src={row?.lec_cover_link}
            style={{ width: "100px" }}
            alt=""
            className=""
          />
        );
      },
    },
    {
      key: "lec_descriprion",
      title: "Description",
      dataIndex: "lec_descriprion",
      render: (text , row) => <p className="lecture-description">{row?.lec_descriprion}</p>,
    },
    {
      key: "actions",
      title: "Actions",
      dataIndex: "actions",
      render: (text, row) => (
        <div className="actions-btns">
          {/* <div
            className="delete-btn c-pointer text-danger"
            onClick={() => setOpenDeleteModal(row)}
          >
            <div className="tooltip">Delete</div>
            {deleteIcon}
          </div>
          <div
            onClick={() => setOpenShowHideModal(row)}
            className={
              row?.hidden
                ? "showhide-btn c-pointer text-success"
                : "showhide-btn c-pointer text-danger"
            }
          >
            <div className="tooltip">{row?.hidden ? "Show" : "Hide"}</div>
            {row?.hidden ? closedEye : openedEye}
          </div>
          <div
            className="open-btn c-pointer text-primary"
            onClick={() => setOpenEditModal(row)}
          >
            <div className="tooltip">Edit</div>
            {editIcon}
          </div> */}
          <div
            className="open-btn c-pointer text-primary"
            onClick={() => navigate(`${row?.lec_id}/videos`)}
          >
            
              <button className="btn btn-success">Videos</button>
            </div>

          <div
            // className="open-btn c-pointer btn btn-primary text-primary"
            // onClick={() => navigate(`${row?.subject_id}/days`)}
          >
            <button className="btn btn-primary" onClick={() => {
              console.log(row);
              setRowData(row);
              setOpenEditModal(true);
            }}>Edit</button>
            {/* <div className="tooltip">Edit</div> */}
              
          </div>

          <div
            // className="open-btn c-pointer btn btn-primary text-primary"
            // onClick={() => navigate(`${row?.subject_id}/days`)}
          >
            <button className="btn btn-danger" onClick={() => {
              console.log(row);
              setRowData(row);
              setOpenDeleteModal(true);
            }}>Delete</button>
            {/* <div className="tooltip">Edit</div> */}
              
          </div>
        </div>
      ),
    },
  ];
  const { pack, group } = useParams();
  // const getAllMyVediosFor = async () => {
  //   setIsPageLoading(true);

  //   let data_to_send = {
  //     package_id: pack,
  //   };

  //   console.log(JSON.stringify(data_to_send));

  //   try {
  //     const response = await fetch(docUrl + "/home/select_lectures.php", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data_to_send),
  //     });
      
  //     const resData = await response.json();
  //     console.log(resData)
  //     setAllLectures(resData);

  //     if (Array.isArray(resData.subjects) && resData.subjects.length !== 0) {
  //       const allData = resData.subjects.map((item) => ({
  //         ...item,
  //         deleteLoading: false,
  //         editLoading: false,
  //       }));
  //       console.log(initialLectureData);
  //       setInitialLectureData(resData);
  //     } else {
  //       setInitialLectureData([]);

  //     }
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     setIsPageLoading(false);
  //   }
  // };


  function getAllMyVediosFor() {
    const data_send = {
      package_id: pack, 
      group_id: group
    }

    axios.post(docUrl + "/home/select_lectures.php",data_send)
    .then(res => {
      console.log(res)
      if(res?.data) {
        setAllLectures(res?.data)
      }
    }).catch(e => console.log(e))
  }
  useEffect(() => {
    getAllMyVediosFor()
    // getAllMyVediosFor();
  }, []);

  function handleDeleteLecture() {
    // console.log(rowData);
    const data_send = {
      lec_id : rowData?.lec_id
    }
    console.log(data_send);
    axios.post(docUrl +"/home/delete_lec.php", data_send)
    .then(res => {
      if(res?.data?.status=="success") {
        setToast({type:"success" ,message: res?.data?.message});
        getAllMyVediosFor();
        setOpenDeleteModal(false);
      }
    }).catch(e => console.log(e))
    .finally(() => setOpenDeleteModal(false))
  }

  // function handleEditLecture(e) {
  //   e.preventDefault();
  //   const data_send ={
  //     ...rowData,
  //   }
    
  // }

  function handleEditLecture(e) {
    e.preventDefault();
    if(rowData?.lec_title == "") {
      setToast({type:"error",message:"ادخل عنوان اليوم أولا!"});
      return;
    }

    const data_send = {
      lec_sub_id : rowData?.lec_sub_id,
      lec_title : rowData?.lec_title || "",
      lec_descriprion :  rowData?.lec_descriprion || "",
      lec_arrangement: rowData?.lec_arrangement || "",
      lecture_price : rowData?.lecture_price || 0,
      lec_id : rowData?.lec_id
    }
    axios.post(docUrl + "/home/edit_lec.php",data_send)
    .then(res => {
      console.log(res)
      if(res?.data =="success") {
        setToast({type:"success",message:"تم التعديل بنجاح"});
        getAllMyVediosFor();
        setOpenEditModal(false);
      }else {
        setToast({type:"error",message :"هناك خطأ ما"});
      }
    }).catch(e => console.log(e))
    .finally(() => setOpenEditModal(false));
  }


  const handleImageChange = (e) => {
    setRowData({ ...rowData, subject_image: URL.createObjectURL(e.target.files[0]) });
  };

  const removeImage = () => {
    setRowData({ ...rowData, subject_image: null });
  };

  return (
    <div className="lectures">
      <div className="tablePageHeader">
        <h1 className="pageTitle">Lectures</h1>
        <button
          className="btn btn-success"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          اضافه محاضره
        </button>
      </div>
      <Modal visible={openDeleteModal} close={setOpenDeleteModal} title="حذف المحاضره">
      <div className="delete-warning">
        <h3>Are you sure you want to delete this lecture?</h3>
        <p className="warning-message">
          This action cannot be undone. Please confirm that you want to delete
          the following lecture:
        </p>
        <div className="lecture-details">
          <strong>Title:</strong> {rowData?.subject_name}
        </div>
        <div className="lecture-details">
          <strong>Description:</strong> {rowData?.subject_description}
        </div>
        {rowData?.subject_image && (
          <div className="lecture-image">
            <img src={rowData?.subject_image} alt="Lecture" />
          </div>
        )}
        <div className="rowEndDiv">
        <>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteLecture}
              >
                Delete
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setOpenDeleteModal(false)}
              >
                Cancel
              </button>
            </>
          {/* {rowData?.deleteLoading ? (
            <Loader />
          ) : (
            <>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteLecture}
              >
                Delete
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setOpenDeleteModal(false)}
              >
                Cancel
              </button>
            </>
          )} */}
        </div>
      </div>
      </Modal>

       <Modal visible={openEditModal} close={setOpenEditModal} title="تعديل المحاضره">
       <form onSubmit={handleEditLecture} className="animated-form">
        <div className="form-group">
          <label htmlFor="dayName" className="form-label">
             اسم المحاضره
          </label>
          <input
            type="text"
            id="dayName"
            placeholder="ادخل اسم المحاضره"
            value={rowData.lec_title}
            onChange={(e) =>
              setRowData({ ...rowData, lec_title: e.target.value })
            }
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="dayName" className="form-label">
            رقم المحاضره
          </label>
          <input
            type="text"
            id="dayName"
            placeholder="ادخل رقم المحاضره"
            value={rowData.lec_arrangement}
            onChange={(e) =>
              setRowData({ ...rowData, lec_arrangement: e.target.value })
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
            value={rowData.lec_descriprion}
            onChange={(e) =>
              setRowData({ ...rowData, lec_descriprion: e.target.value })
            }
            className="form-input"
          />
        </div>
        <div className="form-footer">
            <button type="submit" className="form-submit-btn">
              حفظ
            </button>
        </div>

      </form>
       </Modal>

      <CustomTable dataSource={allLectures} columns={columns} />
      <AddLecture toast={toast} setToast={setToast} getFunction={getAllMyVediosFor} openModal={openModal} setOpenModal={setOpenModal} />
      {/* <EditLecture openModal={openEditModal} setOpenModal={setOpenEditModal} /> */}
      {/* <DeleteLecture
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
      /> */}
      <ShowHideLectures
        openModal={openShowHideModal}
        setOpenModal={setOpenShowHideModal}
      />
      {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(false)} />
        )}
    </div>
  );
}

export default Lectures;
