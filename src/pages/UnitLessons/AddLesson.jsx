import React, { useState } from "react";
import axios from "axios";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { docUrl } from "../../utils/baseUrl";
import Loader from "../../components/loader";
import Toast from "../../components/toast";
import Modal from "../../components/modal";

function AddLesson({ getFunction, openModal, setOpenModal }) {
  const [lessonData, setlessonData] = useState({
    name: "",
  });

  const [toast, setToast] = useState(false);
  const [loading,setLoading]=useState(false)

const {id} = useParams()
  const saveNewUnit = async(e) => {
    e.preventDefault();
    const data_send={
      unit_id:id,
      lesson_name:lessonData?.name
    }
    axios.post(docUrl+"/home/q_bank/add_new_lesson.php",JSON.stringify(data_send))
    .then((res)=>{
      if(res.data.status=='success'){
        setToast(true)
        getFunction()
        setOpenModal(false)
      }
    })
    .catch(e=>console.log(e))
    .finally(()=>{
      setToast(false)
    })

  };

  return (
    <Modal
      close={setOpenModal}
      footer={false}
      title={"إضافه درس"}
      visible={openModal}
    >
      <form onSubmit={(e) => saveNewUnit(e)} className="animated-form">
        <div className="form-group">
          <label htmlFor="packageName" className="form-label">
            إسم الدرس
          </label>
          <input
            type="text"
            id="packageName"
            placeholder="إسم الدرس"
            onChange={(e) => setlessonData({ ...lessonData, name: e.target.value })}
            className="form-input"
          />
        </div>

        <div className="form-footer">
          {loading ? (
            <Loader />
          ) : (
            <button type="submit" className="form-submit-btn">
              حفظ
            </button>
          )}
        </div>
        {toast && (
          <Toast message={"Please fill out all required fields"} type={"error"} onClose={setToast} />
        )}
      </form>
    </Modal>
  );
}

export default AddLesson;
