import React, { useState } from "react";
import Modal from "../../modal";
import axios from "axios";

import Loader from "../../loader";
import { baseUrl, docHomeUrl } from "../../../utils/baseUrl";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

function AddExam({ getFunction, openModal, setOpenModal, rowData }) {
  const [examData, setExamData] = useState({
    name: "",
    numberOfQuestions: "",
    loading: false,
  });

  const { id } = useParams();

  const saveNewExam = async (e) => {
    e.preventDefault();

    if (examData?.loading) return;

    // Validate input
    if (!examData?.name?.trim()) {
      toast.error("اسم السؤال مطلوب");
      return;
    }

    setExamData((prev) => ({ ...prev, loading: true }));

    const dataSend = {
      exam_name: examData?.name.trim(),
      generation_id: id,
    };

    try {
      const res = await axios.post(`${docHomeUrl}add_exam.php`, dataSend);
      console.log(res);

      if (res?.data == "success") {
        toast.success(res.data);
        setOpenModal(false);
        getFunction();

        setExamData({ name: "", loading: false });
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Error saving exam:", err);
      toast.error("Failed to save exam. Please try again.");
    } finally {
      setExamData((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <Modal
      close={setOpenModal}
      footer={false}
      title={"اضافة امتحان"}
      visible={openModal}
    >
      <form onSubmit={(e) => saveNewExam(e)} className="animated-form">
        <div className="form-group">
          <label htmlFor="examName" className="animated-label">
            اسم السؤال
          </label>
          <input
            type="text"
            id="examName"
            placeholder="ادخل اسم السؤال"
            onChange={(e) => {
              setExamData({ ...examData, name: e.target.value });
            }}
            className="animated-input"
          />
        </div>

        <div className="rowEndDiv">
          {examData?.loading ? (
            <Loader />
          ) : (
            <button type="submit" className="btn animated-btn btn-success">
              حفظ
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}

export default AddExam;
