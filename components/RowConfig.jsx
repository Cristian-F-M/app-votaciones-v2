import { View } from "react-native";

export function RowConfig({ children }) {
  return (
    <>
      <View className="flex flex-row justify-between items-center w-full">
        {children}
      </View>
    </>
  );
}
