import HomePage from "@/pages/HomePage.vue";
import AddPage from "@/pages/AddPage.vue";
import DetailPage from "@/pages/DetailPage.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import ReadingList from "@/pages/ReadingList.vue";
import TopicPage from "@/pages/TopicPage.vue";
export const routes = [
  {
    path: '/', // Route cha
    component: DefaultLayout,
    children: [
      {
        path: '', // Route mặc định, hiển thị HomePage khi truy cập '/'
        name: 'Home',
        component: HomePage,
      },
      {
        path: 'add/:id?', // Route con, hiển thị AddPage khi truy cập '/add' hoặc '/add/:id'
        name: 'add',
        component: AddPage,
      },
      {
        path: 'detail/:id?', // Route con, hiển thị DetailPage khi truy cập '/detail/:id'
        name: 'detail',
        component: DetailPage,
      },
      {
        path: 'favorite', // Route mặc định, hiển thị HomePage khi truy cập '/'
        name: 'favourite',
        component: ReadingList,
      },
      {
        path: '/topic/:topicName', // Đường dẫn với tham số topicName
        name: 'BlogListByTopic',
        component:TopicPage,
        props: true // Truyền props là topicName vào component
      },
    ],
  },
];
