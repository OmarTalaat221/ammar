import React, { useEffect, useState } from "react";
import Modal from "../../modal";
import axios from "axios";

import Loader from "../../loader";
import { docHomeUrl } from "../../../utils/baseUrl";
import toast from "react-hot-toast";

function ShowHideExams({
  openModal,
  setOpenModal,
  setRowData,
  rowData,
  getFunction,
}) {
  const toggleVisibility = (e) => {
    e.preventDefault();
    if (!rowData?.loading) {
      setRowData({ ...rowData, loading: true });

      const dataSend = {
        exam_id: rowData?.exam_id,
      };
      axios
        .post(`${docHomeUrl}show_hide_exam.php`, dataSend)
        .then((res) => {
          if (res.data.status == "success") {
            getFunction();
            toast.success(res.data?.message);
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

  useEffect(() => {
    console.log(rowData);
  }, []);

  return (
    <Modal
      close={() => setOpenModal(false)}
      footer={false}
      title={+rowData.show_to_answer ? "اخفاء الامتحان" : "عرض الامتحان"}
      visible={openModal}
    >
      <div className="showhide-warning">
        <h3>{+rowData.show_to_answer ? "اخفاء الامتحان" : "عرض الامتحان"}</h3>
        <p className="warning-message">
          هل انت متاكد انك تريد {+rowData.show_to_answer ? "اخفاء" : "عرض"} هذا
          الامتحان؟ سيؤدي هذا الإجراء إلى تحديث حالة رؤية الاختبار.
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
                className="btn btn-primary"
                onClick={toggleVisibility}
              >
                {+rowData.show_to_answer ? "اخفاء" : "عرض"}
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

export default ShowHideExams;
