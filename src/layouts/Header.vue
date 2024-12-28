<script setup>
import { useRouter } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
const router = useRouter();
const activeTab = ref('new');
const showTopicDropdown = ref(false);
const posts = ref([])
const showMenu = ref(true); // Trạng thái kiểm soát hiển thị menu
function load() {

  router.push(`/`);
}
const toggleMenu = () => {
  showMenu.value = !showMenu.value;
  console.log(showMenu.value) // Chuyển đổi trạng thái hiển thị menu
};
const toPage = (path, tab) => {
  activeTab.value = tab;
  showMenu.value = true;

  router.push(path.trim());
  console.log(path.trim())  // Chuyển hướng đến path đã cho
};
const toggleTopicDropdown = () => {
  showTopicDropdown.value = !showTopicDropdown.value; // Chuyển đổi trạng thái dropdown
};
onMounted(() => {
  getAll();
})
// Lấy danh sách topic không trùng lặp
const uniqueTopics = computed(() => {
  const seen = new Set();
  return posts.value.filter(post => {
    const trimmedTopic = post.topic ? post.topic.trim() : ''; // Xóa dấu cách và kiểm tra giá trị hợp lệ
    if (!trimmedTopic) return false; // Loại bỏ các topic rỗng
    if (seen.has(trimmedTopic)) return false; // Loại bỏ topic trùng lặp
    seen.add(trimmedTopic);
    return true;
  });
});


const getAll = () => {

  axios.get(import.meta.env.VITE_BASE_API + `/Blog`)
    .then(function (response) {
      // handle success
      posts.value = response.data;
      console.log(response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(() => {
      // Kết thúc loading
    });
}
</script>
<template>
  <div class="layout">
    <header class="header">
      <div class="logo">
        <img src="../components/icons/Group 13.png" alt="Logo" @click="load()">
      </div>
      <img src="../components/icons/menu.svg" alt="Menu" class="menu-icon" @click="toggleMenu" />

      <!-- Danh sách menu -->
      <nav class="nav" :class="{ 'is-active': showMenu }">
        <div @click="toPage('/', 'new')" class="new" :class="{ 'active': activeTab === 'new' }">New
        </div>
        <div @click="toPage('/favorite', 'reading-list')" class="reading-list"
          :class="{ 'active': activeTab === 'reading-list' }">Reading list</div>
        <div class="topic" :class="{ 'active': activeTab === 'topic' }">
          <div @click="toggleTopicDropdown" class="topic-title">
            Topic
            <img src="../components/icons/arrow-down.svg" alt="Arrow Down" class="arrow-icon">
          </div>
          <div v-if="showTopicDropdown" class="topic-dropdown">
            <div v-for="post in uniqueTopics" :key="post.id" @click="toPage(`/topic/${post.topic} `, 'topic')">
              {{ post.topic }}
            </div>
          </div>

        </div>
        <div class="btn">
          <button @click="toPage('/add')" class="create">Create</button>
        </div>
      </nav>

    </header>
  </div>

</template>

<style scoped>
/* Topic container */
.topic {
  position: relative;
  cursor: pointer;
}

.topic-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.arrow-icon {
  width: 12px;
  height: 12px;
  margin-left: 5px;
}

/* Dropdown menu */
.topic-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  z-index: 1000;
  width: 150px;
  display: flex;
  flex-direction: column;
}

.topic-dropdown div {
  padding: 10px;
  font-size: 14px;
  color: black;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
}

.topic-dropdown div:hover {
  background-color: #302c41;
  color: white;
}

.topic-dropdown div:last-child {
  border-bottom: none;
}

/* Menu icon (hamburger) */
.menu-icon {
  width: 30px;
  height: 30px;
  display: none;
  /* Mặc định ẩn */
  cursor: pointer;
}

.active {
  color: red;
}

.nav div {
  font-size: 16px;
  padding: 10px 20px;
  cursor: pointer;
}

/* Hover effect */
/* .nav div:not(.btn):hover {
  background-color: #6a42f4;
  color: white;
  border-radius: 5px;
} */

.layout {


  height: 175px;
  top: -25px;
  left: -20px;
  gap: 0px;
  opacity: 0px;
  background-color: #ffffff;
  justify-content: center;
  /* Căn giữa giữa các phần tử */
  display: flex;
  align-items: center;
  /* Căn các phần tử theo chiều dọc */

}

/* Định nghĩa cho header */
.header {
  box-sizing: border-box;
  width: 1171px;
  height: 50px;
  top: 50px;
  left: 464px;
  gap: 0px;
  opacity: 0px;

  display: flex;
  justify-content: space-between;
  /* Căn giữa giữa các phần tử */
  align-items: center;
  /* Căn các phần tử theo chiều dọc */
  padding: 10px 20px;
  background-color: #FFFFFF;
  height: 50px;
  opacity: 1;

  /* Sửa opacity thành 1 để các phần tử hiển thị */
}

/* Định nghĩa cho logo */
.logo img {
  height: 30px;
  /* Đặt chiều cao cho logo */
}

/* Định nghĩa cho navigation */
.nav {
  display: flex;
  gap: 70px;
  /* Khoảng cách giữa các phần tử */
  justify-content: flex-end;
  /* Căn giữa nội dung ngang */
  margin-right: 80px;
  align-items: center;
  /* Căn giữa nội dung dọc */
  flex-grow: 1;
  /* Chiếm không gian còn lại */
}

/* Định nghĩa cho các item trong nav */
.nav div {
  font-size: 16px;

}




/* Định nghĩa cho nút 'Create' */
.create {
  width: 120px;
  height: 40px;
  background-color: rgb(137, 76, 224);
  border-radius: 5px;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

/* Hiệu ứng hover cho button */
.create:hover {
  background-color: #6a42f4;
  /* Màu khi hover */
}

.search {
  width: 1171px;
  height: 83px;
  top: 187px;
  left: 464px;
  gap: 0px;
  opacity: 0px;

}

/* Responsive Design */
@media screen and (max-width: 768px) {
  .menu-icon {
    display: block;
    /* Hiển thị menu icon */
  }

  .nav {
    display: flex;
    /* Ẩn danh sách menu khi chưa bật */
    flex-direction: column;
    background-color: aliceblue;
    /* Màu nền menu */
    position: absolute;
    top: 50px;
    right: 10px;
    width: 200px;
    padding: 10px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  }

  .nav.is-active {
    display: none;
    /* Hiển thị menu khi trạng thái là active */
  }

  .nav div {
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
    font-size: 14px;
  }


}
</style>