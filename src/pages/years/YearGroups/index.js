import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  students,
  examIcon,
  GroupsIcon,
  closedEye,
  deleteIcon,
  editIcon,
  lectures,
  openedEye,
} from "../../../assets/svgIcons";
import AddGroupModal from "../../../components/groups/add";
import AssignToGroup from "../../../components/groups/assign";
import DeleteGroupModal from "../../../components/groups/delete";
import EditGroupModal from "../../../components/groups/edit";
import ShowHideGroupModal from "../../../components/groups/show-hide";
import CustomTable from "../../../components/table";
import DropMenu from "../../../components/dropmenu";
import Modal from "../../../components/modal";
import axios from "axios";
import Loader from "../../../components/loader";
import Toast from "../../../components/toast";
import { docUrl } from "../../../utils/baseUrl";

function Groups() {
  const [toast , setToast] = useState(false);
  const [groups, setGroups] = useState([]);
  const [studentsData, setStudents] = useState([]);
  const [deleteModal , setDeleteModal] = useState(false);
  const [rowData , setRowData] = useState({})
  const { id } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [assignModal, setAssignModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [showHideModal, setShowHideModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [groupData , setGroupData] = useState({
    group_name:""
  })

  const navigate = useNavigate();

  const getGroups = async () => {
    try {
      const response = await fetch(
        "https://camp-coding.online/Teacher_App_2024/Mahmoud_Ammar/doctor/home/select_groups.php",
        {
          method: "POST",
          header: { "Content-Type": "Application/Json" },
          body: JSON.stringify({ generation_id: id }),
        }
      );
      const data = await response.json();
      setGroups(data);
    } catch (err) {
      setGroups([]);
    }
  };

  useEffect(() => {
    getGroups();
  }, []);

  const columns = [
    {
      key: "groupName",
      title: "اسم المجموعة",
      dataIndex: "group_name",
      search: true,
    },
    {
      key: "actions",
      title: "أوامر",
      dataIndex: "actions",
      render: (text, row) => {
        return (
          <div className="actions-btn">
          {/* <div
            onClick={() => navigate(`${row.group_id}/groupStudents`)}
            className="open-btn c-pointer btn btn-primary"
          >
           Students
          </div> */}
          {row?.gen?.type == "سنتر"?<div
            onClick={() => navigate(`${row.group_id}/exams`)}
            className="open-btn c-pointer btn btn-primary"
          >
           الامتحانات
          </div>:null}

          <div
            className="open-btn c-pointer btn btn-primary"
            onClick={() => navigate(`${row?.group_id}/Packages`)}
          >
            الباقات
          </div>
          <div
            className="open-btn c-pointer btn btn-primary"
            onClick={() => navigate(`${row?.group_id}/inquires`)}
          >
            الاستفسارات
          </div>
          <div
            className="open-btn c-pointer btn btn-primary"
            onClick={()=>setEditModal(row)}
          >
            تعديل
          </div>

          <div
            className="open-btn btn btn-danger c-pointer btn btn-primary"
            onClick={
              ()=>{
                console.log(row)
                setDeleteModal(row)
                setRowData(row)
              }
            }
          >
            حذف
          </div>
        </div>
        );
      },
    },
  ];

  function handleDeleteGroup() {
    const data_send = {
      group_id : rowData?.group_id,
    }

    axios.post("https://camp-coding.online/Teacher_App_2024/Mahmoud_Ammar/doctor/home/delete_group.php",data_send)
    .then(res => {
      console.log(res)
      if(res?.data?.status =="success") {
        setToast({type:"success",message:res?.data?.message})
        getGroups()
        setDeleteModal(false)
      }else {
        setToast({type:"error",message:res?.data?.message || "هناك مشكله ف حذف المجموعه"})
      }
    }).catch(e => console.log(e))
    .finally(() => setDeleteModal(false))
  }

  function handleAddGroup(e) {
    e.preventDefault();
    const data_send = {
      ...groupData,
      generation_id : id
    }

    axios.post("https://camp-coding.online/Teacher_App_2024/Mahmoud_Ammar/doctor/home/add_group.php" , data_send)
    .then(res => {
      console.log(res)
      if(res?.data == "success"){
        setToast({type:"success",message:"تم إضافة مجموعة بنجاح"})
        getGroups();
        setGroupData({
          group_name:""
        })
      }else {
        setToast({type:"error",message: "هناك مشكله في إضافة مجموعه"});
      }
    }).catch(e => console.log(e))
    .finally(() => setAddModal(false))
  }
 
  return (
    <div className="groups">
      <div className="tablePageHeader">
        <h1 className="pageTitle">المجموعات</h1>
        <button
          className="btn btn-success"
          onClick={() => {
            setAddModal(true);
          }}
        >
          إضافة مجموعة
        </button>
      </div>

      <Modal
      close={setDeleteModal}
      footer={false}
      title={"حذف المجموعة"}
      visible={deleteModal}
    >
      <div className="delete-warning">
        <h3>هل أنت متأكد أنك تريد حذف هذه المجموعة؟
        </h3>
        <p className="warning-message">
        لا يمكن التراجع عن هذا الإجراء. الرجاء تأكيد أنك تريد الحذف
        ما يلي:
        </p>
        <div className="year-details">
          <strong>الاسم:</strong> {rowData?.group_name}
        </div>
        <div className="rowEndDiv">
          {rowData?.loading ? (
            <Loader />
          ) : (
            <>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteGroup}
              >
                حذف
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDeleteModal(false)}
              >
                إلغاء
              </button>
            </>
          )}
        </div>
        {toast && (
          <Toast message={"حدث خطأ. الرجاء المحاولة مرة أخرى."} type={"error"} onClose={() => setToast(false)} />
        )}
      </div>
    </Modal>

    <Modal visible={addModal} close={setAddModal} title={"إضافة مجموعة"} footer={null}>
      <form onSubmit={handleAddGroup}>
        <div className="form-group">
           <label className="form-label">اسم المجموعه</label>
           <input type="text" className="form-input" placeholder="اسم المجموعه" value={groupData?.group_name} onChange={(e) => setGroupData({...groupData , group_name:e.target.value})}/>
        </div>

        <button className="btn btn-primary">إضافة</button>
      </form>
    </Modal>

      <CustomTable dataSource={groups} columns={columns} />
      <AssignToGroup openModal={assignModal} setOpenModal={setAssignModal} />
      {/* <AddGroupModal openModal={addModal} setOpenModal={setAddModal} /> */}
      {/* <DeleteGroupModal openModal={deleteModal} setOpenModal={setDeleteModal} /> */}
      <ShowHideGroupModal
        openModal={showHideModal}
        setOpenModal={setShowHideModal}
      />
      <EditGroupModal openModal={editModal} setOpenModal={setEditModal} getFunction={getGroups} />

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

export default Groups;
