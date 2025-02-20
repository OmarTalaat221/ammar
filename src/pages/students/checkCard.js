import React, { useState } from "react";
import "./style.css";
import { baseUrl } from "../../utils/baseUrl";
import Toast from "../../components/toast";
import CustomTable from "../../components/table";

function CheckCard() {
  const [toast, setToast] = useState(false);
  const [cardCode, setCardCode] = useState("");
  const [cardDetails, setCardDetails] = useState(null);

  const handleInputChange = (e) => {
    setCardCode(e.target.value);
  };

  const handleCheckCard = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(baseUrl + "subscriptions/check_card.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card_code: cardCode }),
      });

      const data = await response.json();
      setCardDetails(data);
      setToast({ type: "success", message: "تم جلب تفاصيل البطاقة بنجاح!" });
    } catch (err) {
      setCardDetails(null);
      setToast({ type: "error", message: "فشل جلب تفاصيل البطاقة." });
    }
  };

  const columns = [
    { key: "card_code", title: "كود البطاقة", dataIndex: "card_code" },
    { key: "student_name", title: "اسم الطالب", dataIndex: "student_name" },
    { key: "student_email", title: "البريد الالكتروني", dataIndex: "student_email" },
    { key: "student_phone", title: "رقم هاتف الطالب", dataIndex: "student_phone" },
    { key: "school_name", title: "اسم المدرسة", dataIndex: "school_name" },
    { key: "student_governce", title: "المحافظة", dataIndex: "student_governce" },
    // { key: "name", title: "اسم الباقة", dataIndex: "name" },
    // { key: "price", title: "السعر", dataIndex: "price" },
    { key: "group_name", title: "اسم المجموعة", dataIndex: "group_name" },
    // { key: "doctor_name", title: "اسم الدكتور", dataIndex: "doctor_name" },
    { key: "type", title: "النوع", dataIndex: "type",  render: (e, row) => {
      return <span>{row?.group_status	==0?"أونلاين":"سنتر"}</span>;
    }, },
  ];

  return (
    <div className="check-card">
      <div className="cardCheckForm">
        <h1 className="pageTitle">كود التحقق</h1>
        <form onSubmit={handleCheckCard}>
          <div className="form-group">
            <label htmlFor="cardCode">كود البطاقة</label>
            <input
              type="text"
              id="cardCode"
              name="cardCode"
              value={cardCode}
              onChange={handleInputChange}
              className="form-control"
              placeholder="ادخل كود البطاقة"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            كود التحقق
          </button>
        </form>
      </div>

      {cardDetails && (
        <CustomTable dataSource={[cardDetails]} columns={columns} />
      )}

      {toast && (
        <Toast message={toast?.message} type={toast?.type} onClose={setToast} />
      )}
    </div>
  );
}

export default CheckCard;
