import { React, ReactNative } from "../vendors"
import { StyleSheetStyleView } from "../types/styles"

interface Props<Item> extends ReactNative.FlatListProps<Item> {
  style?: StyleSheetStyleView
}

export function FlatList<Item = any>(props: Props<Item>) {
  return <ReactNative.FlatList {...props}/>
}
