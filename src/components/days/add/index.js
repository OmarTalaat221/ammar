import React, { useState } from "react";
import Modal from "../../modal";
import axios from "axios";
import Toast from "../../toast";
import Loader from "../../loader";
import { FaPlus } from "react-icons/fa";
import "./style.css";
import { useParams } from "react-router-dom";
import { docUrl, secondUrl } from "../../../utils/baseUrl";

function AddDay({ getFunction, openModal, setOpenModal , toast , setToast }) {
  const [dayData, setDayData] = useState({
    day_name: "",
    day_description: "",
    loading: false,
  });


  const { pack, group, lecture } = useParams();
  console.log(lecture);
  const saveNewDay = async (e) => {
    e.preventDefault();

    const { day_name, day_description } = dayData;

    if (day_name.trim() === "") {
      alert("يجب إدخال اسم اليوم .");
      return;
    }

    setDayData({ ...dayData, loading: true });

    const formDataObj = new FormData();
    formDataObj.append("lec_title", day_name);
    formDataObj.append("lec_description", day_description);
    formDataObj.append("package_id", pack);
    formDataObj.append("group_id", group);
    formDataObj.append("lecture_price", "120");
    formDataObj.append("lec_sub_id", lecture);
    formDataObj.append(
      "lec_arrangement ",
      dayData.lec_arrangement ? dayData.lec_arrangement : 0
    );

    try {
      const userData = JSON.parse(localStorage.getItem("moreenglishlogin"));
      formDataObj.append("user_id", userData?.user_id);
      const response = await fetch(docUrl+"/home/add_leceture.php", {
        method: "POST",
        body: JSON.stringify({
          lec_title: day_name,
          lec_descriprion: day_description,
          package_id: pack,
          group_id: group,
          lecture_price: "120",
          lec_sub_id: lecture,
          lec_arrangement: dayData.lec_arrangement ? dayData.lec_arrangement : 0
        }),
      });

      const data = await response.text();
      setDayData({ ...dayData, loading: false });
console.log(data)
      if (data.trim() == '"success"') {
        setToast({type:"success",message:"تم اضافه يوم بنجاح"});
        setOpenModal(false);
        getFunction();
        setDayData({
          day_name: "",
    day_description: "",
    lec_arrangement:"",
    loading: false,
        })
        alert("تمت إضافة اليوم بنجاح");
      } else {
        alert("حدث خطأ ما من فضلك حاول مره اخرى");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ ما من فضلك حاول مره اخرى");
    } finally {
      setDayData({ ...dayData, day_name: "",
        day_description: "",
        lec_arrangement:"",
        loading: false, });
    }
  };

  return (
    <>
    <Modal
      close={() => setOpenModal(false)}
      footer={false}
      title={"اضافة محاضره"}
      visible={openModal}
    >
      <form onSubmit={saveNewDay} className="animated-form">
        <div className="form-group">
          <label htmlFor="dayName" className="form-label">
             اسم اليوم
          </label>
          <input
            type="text"
            id="dayName"
            placeholder="ادخل اسم اليوم"
            value={dayData.day_name}
            onChange={(e) =>
              setDayData({ ...dayData, day_name: e.target.value })
            }
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="dayName" className="form-label">
            رقم اليوم
          </label>
          <input
            type="number"
            onWheel={(e) => e.target.blur()}
            id="dayName"
            placeholder="ادخل رقم اليوم"
            value={dayData.lec_arrangement}
            onChange={(e) =>
              setDayData({ ...dayData, lec_arrangement: e.target.value })
            }
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="dayDescription" className="form-label">
             وصف اليوم
          </label>
          <input
            type="text"
            id="dayDescription"
            placeholder="ادخل وصف اليوم"
            value={dayData.day_description}
            onChange={(e) =>
              setDayData({ ...dayData, day_description: e.target.value })
            }
            className="form-input"
          />
        </div>
        <div className="form-footer">
          {dayData.loading ? (
            <Loader />
          ) : (
            <button type="submit" className="form-submit-btn">
              حفظ
            </button>
          )}
        </div>

      </form>
    </Modal>
   <></>
    </>
  );
}

export default AddDay;
