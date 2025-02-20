import React, { useEffect, useState } from "react";
import CustomTable from "../../components/table";
import "./style.css";
import AddExams from "../../components/exams/add";
import {
  closedEye,
  deleteIcon,
  editIcon,
  openedEye,
  openPage,
  questions,
  score,
} from "../../assets/svgIcons";
import Toast from "../../components/toast";
import EditExams from "../../components/exams/edit";
import DeleteExams from "../../components/exams/delete";
import ShowHideExams from "../../components/exams/showHide";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { docHomeUrl, secondUrl } from "../../utils/baseUrl";
import { FaLock } from "react-icons/fa6";
import { FaEye, FaEyeSlash, FaLockOpen } from "react-icons/fa";
import ShowHideAnswers from "../../components/exams/ShowAnswers";

function Exams() {
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openShowHideModal, setOpenShowHideModal] = useState(false);
  const [openShowAnswerModal, setOpenShowAnswerModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [exams, setExams] = useState([]);
  const [rowData, setRowData] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const getExams = async () => {
    const dataSend = {
      generation_id: id,
    };
    try {
      const res = await axios.post(
        `${docHomeUrl}select_total_exams.php`,
        dataSend
      );

      if (res.status == 200) {
        setExams(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getExams();
  }, []);

  const columns = [
    {
      key: "exam_id",
      title: "رقم الإمتحان",
      dataIndex: "exam_id",
    },
    {
      key: "exam_name",
      title: "اسم الامتحان",
      dataIndex: "exam_name",
      search: true,

      render: (text) => <span>{text}</span>,
    },
    {
      key: "q_number",
      title: "عدد الأسئله",
      dataIndex: "q_number",
      render: (text) => <span>{text}</span>,
    },

    {
      key: "actions",
      title: "اوامر",
      dataIndex: "actions",
      render: (text, row) => (
        <div className="actions-btns">
          <div
            className="delete-btn c-pointer text-danger"
            onClick={() => {
              setOpenDeleteModal(true);
              setRowData(row);
            }}
          >
            <div className="tooltip">حذف</div>
            {deleteIcon}
          </div>
          <div
            className="open-btn c-pointer text-primary"
            onClick={() => {
              setOpenEditModal(true);
              setRowData(row);
            }}
          >
            <div className="tooltip">تعديل</div>
            {editIcon}
          </div>
          <div
            className="c-pointer"
            onClick={() => {
              setOpenShowHideModal(true);
              setRowData(row);
            }}
          >
            <div className="tooltip">
              {+row?.show_to_answer ? "عرض" : "اخفاء"}
            </div>
            {+row?.show_to_answer ? (
              <FaLockOpen className="text-success" />
            ) : (
              <FaLock className="text-danger" />
            )}
          </div>
          <div
            className="c-pointer"
            onClick={() => {
              setOpenShowAnswerModal(true);
              setRowData(row);
            }}
          >
            <div className="tooltip">
              {+row?.exam_show_to_public ? "عرض" : "اخفاء"}
            </div>
            {+row?.exam_show_to_public ? (
              <FaEye className="text-success" />
            ) : (
              <FaEyeSlash className="text-danger" />
            )}
          </div>
          <div
            className="open-btn c-pointer text-success"
            onClick={() => navigate(`${row?.exam_id}/questions`)}
          >
            <div className="tooltip">الأسئله</div>
            {questions}
          </div>
          <div
            className="open-btn c-pointer text-success"
            onClick={() => navigate(`${row?.exam_id}/score`)}
          >
            <div className="tooltip">النتائج</div>
            {score}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="exams">
      <div className="tablePageHeader">
        <h1 className="pageTitle">الامتحانات</h1>
        <button
          className="btn btn-success"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          اضافة امتحان
        </button>
      </div>
      <CustomTable dataSource={exams} columns={columns} />
      <AddExams
        getFunction={getExams}
        openModal={openModal}
        setOpenModal={setOpenModal}
        rowData={rowData}
      />
      <EditExams
        setRowData={setRowData}
        getFunction={getExams}
        openModal={openEditModal}
        setOpenModal={setOpenEditModal}
        rowData={rowData}
      />
      <DeleteExams
        getFunction={getExams}
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        rowData={rowData}
        setRowData={setRowData}
      />
      <ShowHideExams
        getFunction={getExams}
        openModal={openShowHideModal}
        setOpenModal={setOpenShowHideModal}
        rowData={rowData}
        setRowData={setRowData}
      />
      <ShowHideAnswers
        getFunction={getExams}
        openModal={openShowAnswerModal}
        setOpenModal={setOpenShowAnswerModal}
        rowData={rowData}
        setRowData={setRowData}
      />
    </div>
  );
}

export default Exams;
