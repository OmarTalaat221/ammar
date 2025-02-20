import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DropMenu from "../../components/dropmenu";

import CustomTable from "../../components/table";
import { baseUrl, docUrl, secondUrl } from "../../utils/baseUrl";
import PdfOpen from "../../components/Packages/pdf";
import { editIcon } from "../../assets/svgIcons";
import AddQuestion from "./AddQuestion";
import EditQuestion from "./EditQuestion";

function QuestionBank() {
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
      key: "doctor_name",
      title: "إسم الصف",
      dataIndex: "doctor_name",
      search: true,
    },
    {
      key: "question_image",
      title: "صورة السؤال",
      dataIndex: "question_image",
      render:(text,row)=>(
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
      title: "نص توضيح السؤال",
      dataIndex: "question_exp_text",
      render:(text,row)=>(
        <div>
          <p>{row?.question_exp_text}</p>
        </div>
      ),
      search: true,
    },
    {
      key: "explanationVoice",
      title: "صوت توضيح السؤال",
      dataIndex: "question_exp_voice",
      render: (text, row) => (
        <div>
           <audio controls muted autoPlay>
              <source src={row.question_exp_voice} type="audio/mpeg"/>
              Your browser does not support the audio element.
            </audio>
          {/* {row.question_exp_voice ? (
           
          ) : null} */}
        </div>
      ),
      search: true,
    },    
    {
      key: "hidden",
      title: "الحاله",
      dataIndex: "hidden",
      render:(text,row)=>(
        <div>
          {row?.hidden=='no'?
            <p style={{
              color:'green'
             }}>ظاهر</p>
          :
            <p
             style={{
              color:'red'
             }}
            >مخفى</p>
          }
        </div>
      ),
      search: true,
    },
    {
      key: "actions",
      title: "الأوامر",
      dataIndex: "actions",
      render: (text, row) => (
        <div className="actions-btns">
          {/* <div
            className="delete-btn c-pointer text-danger"
            onClick={() => setOpenDeleteModal(row)}
          >
            <div className="tooltip">Delete</div>
            {deleteIcon}
          </div>*/}

          <DropMenu>
            <div className="actions-btns">


              <div
                className="open-btn c-pointer text-primary"
                onClick={() => {
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
            </div>
          </DropMenu>
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
      const response = await fetch(docUrl + "/home/q_bank/get_all_q_bank.php", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response)

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



  useEffect(() => {
    getUnits();
  }, []);

  return (
    <div className="packages">
      <div className="tablePageHeader">
        <h1 className="pageTitle">بنك الأسئله</h1>
        <button
          className="btn btn-success"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          إضافه السؤال
        </button>
      </div>
      <CustomTable dataSource={packagesData} columns={columns} />
      <PdfOpen
        getFunction={getUnits}
        openModal={pdfOpen}
        setOpenModal={setPdfOpen}
      />
      <AddQuestion
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

    </div>
  );
}

export default QuestionBank;
