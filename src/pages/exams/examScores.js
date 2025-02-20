import React, { useEffect, useState } from "react";
import CustomTable from "../../components/table";
import "./style.css";
import AddScore from "../../components/scores/add";

import { deleteIcon, editIcon } from "../../assets/svgIcons";
import Toast from "../../components/toast";
import { initialStudentData } from "../../data/studentsdata";
import EditScore from "../../components/scores/edit";
import DeleteScore from "../../components/scores/delete";
import axios from "axios";
import { useParams } from "react-router-dom";
import { baseUrl, docHomeUrl } from "../../utils/baseUrl";
import { GrPowerReset } from "react-icons/gr";
import toast from "react-hot-toast";
import Modal from "../../components/modal";

function ExamScores() {
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openResetModal, setOpenResetModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id, exam_id } = useParams();

  const getScores = async () => {
    const dataSend = {
      exam_id: exam_id,
      group_id: id,
    };

    console.log(dataSend);

    try {
      const res = await axios.post(
        `${docHomeUrl}select_student_group_solved_exam.php`,
        dataSend
      );

      if (res.status == 200) {
        setData(res?.data?.students);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resetExam = async () => {
    setLoading(true);
    const dataSend = {
      quiz_id: exam_id,
      student_id: rowData?.solved_student_id,
    };
    try {
      const res = await axios.post(
        `${baseUrl}absence/reset_exam.php`,
        dataSend
      );
      if (res?.status == 200) {
        toast.success(res?.data);
        getScores();
        setOpenResetModal(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getScores();
  }, []);

  const columns = [
    {
      key: "solved_student_id",
      title: "Student ID",
      dataIndex: "solved_student_id",
    },
    {
      key: "student_name",
      title: "Student Name",
      dataIndex: "student_name",
      search: true,
    },
    {
      key: "solved_score",
      title: "Score",
      dataIndex: "solved_score",
      render: (text, row) => {
        return <div>{row?.solved_score}</div>;
      },
    },
    {
      key: "actions",
      title: "Actions",
      dataIndex: "actions",
      render: (text, row) => {
        return (
          <div className="actions-btns">
            <div
              className="c-pointer text-secondary"
              onClick={() => {
                setOpenResetModal(row);
                setRowData(row);
              }}
            >
              <div className="tooltip">إعادة درجة الامتحان</div>
              <GrPowerReset />
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="exam-scores">
      <div
        className="tablePageHeader scoretablePageHeader"
        style={{ flexDirection: "column", justifyContent: "flex-start" }}
      >
        <b
          style={{ marginRight: "auto", marginLeft: "20px", fontSize: "30px" }}
        >
          Score
        </b>
      </div>
      <CustomTable dataSource={data} columns={columns} />
      {/* <EditScore openModal={openEditModal} setOpenModal={setOpenEditModal} />
      <DeleteScore
        openModal={openDeleteModal}
        setOpenModal={setOpenResetModal}
      /> */}
      <Modal
        close={setOpenResetModal}
        footer={false}
        title={"إعادة ضبط الامتحان"}
        visible={openResetModal}
      >
        <div className="d-flex flex-column gap-3 ">
          <div className="fs-5 bold">
            هل أنت متأكد من إعادة تعيين اختبار الطالب هذا؟
          </div>
          <div className="d-flex justify-content-end gap-3 align-items-center">
            <button className="btn btn-success" onClick={resetExam}>
              تأكيد
            </button>

            <button
              className="btn btn-danger"
              onClick={() => setOpenResetModal(false)}
            >
              إلغاء
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ExamScores;
