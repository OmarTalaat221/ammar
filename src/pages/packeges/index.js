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
import axios from "axios";
import Modal from "../../components/modal";
import Loader from "../../components/loader";
import Toast from "../../components/toast";

function Packages() {
  const [toast , setToast] = useState(false)
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openShowHideModal, setOpenShowHideModal] = useState(false);
  const [packagesData, setPackagesData] = useState([]);
  const [pdfOpen, setPdfOpen] = useState(null);
  const [rowData , setRowData] = useState({})
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [pdfFile , setPdfFile] = useState(null)
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [getPackagesLoading, setGetPackagesLoading] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [groups , setGroups] = useState([]);

  const { group , id , pack } = useParams();
  console.log(pack)
  function handleAllGroup() {
    const data_send = {
      generation_id  : id,
    }

    axios.post(docUrl + "/home/select_groups_for_copy.php",data_send)
    .then(res => {
      console.log(res)
      if(res?.data) {
        setGroups(res?.data);
      }
    }).catch(e => console.log(e))
  }

  useEffect(() =>{ 
    handleAllGroup();
  } , [])

  const columns = [
    {
      key: "name",
      title: "Package Name",
      dataIndex: "name",
      search: true,
    },
    {
      key: "description",
      title: "Description",
      dataIndex: "description",
      render: (text) => (
        <p
          className="package-description"
          style={{ width: "240px", whiteSpace: "pre-wrap" }}
        >
          {text}
        </p>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      dataIndex: "actions",
      render: (text, row) => (
        <div>
          <div className="actions-btns">
              <div
                onClick={() =>{
                    console.log(row)
                  navigate(`/${id}/${row?.package_id}/units`)
                }
                  // navigate(`/${}/:pack/units"/${row?.package_id}/students`)
                }
              >
                <div className="btn btn-primary">Units</div>
              </div>
              <div
                onClick={() =>
                  navigate(`/SubscriptionCounts/${row?.package_id}/students`)
                }
              >
                <div className="btn btn-primary">Students</div>
              </div>
              <div
                className="open-btn c-pointer text-primary"
                onClick={() =>navigate(`/years/${row?.package_id}/packagePdf`)}
              >
                <div className="btn btn-primary">PDF</div>
                {/* {editIcon} */}
              </div>
              <div
                className="open-btn c-pointer text-primary"
                onClick={() => setOpenEditModal(row)}
              >
                <div className="btn btn-primary">Edit</div>
                {/* {editIcon} */}
              </div>
              <div
                className="open-btn c-pointer text-primary"
                onClick={() => {
                  console.log(row)
                  setRowData(row)
                  setOpenDeleteModal(row)
                }}
              >
                <div className="btn btn-danger">Delete</div>
                {/* {editIcon} */}
              </div>
              <div
                className="open-btn c-pointer text-primary"
                onClick={() => {
                  console.log(row);
                  navigate(`${row?.package_id}/lectures`)
                }}
              >
                <div className="btn btn-primary">Lectures</div>
              </div>

              <DropMenu child={"Copy"}>
               <div style={{display:"flex",flexDirection:"column",gap:"2px"}}>

               {groups?.map(group => <button onClick={() => {
                console.log(group?.group_id)
                handleChooseGroup(group?.group_id , row?.package_id)
               }} className="btn btn-primary">{group?.group_name}</button>)}
               </div>
              
          </DropMenu>
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

  function handleChooseGroup(group_idd , pack_id) {
     const data_send = {
      group_id : group_idd,
      package_id : pack_id
     }
     console.log(data_send)
     axios.post(docUrl +"/home/copy_data/make_copy_from_package.php",data_send)
     .then(res => {
      console.log(res)
      if(res?.data?.status == "success") {
       setToast({type:"success",message:"تم نسخ الجروب بنجاح"})
      }else {
        setToast({type:"error",message:"هناك خطأ ما"});
      }
     }).catch(e => console.log(e))
  }
   
  const getPackages = async () => {
    setGetPackagesLoading(true);
    setIsPageLoading(true);

    let data_to_send = {
      group_id: group,
    };

    try {
      const response = await fetch(docUrl + "/home/select_packages.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data_to_send),
      });

      const resData = await response.json();
      console.log(resData);

      if (response.status === 200) {
        if (Array.isArray(resData.packages)) {
          if (resData.packages.length === 0) {
            setPackagesData([]);
            setSelectedPackageId("");
          } else {
            setPackagesData(resData.packages);
            setSelectedPackageId(resData.packages[0]?.package_id);
          }
        }
      } else {
        console.error("Please try again later.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setGetPackagesLoading(false);
      setIsPageLoading(false);
    }
  };

  function handleDeletePackage() {
    const data_send = {
      package_id : rowData?.package_id,
      group_id :  rowData?.group_id
    }

    axios.post(docUrl + "/home/delete_package.php", data_send)
    .then(res => {
      if(res?.data?.status == "success") {
        setToast({type:"success",message:res?.data?.message})
        getPackages()
        setOpenDeleteModal(false)
      }else {
        setToast({type:"error",menubar :res?.data?.message || "هناك مشكله ف حذف الباقة"})
      }
    }).catch(e => console.log(e))
    .finally(() => setOpenDeleteModal(false))
  }

 async function handleAddPdf(e) {
    e.preventDefault();

    const uploads = await Promise.all(
      uploadedFiles.map(async (item) => {
        const result = await uploadPdf(item);
        if (result?.data === "success") {
          toast.success("PDF uploaded successfully");
        } else {
          toast.error("Error uploading image");
        }
        return result;
      })
    );

    console.log(uploads)
  }

  async function uploadPdf(pdf) {
    if (!pdf) return;
    const formData = new FormData();
    formData.append("image", pdf);
  
    const uploaded = await axios.post("", formData);
    setPdfOpen(false);
    return uploaded;
  }

  useEffect(() => {
    getPackages();
  }, []);

  return (
    <div className="packages">
      <div className="tablePageHeader">
        <h1 className="pageTitle">Packages</h1>
        <button
          className="btn btn-success"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          Add Package
        </button>
      </div>
      <CustomTable dataSource={packagesData} columns={columns} />

      <Modal visible={openDeleteModal} close={setOpenDeleteModal} footer={null} title="حذف الباقة">
      <div className="delete-warning">
        <h3>هل أنت متأكد أنك تريد حذف هذه الباقة
        </h3>
        <p className="warning-message">
        لا يمكن التراجع عن هذا الإجراء. الرجاء تأكيد أنك تريد الحذف
        ما يلي:
        </p>
        <div className="year-details">
          <strong>الاسم:</strong> {rowData?.name}
        </div>
        <div className="rowEndDiv">
          {rowData?.loading ? (
            <Loader />
          ) : (
            <>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeletePackage}
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
          )}
        </div>
        {toast && (
          <Toast message={"حدث خطأ. الرجاء المحاولة مرة أخرى."} type={"error"} onClose={() => setToast(false)} />
        )}
      </div>
      </Modal> 

      <Modal visible={pdfOpen} close={setPdfOpen} footer={null} title="إضافة PDF">
         <form onSubmit={handleAddPdf}>
            <div className="form-group">
              <label className="form-label">PDF</label>
              <input accept="application/pdf" className="form-input" type="file" onChange={(e) => setUploadedFiles((prev) => [...prev , e.target.files[0]])}/>
            </div>

            <button className="btn btn-primary">إضافة</button>
         </form>
      </Modal>
      {/* <PdfOpen
        getFunction={getPackages}
        openModal={pdfOpen}
        setOpenModal={setPdfOpen}
      /> */}
      <AddPackage
        getFunction={getPackages}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
      <EditPackage
        getFunction={getPackages}
        openModal={openEditModal}
        setOpenModal={setOpenEditModal}
      />
      {/* <DeletePackage
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
      /> */}
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

export default Packages;
