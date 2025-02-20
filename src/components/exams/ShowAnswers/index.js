import React, { useEffect, useState } from "react";
import Modal from "../../modal";
import axios from "axios";

import Loader from "../../loader";
import { docHomeUrl } from "../../../utils/baseUrl";
import toast from "react-hot-toast";

function ShowHideAnswers({
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
        .post(`${docHomeUrl}update_exam_show_to_public.php`, dataSend)
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

  useEffect(() => {
    console.log(rowData);
  }, []);

  return (
    <Modal
      close={() => setOpenModal(false)}
      footer={false}
      title={
        +rowData.exam_show_to_public
          ? "اخفاء اجابات الامتحان"
          : "عرض اجابات الامتحان"
      }
      visible={openModal}
    >
      <div className="showhide-warning">
        <h3>
          {+rowData.exam_show_to_public
            ? "اخفاء اجابات الامتحان"
            : "عرض اجابات الامتحان"}
        </h3>
        <p className="warning-message">
          هل انت متاكد انك تريد{" "}
          {+rowData.exam_show_to_public ? "اخفاء اجابات" : "عرض اجابات"} هذا
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
                {+rowData.exam_show_to_public ? "اخفاء اجابات" : "عرض اجابات"}
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

export default ShowHideAnswers;
