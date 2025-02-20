import React, { useEffect, useState } from "react";
import Modal from "../../modal";
import axios from "axios";

import Loader from "../../loader";
import toast from "react-hot-toast";
import { docHomeUrl, secondUrl } from "../../../utils/baseUrl";

function DeleteExams({
  getFunction,
  openModal,
  setOpenModal,
  rowData,
  setRowData,
}) {
  const deleteExam = (e) => {
    e.preventDefault();
    if (!rowData?.loading) {
      setRowData({ ...rowData, loading: true });

      const dataSend = {
        exam_id: rowData?.exam_id,
      };

      axios
        .post(`${docHomeUrl}delete_exam.php`, dataSend)
        .then((res) => {
          if (res.data == "success") {
            getFunction();
            toast.success(res.data);
            setOpenModal(false);
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

  return (
    <Modal
      close={() => setOpenModal(false)}
      footer={false}
      title={"Delete Exam"}
      visible={openModal}
    >
      <div className="delete-warning">
        <h3>هل انت متأكد تريد حذف هذا الامتحان ؟</h3>
        <p className="warning-message">
          لا يمكن التراجع عن هذا الإجراء. الرجاء تأكيد أنك تريد الحذف ما يلي:
        </p>
        <div className="exam-details">
          <strong>اسم الامتحان:</strong> {rowData?.exam_name}
        </div>
        <div className="rowEndDiv">
          {rowData?.loading ? (
            <Loader />
          ) : (
            <>
              <button
                type="button"
                className="btn btn-danger"
                onClick={deleteExam}
              >
                حذف
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setOpenModal(false)}
              >
                الغاء
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default DeleteExams;
