import React, { useEffect, useState } from "react";
import Modal from "../../modal";
import axios from "axios";

import Loader from "../../loader";
import { FaPlus, FaTrash } from "react-icons/fa";
import "./style.css";
import { docHomeUrl, secondUrl } from "../../../utils/baseUrl";
import toast from "react-hot-toast";

function AddQuestion({ getFunction, openModal, setOpenModal, exam_id }) {
  const [correctAnswerText, setCorrectAnswerText] = useState("");
  const [responseStatus, setResponseStatus] = useState(null); // New state for tracking response status
  const [questionData, setQuestionData] = useState({
    name: "",
    image: null,
    answers: [{ text: "", isCorrect: false }],
    loading: false,
  });
  const handleAddAnswer = () => {
    setQuestionData({
      ...questionData,
      answers: [...questionData.answers, { text: "", isCorrect: false }],
    });
  };

  const handleRemoveAnswer = (index) => {
    const updatedAnswers = questionData.answers.filter((_, i) => i !== index);
    setQuestionData({ ...questionData, answers: updatedAnswers });
  };

  useEffect(() => {
    // Find the correct answer
    const correctAnswer = questionData?.answers.find(
      (answer) => answer.isCorrect === true
    );

    // If a correct answer is found, set its text to the state
    if (correctAnswer) {
      setCorrectAnswerText(correctAnswer.text);
    }
  }, [questionData?.answers]);

  const handleAnswerChange = (index, field, value) => {
    const updatedAnswers = questionData.answers.map((answer, i) =>
      i === index ? { ...answer, [field]: value } : answer
    );
    setQuestionData({ ...questionData, answers: updatedAnswers });
  };

  const handleImageChange = (e) => {
    setQuestionData({ ...questionData, image: e.target.files[0] });
  };

  const removeImage = () => {
    setQuestionData({ ...questionData, image: null });
  };

  const handleLabelClick = (index) => {
    const updatedAnswers = questionData.answers.map((answer, i) =>
      i === index
        ? { ...answer, isCorrect: true }
        : { ...answer, isCorrect: false }
    );
    setQuestionData({ ...questionData, answers: updatedAnswers });
  };

  const saveNewQuestion = (e) => {
    e.preventDefault();

    // Validation checks
    if (!questionData?.name?.trim()) {
      toast.error("اسم السؤال مطلوب.");
      return;
    }

    if (!questionData?.answers || questionData.answers.length === 0) {
      toast.error("علي الاقل اجابة سؤال مطلوبه.");
      return;
    }

    const hasEmptyAnswer = questionData.answers.some(
      (answer) => !answer.text.trim()
    );
    if (hasEmptyAnswer) {
      toast.error("يجب أن تحتوي جميع الإجابات على نص.");
      return;
    }

    if (!correctAnswerText) {
      toast.error("مطلوب الإجابة الصحيحة.");
      return;
    }

    if (!questionData?.loading) {
      setQuestionData({ ...questionData, loading: true });

      const formData = new FormData();
      formData.append("question_text", questionData.name);
      formData.append("image", questionData.image);
      formData.append("question_image", questionData.image ? 1 : 0);
      formData.append(
        "question_answers",
        questionData.answers.map((answer) => answer.text).join("//CAMP//")
      );
      formData.append("exam_id", exam_id);
      formData.append("question_valid_answer", correctAnswerText);

      axios
        .post(`${docHomeUrl}add_ques.php`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setResponseStatus(res.status); // Set the response status

          if (res.status === 200) {
            setQuestionData({
              name: "",
              image: null,
              answers: [{ text: "", isCorrect: false }],
              loading: false,
            });
            toast.success(res.data);
            setCorrectAnswerText("");
            setOpenModal(false);
            getFunction();
          } else {
            toast.error("An error occurred while saving the question.");
          }
        })
        .catch((err) => {
          console.log(err);
          setResponseStatus(err.response?.status || 500); // Set the error status
          toast.error("An error occurred while saving the question.");
        })
        .finally(() => {
          setQuestionData({
            name: "",
            image: null,
            answers: [{ text: "", isCorrect: false }],
            loading: false,
          });
        });
    }
  };

  useEffect(() => {
    if (responseStatus === 200) {
      setQuestionData({
        name: "",
        image: null,
        answers: [{ text: "", isCorrect: false }],
        loading: false,
      });

      setCorrectAnswerText("");
      setOpenModal(false);
      getFunction();
    } else if (responseStatus === 400) {
      console.log("Bad request: Please check your input.");
    } else if (responseStatus === 500) {
      console.log("Server error: Please try again later.");
    }
  }, [responseStatus]);
  return (
    <Modal
      close={setOpenModal}
      footer={false}
      title={"Add Question"}
      visible={openModal}
    >
      <form onSubmit={(e) => saveNewQuestion(e)} className="animated-form">
        <div className="form-group">
          <label htmlFor="questionName" className="form-label">
            اسم السؤال
          </label>
          <input
            value={questionData?.name}
            type="text"
            id="questionName"
            placeholder="ادخل اسم السؤال"
            onChange={(e) =>
              setQuestionData({ ...questionData, name: e.target.value })
            }
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="questionImage" className="form-label">
            صورة السؤال (اختياري)
          </label>
          <input
            type="file"
            id="questionImage"
            onChange={handleImageChange}
            className="form-input"
          />
          {questionData?.image && (
            <div className="image-preview">
              <img
                src={URL.createObjectURL(questionData?.image)}
                alt="Question Preview"
              />
              <button
                type="button"
                onClick={removeImage}
                className="remove-image-btn"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>
        {questionData.answers.map((answer, index) => (
          <div key={index} className="answer-row">
            <input
              type="text"
              placeholder="ادخل اجابة السؤال"
              value={answer.text}
              onChange={(e) =>
                handleAnswerChange(index, "text", e.target.value)
              }
              className="answer-input"
            />
            <input
              type="checkbox"
              checked={answer.isCorrect}
              onChange={() => handleLabelClick(index)}
              className="answer-checkbox"
              readOnly
            />
            <label onClick={() => handleLabelClick(index)}>
              الإجابة الصحيحه
            </label>
            <button
              type="button"
              onClick={() => handleRemoveAnswer(index)}
              className="answer-action-btn remove-answer-btn text-danger"
            >
              <FaTrash />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddAnswer}
          className="answer-action-btn add-answer-btn answer-action-btn2"
        >
          <FaPlus /> <span>اضافة اجابه جديده</span>
        </button>
        <div className="form-footer d-flex justify-content-start">
          {questionData?.loading ? (
            <Loader />
          ) : (
            <button type="submit" className="form-submit-btn">
              حفظ
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}

export default AddQuestion;
