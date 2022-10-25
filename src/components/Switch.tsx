import { React, ReactNative } from "../vendors"
import { StyleSheetStyleView } from "../styles"

interface Props extends ReactNative.SwitchProps {
  style?: StyleSheetStyleView
}

export const Switch = (props: Props) => {
  return <ReactNative.Switch {...props}/>
}
