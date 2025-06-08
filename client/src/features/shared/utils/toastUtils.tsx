import toast from 'react-hot-toast';

interface ToastMessage {
    loading: string,
        success: string,
        error: string,
}

// Basic toasts (will use pre-defined styles from <Toaster>)
export const showSuccess = (message: string) => toast.success(message);
export const showError = (message: string) => toast.error(message);

// Loading toast (returns ID for later updates)
export const showLoading = (message: string) => toast.loading(message);


// Custom UI toasts
export const showUploadProgress = () => toast.custom((t) => (
    <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} 
        bg-white border border-greyB shadow-lg rounded-lg p-4`}>
    <div className="flex items-center gap-2">
      <div className="h-4 w-4 rounded-full border-2 border-grey border-t-transparent animate-spin" />
      <span>Uploading...</span>
    </div>
  </div>
));

//Promise wrapper ()
export const withToast = <T,>(
    promise: Promise<T>,
    messages: ToastMessage
) => { return toast.promise(promise, messages)} //This will inherit styles from <Toaster>

// Usage in component

// // Instead of this:
// const handleSubmit = async () => {
//   toast.loading('Saving...');
//   try {
//     await axios.post(...);
//     toast.success('Saved!');
//   } catch {
//     toast.error('Failed!');
//   }
// };

// // You get this:
// const handleSubmit = () => {
//   withToast(saveData(), {
//     loading: 'Saving...',
//     success: 'Saved!',
//     error: 'Failed!'
//   });
// };