import React, { useState, useEffect } from "react";
import CustomTable from "../../components/table";
import "./style.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  AbsentStudents,
  books,
  closedEye,
  days,
  deleteIcon,
  editIcon,
  openedEye,
  quiz,
  video,
} from "../../assets/svgIcons";
import AddDay from "../../components/days/add";
import EditDay from "../../components/days/edit";
import DeleteDay from "../../components/days/delete";
import ShowHideDays from "../../components/days/showHide";
import { baseUrl, docUrl, secondUrl } from "../../utils/baseUrl";
import DropMenu from "../../components/dropmenu";
import axios from "axios";
import Modal from "../../components/modal";
import Toast from "../../components/toast";
import Loader from "../../components/loader";

function Days() {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openShowHideModal, setOpenShowHideModal] = useState(false);
  const [initialDayData, setInitialDayData] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [rowData , setRowData] = useState({});
  const [toast , setToast] = useState(false);

  const columns = [
    {
      key: "name",
      title: "Day Name",
      dataIndex: "lec_title",
      search: true,
    },
    {
      key: "lec_cover_link",
      title: "Image",
      dataIndex: "lec_cover_link",
      render: (row) => {
        console.log(row);
        return <img src={row} style={{ width: "100px" }} alt="" className="" />;
      },
    },
    {
      key: "description",
      title: "Description",
      dataIndex: "lec_descriprion",
      render: (text) => <p className="lecture-description">{text}</p>,
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
          </div> */}
          {/* <div
            className="open-btn c-pointer text-primary"
            onClick={() => setOpenEditModal(row)}
          >
            <div className="tooltip">Edit</div>
            {editIcon}
          </div> */}
                      <div className="actions-btn">
              {/* <div
                className="open-btn c-pointer text-primary"
                onClick={() => navigate(`${row?.lec_id}/quiz?type=${"lec"}`)}
              >
                <div className="btn btn-primary">Quiz</div>

              </div> */}
              <div
                className="open-btn c-pointer text-success"
                onClick={() =>
                  navigate(
                    `${row?.lec_id}/videos`
                  )
                }
              >
                <div className="btn btn-primary">Video</div>
              </div>

              <button className="btn btn-primary" onClick={() => {
                console.log(row);
                setRowData(row);
                setOpenEditModal(true);
              }}>Edit</button>
              <button className="btn btn-danger" onClick={() => {
                console.log(row);
                setRowData(row);
                setOpenDeleteModal(true);
              }}>Delete</button>
              {/* <div
            className="open-btn c-pointer text-primary"
            onClick={() => navigate(`/lectures/${row?.lec_id}/score`)}
          >
            <div className="btn btn-success">Scores</div>
          </div> */}
            </div>
          {/* <DropMenu child={"Actions"}>


          </DropMenu> */}
          {/* <div
            className="open-btn c-pointer text-danger"
            onClick={() => navigate(`${row?.lec_id}/AbsentStudents`)}
          >
            <div className="tooltip">Absent Students</div>
            {AbsentStudents}
          </div> */}

        </div>
      ),
    },
  ];
  const { pack, group, lecture } = useParams();
  const getAllMyVediosFor = async () => {
    setIsPageLoading(true);

    let data_to_send = {
      package_id : pack,
      // group_id: group,
      // package: pack,

    };


    console.log(data_to_send)

    console.log(JSON.stringify(data_to_send));

    try {
      const response = await fetch(docUrl + "/home/select_lectures.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data_to_send),
      });

      const resData = await response.json();
      console.log( "select_data_res" ,  response);

      if (Array.isArray(resData) && resData.length !== 0) {
        const allData = resData.map((item) => ({
          ...item,
        }));

        setInitialDayData(allData);
      } else {
        setInitialDayData([]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    getAllMyVediosFor();
  }, []);

  function handleDeleteLecture() {
    const data_send = {
      lec_id : rowData?.lec_id
    }

    axios.post(docUrl + "/home/delete_lec.php",data_send)
    .then(res => {
      if(res?.data?.status == "success") {
        setToast({type:"success",message:"تم الحذف بنجاح"});
        getAllMyVediosFor();
        setOpenDeleteModal(false);
      }else {
        setToast({type:"error",message:"حدث خطأ ما"});
      }
    }).catch(e => console.log(e))
    .finally(() => setOpenDeleteModal(false));
  }

  function handleEditDay(e) {
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

      <CustomTable dataSource={initialDayData} columns={columns} />

      <Modal visible={openDeleteModal} close={setOpenDeleteModal} title={"حذف اليوم"}>
      <div className="delete-warning">
        <h3>هل أنت متأكد أنك تريد حذف هذا اليوم؟
        </h3>
        <p className="warning-message">
        لا يمكن التراجع عن هذا الإجراء. الرجاء تأكيد أنك تريد الحذف
        في اليوم التالي:
        </p>
        <div className="day-details">
          <strong>اسم اليوم:</strong> {rowData?.lec_title}
        </div>
        <div className="rowEndDiv">
        <>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteLecture}
              >
                حذف
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setOpenDeleteModal(false)}
              >
                إلغاء
              </button>
            </>
        </div>
       
      </div>
      </Modal>

      <Modal visible={openEditModal} close={setOpenEditModal} title={"تعديل اليوم"}>
      <form onSubmit={handleEditDay} className="animated-form">
        <div className="form-group">
          <label htmlFor="dayName" className="form-label">
             اسم اليوم
          </label>
          <input
            type="text"
            id="dayName"
            placeholder="ادخل اسم اليوم"
            value={rowData.lec_title}
            onChange={(e) =>
              setRowData({ ...rowData, lec_title: e.target.value })
            }
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="dayName" className="form-label">
            رقم اليوم
          </label>
          <input
            type="text"
            id="dayName"
            placeholder="ادخل رقم اليوم"
            value={rowData.lec_arrangement}
            onChange={(e) =>
              setRowData({ ...rowData, lec_arrangement: e.target.value })
            }
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="dayDescription" className="form-label">
             وصف اليوم
          </label>
          <input
            type="text"
            id="dayDescription"
            placeholder="ادخل وصف اليوم"
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

      <AddDay  toast={toast} setToast={setToast} getFunction={getAllMyVediosFor} openModal={openModal} setOpenModal={setOpenModal} />
      {/* <EditDay openModal={openEditModal} setOpenModal={setOpenEditModal} /> */}
      {/* <DeleteDay
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
      /> */}
      <ShowHideDays
        openModal={openShowHideModal}
        setOpenModal={setOpenShowHideModal}
      />

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

export default Days;
