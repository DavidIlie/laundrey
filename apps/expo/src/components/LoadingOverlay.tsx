import { ActivityIndicator, View } from "react-native";
import { create } from "zustand";

type Store = {
   loading: boolean;
   toggleLoading: () => void;
};

export const useLoadingStore = create<Store>((set) => ({
   loading: false,
   toggleLoading() {
      set((state) => ({
         ...state,
         loading: !state.loading,
      }));
   },
}));

export const LoadingOverlay: React.FC<{ children: React.ReactNode }> = ({
   children,
}) => {
   const { loading } = useLoadingStore();

   if (!loading) return children;

   return (
      <>
         <View className="absolute inset-0 z-10 flex h-full w-screen items-center justify-center bg-gray-200/60">
            <ActivityIndicator size="large" color="#000000" />
         </View>
         {children}
      </>
   );
};
