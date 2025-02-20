import React, { useEffect, useState } from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";
import "./DeleteYears.css"; 

function DeleteYears({ getFunction, openModal, setOpenModal }) {
  const [yearData, setYearData] = useState({
    name: openModal?.grade,
    description: openModal?.description,
    loading: false,
  });

  const [toast, setToast] = useState(false);

  const deleteYear = (e) => {
    e.preventDefault();
    if (!yearData?.loading) {
      setYearData({ ...yearData, loading: true });
      setToast(true);
      axios
        .delete(`your-api-endpoint/${openModal?.id}`) 
        .then((res) => {
          
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setYearData({ ...yearData, loading: false });
        });
    }
  };

  useEffect(() => {
    setYearData({
      name: openModal?.grade,
      description: openModal?.description,
      loading: false,
    });
  }, [openModal]);

  return (
    <Modal
      close={() => setOpenModal(false)}
      footer={false}
      title={"Delete Year"}
      visible={openModal}
    >
      <div className="delete-warning">
        <h3>هل أنت متأكد أنك تريد الحذف هذه الدفعة؟</h3>
        <p className="warning-message">
        لا يمكن التراجع عن هذا الإجراء. الرجاء تأكيد أنك تريد الحذف
        ما يلي:
        </p>
        <div className="year-details">
          <strong>الصف:</strong> {yearData?.name}
        </div>
        <div className="year-details">
          <strong>وصف:</strong> {yearData?.description}
        </div>
        <div className="rowEndDiv">
          {yearData?.loading ? (
            <Loader />
          ) : (
            <>
              <button
                type="button"
                className="btn btn-danger"
                onClick={deleteYear}
              >
                حذف
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setOpenModal(false)}
              >
                إلغاء
              </button>
            </>
          )}
        </div>
        {toast && (
          <Toast message={"An error occurred. Please try again."} type={"error"} onClose={() => setToast(false)} />
        )}
      </div>
    </Modal>
  );
}

export default DeleteYears;
