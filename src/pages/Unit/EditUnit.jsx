import React, { useState } from "react";
import axios from "axios";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { docUrl } from "../../utils/baseUrl";
import Loader from "../../components/loader";
import Toast from "../../components/toast";
import Modal from "../../components/modal";

function EditUnit({ getFunction, openModal, setOpenModal,rowData,setRowData }) {
  console.log(rowData)
  const [untiData, setUntiData] = useState({
    name: "",
  });

  const [toast, setToast] = useState(false);
  const [loading,setLoading]=useState(false)

const {id} = useParams()
  const saveNewUnit = async(e) => {
    e.preventDefault();
    const data_send={
      ...rowData
    }
    axios.post(docUrl+"/home/q_bank/update_unit.php",JSON.stringify(data_send))
    .then((res)=>{
      console.log(res)
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
      title={"تعديل وحده"}
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
            value={rowData?.unit_name}
            onChange={(e) => setRowData({ ...rowData, unit_name: e.target.value })}
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

export default EditUnit;
