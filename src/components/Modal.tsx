import { React, ReactNative } from "../vendors"
import { StyleSheetStyleView } from "../styles"

interface Props extends ReactNative.ModalProps {
  style?: StyleSheetStyleView
  children?: React.ReactNode
}

export const Modal = (props: Props) => {
  return <ReactNative.Modal {...props} />
}
