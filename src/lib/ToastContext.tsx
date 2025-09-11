import { type ToastActionElement, type ToastProps } from '@/components/ui/toast';
import React, { createContext, useContext, useReducer } from 'react';

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

type State = { toasts: ToasterToast[] };

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  // UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const;

type ActionType = typeof actionTypes;

type Action =
  | { type: ActionType['ADD_TOAST']; toast: ToasterToast }
  //| { type: ActionType['UPDATE_TOAST']; toast: Partial<ToasterToast> }
  | { type: ActionType['DISMISS_TOAST']; toastId: ToasterToast['id'] }
  | { type: ActionType['REMOVE_TOAST']; toastId: ToasterToast['id'] };

let memeoryState: State = { toasts: [] };

// ID counter
let count = 0;

const genID = () => {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
};

// reducer
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes['ADD_TOAST']:
      return { ...state, toasts: [action.toast, ...state.toasts].slice(0, 1) };
    case actionTypes['DISMISS_TOAST']:
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toastId ? { ...t, open: false } : t)),
      };
    default:
      return state;
  }
};

// context
const ToastContext = createContext<{
  state: State;
  // dispatch: React.Dispatch<Action>;
  toast: (props: Partial<ToasterToast>) => void;
} | null>(null);

// provider
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, memeoryState);

  const dismiss = (toastId: ToasterToast['id']) =>
    dispatch({
      type: actionTypes['DISMISS_TOAST'],
      toastId,
    });

  const toast = ({ ...props }) => {
    const id = genID();

    dispatch({
      type: actionTypes['ADD_TOAST'],
      toast: {
        ...props,
        id,
        open: true,
        onOpenChange: (open) => {
          if (!open) {
            dismiss(id);
          }
        },
      },
    });
  };

  return <ToastContext.Provider value={{ state, toast }}>{children}</ToastContext.Provider>;
};

// hook
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
