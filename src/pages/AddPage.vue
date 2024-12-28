<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

const route = useRoute();
const router = useRouter();
const isEditing = ref(false);
const loading = ref(false);
const recentPosts = ref([]);
const form = ref({
    title: '',
    subtile: '',
    topic: '',
    content: '',
    images: null
});
const getAll = () => {
    axios.get(import.meta.env.VITE_BASE_API + `/Blog`)
        .then(function (response) {
            recentPosts.value = response.data.reverse().slice(0, 5); // Lấy 5 bài viết mới nhất
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
};


onMounted(() => {
    getAll();
    const postId = route.params.id;
    if (postId) {
        getPostById(postId);
    }
});

const getPostById = (postId) => {
    loading.value = true;
    axios.get(`${import.meta.env.VITE_BASE_API}/Blog/${postId}`)
        .then((response) => {
            form.value = response.data;
            isEditing.value = true;
        })
        .catch((error) => {
            console.error('Error fetching post:', error);
        })
        .finally(() => {
            loading.value = false;
        });
};



const validateForm = () => {
    if (!form.value.title) {
        toastr.warning("fill title please!");
        return false;
    }
    if (!form.value.subtile) {
        toastr.warning("fill subtitle please!");
        return false;
    }
    if (!form.value.topic) {
        toastr.warning("fill topic please!");
        return false;
    }
    if (!form.value.content) {
        toastr.warning("fill content please!");
        return false;
    }
    return true;

}
const savePost = () => {
    if (isEditing.value) {
        // Update post
        form.value.images = "https://loremflickr.com/640/480";

        const postId = route.params.id;
        if (!validateForm()) {
            return;
        }
        loading.value = true;
        axios.put(`${import.meta.env.VITE_BASE_API}/Blog/${postId}`, { ...form.value })
            .then(() => {
                goToHome();

                toastr.success('Edit successful');

            })
            .catch((error) => {
                console.error('Error fetching post:', error);
            })
            .finally(() => {
                loading.value = false;
            });

    } else {
        // Add new post
        form.value.id = Date.now();
        form.value.images = "https://loremflickr.com/640/480";

        if (!validateForm()) {
            return;
        }
        loading.value = true;
        axios.post(`${import.meta.env.VITE_BASE_API}/Blog`, { ...form.value })
            .then(() => {
                goToHome();

                toastr.success('Post added successfully');
            })
            .catch((error) => {
                console.error('Error fetching post:', error);
            })
            .finally(() => {
                loading.value = false;
            });
    }
};

const goToHome = () => {
    router.push('/');
};
toastr.options = {
    "closeButton": true, // Hiển thị nút đóng
    "progressBar": true, // Hiển thị thanh tiến trình
    "positionClass": "toast-top-right", // Vị trí của Toast
    "timeOut": "5000", // Thời gian hiển thị toast (5000ms = 5 giây)
};
</script>

<template>
    <div v-if="loading" class="loading-overlay">
        <p>Loading...</p>
    </div>
    <div class="createpost">
        <div class="newpost">
            <button class="back" @click="router.push('/')">Back</button>

            <div class="header">
                {{ isEditing ? 'Edit Post' : 'Create Post' }}
            </div>

            <div class="input-content">
                <div class="title-input">

                    <label for="">Title</label>
                    <input v-model="form.title" type="text">
                </div>
                <div class="title-input">

                    <label for="">Subtitle</label>
                    <input v-model="form.subtile" type="text">
                </div>
                <div class="title-input">

                    <label for="">Topic</label>
                    <input v-model="form.topic" type="text">
                </div>
                <div class="content-input">
                    <label for="">Content</label>
                    <textarea v-model="form.content" style="height: 90px; width:790px;" name="" id=""></textarea>
                </div>
                <!-- <div class="image-input">
                    <label for="file">Upload Image</label>
                    <input id="file" type="file" @change="handleFileUpload">
                    <img v-if="form.images" :src="form.images" class="image" alt="Post Image" />
                </div> -->

            </div>
            <button @click="savePost()" class="add">{{ isEditing ? 'Save Changes' : 'Create Post' }}</button>

        </div>
        <div class="recentpost">
            <div class="title">
                <strong>RECENT POST</strong>
            </div>
            <div class="list">
                <ul>
                    <li class="recent-item" v-for="post in recentPosts" :key="post.id">
                        <div> <span class="author">{{ post.topic }}</span> </div>
                        {{ post.title }}

                    </li>
                </ul>
            </div>
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

.recentpost {
    background-color: #f9f9f9;
    /* Màu nền nhẹ */
    border-radius: 8px;
    /* Bo tròn góc */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    /* Tạo hiệu ứng bóng */
    width: 336px;
}

.recent-item {
    list-style: none;
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
    color: #7a7a7a;
}

.back {
    border-radius: 30px 5px;
    background-color: #5da6f4;
    border: none;
    width: 50px;
    height: 30px;
}

.title {
    margin-left: 100px;
    margin-top: 40px;
}

.createpost {

    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
}

.image {
    width: 100px;
}

.newpost {

    width: 776px;
    /* Đặt kích thước cụ thể */
    height: auto;
    /* Tự động điều chỉnh chiều cao */
    margin: 0 auto;
    /* Căn giữa theo chiều ngang */
    padding: 20px;
    background-color: #f9f9f9;
    /* Màu nền nhẹ */
    border-radius: 8px;
    /* Bo tròn góc */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    /* Tạo hiệu ứng bóng */
}

.header {
    text-align: center;
    /* Căn giữa tiêu đề */
    font-size: 24px;
    /* Kích thước font lớn hơn */
    font-weight: bold;
    margin-bottom: 20px;
    /* Khoảng cách dưới */
    color: #333;
    /* Màu chữ đậm */
}

.input-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    /* Khoảng cách giữa các thành phần */
}


.title-input,
.content-input {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

label {
    font-size: 16px;
    font-weight: bold;
    color: #555;
    /* Màu chữ nhạt hơn */
}

input {
    width: 100%;
    /* Chiếm toàn bộ chiều rộng container */
    height: 40px;
    /* Chiều cao cố định */
    border: 1px solid #ccc;
    /* Viền nhạt */
    border-radius: 5px;
    /* Bo tròn góc */
    padding: 0 10px;
    /* Khoảng cách giữa nội dung và viền */
    font-size: 14px;
    color: #333;
    outline: none;
    /* Loại bỏ viền mặc định khi focus */
    transition: border-color 0.3s ease;
    /* Hiệu ứng khi hover hoặc focus */
}

input:focus {
    border-color: #007bff;
    /* Màu viền khi focus */
}

.add {
    display: block;
    width: 200px;
    /* Chiều rộng nút */
    height: 50px;
    /* Chiều cao nút */
    margin: 20px auto 0;
    /* Căn giữa nút và thêm khoảng cách trên */
    background-color: #007bff;
    /* Màu nền */
    color: #fff;
    /* Màu chữ */
    font-size: 16px;
    font-weight: bold;
    border: none;
    /* Loại bỏ viền */
    border-radius: 25px;
    /* Bo tròn nút */
    cursor: pointer;
    /* Con trỏ dạng click */
    transition: background-color 0.3s ease;
    /* Hiệu ứng khi hover */
}

.add:hover {
    background-color: #0056b3;
    /* Màu khi hover */
}

@media screen and (max-width: 768px) {
    .newpost {
        max-width: 300px;
    }

    textarea {
        max-width: 310px;
    }

    .createpost {
        max-width: 400px;
        display: flex;
        flex-direction: column;
        gap: 30px;
    }

    .recentpost {

        max-width: 400px;
    }


}
</style>
