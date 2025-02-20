import React, { useState } from "react";
import axios from "axios";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { docUrl } from "../../utils/baseUrl";
import Loader from "../../components/loader";
import Toast from "../../components/toast";
import Modal from "../../components/modal";

function AddUnit({ getFunction, openModal, setOpenModal }) {
  const [untiData, setUntiData] = useState({
    name: "",
  });

  const [toast, setToast] = useState(false);
  const [loading,setLoading]=useState(false)

const {id , pack} = useParams()
  const saveNewUnit = async(e) => {
    e.preventDefault();
    const data_send={
      generation_id:id,
      unit_name:untiData?.name,
      package_id:pack
      
    }
    axios.post(docUrl+"/home/q_bank/add_unit.php",JSON.stringify(data_send))
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
      title={"إضافه وحده"}
      visible={openModal}
    >
      <form onSubmit={(e) => saveNewUnit(e)} className="animated-form">
        <div className="form-group">
          <label htmlFor="packageName" className="form-label">
            إسم الوحده
          </label>
          <input
            type="text"
            id="packageName"
            placeholder="إسم الوحده"
            onChange={(e) => setUntiData({ ...untiData, name: e.target.value })}
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

export default AddUnit;
