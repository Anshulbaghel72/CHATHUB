import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "bottom-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
  showClass: {
    popup: "swal2-noanimation",
    backdrop: "swal2-noanimation",
  },
});

const makeToast = (type, msg) => {
  Toast.fire({
    icon: type,
    title: msg,
  });
};

export default makeToast;
