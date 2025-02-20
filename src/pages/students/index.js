import React, { useEffect, useState } from "react";
import CustomTable from "../../components/table";
import "./style.css";
import { baseUrl, docUrl, secondUrl } from "../../utils/baseUrl";
import Toast from "../../components/toast";
import ChangeGroup from "../../components/students/changegroup";
import SelectComponent from "../../components/selectBox";
import Modal from "../../components/modal";
import axios from "axios";
// import { setHours } from "react-datepicker/dist/date_utils";

// ConfirmModal Component
function ConfirmModal({ visible, onClose, onConfirm, message }) {
  if (!visible) return null;

  return (
    <Modal close={onClose} footer={false} title={"تأكيد الإجراء"} visible={visible}>
      <div className="confirm-modal">
        <p>{message}</p>
        <div className="confirm-modal-buttons">
          <button className="btn btn-danger" onClick={onClose}>
            إلغاء
          </button>
          <button className="btn btn-success" onClick={onConfirm}>
            تأكيد
          </button>
        </div>
      </div>
    </Modal>
  );
}

function Students() {
  const [toast, setToast] = useState(false);
  const [openChangeGroup, setOpenChangeGroup] = useState(false);
  const [students, setStudents] = useState(null);
  const [rowData , setRowData] = useState({});
  const [openAddSubCard, setOpenAddSubCard] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [years, setYears] = useState([]);
  const [groups, setGroups] = useState([]);
  const [generations , setGenerations] = useState([]);
  const [updateStudentModal , setUpdateStudentModal] = useState(false);
  const [packages, setPackages] = useState([]);
  const [generationsType , setGenerationsType] = useState([]);
  const [generationGroup , setGenerationGroup] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState({
    centerType: "",
    gen_id: "",
    group_id: "",
    package_id: "",
  });
  const [confirmAction, setConfirmAction] = useState({
    visible: false,
    message: "",
    onConfirm: null,
  }); // State for confirmation modal
  const [updateStudentData , setUpdateStudentData] = useState({
    type:"",
    gen:"",
    group:"",
  })
  useEffect(() => {
    getStudents();
    getYears();
  }, []);

  const getStudents = async () => {
    try {
      const response = await fetch(baseUrl + "select_all_students.php");
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setStudents([]);
    }
  };

  const getYears = async () => {
    try {
      const yearsData = await fetch(baseUrl + "subscriptions/select_genrations.php");
      const data = await yearsData.json();
      setYears(data);
    } catch (err) {
      setYears([]);
    }
  };


  function handleGetAllGenerations() {
    axios.get(baseUrl +"select_genrations.php")
    .then(res => {
      if(res?.data) {
        setGenerations(res?.data)
      }
    }).catch(e => console.log(e))
  }

  useEffect(() => {
    handleGetAllGenerations();
  } ,[])

  useEffect(() => {
    if(updateStudentData?.type == "سنتر") {
      const filteredGenerations = generations?.filter(item => item?.type == "سنتر")
      setGenerationsType(filteredGenerations)
    }else {
      const filteredGenerations = generations?.filter(item => item?.type == "اونلاين")
      setGenerationsType(filteredGenerations)
    }
  } , [generations , updateStudentData?.type])

  useEffect(() => {
    if (subscriptionData.gen_id) {
      const selectedYear = years.find((year) => year.gen_id === subscriptionData.gen_id);
      setGroups(selectedYear?.groups || []);
    }
  }, [subscriptionData.gen_id]);

  useEffect(() => {
    if (subscriptionData.group_id) {
      const selectedGroup = groups.find((group) => group.group_id === subscriptionData.group_id);
      setPackages(selectedGroup?.packages || []);
    }
  }, [subscriptionData.group_id]);

  useEffect(() =>{
    setUpdateStudentData({...updateStudentData , type : rowData?.type , student_id : rowData?.student_id})
  } , [rowData])

  const handleCreateSubscription = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(secondUrl + "add_student_sub.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...subscriptionData,
          student_id: selectedStudent?.student_id,
        }),
      });
      const result = await response.text();
      setToast({ message: result, type: "success" });
      setOpenAddSubCard(null);
      setSelectedStudent(null); // Reset the selected student after creation
    } catch (error) {
      setToast({ message: "Error creating subscription", type: "error" });
    }
  };

  // Function to change subscription status (0 or 1)
  const changeSubscriptionStatus = async (student_id, package_id, status) => {
    try {
      const response = await fetch(docUrl + "/home/status_student_sub.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ student_id, package_id, status }),
      });
      const result = await response.text();
      setToast({ message: result, type: "success" });
    } catch (error) {
      setToast({ message: "Error changing subscription status", type: "error" });
    }
  };

  // Trigger the confirm modal for the activation/deactivation
  const triggerConfirmModal = (message, onConfirm) => {
    setConfirmAction({
      visible: true,
      message,
      onConfirm,
    });
  };

  const columns = [
    {
      key: "name",
      title: "اسم الطالب",
      dataIndex: "student_name",
      search: true,
    },
    {
      key: "doctor_name",
      title: "الصف",
      dataIndex: "doctor_name",
      render: (e, row) => {
        return <span>{row?.doctor_name}</span>;
      },
    },
    {
      key: "age",
      title: "اسم المجموعة",
      dataIndex: "group_name",
      render: (e, row) => {
        return <span>{row?.group_name}</span>;
      },
    },
    {
      key: "email",
      title: "البريد الالكتروني",
      dataIndex: "student_email",
      render: (e, row) => {
        return <span>{row?.student_email}</span>;
      },
    },
    {
      key: "phone",
      title: "رقم الهاتف",
      dataIndex: "student_phone",
      render: (e, row) => {
        return <span>{row?.student_phone}</span>;
      },
    },
    {
      key: "Actions",
      title: "أوامر",
      dataIndex: "reset_count",
      render: (e, row) => {
        return (
          <div className="rowDiv d-flex gap-2">

            <button className="btn btn-primary" onClick={() => {
              console.log(row)
              setUpdateStudentModal(true)
              setRowData(row)
            }}>تعديل الجروب</button>

            <button
              className="btn btn-danger"
              onClick={async () => {
                try {
                  const response = await fetch(
                    baseUrl + "reset_student_device.php",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ student_id: row?.student_id }),
                    }
                  );
                  const x = await response?.text();
                  setToast({ type: "dark", message: x });
                } catch (err) {}
              }}
            >
              تسجيل الخروج
                          </button>
            

          </div>
        );
      },
    },
  ];


  function handleGetAllGroups() {
    const data_send = {
      generation_id : +updateStudentData?.gen
    }
    axios.post(docUrl +"/home/select_groups.php",data_send)
    .then(res => {
      console.log(res)
      if(res?.data) {
        setGenerationGroup(res?.data)
      }
    }).catch(e => console.log(e))

  }

  useEffect(() => {
    handleGetAllGroups()
  } , [updateStudentData?.gen])

  function handleSubmit(e) {
    e.preventDefault();
    console.log(updateStudentData)
    const data_send = {
      student_id : rowData?.student_id,
      generation_id : updateStudentData?.gen,
      group_id : updateStudentData?.group,
      group_status : updateStudentData?.type == "أونلاين" ? 0 : 1
     }
     axios.post(docUrl + "/home/update_student_group.php",data_send)
     .then(res => {
      if(res?.data == "success") {
        setToast({type :"success",message:"تم تعديل الطالب بنجاح"})
      getStudents();
      setUpdateStudentData({
        type:"",
        gen:null,
        group:null,
      })
      setUpdateStudentModal(false);
      }else {
        setToast({type:"error",message:"هناك خطأ ما"})
      }
     }).catch(e => console.log(e))
     .finally(() => setUpdateStudentModal(false))
  }
   
  useEffect(() => {
    setUpdateStudentData({...updateStudentData , type:updateStudentData?.type ,  gen : null , group :null})
  } , [updateStudentData?.type])


  // useEffect(() => {
  //   setUpdateStudentData({...updateStudentData  ,  type:updateStudentData?.type})
  // } , [updateStudentData])
  return (
    <div className="students">
      <div className="tablePageHeader">
        <h1 className="pageTitle">الطلاب</h1>
      </div>
      
      <Modal close={setUpdateStudentModal} visible={updateStudentModal} title="تعديل مجموعه الطالب" footer={false}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label"> نوع الدفعه</label>
              <select value={updateStudentData?.type} style={{padding:"10px" , borderRadius:"5px"}} className="form-input" onChange={(e) =>setUpdateStudentData({...updateStudentData , type :e.target.value})}>
                <option value="سنتر">سنتر</option>
                <option value="اونلاين">أونلاين</option>
              </select>
            </div>

           {generationsType && generationsType?.length >0 ?  
           <div className="form-group">
              <label className="form-label"> الدفعه</label>
              <select required value={updateStudentData?.gen} style={{padding:"10px" , borderRadius:"5px"}} className="form-input" onChange={(e) => setUpdateStudentData({...updateStudentData , gen : e.target.value})}>
              <option value="" selected={updateStudentData?.gen == null ? true : false} disabled>اختر دفعه</option>
                {generationsType?.map(item => <option value={item?.gen_id}>{item?.doctor_name}</option>)}
              </select>
            </div> : null
            }

            {generationGroup && generationGroup?.length > 0 ?
             <div className="form-group">
             <label className="form-label">اختر مجموعه</label>
             <select required value={updateStudentData?.group} style={{padding:"10px" , borderRadius:"5px"}} className="form-input" onChange={(e) => setUpdateStudentData({...updateStudentData , group : e.target.value})}>
               <option value="" disabled selected>اختر مجموعه</option>
               {generationGroup?.map(item => <option value={item?.group_id} key={item?.group_id}>{item?.group_name}</option>)}
             </select>
           </div> : null}

            <button className="btn btn-primary">تعديل</button>
          </form> 
      </Modal>

      <CustomTable dataSource={students} columns={columns} />
      <ChangeGroup
        userData={openChangeGroup}
        openModal={openChangeGroup}
        setOpenModal={setOpenChangeGroup}
      />

      {/* Render Add Subscription Form if a student is selected */}
      <Modal
        close={setOpenAddSubCard}
        footer={false}
        title={"اضافة اشتراك"}
        visible={openAddSubCard}
      >
        <div className="subscription-form-section">
          <h2>إضافة اشتراك لـ {selectedStudent?.student_name}</h2>
          <form onSubmit={handleCreateSubscription}>
            <div className="form-group">
              <label htmlFor="centerType">Type</label>
              <SelectComponent
                options={[
                  { label: "سنتر", value: "سنتر" },
                  { label: "اونلاين", value: "اونلاين" },
                ]}
                value={{ value: subscriptionData.centerType }}
                onChange={(e) =>
                  setSubscriptionData({
                    ...subscriptionData,
                    centerType: e.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="gen_id">الصف</label>
              <SelectComponent
                options={years.map((year) => ({
                  label: year.doctor_name,
                  value: year.gen_id,
                }))}
                value={{ value: subscriptionData.gen_id }}
                onChange={(e) =>
                  setSubscriptionData({ ...subscriptionData, gen_id: e.value })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="group_id">المجموعة</label>
              <SelectComponent
                options={groups.map((group) => ({
                  label: group.group_name,
                  value: group.group_id,
                }))}
                value={{ value: subscriptionData.group_id }}
                onChange={(e) =>
                  setSubscriptionData({
                    ...subscriptionData,
                    group_id: e.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="package_id">الباقة</label>
              <SelectComponent
                options={packages.map((pkg) => ({
                  label: pkg.name,
                  value: pkg.package_id,
                }))}
                value={{ value: subscriptionData.package_id }}
                onChange={(e) =>
                  setSubscriptionData({
                    ...subscriptionData,
                    package_id: e.value,
                  })
                }
              />
            </div>

            <button type="submit" className="btn btn-success">
              إنشاء اشتراك
            </button>
          </form>
        </div>
      </Modal>

      {/* Confirm Modal */}
      <ConfirmModal
        visible={confirmAction.visible}
        message={confirmAction.message}
        onClose={() => setConfirmAction({ ...confirmAction, visible: false })}
        onConfirm={() => {
          confirmAction.onConfirm();
          setConfirmAction({ ...confirmAction, visible: false });
        }}
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

export default Students;
