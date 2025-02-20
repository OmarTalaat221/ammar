import React, {useEffect, useState} from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";
import {baseUrl} from "../../../utils/baseUrl";
import SelectComponent from "../../selectBox";


function DeleteGroupModal({getFunction, openModal, setOpenModal}) {
  const [yearData, setYearData] = useState({
    name: openModal?.grade,
    description: openModal?.description,
    loading: false,
  });
  const [toast, setToast] = useState(false);
  const [students, setStudents] = useState([]);
  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = async () => {
    try {
      const response = await fetch(baseUrl + "select_all_students.php");

      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setStudents([]);
    }
  };

  function handleDeleteGroup() {
 
  }

  return (
    <Modal
      close={setOpenModal}
      footer={false}
      title={"حذف المجموعة"}
      visible={openModal}
    >
      <div className="delete-warning">
        <h3>هل أنت متأكد أنك تريد حذف هذه المجموعة؟
        </h3>
        <p className="warning-message">
        لا يمكن التراجع عن هذا الإجراء. الرجاء تأكيد أنك تريد الحذف
        ما يلي:
        </p>
        <div className="year-details">
          <strong>الاسم:</strong> {yearData?.name}
        </div>
        <div className="year-details">
          <strong>الوصف:</strong> {yearData?.description}
        </div>
        <div className="rowEndDiv">
          {yearData?.loading ? (
            <Loader />
          ) : (
            <>
              <button
                type="button"
                className="btn btn-danger"
                onClick={()=>""}
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
          <Toast message={"حدث خطأ. الرجاء المحاولة مرة أخرى."} type={"error"} onClose={() => setToast(false)} />
        )}
      </div>
    </Modal>
  );
}

export default DeleteGroupModal;
