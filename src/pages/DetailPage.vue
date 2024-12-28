<script setup>

import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
const loading = ref(false);
// const posts = ref(JSON.parse(localStorage.getItem('posts')) || []); // Khởi tạo với dữ liệu từ localStorage hoặc mảng rỗng
const posts = ref([]);
const router = useRouter();
const route = useRoute();
console.log("home", posts)



const post = ref({})


onMounted(() => {
    loading.value = true;
    const postId = route.params.id;
    console.log(postId)
    if (postId) {
        getPostById(postId);
    }
});

const getPostById = (postId) => {
    loading.value = true;
    axios.get(`${import.meta.env.VITE_BASE_API}/Blog/${postId}`)
        .then((response) => {
            post.value = response.data;
            isEditing.value = true;
        })
        .catch((error) => {
            console.error('Error fetching post:', error);
        })
        .finally(() => {
            loading.value = false;
        });
};

</script>

<template>
    <div v-if="loading" class="loading-overlay">
        <p>Loading...</p>
    </div>
    <div class="top">
        <h1>{{ post.title }}</h1>
        <p></p>
        <span>{{ post.subtile }}</span>

    </div>
    <div class="break">
        Home-{{ post.title }}
    </div>
    <div class="text">
        <div class="img">

            <img :src="post.images" alt="">
        </div>
        <div class="detail">
            {{ post.content }}
        </div>
    </div>
</template>

<style scoped>
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

.img {
    width: 1021px;
    text-align: center;
    top: 607px;
    left: 514px;
    gap: 0px;
    opacity: 0px;

}

.detail {
    width: 1021px;
}

.text {
    width: 1021px;

    top: 607px;
    left: 486px;
    gap: 0px;
    opacity: 0px;
    padding: 50px;
    width: 972px;
    height: auto;
    /* Tự động điều chỉnh chiều cao */

    /* Căn giữa container */
    text-align: justify;
    /* Căn đều chữ */
    line-height: 1.6;
    /* Tăng khoảng cách dòng để dễ đọc */
    color: #333;
    /* Màu chữ */
}

.break {

    margin-top: 70px;
    width: 549px;
    height: 19px;
    top: 568px;
    left: 463px;
    gap: 0px;
    opacity: 0px;
    font-size: small;
    color: rgb(103, 106, 108);
}

.top {
    width: 1170px;
}

h1 {
    width: 1170px;
    height: 65px;
    top: 225px;
    left: 465px;
    gap: 0px;
    opacity: 0px;

}

span {
    font-weight: bold;
    width: 1170px;
    height: 81px;
    top: 319px;
    left: 465px;
    gap: 0px;
    opacity: 0px;

}

@media screen and (max-width: 768px) {
    .top {
        max-width: 350px;

    }

    .text {
        max-width: 350px;
        padding: 0px;
    }

    h1 {
        max-width: 350px;
        margin-bottom: 70px;
        padding-bottom: 20px;
    }

    img {
        max-width: 350px;
        height: 200px;

    }

    .break {
        max-width: 350px;
        padding-bottom: 20px;
    }

    .img {
        max-width: 350px;
        padding-bottom: 20px;
    }

    .detail {

        max-width: 350px;

    }
}
</style>