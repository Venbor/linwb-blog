<template>
    <div class='loading-cover'>
      <div class="k-ring-2" style="border-color:#000000;">
          <div class="k-ball-holder2">
            <div class="k-ball1d" ></div>
            <div class="k-ball2b" ></div>
            <div class="k-ball5a" ></div>
            <div class="k-ball6a" ></div>
          </div>
      </div>
    </div>
</template>
<script>
   export default{
     data() {
       return {
         searchtxt: '',
       };
     },
};
</script>
<style>
.k-ring-2 {
  position:relative;
  width:45px;
  height:45px;
  margin:0 auto;
  border:4px solid #9C27B0;
  border-radius:100%;
  text-align: center;
  top: 40%;
}
.k-ball-holder2 {
  position:absolute;
  width:12px;
  height:45px;
  left:13px;
  top:-4px
}
.k-ball1d {
  position:absolute;
  top:-10px;
  left:-1px;
  width:16px;
  height:16px;
  border-radius:100%;
  background:#CDDC39
}
/* .k-ball1b {
  position:absolute;
  top:-10px;
  left:-1px;
  width:16px;
  height:16px;
  border-radius:100%;
  background:#000
} */
.k-ball2b {
  position:absolute;
  bottom:-10px;
  left:-1px;
  width:16px;
  height:16px;
  border-radius:100%;
  background:#F44336
}
.k-ball6a {
  position:absolute;
  top:14px;
  right:-26px;
  width:16px;
  height:16px;
  border-radius:100%;
  background:#3F51B5
}
.k-ball5a {
  position:absolute;
  top:14px;
  left:-26px;
  width:16px;
  height:16px;
  border-radius:100%;
  background:#4CAF50
}
.k-ball-holder2 {
  animation:k-loadingE 2.3s linear infinite
}
@keyframes k-loadingE {
  0 {
  transform:rotate(0deg)
}
100% {
  transform:rotate(360deg)
}
}
.loading-cover{z-index: 99999; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color:rgba(225,225,225,0.5)}
</style>
