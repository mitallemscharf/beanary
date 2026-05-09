export const toast = $state({
  message: '',
  type: 'success',
  visible: false
});

let timer;

export function showToast(message, type = 'success') {
  clearTimeout(timer);
  toast.message = message;
  toast.type = type;
  toast.visible = true;
  timer = setTimeout(() => {
    toast.visible = false;
  }, 3000);
}
