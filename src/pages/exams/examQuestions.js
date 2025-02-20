import React, { useState, useEffect } from "react";
import axios from "axios";
import QuestionCard from "../../components/ExamQuestions/questionCard/QuestionCard";
import Toast from "../../components/toast";
import Loader from "../../components/loader";
import AddQuestion from "../../components/ExamQuestions/add";
import EditQuestion from "../../components/ExamQuestions/edit";
import { sampleQuestionData } from "../../data/questions";
import { docHomeUrl } from "../../utils/baseUrl";
import { useParams } from "react-router-dom";
import DeleteQuestion from "./../days/dayQuizzess/delete";

function ExamQuestions() {
  const [questions, setQuestions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  const { exam_id } = useParams();

  const [loading, setLoading] = useState(false);

  const getQuestions = async () => {
    setLoading(true);

    try {
      const res = await axios.post(`${docHomeUrl}select_questions.php`, {
        exam_id: exam_id,
      });

      if (res.status === 200) {
        if (Array.isArray(res?.data?.questions)) {
          setQuestions(res?.data?.questions);
        } else {
          throw new Error("Invalid data format received from the server.");
        }
      } else {
        throw new Error(`Unexpected status code: ${res.status}`);
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getQuestions();
  }, []);

  const handleEditClick = (question) => {
    setCurrentQuestion(question);
    setOpenEditModal(true);
  };
  const handleDeleteClick = (question) => {
    setCurrentQuestion(question);
    setOpenDeleteModal(true);

    console.log(currentQuestion);
  };

  return (
    <div className="exam-questions">
      <div className="header">
        <h1>أسئلة الامتحان</h1>
        <button className="btn btn-success" onClick={() => setOpenModal(true)}>
          اضافة سؤال
        </button>
      </div>
      <div className="questions-grid">
        {questions?.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            onEdit={() => handleEditClick(question)}
            onDelete={() => handleDeleteClick(question)}
          />
        ))}
      </div>
      <AddQuestion
        getFunction={getQuestions}
        exam_id={exam_id}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />

      <DeleteQuestion
        questionId={currentQuestion?.question_id}
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        getFunction={getQuestions}
      />

      {currentQuestion && (
        <EditQuestion
          questionId={currentQuestion?.question_id}
          openModal={openEditModal}
          setOpenModal={setOpenEditModal}
          questionData={currentQuestion}
          getFunction={getQuestions}
          setQuestionData={setCurrentQuestion}
        />
      )}
      {loading && <Loader />}
    </div>
  );
}

export default ExamQuestions;
