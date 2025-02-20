import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DropMenu from "../../components/dropmenu";

import CustomTable from "../../components/table";
import { docUrl, secondUrl } from "../../utils/baseUrl";
import PdfOpen from "../../components/Packages/pdf";
import { editIcon } from "../../assets/svgIcons";
import AddQuestion from "./AddQuestion";
import EditQuestion from "./EditQuestion";
import axios from "axios";
import Modal from "../../components/modal";
import Toast from "../../components/toast";
import Loader from "../../components/loader";

function LessonQuestions() {
  const [toast , setToast] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openShowHideModal, setOpenShowHideModal] = useState(false);
  const [packagesData, setPackagesData] = useState([]);
  const [pdfOpen, setPdfOpen] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [getUnitsLoading, setgetUnitsLoading] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [edQuesList,setEdQuesList]=useState([]);
  const [imgEdit,setImgEdit]=useState(null)
  const [editVoice,setEditVoice]=useState(null)
  const [imgUrlEdit,setImgUrlEdit]=useState()
  const [rowData,setRowData]=useState({})
  const {id}=useParams()
  console.log(id)

  const columns = [
    {
      key: "id",
      title: "*",
      dataIndex: "question_id",
      search: true,
    },
    {
      key: "question_image",
      title: "صورة السؤال",
      dataIndex: "question_image",
      render:(text,row)=>(
        row?.question_image &&
        <div>
           <img style={{width:'100px'}} src={row?.question_image} alt="" />
        </div>
      ),
      search: false,
    },
    {
      key: "name",
      title: "نص السؤال",
      dataIndex: "question_text",
      search: true,
    },
    {
      key: "answers",
      title: "الإجابات",
      dataIndex: "arr_ans",
      render:(text,row)=>(
        <div>
          {
            row?.arr_ans&&Array.isArray(row?.arr_ans)&&row?.arr_ans.map((item,index)=>{
              return(
                <p
                  style={{
                    color:item==row?.question_valid_answer?'green':'black'
                  }}
                >{item}</p>
              )
            })
          }
        </div>
      ),
      search: true,
    },
    {
      key: "explnation Text",
      title: " توضيح السؤال",
      dataIndex: "question_exp_text",
      render:(text,row)=>(
        <div>
          <p>{row?.question_exp_text}</p>
        </div>
      ),
      search: true,
    },
    {
      key: "explnation Voice",
      title: "صوت توضيح السؤال",
      dataIndex: "question_exp_voice",
      render:(text,row)=>
    {
      console.log(row)
      return   (
        <div>
          {row.question_exp_voice !== "Error: No file data received." || row?.question_exp_voice !== "" && (
        <audio controls>
          <source src={row.question_exp_voice} type="audio/mpeg" />
        </audio>
      )}
        </div>
      )
    }
      // search: true,
    },
    // {
    //   key: "hidden",
    //   title: "الحاله",
    //   dataIndex: "hidden",
    //   render:(text,row)=>(
    //     <div>
    //       {row?.hidden=='no'?
    //         <p style={{
    //           color:'green'
    //          }}>ظاهر</p>
    //       :
    //         <p
    //          style={{
    //           color:'red'
    //          }}
    //         >مخفى</p>
    //       }
    //     </div>
    //   ),
    //   search: true,
    // },
    {
      key: "actions",
      title: "الأوامر",
      dataIndex: "actions",
      render: (text, row) => (
        <div >
           <div className="actions-btns">


<div
  className="open-btn c-pointer text-primary"
  onClick={() => {
    console.log(row)
    setRowData(row)
    setOpenEditModal(true)
    let answers=row?.arr_ans;
    console.log(answers)
    setEdQuesList(answers.map((it,index)=>{
      return {answer:it,status:it==row?.question_valid_answer?true:false,id:index+1}
    }))
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
      lesson_id: id,
    };

    try {
      const response = await fetch(docUrl + "/home/q_bank/select_questions.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data_to_send),
      });

      const resData = await response.json();
      console.log(resData);

      console.log(response)
      if (Array.isArray(resData.message)) {
        if (resData.message.length === 0) {
          setPackagesData([]);
          setSelectedPackageId("");
        } else {
          setPackagesData(resData.message);
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


  function handleDeletQuestion() {
    const data_send ={
      question_id : +rowData?.question_id
    }

    axios.post(docUrl + "/home/q_bank/delete_q_bank.php",data_send)
    .then(res => {
      console.log(res)
      if(res?.data == "success") {
         setToast({type:"success",message :"تم حذف السؤال"})
         getUnits()
         setOpenDeleteModal(false)
      }
      else {
        setToast({type:"error",message :  "هناك مشكله ف حذف السؤال"})
      }
    }).catch(e => console.log(e))
    .finally(() => setOpenDeleteModal(false))
  }
  useEffect(() => {
    getUnits();
  }, []);

  return (
    <div className="packages">
      <div className="tablePageHeader">
        <h1 className="pageTitle">أسئله الدرس</h1>
        <button
          className="btn btn-success"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          أضف سؤال
        </button>
      </div>
      <CustomTable dataSource={packagesData} columns={columns} />

      <Modal visible={openDeleteModal} close={setOpenDeleteModal} title="حذف السؤال" footer="false">
      <div className="delete-warning">
        <h3>هل أنت متأكد أنك تريد حذف هذه الباقة
        </h3>
        <p className="warning-message">
        لا يمكن التراجع عن هذا الإجراء. الرجاء تأكيد أنك تريد الحذف
        ما يلي:
        </p>
        <div className="year-details">
          <strong>الاسم:</strong> {rowData?.question_text}
        </div>
        <div className="rowEndDiv">
          {rowData?.loading ? (
            <Loader />
          ) : (
            <>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeletQuestion}
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
      <PdfOpen
        getFunction={getUnits}
        openModal={pdfOpen}
        setOpenModal={setPdfOpen}
      />
      <AddQuestion
      toast={toast}
      setToast={setToast}
        getFunction={getUnits}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
      <EditQuestion
        getFunction={getUnits}
        imgEdit={imgEdit}
        setImgEdit={setImgEdit}
        imgUrlEdit={imgUrlEdit}
        setImgUrlEdit={setImgUrlEdit}
        edQuesList={edQuesList}
        setEdQuesList={setEdQuesList}
        setEditVoice={setEditVoice}
        editVoice={editVoice}
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

export default LessonQuestions;
