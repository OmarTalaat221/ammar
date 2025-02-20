import React, { useEffect, useState } from "react";
import CustomTable from "../../../components/table";
import { useParams } from "react-router-dom";
import { baseUrl, docUrl, secondUrl } from "../../../utils/baseUrl";
import Modal from "../../../components/modal";

// ConfirmModal Component
function ConfirmModal({ visible, onClose, onConfirm, message }) {
  if (!visible) return null;

  return (
    <Modal
      close={onClose}
      footer={false}
      title={"تأكيد الإجراء"}
      visible={visible}
    >
      <div className="confirm-modal">
        <p>{message}</p>
        <div className="confirm-modal-buttons">
          <button className="btn btn-danger" onClick={onClose}>
            إلغاء
          </button>
          <button className="btn btn-success" onClick={onConfirm}>
            تأكيد
          </button>
        </div>
      </div>
    </Modal>
  );
}

function PackSubscriptions() {
  const [openModal, setOpenModal] = useState(false);
  const [students, setStudents] = useState(null);
  const { pack_id } = useParams(); // Get package ID from URL params
  const [toast, setToast] = useState(false);
  const [confirmAction, setConfirmAction] = useState({
    visible: false,
    message: "",
    onConfirm: null,
  }); // State for confirmation modal

  useEffect(() => {
    if (pack_id) getStudents(); // Fetch students when the component loads
  }, [pack_id]);

  // Fetch students for the package
  const getStudents = async () => {
    try {
      const response = await fetch(
        baseUrl + "subscriptions/select_package_subscriptions.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ package_id: pack_id }),
        }
      );

      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setStudents([]); // Set students to an empty array if there's an error
    }
  };

  // Function to change subscription status (0 or 1)
  const changeSubscriptionStatus = async (student_id, status) => {
    try {
      const response = await fetch(docUrl + "/home/status_student_sub.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ student_id, package_id: pack_id, status }), // Use pack_id for package ID
      });
      const result = await response.text();
      setToast({ message: result, type: "success" });
      getStudents(); // Refresh students after the status change
    } catch (error) {
      setToast({
        message: "حدث خطأ أثناء تغيير حالة الاشتراك",
        type: "error",
      });
    }
  };

  // Trigger the confirm modal for activation/deactivation
  const triggerConfirmModal = (message, onConfirm) => {
    setConfirmAction({
      visible: true,
      message,
      onConfirm,
    });
  };

  const columns = [
    {
      key: "name",
      title: "اسم الطالب",
      dataIndex: "student_name",
      search: true,
    },
    {
      key: "student_governce",
      title: "محافظة الطالب",
      dataIndex: "student_governce",
      render: (e, row) => {
        return <span>{row?.student_governce}</span>;
      },
    },
    {
      key: "email",
      title: "البريد الالكتروني",
      dataIndex: "student_email",
      render: (e, row) => {
        return <span>{row?.student_email}</span>;
      },
    },
    {
      key: "phone",
      title: "رقم الهاتف",
      dataIndex: "student_phone",
      render: (e, row) => {
        return <span>{row?.student_phone}</span>;
      },
    },
    {
      key: "start_date",
      title: "تاريخ البدايه",
      dataIndex: "start_date",
    },
    {
      key: "school_name",
      title: "اسم المدرسة",
      dataIndex: "school_name",
    },
    {
      key: "parent_phone",
      title: "رقم هاتف ولي الأمر",
      dataIndex: "parent_phone",
    },
    // {
    //   key: "Actions",
    //   title: "أوامر",
    //   dataIndex: "reset_count",
    //   render: (e, row) => {
    //     return (
    //       <div className="rowDiv">
    //         <button
    //           style={{ margin: "0 10px", background: "green", color: "white" }}
    //           className="btn btn-primary"
    //           onClick={() =>
    //             triggerConfirmModal(
    //               `Are you sure you want to activate the subscription for ${row.student_name}?`,
    //               () => changeSubscriptionStatus(row.student_id, 1) // Activate Subscription
    //             )
    //           }
    //         >
    //           Activate
    //         </button>
    //         <button
    //           style={{ background: "red", color: "white" }}
    //           className="btn btn-primary"
    //           onClick={() =>
    //             triggerConfirmModal(
    //               `هل أنت متأكد أنك تريد إلغاء الاشتراك في  ${row.student_name}؟`,
    //               () => changeSubscriptionStatus(row.student_id, 0) // Deactivate Subscription
    //             )
    //           }
    //         >
    //           إلغاء التفعيل
    //         </button>
    //       </div>
    //     );
    //   },
    // },
  ];

  return (
    <div className="students">
      <div className="tablePageHeader">
        <h1 className="pageTitle">اشتراكات الباقات</h1>
      </div>
      <CustomTable dataSource={students} columns={columns} />

      {/* Confirm Modal */}
      <ConfirmModal
        visible={confirmAction.visible}
        message={confirmAction.message}
        onClose={() => setConfirmAction({ ...confirmAction, visible: false })}
        onConfirm={() => {
          confirmAction.onConfirm();
          setConfirmAction({ ...confirmAction, visible: false });
        }}
      />
    </div>
  );
}

export default PackSubscriptions;
