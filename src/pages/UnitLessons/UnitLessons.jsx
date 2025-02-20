import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DropMenu from "../../components/dropmenu";

import CustomTable from "../../components/table";
import { docUrl, secondUrl } from "../../utils/baseUrl";
import PdfOpen from "../../components/Packages/pdf";
import { editIcon } from "../../assets/svgIcons";
import AddLesson from "./AddLesson";
import EditLesson from "./EditLesson";
import axios from "axios";
import Toast from "../../components/toast";
import Modal from "../../components/modal";

function UnitLessons() {
  const [toast , setToast] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openShowHideModal, setOpenShowHideModal] = useState(false);
  const [packagesData, setPackagesData] = useState([]);
  const [pdfOpen, setPdfOpen] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [getLessonsLoading, setgetLessonsLoading] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [rowData,setRowData]=useState({})
  const {id}=useParams()
  console.log(id)

  const columns = [
    {
      key: "id",
      title: "*",
      dataIndex: "lesson_id",
      search: true,
    },
    {
      key: "name",
      title: "إسم الدرس",
      dataIndex: "lesson_name",
      search: true,
    },
    {
      key: "actions",
      title: "الأوامر",
      dataIndex: "actions",
      render: (text, row) => (
        <div>
          {/* <div
            className="delete-btn c-pointer text-danger"
            onClick={() => setOpenDeleteModal(row)}
          >
            <div className="tooltip">Delete</div>
            {deleteIcon}
          </div>*/}
 <div className="actions-btns">


<div
  className="open-btn c-pointer text-primary"
  onClick={() => {
    setRowData(row)
    setOpenEditModal(true)
  }}
>
  <div className="btn btn-primary">تعديل</div>
  {/* {editIcon} */}
</div>

<div
  className="open-btn c-pointer text-primary"
  onClick={() => {
    console.log(row)
    setRowData(row)
    setOpenDeleteModal(true)
  }}
>
  <div className="btn btn-danger">حذف</div>
  {/* {editIcon} */}
</div>

<div
  className="open-btn c-pointer text-primary"
  onClick={() => navigate(`${row?.lesson_id}/questions_bank`)}
>
  <div className="btn btn-primary">بنك أسئله الدرس</div>
</div>
</div>
          {/* <DropMenu>
           
          </DropMenu> */}
        </div>
      ),
    },
  ];

  const getLessons = async () => {
    setgetLessonsLoading(true);
    setIsPageLoading(true);

    let data_to_send = {
      unit_id: id,
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
          setPackagesData([]);
          setSelectedPackageId("");
        } else {
          setPackagesData(resData);
          setSelectedPackageId(resData[0]);
        }
      } else {
        console.error("Please try again later.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setgetLessonsLoading(false);
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    getLessons();
  }, []);

  function handleDeleteLesson() {
    const data_send = {
      lesson_id : +rowData?.lesson_id
    }
    axios.post("https://camp-coding.online/Teacher_App_2024/Mahmoud_Ammar/doctor/home/q_bank/delete_qbank_lesson.php",data_send)
    .then(res => {
      if(res?.data == "success") {
        setToast({type:"success",message :"تم حذف الدرس بنجاح"})
        getLessons();
        setOpenDeleteModal(false)
      }else {
        setToast({type:"error", message:"هناك مشكله في حذف درس الوحده"}) 
      }
    })
  }

  return (
    <div className="packages">
      <div className="tablePageHeader">
        <h1 className="pageTitle">دروس الوحده</h1>
        <button
          className="btn btn-success"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          إضافه درس
        </button>
      </div>

      <Modal visible={openDeleteModal} close={setOpenDeleteModal} title={"حذف درس"} footer={null}>
        <h5>هل تريد حذف هذه الدرس؟</h5>
        <div className="d-flex gap-2">
           <button className="btn btn-danger" onClick={handleDeleteLesson}>تأكيد</button>
           <button className="btn btn-primary" onClick={() => setOpenDeleteModal(false)}>إلغاء</button>
        </div>
      </Modal>

      <CustomTable dataSource={packagesData} columns={columns} />
      <PdfOpen
        getFunction={getLessons}
        openModal={pdfOpen}
        setOpenModal={setPdfOpen}
      />
      <AddLesson
        getFunction={getLessons}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
      <EditLesson
        getFunction={getLessons}
        openModal={openEditModal}
        rowData={rowData}
        setRowData={setRowData}
        setOpenModal={setOpenEditModal}
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

export default UnitLessons;
