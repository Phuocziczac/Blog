<script setup>
defineProps(['visible', 'title', 'message']);
</script>

<template>
    <div v-if="visible" class="modal-overlay">
        <div class="modal-content">
            <h2>{{ title }}</h2>
            <p>{{ message }}</p>
            <div class="modal-buttons">
                <button class="btn cancel" @click="$emit('cancel')">Cancel</button>
                <button class="btn confirm" @click="$emit('confirm')">Confirm</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    display: flex;
    /* Use flexbox to center the modal */
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    /* Overlay effect */
    z-index: 1000;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
    text-align: center;
    width: 300px;
}

.modal-content h2 {
    font-size: 20px;
    margin-bottom: 10px;
}

.modal-content p {
    font-size: 16px;
    margin-bottom: 20px;
}

.modal-buttons {
    display: flex;
    justify-content: space-between;
}

.btn {
    padding: 10px 20px;
    font-size: 14px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.btn.cancel {
    background-color: #dcdcdc;
    color: #333;
}

.btn.cancel:hover {
    background-color: #c0c0c0;
}

.btn.confirm {
    background-color: #e74c3c;
    color: white;
}

.btn.confirm:hover {
    background-color: #c0392b;
}
</style>
