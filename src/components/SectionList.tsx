import { React, ReactNative } from "../vendors"
import { StyleSheetStyleView } from "../styles"

interface Props<Item> extends ReactNative.SectionListProps<Item> {
  style?: StyleSheetStyleView
}

export function SectionList<Item = any>(props: Props<Item>) {
  return <ReactNative.SectionList {...props}/>
}
