import React, {useEffect, useState} from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";
import {baseUrl, docUrl} from "../../../utils/baseUrl";
import SelectComponent from "../../selectBox";



function EditGroupModal({getFunction, openModal, setOpenModal}) {
  const [yearData, setYearData] = useState({
    name: openModal?.grade,
    description: openModal?.description,
    loading: false,
  });
  const [toast, setToast] = useState(false);

  const EditGroup = async()=>{
    let dataSend ={
      group_id:openModal.group_id,
      group_name:openModal.group_name,
      score:openModal.score,
    }

    console.log(dataSend);
    await axios.post( `https://camp-coding.online/Teacher_App_2024/Mahmoud_Ammar/doctor/home/update_group.php` , JSON.stringify(dataSend))
    .then(res=>{
      if(res.data.status = "success"){
        
        setToast(true);

      }if(res.data.status = "error"){
        console.log(res.data.message);
        
      }else{
        console.log("someThing went wrong");

      }
    }).finally(()=>{
      getFunction()
      setOpenModal(false)

    })
    .catch(e=> console.log(e))

    
  }

  return (
    <Modal
      close={setOpenModal}
      footer={false}
      title={"تعديل المجموعة"}
      visible={openModal}
    >
      <div className='animated-form'>
        <div className='form-group'>
          <label htmlFor='year' className='animated-label'>
            اسم المجموعة
          </label>
          <input
            type="text"
            id="year"
            placeholder="Group Name"
            defaultValue={openModal?.group_name}
            onChange={(e)=>{
              setOpenModal(
                {
                  ...openModal,
                  group_name:e.target.value
                }
              )
            }}
            className="animated-input"
          />

        </div>

        <div className='rowEndDiv'>
          {/* <span className="cancel-btn" onClick={() => setOpenModal(false)}>
            {"Cancel"}
          </span> */}
          {yearData?.loading ? (
            <Loader />
          ) : (
            <button type='submit' className='btn animated-btn btn-success' onClick={EditGroup}>
              تعديل
            </button>
          )}
        </div>

        {toast && (
          <Toast message={"لم يتم تمرير أي بيانات"} type={"error"} onClose={setToast} />
        )}
      </div>
    </Modal>
  );
}

export default EditGroupModal;
