<script setup></script>
<template>

  <footer class="footer">
    <div class="logo">
      <img src="../components/icons/Group 13 -2.png" alt="">
    </div>
    <div class="social-icons">
      <a href="https://www.facebook.com" target="_blank" class="icon">
        <i class="fab fa-facebook-f"></i> <!-- Facebook icon -->
      </a>
      <a href="https://www.twitter.com" target="_blank" class="icon">
        <i class="fab fa-twitter"></i> <!-- Twitter icon -->
      </a>
      <a href="https://www.instagram.com" target="_blank" class="icon">
        <i class="fab fa-instagram"></i> <!-- Instagram icon -->
      </a>
      <a href="https://www.linkedin.com" target="_blank" class="icon">
        <i class="fab fa-linkedin-in"></i> <!-- LinkedIn icon -->
      </a>
    </div>
    <div class="sign">
      All Rights Reserved 2018 3layers
    </div>
  </footer>
</template>
<style scoped>


.social-icons {
  justify-content: flex-end;
  /* Căn giữa giữa các phần tử */
  display: flex;
  align-items: center;
  gap: 30px;
}

.footer {
  height: 100px;
  top: 5401px;

  opacity: 0px;

  justify-content: center;
  /* Căn giữa giữa các phần tử */
  display: flex;
  align-items: center;
  gap: 300px;
}

.sign {
  /* margin-left: 500px; */
  font-family: 'Courier New', Courier, monospace;
}
@media screen and (max-width: 768px) {
  .footer {
    gap: 20px;
  }
  .social-icons {
    gap: 10px;
  }

}
</style>