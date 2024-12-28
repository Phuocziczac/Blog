<script setup>
defineProps({
    topicName: String
});
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import axios from 'axios';
import ModalPage from './ModalPage.vue';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import starFilled from '../components/icons/star-filled.svg';
import starEmpty from '../components/icons/start.svg';
const loading = ref(false);
// const posts = ref(JSON.parse(localStorage.getItem('posts')) || []); // Khởi tạo với dữ liệu từ localStorage hoặc mảng rỗng
const posts = ref([]);
const router = useRouter();

console.log("home", posts)
const route = useRoute();
const topicName = ref(route.params.topicName || '');  // Lưu từ khóa tìm kiếm



watch(() => route.params.topicName, (newTopicName) => {
    topicName.value = newTopicName || ''; // Cập nhật `topicName` khi `params` thay đổi
});
console.log(topicName.value)
let morePost = 8; // Dùng let để có thể thay đổi giá trị
const loadMore = () => {
    morePost += 4; // Tăng thêm 4 bài viết mỗi lần nhấn
    getAll(); // Gọi lại API để lấy danh sách bài viết
};

function goToEdit(id) {
    router.push(`/add/${id}`); // Chuyển hướng đến trang chỉnh sửa với id
}

function goToDetail(id) {
    router.push(`/detail/${id}`); // Chuyển hướng đến trang chỉnh sửa với id
}


onMounted(() => {
    loading.value = true;
    getAll();
});

const filteredPosts = computed(() => {
    return posts.value.filter(post =>
        post.topic.trim().toLowerCase() === topicName.value.trim().toLowerCase()
    );
});



const getAll = () => {
    loading.value = true;
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
            loading.value = false; // Kết thúc loading
        });
}
const deleteById = (postId) => {
    loading.value = true;
    axios.delete(`${import.meta.env.VITE_BASE_API}/Blog/${postId}`)
        .then((response) => {
            toastr.success('Item deleted successfully!');
            getAll();
        })
        .catch((error) => {
            console.error('Error fetching post:', error);
        })
        .finally(() => {
            loading.value = false;
        });
};
const isModalVisible = ref(false);
const idDelete = ref();
const openModal = (id) => {
    idDelete.value = id;
    console.log(idDelete.value)
    console.log("Opening modal...");
    isModalVisible.value = true;
    console.log("Modal visible:", isModalVisible.value);
};


const closeModal = () => {
    isModalVisible.value = false; // Ẩn modal
};

const handleDelete = () => {
    if (idDelete) { deleteById(idDelete.value); }

    console.log('Item deleted!');
    closeModal(); // Đóng modal sau khi xác nhận
};
toastr.options = {
    "closeButton": true, // Hiển thị nút đóng
    "progressBar": true, // Hiển thị thanh tiến trình
    "positionClass": "toast-top-right", // Vị trí của Toast
    "timeOut": "5000", // Thời gian hiển thị toast (5000ms = 5 giây)
};
const toggleFavorite = (postId) => {
    const post = posts.value.find(p => p.id === postId);
    if (post) {
        // Toggle the favorite status locally
        post.favorite = !post.favorite;
        console.log(post.favorite); // Check the updated status

        // Update the post on the server using PUT request
        axios.put(`${import.meta.env.VITE_BASE_API}/Blog/${postId}`, post)
            .then((response) => {
                toastr.success('Favorite status updated!');
                getAll(); // Optionally reload posts after update
            })
            .catch((error) => {
                toastr.error('Failed to update favorite status');
                console.error('Error updating favorite:', error);
            });
    }
};

</script>

<template>
    <div v-if="loading" class="loading-overlay">
        <p>Loading...</p>
    </div>
    <ModalPage :visible="isModalVisible" title="Are you sure?"
        message="Do you want to delete this item? This action cannot be undone." @cancel="closeModal"
        @confirm="handleDelete" />
    <!-- <div class="search">

        <input type="text" v-model="searchKeyword" placeholder="Type something">
        <i class="fas fa-search search-icon"></i>
    </div> -->
    <!-- <div class="search-content">
        <ul v-for="search in filteredPosts" :key="search.id">
            <li @click="goToDetail(search.id)">{{ search.title }}</li>
        </ul>
    </div> -->

    <div class="title">
        ALL POST
    </div>
    <div class="row">
        <div class="news" v-for="post in filteredPosts" :key="post.id">

            <img :src="post.images" alt="" @click="goToDetail(post.id)">
            <div class="noidung">
                <div><span class="by">IN</span> <span class="author">{{ post.topic }}</span> </div>
                <div @click="goToDetail(post.id)">
                    <div class="text-title">{{ post.title }}</div>
                </div>
                <p></p>

                <div @click="goToDetail(post.id)">
                    <div class="text-subtile">{{ post.subtile }}</div>
                </div>
                <div class="btn-down"> <button class="delete" @click="openModal(post.id)"><i
                            class="fa-solid fa-trash"></i></button>
                    <button class="edit" @click="goToEdit(post.id)"><i class="fa-regular fa-pen-to-square"></i></button>
                    <button class="favorite" @click="toggleFavorite(post.id)">
                        <img :src="post.favorite ? starFilled : starEmpty" alt="Favorite" class="favorite-icon"
                            style="height: 25px; width: 25px;" />
                    </button>


                </div>


            </div>

        </div>



    </div>
    <!-- <div class="btn"> <button class="load" @click="loadMore()">Load More</button></div> -->
</template>


<style scoped>
.search-content {
    position: absolute;
    /* Để pseudo-element có thể căn chỉnh đúng */
    background-color: #ffffff;
    z-index: 1000;
    border-radius: 15px;
    width: 1170px;
    border: #888;
    box-shadow: 0 0 50px rgba(136, 136, 136, 0.5);
    /* Tạo bóng mờ */
}

.search-content ul {
    padding: 2px;
}

.search-content li {
    position: relative;
    /* Để pseudo-element có thể được căn chỉnh đúng */
    padding: 10px;

    list-style: none;
    border-radius: 7px;
    cursor: pointer;
    /* Thêm con trỏ chuột khi hover vào */
}

.search-content li::before {
    content: '';
    /* Tạo phần tử giả */
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #dbdbdb;
    /* Màu nền bạn muốn */
    border-radius: 7px;
    /* Làm tròn góc */
    opacity: 0;
    /* Ban đầu không hiển thị */
    transition: opacity 0.3s ease;
    /* Thêm hiệu ứng mờ dần */
    z-index: -1;
    /* Đảm bảo nền không che nội dung */
}

.search-content li:hover::before {
    opacity: 1;
    /* Khi hover, làm cho nền hiện lên */
}



.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 18px;
    z-index: 9999;
}

.by {
    font-family: Open Sans;
    font-size: 16px;
    font-weight: 400;
    line-height: 58px;
    letter-spacing: -0.10000000149011612px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    color: #9B9B9B;

}

.text-title {
    font-family: Open Sans;
    font-size: 28px;
    font-weight: 600;
    line-height: 46px;
    letter-spacing: -0.17499999701976776px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;

}

.text-subtile {
    font-family: Open Sans;
    font-size: 16px;
    font-weight: 400;
    line-height: 32px;
    letter-spacing: -0.10000000149011612px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    color: #9B9B9B;
    ;
}

.author {
    font-family: Open Sans;
    font-size: 16px;
    font-weight: 400;
    line-height: 58px;
    letter-spacing: -0.10000000149011612px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;

}

.btn {
    display: flex;
    /* Đặt flexbox */
    justify-content: center;
    /* Căn giữa theo chiều ngang */
    width: 1170px;
    padding-top: 70px;
    /* Căn giữa container */

}

.load {
    width: 200px;
    height: 50px;
    background-color: rgb(255, 124, 146);
    color: white;
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 25px;

    /* Bo tròn */
    cursor: pointer;
    transition: background-color 0.3s ease;
    /* Hiệu ứng hover */
}

.load:hover {
    background-color: rgb(255, 100, 120);
}

.row {
    width: 1170px;
    /* height: 4900px; */
    top: 346px;
    left: 465px;

    opacity: 0px;

    display: grid;
    grid-template-columns: 1fr 1fr;
    /* Chia làm 2 cột với kích thước bằng nhau */
    /* Khoảng cách giữa các cột */


}


.news {

    width: 573px;
    height: max-content;
    top: 346px;
    left: 465px;
    gap: 15px;
    margin-right: 30px;
    padding-bottom: 20px;


}

.news img {
    width: 573px;
    height: 358px;
    top: 346px;
    left: 465px;
    gap: 0px;
    opacity: 0px;

}

.noidung {
    display: flex;
    width: 573px;

    top: 724px;
    left: 465px;
    gap: 0px;
    opacity: 0px;

    border-radius: 5px;
    flex-direction: column;
}

.noidung div:nth-child(1) {
    margin-bottom: auto;
    /* Đẩy nội dung phía trên lên */
}

.btn-down {
    display: flex;
    justify-content: flex-end;
    /* Căn nút về bên phải */
    gap: 10px;
    /* Khoảng cách giữa các nút */
    margin-top: auto;
    /* Đẩy phần nút xuống đáy */
}

.noidung span {
    width: 377px;
    height: 25px;
    top: 724px;
    left: 465px;
    gap: 0px;
    opacity: 0px;

}

.noidung strong {
    width: 536px;
    height: 133px;
    top: 770px;
    left: 465px;
    gap: 0px;
    opacity: 0px;

}

.title {
    width: 211px;
    height: 19.2px;
    top: 310px;
    left: 465px;
    gap: 0px;
    opacity: 0px;
    padding-top: 40px;

}

.title strong {
    color: #9B9B9B;
}

.search {
    display: flex;
    align-items: center;
    border: none;
    border-radius: 7px;
    padding: 5px;
    width: 1171px;
    height: 53px;
    top: 187px;
    left: 464px;
    gap: 0px;
    opacity: 0px;
    background-color: rgb(255, 255, 255);
    box-shadow: 0 0 5px rgba(136, 136, 136, 0.5);
}

.search-icon {
    margin-right: 10px;
    color: #888;
}

input {
    /* width: 1171px; */
    height: 53px;
    top: 187px;
    left: 464px;
    border: none;
    outline: none;
    flex-grow: 1;
    background-color: snow;
}

.btn-down {


    height: 50px;
}

.edit {
    background-color: rgb(255, 234, 0);
    width: 50px;
    height: 30px;
    border-radius: 7px;
    border: none;

    float: right;
}

.delete {
    background-color: rgb(255, 0, 0);
    width: 50px;
    height: 30px;
    border-radius: 7px;
    border: none;

    float: right;
}

.favorite {

    width: 50px;
    height: 30px;
    border-radius: 7px;
    border: none;

    float: right;
}

@media screen and (max-width: 768px) {
    .conten {
        max-width: 350px;
    }

    .row {
        display: inline;
        /* flex-direction: column; */
        max-width: 350px;

        /* justify-content: center; */
    }

    .noidung {
        display: inline;
        max-width: 350px;


    }

    input {
        max-width: 350px;
    }

    .search {
        max-width: 350px;

    }

    .news img {
        max-width: 350px;
        height: 250px;
    }

    .news {
        padding-bottom: 30px;
        max-width: 350px;
    }

    .btn {
        max-width: 350px;
    }
}
</style>