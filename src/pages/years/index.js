import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GroupsIcon,
  closedEye,
  deleteIcon,
  editIcon,
  lectures,
  openedEye,
  students,
} from "../../assets/svgIcons";
import CustomTable from "../../components/table";
import AddYears from "../../components/years/add";
import DeleteYears from "../../components/years/delete";
import EditYears from "../../components/years/edit";
import ShowHideYears from "../../components/years/showHide";
import { baseUrl } from "../../utils/baseUrl";
import "./style.css";
import { MdSubscriptions } from "react-icons/md";
import { FaBookOpen, FaQuestion, FaRegNewspaper } from "react-icons/fa";
import DropMenu from "../../components/dropmenu";
import { FaPodcast } from "react-icons/fa6";
const initialData = [
  {
    key: "1",
    grade: "أولى ثانوي",
    description: "الصف الأول الثانوي",
    hidden: false,
  },
  {
    key: "2",
    grade: "تانية ثانوي",
    description: "الصف الثاني الثانوي",
    hidden: true,
  },
  {
    key: "3",
    grade: "تالتة ثانوي",
    description: "الصف الثالث الثانوي",
    hidden: false,
  },
];

function Years() {
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openShowHideModal, setOpenShowHideModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const navigate = useNavigate();
  const [years, setYears] = useState(null);
  useEffect(() => {
    getYears();
  }, []);
  const getYears = async () => {
    try {
      const yearsData = await fetch(baseUrl + "select_genrations.php");
      const data = await yearsData?.json();
      console.log(data);
      setYears(data);
    } catch (err) {
      setYears([]);
    }
  };
  const columns = [
    {
      key: "Generation",
      title: "الدفعه",
      dataIndex: "doctor_name",
      search: true,
    },
    {
      key: "type",
      title: "النوع",
      dataIndex: "type",
      search: true,
    },

    {
      key: "actions",
      title: "أوامر",
      dataIndex: "actions",
      render: (text, row) => {
        return (
          <div className="actions-btns">
            {/* <div
              className='delete-btn c-pointer text-danger'
              onClick={() => setOpenDeleteModal(row)}
            >
              <div className='tooltip'>Delete</div>
              {deleteIcon}
            </div>

            <div
              className='open-btn c-pointer text-primary'
              onClick={() => {
                setOpenEditModal(row);
              }}
            >
              <div className='tooltip'>Edit</div>
              {editIcon}
            </div>

            <div
              className={
                row?.hidden
                  ? "showhide-btn c-pointer text-success"
                  : "showhide-btn c-pointer text-danger"
              }
              onClick={() => setOpenShowHideModal(row)}
            >
              <div className='tooltip'>{row?.hidden ? "Show" : "Hide"}</div>
              {row?.hidden ? closedEye : openedEye}
            </div> */}

            {/* <div
              className='open-btn c-pointer text-success'
              onClick={() => navigate(`${row?.key}/lectures`)}
            >
              <div className='tooltip'>Lectures</div>
              {lectures}
            </div> */}

            {/*
             */}
            <div
              className="open-btn c-pointer text-success"
              onClick={() =>
                navigate(`${row?.gen_id}/${row?.doctor_name}/students`)
              }
            >
              <div className="tooltip">الطلاب</div>
              {students}
            </div>

            <div
              className="open-btn c-pointer text-success"
              onClick={() => navigate(`/${row?.gen_id}/Subscriptions/years`)}
            >
              <div className="tooltip">الاشتراكات</div>
              <FaRegNewspaper />
            </div>
            {/* <div
              className='open-btn c-pointer text-success'
              onClick={() => navigate(`/${row?.gen_id}/units`)}
            >
              <div className='tooltip'>الوحدات</div>
              <FaBookOpen />
            </div> */}
            <div
              className="open-btn c-pointer text-success"
              onClick={() => navigate(`${row?.gen_id}/groups`)}
            >
              <div className="tooltip">المجموعات</div>
              {GroupsIcon}
            </div>

            <div
              className="open-btn c-pointer text-success"
              onClick={() => navigate(`${row?.gen_id}/podcast`)}
            >
              <div className="tooltip">البودكاست</div>
              <FaPodcast />
            </div>
            <div
              className="open-btn c-pointer text-success"
              onClick={() => navigate(`${row?.gen_id}/exam`)}
            >
              <FaQuestion />
              <div className="tooltip">امتحانات</div>
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="years">
      <div className="tablePageHeader">
        <h1 className="pageTitle">الدفعات</h1>
        {/* <button
          className="btn btn-success"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          Add Year
        </button> */}
      </div>
      <CustomTable dataSource={years} columns={columns} />

      <AddYears openModal={openModal} setOpenModal={setOpenModal} />
      <EditYears openModal={openEditModal} setOpenModal={setOpenEditModal} />
      <DeleteYears
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
      />

      <ShowHideYears
        openModal={openShowHideModal}
        setOpenModal={setOpenShowHideModal}
      />
    </div>
  );
}

export default Years;
