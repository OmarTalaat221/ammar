import React, { useState, useEffect } from "react";
import CustomTable from "../../components/table";
import Loader from "../../components/loader";
import { baseUrl } from "../../utils/baseUrl";
import { students } from "../../assets/svgIcons";
import { useNavigate } from "react-router-dom";

function SubscriptionCounts() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          baseUrl + "subscriptions/select_packages_counts.php",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();
        setPackages(data);
      } catch (err) {
        setPackages([]);
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const columns = [
    {
      key: "Number",
      title: "الرقم",
      dataIndex: "package_id",
    },
    {
      key: "type",
      title: "النوع",
      dataIndex: "type",
    },
    {
      key: "Year",
      title: "الدفعه",
      dataIndex: "doctor_name",
    },
    {
      key: "group_name",
      title: "اسم المجموعة",
      dataIndex: "group_name",
    },
    {
      key: "name",
      title: "اسم الباقة",
      dataIndex: "name",
    },
    {
      key: "price",
      title: "السعر",
      dataIndex: "price",
    },
    {
      key: "count",
      title: "العدد",
      dataIndex: "count",
    },
    {
      key: "age",
      title: "المجموعه",
      dataIndex: "group_name",
      render: (e, row) => {
        return (
          <div
            className="open-btn c-pointer text-success"
            onClick={() => navigate(`${row?.package_id}/students`)}
          >
            <div className="tooltip">الطلاب</div>
            {students}
          </div>
        );
      },
    },
  ];

  return (
    <div className="subscription-cards">
      {loading ? (
        <Loader size="lg" />
      ) : (
        <CustomTable dataSource={packages} columns={columns} />
      )}
    </div>
  );
}

export default SubscriptionCounts;
