import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DropMenu from "../../components/dropmenu";
import AddPackage from "../../components/Packages/add";
import DeletePackage from "../../components/Packages/delete";
import EditPackage from "../../components/Packages/edit";
import ShowHidePackages from "../../components/Packages/showHide";
import CustomTable from "../../components/table";
import { docUrl, secondUrl } from "../../utils/baseUrl";
import PdfOpen from "../../components/Packages/pdf";
import AddUnit from "./AddUnit";
import { editIcon } from "../../assets/svgIcons";
import EditUnit from "./EditUnit";
import Modal from "../../components/modal";
import axios from "axios";
import Toast from "../../components/toast";

function Unit() {
  const [toast , setToast] = useState(false)
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openShowHideModal, setOpenShowHideModal] = useState(false);
  const [packagesData, setPackagesData] = useState([]);
  const [pdfOpen, setPdfOpen] = useState(null);
  const [deleteModal , setDeleteModal] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [getUnitsLoading, setgetUnitsLoading] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [rowData,setRowData]=useState({})
  const {id}=useParams()
  console.log(id)

  const columns = [
    {
      key: "id",
      title: "*",
      dataIndex: "unit_id",
      search: true,
    },
    {
      key: "name",
      title: "إسم الوحده",
      dataIndex: "unit_name",
      search: true,
    },
    {
      key: "Actions",
      title: "الأوامر",
      dataIndex: "actions",
      render: (text, row) => (
        <div>
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
    setDeleteModal(true)
  }}
>
  <div className="btn btn-danger">حذف</div>
  {/* {editIcon} */}
</div>
<div
  className="open-btn c-pointer text-primary"
  onClick={() => navigate(`${row?.unit_id}/lessons`)}
>
  <div className="btn btn-primary">الدروس</div>
</div>
</div>
          {/* <div
            className="delete-btn c-pointer text-danger"
            onClick={() => setOpenDeleteModal(row)}
          >
            <div className="tooltip">Delete</div>
            {deleteIcon}
          </div>*/}

          {/* <DropMenu>
            
          </DropMenu> */}
        </div>
      ),
    },
  ];

  const getUnits = async () => {
    setgetUnitsLoading(true);
    setIsPageLoading(true);

    let data_to_send = {
      generation_id: id,
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
      setgetUnitsLoading(false);
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    getUnits();
  }, []);

  function handleDeleteUnit() {
    const data_send = {
      unit_id : +rowData?.unit_id,
    }

    axios.post("https://camp-coding.online/Teacher_App_2024/Mahmoud_Ammar/doctor/home/q_bank/delete_qbank_unit.php",data_send)
    .then(res => {
      console.log(res)
      if(res?.data == "success") {
        setToast({type:"success",message :"تم حذف الوحده بنجاح"})
        getUnits();
        setDeleteModal(false)
      }else {
        setToast({type:"error",message: "هناك مشكله في حذف الوحدة"}) 
      }
    })
  }

  return (
    <div className="packages">
      <div className="tablePageHeader">
        <h1 className="pageTitle">وحدات</h1>
        <button
          className="btn btn-success"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          إضافه وحده
        </button>
      </div>
      <CustomTable dataSource={packagesData} columns={columns} />
      <Modal visible={deleteModal} close={setDeleteModal} title={"حذف وحده"} footer={null}>
        <h5>هل تريد حذف هذه الوحده؟</h5>
        <div className="d-flex gap-2">
           <button className="btn btn-danger" onClick={handleDeleteUnit}>تأكيد</button>
           <button className="btn btn-primary" onClick={() => setDeleteModal(false)}>إلغاء</button>
        </div>
      </Modal>

      <PdfOpen
        getFunction={getUnits}
        openModal={pdfOpen}
        setOpenModal={setPdfOpen}
      />
      <AddUnit
        getFunction={getUnits}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
      <EditUnit
        getFunction={getUnits}
        openModal={openEditModal}
        rowData={rowData}
        setRowData={setRowData}
        setOpenModal={setOpenEditModal}
      />
      <DeletePackage
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
      />
      <ShowHidePackages
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

export default Unit;
