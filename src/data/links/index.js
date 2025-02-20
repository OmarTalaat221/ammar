import Home from "../../pages/home";
import Students from "../../pages/students";
import {
  FaHome,
  FaCalendarAlt,
  FaUsers,
  FaUserGraduate,
  FaUser,
  FaBookOpen,
  FaWolfPackBattalion,
  FaMoneyCheckAlt,
  FaMoneyBillWave,
  FaUserClock,
  FaUserAltSlash,
  FaDollarSign,
  FaCreditCard,
  FaUsersSlash,
  FaBoxOpen,
  FaRegCreditCard,
} from "react-icons/fa";
import Years from "../../pages/years";
import Groups from "../../pages/groups";
import Exams from "../../pages/exams";
import ExamQuestions from "../../pages/exams/examQuestions";
import ExamScores from "../../pages/exams/examScores";
import Lectures from "../../pages/lectures";
import Days from "../../pages/days";
import DaysQuiz from "../../pages/days/dayQuizzess";
import QuizQuestions from "../../pages/days/dayQuizzess/quizQuestions";
import QuizScores from "../../pages/days/dayQuizzess/quizScores";
import Videos from "../../pages/days/dayVideos";
import VideoQuiz from "../../pages/days/dayVideos/videoQuizzess";
import VideoQuizQuestions from "../../pages/days/dayVideos/videoQuizzess/quizQuestions";
import VideoQuizScores from "../../pages/days/dayVideos/videoQuizzess/quizScores";
import AbsentStudents from "../../pages/students/absent";
import Login from "../../pages/login";
import YearStudents from "../../pages/years/students";
import SubscriptionCards from "../../pages/SubscriptionCards";
import Subscriptions from "../../pages/years/Subscriptions";
import NotAssignedThirdGroup from "../../pages/NotAssignedThirdGroup/add/NotAssignedThirdGroup";
import YearGroups from "../../pages/years/YearGroups/index";
import GroupStudents from "../../pages/groupsStudents";
import GroupsQuizzes from "../../pages/years/YearGroups/exams";
import ExamGroupsScores from "../../pages/years/YearGroups/examScores";
import PausedStudents from "../../pages/students/Paused";
import CheckTransferMoney from "../../pages/transfer";
import TransferMoney from "../../pages/transfer/insertTransfer";
import SubscriptionCounts from "../../pages/packeges/subscriptionsCards";
import CheckCard from "../../pages/students/checkCard";
import PackSubscriptions from "../../pages/packeges/Subscriptions";
import Packages from "../../pages/packeges";
import LectureScores from "../../pages/lectures/LectureScores";
import VideoScores from "../../pages/lectures/VideoScores";
import Unit from "../../pages/Unit/Unit";
import UnitLessons from "../../pages/UnitLessons/UnitLessons";
import LessonQuestions from "../../pages/LessonQuestions/LessonQuestions";
import QuestionBank from "../../pages/QuestionBank";
import PackagePdf from "../../pages/PackagePdfs/PackagePdf";
import Podcast from "../../pages/Podcast/Podcast";
import { FaPodcast } from "react-icons/fa6";
import Inquiries from "../../pages/Inquiries/Inquiries";
// import ExamScores from "./../../pages/exams/examScores";

export const links = localStorage.getItem("moreenglishlogin")
  ? [
      {
        id: 20,
        route: "/lectures/:lecture/score",
        // icon: <FaUserGraduate />,
        hidden: true,
        component: LectureScores,
      },
      {
        id: 21,
        route: "/videos/:video/score",
        // icon: <FaUserGraduate />,
        hidden: true,
        component: VideoScores,
      },

      {
        id: 1,
        label: "الدفعات",
        route: "/years",
        icon: <FaCalendarAlt />,
        component: Years,
        subRoutes: [
          {
            route: "",
            component: Years,
          },
          {
            route: ":id/groups",
            component: YearGroups,
          },
          {
            route: ":id/groups/:group/Packages",
            component: Packages,
          },
          {
            route: ":id/packagePdf",
            component: PackagePdf,
          },
          {
            route: ":id/exam",
            component: Exams,
          },
          {
            route: ":id/exam/:exam_id/score",
            component: ExamScores,
          },
          {
            route: ":id/groups/:group_id/inquires",
            component: Inquiries,
          },
          {
            route: ":year_id/groups/:group_id/exams",
            component: GroupsQuizzes,
          },
          {
            route: ":yearId/groups/:groupID/exams/:quiz_id/score",
            component: ExamGroupsScores,
          },
          {
            route: ":id/groups/:group/exams",
            component: Exams,
          },
          {
            route: ":id/exam/:exam_id/questions",
            component: ExamQuestions,
          },
          {
            route: ":id/groups/:group/Packages/:pack/lectures/:lecture/days",
            // route: ":id/groups/:group/Packages/:pack/lectures",
            component: Days,
          },
          {
            route: ":yearId/groups/:group/days/:id/AbsentStudents",
            component: AbsentStudents,
          },
          {
            route: ":id/groups/:group/Packages/:pack/lectures",
            component: Lectures,
          },

          {
            route: ":id/:YearName/students",
            component: YearStudents,
          },
          {
            route:
              ":yearId/groups/:group/Packages/:pack/lectures/:lecture/days/:day/quiz",
            component: QuizQuestions, //here
          },
          {
            route:
              ":yearId/groups/:group/Packages/:pack/lectures/:lecture/days/:day/quiz/:quiz",
            component: QuizQuestions,
          },
          {
            route:
              ":yearId/groups/:group/Packages/:pack/lectures/:lecture/days/:day/quiz/:quiz/score",
            component: QuizScores,
          },
          {
            route:
              // ":yearId/groups/:group/Packages/:pack/lectures/:lecture/days/:day/videos",
              // ":yearId/groups/:group/Packages/:pack/lectures/:day/videos",
              ":yearId/groups/:group/Packages/:pack/lectures/:lec_id/videos",
            component: Videos,
          },
          {
            route: ":id/lectures/:id/days/:id/videos/:lecture/quiz",
            component: VideoQuiz,
          },
          {
            route: ":id/lectures/:id/days/:id/videos/:id/quiz/:id",
            component: VideoQuizQuestions,
          },
          {
            route: ":id/lectures/:id/days/:id/videos/:id/quiz/:id/score",
            component: VideoQuizScores,
          },
          {
            route: ":id/podcast",
            component: Podcast,
          },
        ],
      },

      {
        id: 3,
        label: "الطلاب",
        route: "/students",
        icon: <FaUserGraduate />,
        component: Students,
      },
      {
        id: 4,
        label: "أكواد الاشتراك",
        route: "/SubscriptionCards",
        icon: <FaCreditCard />,
        component: SubscriptionCards,
      },
      {
        id: 4,
        hidden: true,
        label: "وحدات",
        route: ":id/:pack/units",
        icon: <FaBookOpen />,
        component: Unit,
      },
      {
        id: 4,
        label: "الدروس",
        hidden: true,
        route: ":id/:pack/units/:id/lessons",
        icon: <FaBookOpen />,
        component: UnitLessons,
      },
      {
        id: 4,
        label: "بنك الأسئله",
        hidden: true,
        route: ":id/:pack/units/:id/lessons/:id/questions_bank",
        icon: <FaBookOpen />,
        component: LessonQuestions,
      },
      {
        id: 4,
        label: "بنك الأسئله",
        route: "QuestionBank",
        icon: <FaBookOpen />,
        hidden: true,
        component: QuestionBank,
      },

      // {
      //   id: 6,
      //   label: "Not Assigned Groups",
      //   route: "/notAssignedThird",
      //   icon: <FaUsersSlash />,
      //   component: NotAssignedThirdGroup,
      //   subRoutes: [
      //     {
      //       route: "",
      //       component: NotAssignedThirdGroup,
      //     },
      //     {
      //       route: ":id/groupStudents",
      //       component: GroupStudents,
      //     },
      //   ],
      // },

      {
        id: 5,
        label: "Subscriptions",
        route: ":id/Subscriptions/:type",
        icon: <FaDollarSign />,
        component: Subscriptions,
        hidden: true,
      },
      // {
      //   id: 8,
      //   label: "Paused Students",
      //   route: "/Paused",
      //   icon: <FaUserAltSlash />,
      //   component: PausedStudents,
      // },
      // {
      //   id: 7,
      //   label: "Absent Students",
      //   route: "/Absence",
      //   icon: <FaUserClock />,
      //   component: AbsentStudents,
      // },
      // {
      //   id: 9,
      //   label: "Check Transfer",
      //   route: "/CheckTransferMoney",
      //   icon: <FaMoneyCheckAlt />,
      //   component: CheckTransferMoney,
      // },
      // {
      //   id: 10,
      //   label: "تحويل الأموال",
      //   route: "/TransferMoney",
      //   icon: <FaMoneyBillWave />,
      //   component: TransferMoney,
      // },
      {
        id: 11,
        label: "أعداد الاشتراكات",
        route: "/SubscriptionCounts",
        icon: <FaBoxOpen />,
        component: SubscriptionCounts,
        subRoutes: [
          {
            route: "",
            component: SubscriptionCounts,
          },
          {
            route: ":pack_id/students",
            component: PackSubscriptions,
          },
        ],
      },
      {
        id: 12,
        label: "كود التحقق",
        route: "/checkCard",
        icon: <FaRegCreditCard />,
        component: CheckCard,
      },
    ]
  : [
      {
        id: 4,
        label: "تسجيل الدخول",
        route: "*",
        icon: <FaUser />,
        component: Login,
        hidden: true,
      },
    ];
