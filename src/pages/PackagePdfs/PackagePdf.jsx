import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CustomTable from '../../components/table/index';
import Modal from "../../components/modal";
import axios from "axios";
import { pdfIcon } from "../../assets/svgIcons";
import Toast from "../../components/toast";

export default function PackagePdf() {
    const [toast , setToast] = useState(false);
    const [openModal , setOpenModal] = useState(false);
    const [rowData , setRowData] = useState({});
    const [deleteModal , setDeleteModal] = useState(false)
    const {id} = useParams();
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfs , setPdfs] = useState([]);
    const [pdfData , setPdfData] = useState({
        title:"",
    })
    console.log(id)

    const columns = [
        {
            title:"id",
            dataIndex:"summary_id",
        },
        {
            title:"Title",
            dataIndex:"summary_name",
        },
        {
            title:"PDF",
            dataIndex:"pdf",
            render:(text , row) => <a href={row?.summary_link} target="_blank">{pdfIcon}</a>
        },
        {
            title:"Actions",
            dataIndex:"Actions",
            render:(text , row) => <div className="d-flex gap-2">
                <button className="btn btn-danger" onClick={() => {
                    setRowData(row)
                    setDeleteModal(true)
                }}>حذف</button>
            </div>
        }
    ]

    function handleGetAllPdfs() {
        const data_send = {
            package_id  : +id
        }
       axios.post("https://camp-coding.online/Teacher_App_2024/Mahmoud_Ammar/doctor/home/select_pdf_package.php" ,data_send)
       .then(res => {
        if(res.data?.length > 0) {
            console.log(res?.data)
            setPdfs(res?.data)
        }
        }).catch(e => console.log(e))
    }

    useEffect(() => {
        handleGetAllPdfs();
    } ,[])

    function handleAddPdf(e) {
        e.preventDefault();

        if(pdfData?.title == "") {
            setToast({type:"error",message:"ادخل اسم للملف أولا!"});
            return;
        }

        if(!pdfFile) {
            setToast({type:"error",message:"ادخل PDF اولا!"});
            return;
        }
        const formData = new FormData()
        formData.append("file_attachment" , pdfFile)

        

        axios.post("https://camp-coding.online/Teacher_App_2024/Mahmoud_Ammar/doctor/home/upload_pdf.php" , formData)
        .then(res => {
            console.log(res)
            if(res?.data?.status == "success"){
                setToast({type:"success",message:"تم رفع الملف بنجاح"});
                       
                const data_send = {
                    package_id : +id,
                    title : pdfData?.title,
                    attach_pdf : res?.data?.message
                }

                axios.post("https://camp-coding.online/Teacher_App_2024/Mahmoud_Ammar/doctor/home/add_package_pdf.php",data_send)
                .then(res => {
                    if(res?.data == "success") {
                        handleGetAllPdfs();
                        setToast({type:"success",message:"تم إضافة الPDF بنجاح"});
                        setPdfFile(null);
                        setPdfData({title:""})
                    }else {
                        setToast({type:"error",message:"هناك مشكله في اضافة PDF"})
                    }
                }).catch(e => console.log(e))
                .finally(() => setOpenModal(false))
            }
        }).catch(e => console.log(e))
        .finally(() => setOpenModal(false))

        // const data_send = {
        //     papackage_id : +id,
        //     title: pdfData?.title,
        //     attach_pdf : formData
        // }
        // console.log(data_send)
    }

    function handleDeletPdf(){
     const data_send = {
        pdf_id : rowData?.summary_id
     }

     console.log("dataSend: "  ,  data_send)

    

     axios.post("https://camp-coding.online/Teacher_App_2024/Mahmoud_Ammar/doctor/home/delete_pdf.php",data_send)
     .then(res => {
        console.log(res)
        if(res?.data == "success") {
            setToast({type:"success",message:"تم حذف ال pdf بنجاح"});
            window.location.reload();
            handleGetAllPdfs();
            setDeleteModal(false)
        }else{
            setToast({type:"error",message:"هناك مشكله في حذف ال PDF"});
        }
     }).catch(e => console.log(e))
     .finally(() => setDeleteModal(false))
    }
  return (
    <div>
         <div className="tablePageHeader">
        <h1 className="pageTitle">Packages PDFS</h1>
        <button
          className="btn btn-success"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          Add PDF
        </button>
      </div>

      <Modal visible={deleteModal} close={setDeleteModal} title="Delete PDF" footer={null}>
        <h5>هل تريد حذف هذا ال pdf ? ({rowData?.summary_name})</h5>
        <div className="d-flex gap-2">
            <button className="btn btn-danger" onClick={handleDeletPdf}>حذف</button>
            <button className="btn btn-primary" onClick={() => setDeleteModal(false)}>إلغاء</button>
        </div>
      </Modal>

      <Modal visible={openModal} close={setOpenModal} title={"إضافة PDF"} footer={null}>
      <form onSubmit={handleAddPdf}>
           <div className="form-group">
            <label className="form-label">عنوان ال PDF</label>
            <input type="text" onChange={(e) =>setPdfData({...pdfData , title:e.target.value})} value={pdfData?.title} className="form-input"/>
           </div>
             
            <div className="form-group">
              <label className="form-label">PDF</label>
              <input accept="application/pdf" className="form-input" type="file" onChange={(e) => setPdfFile(e.target.files[0])} />
            </div>

            <button className="btn btn-primary">إضافة</button>
         </form>
      </Modal>

      <CustomTable columns={columns} dataSource={pdfs}/>

      {toast && (
          <Toast
            message={toast?.message}
            type={toast?.type}
            onClose={() => setToast(false)}
          />
        )}
    </div>
  )
}
