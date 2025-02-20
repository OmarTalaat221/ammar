import React, { useEffect, useState } from "react";
import Modal from "../../modal";
import axios from "axios";

import Loader from "../../loader";
import { docHomeUrl } from "../../../utils/baseUrl";
import toast from "react-hot-toast";

function EditExams({
  getFunction,
  openModal,
  setOpenModal,
  rowData,
  setRowData,
}) {
  const saveExamData = (e) => {
    e.preventDefault();
    if (!rowData?.loading) {
      setRowData({ ...rowData, loading: true });

      const dataSend = {
        exam_id: rowData?.exam_id,
        exam_name: rowData?.exam_name,
      };
      axios
        .post(`${docHomeUrl}edit_exam.php`, dataSend)
        .then((res) => {
          if (res.data == "success") {
            getFunction();
            setOpenModal(false);
            toast.success(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setRowData({ ...rowData, loading: false });
        });
    }
  };

  useEffect(() => {});

  return (
    <Modal
      close={() => setOpenModal(false)}
      footer={false}
      title={"تعديل الامتحان"}
      visible={openModal}
    >
      <form onSubmit={(e) => saveExamData(e)} className="animated-form">
        <div className="form-group">
          <label htmlFor="examName" className="animated-label">
            اسم السؤال
          </label>
          <input
            type="text"
            id="examName"
            placeholder="اسم السؤال"
            value={rowData?.exam_name}
            onChange={(e) => {
              setRowData({ ...rowData, exam_name: e.target.value });
            }}
            className="animated-input"
          />
        </div>

        <div className="rowEndDiv">
          {rowData?.loading ? (
            <Loader />
          ) : (
            <button type="submit" className="btn animated-btn btn-success">
              حفظ
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}

export default EditExams;
