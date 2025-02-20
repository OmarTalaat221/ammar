import React, { useEffect, useState } from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";
import "./ShowHideYears.css"; 

function ShowHideYears({ openModal, setOpenModal }) {
  const [yearData, setYearData] = useState({
    name: openModal?.grade,
    description: openModal?.description,
    hidden: openModal?.hidden,
    loading: false,
  });

  const [toast, setToast] = useState(false);

  const toggleVisibility = (e) => {
    e.preventDefault();
    if (!yearData?.loading) {
      setYearData({ ...yearData, loading: true });
      axios
        .post(`your-api-endpoint/${openModal?.key}`, {
          hidden: !yearData.hidden,
        })
        .then((res) => {
          
          setOpenModal(false); 
        })
        .catch((err) => {
          console.log(err);
          setToast(true); 
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
      hidden: openModal?.hidden,
      loading: false,
    });
  }, [openModal]);

  return (
    <Modal
      close={() => setOpenModal(false)}
      footer={false}
      title={yearData.hidden ? "Show Year" : "Hide Year"}
      visible={openModal}
    >
      <div className="showhide-warning">
        <h3>{yearData.hidden ? "Show Year" : "Hide Year"}</h3>
        <p className="warning-message">
        هل أنت متأكد أنك تريد ذلك {yearData.hidden ? "show" : "hide"} هذا
          سنة؟ سيؤدي هذا الإجراء إلى تحديث حالة الرؤية لهذا العام.
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
                className="btn btn-primary"
                onClick={toggleVisibility}
              >
                {yearData.hidden ? "Show" : "Hide"}
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
          <Toast
            message={"An error occurred. Please try again."}
            type={"error"}
            onClose={() => setToast(false)}
          />
        )}
      </div>
    </Modal>
  );
}

export default ShowHideYears;
