import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import "./toastbar.css";

type ToastType = "info" | "success" | "error";

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

// 토스트 컨텍스트 생성
const ToastContext = createContext<{
  toastbars: ToastMessage[];
  showToastbar: (message: string, type?: ToastType) => void;
}>({
  toastbars: [],
  showToastbar: () => {},
});

// 토스트 바 컴포넌트
function ToastBar() {
  const { toastbars } = useToastBarContext();
  return (
    <div className="fixed inset-x-0 top-10 flex justify-center">
      {toastbars.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}

const useToastBarContext = () => useContext(ToastContext);

function ToastProvider({ children }: PropsWithChildren) {
  const [toastbars, setToastbars] = useState<ToastMessage[]>([]);

  const showToastbar = (message: string, type: ToastType = "info") => {
    const id = new Date().getTime();
    setToastbars((prevToasts) => [...prevToasts, { id, message, type }]);

    setTimeout(() => {
      setToastbars((prevToasts) =>
        prevToasts.filter((toast) => toast.id !== id)
      );
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToastbar, toastbars }}>
      {children}
      <ToastBar />
    </ToastContext.Provider>
  );
}

export { ToastProvider, useToastBarContext };
