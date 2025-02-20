import React, { useState, useEffect } from "react";
import Modal from "../../modal";
import axios from "axios";

import Loader from "../../loader";
import { FaPlus, FaTrash } from "react-icons/fa";
import "./style.css";
import { docHomeUrl, secondUrl } from "../../../utils/baseUrl";
import toast from "react-hot-toast";

function EditQuestion({
  questionId,
  questionData,
  openModal,
  setQuestionData,
  setOpenModal,
  getFunction,
}) {
  const handleImageChange = (e) => {
    setQuestionData({ ...questionData, question_image: e.target.files[0] });
  };

  const handleAddAnswer = () => {
    setQuestionData({
      ...questionData,
      question_answers: [...questionData.question_answers, ""], // Add an empty string as a new answer
    });
  };

  const handleRemoveAnswer = (index) => {
    const updatedAnswers = questionData.question_answers.filter(
      (_, i) => i !== index
    );
    setQuestionData({
      ...questionData,
      question_answers: updatedAnswers,
      // If the removed answer was the correct answer, reset the correct answer
      question_valid_answer:
        questionData.question_valid_answer ===
        questionData.question_answers[index]
          ? ""
          : questionData.question_valid_answer,
    });
  };

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = questionData.question_answers.map((answer, i) =>
      i === index ? value : answer
    );
    setQuestionData({ ...questionData, question_answers: updatedAnswers });
  };

  const handleLabelClick = (index) => {
    const selectedAnswer = questionData.question_answers[index];
    setQuestionData({
      ...questionData,
      question_valid_answer: selectedAnswer, // Set the correct answer
    });
  };

  const saveUpdatedQuestion = (e) => {
    e.preventDefault();

    // Validation
    if (!questionData.question_text?.trim()) {
      toast.error("لا يمكن أن يكون اسم السؤال فارغًا.");
      return;
    }

    if (questionData.question_answers.length === 0) {
      toast.error("ويجب تقديم إجابة واحدة على الأقل.");
      return;
    }

    const hasEmptyAnswer = questionData.question_answers.some(
      (answer) => !answer?.trim()
    );
    if (hasEmptyAnswer) {
      toast.error("يجب أن تحتوي جميع الإجابات على نص.");
      return;
    }

    if (!questionData.question_valid_answer?.trim()) {
      toast.error("يجب اختيار إجابة واحدة صحيحة بالضبط.");
      return;
    }

    // Proceed if validation passes
    if (!questionData?.loading) {
      const formDataObj = new FormData();

      // Append basic fields
      formDataObj.append("question_text", questionData.question_text);
      formDataObj.append("question_id", questionData.question_id);

      // Append image (if exists)
      formDataObj.append("question_image", questionData.question_image ? 1 : 0);
      if (questionData.question_image) {
        formDataObj.append("image", questionData.question_image);
      }

      // Append answers (joined with a delimiter)
      const joinedAnswers = questionData.question_answers.join("//CAMP//");
      formDataObj.append("question_answers", joinedAnswers);

      // Append the correct answer
      formDataObj.append(
        "question_valid_answer",
        questionData.question_valid_answer
      );

      // Set loading state
      setQuestionData({ ...questionData, loading: true });

      // Send the request
      axios
        .post(`${docHomeUrl}edit_ques.php`, formDataObj, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.data === "success") {
            toast.success("تم تحديث السؤال بنجاح.");
            getFunction(); // Refresh the data
            setOpenModal(false); // Close the modal
          } else {
            toast.error("فشل في تحديث السؤال. يرجى المحاولة مرة أخرى.");
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("فشل في تحديث السؤال. يرجى المحاولة مرة أخرى.");
        })
        .finally(() => {
          setQuestionData({ ...questionData, loading: false }); // Reset loading state
        });
    }
  };

  return (
    <Modal
      close={() => setOpenModal(false)}
      footer={false}
      title={"Edit Question"}
      visible={openModal}
    >
      <form onSubmit={saveUpdatedQuestion} className="animated-form">
        <div className="form-group">
          <label htmlFor="questionName" className="form-label">
            اسم السؤال
          </label>
          <input
            type="text"
            id="questionName"
            placeholder="ادخل اسم السؤال"
            value={questionData.question_text}
            onChange={(e) =>
              setQuestionData({
                ...questionData,
                question_text: e.target.value,
              })
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
          {questionData?.question_image && (
            <div className="image-preview">
              <img
                src={
                  questionData?.question_image instanceof File
                    ? URL.createObjectURL(questionData?.question_image)
                    : questionData?.question_image
                }
                alt="Question Preview"
              />
              <button
                type="button"
                onClick={() =>
                  setQuestionData({ ...questionData, question_image: null })
                }
                className="remove-image-btn"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>
        {questionData?.question_answers?.map((answer, index) => (
          <div key={index} className="answer-row">
            <input
              type="text"
              placeholder="ادخل نص الاجابة"
              value={answer}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              className="answer-input"
            />
            <input
              type="checkbox"
              checked={answer == questionData?.question_valid_answer}
              onChange={() => handleLabelClick(index)}
              className="answer-checkbox"
              readOnly
            />
            <label onClick={() => handleLabelClick(index)}>
              الاجابة الصحيحه
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
          <FaPlus /> <span>اضف اجابة السؤال</span>
        </button>
        <div className="form-footer">
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

export default EditQuestion;
