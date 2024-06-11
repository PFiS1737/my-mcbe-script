import {
  ActionFormResponse,
  FormCancelationReason,
  MessageFormData,
  MessageFormResponse,
  ModalFormResponse,
} from "@minecraft/server-ui"

import { asyncRun } from "../util/game.js"

export class Dialog {
  static async confirm({
    title = "确认",
    body,
    target,
    onCancel = async () => {},
    onConfirm = async () => {},
  }) {
    if (!body || !target) throw new Error()
    const form = await asyncRun(() => {
      return new Dialog({
        dialog: new MessageFormData()
          .title(title)
          .body(body)
          .button1("CANCEL")
          .button2("OK"),
        onClose: onCancel,
        onSelectButton1: onCancel,
        onSelectButton2: onConfirm,
      })
    })

    return await form.show(target)
  }

  constructor({
    dialog,
    onClose = async () => {},
    onSubmit = async (_) => {},
    onSelectButton1 = async () => {},
    onSelectButton2 = async () => {},
    onSelect = async (_) => {},
  }) {
    this.dialog = dialog
    this.onSubmit = onSubmit
    this.onSelectButton1 = onSelectButton1
    this.onSelectButton2 = onSelectButton2
    this.onSelect = onSelect
    this.onClose = onClose
  }
  async show(target) {
    let response
    target.sendMessage("[!] 新对话框已发送，请关闭命令输入栏或其他对话框")
    do {
      response = await this.dialog.show(target)
    } while (response.cancelationReason === FormCancelationReason.UserBusy)

    if (
      response.canceled &&
      response.cancelationReason === FormCancelationReason.UserClosed
    )
      return await this.onClose()
    if (response instanceof ModalFormResponse)
      return await this.onSubmit(response.formValues)
    if (response instanceof MessageFormResponse) {
      if (response.selection === 0) return await this.onSelectButton1()
      if (response.selection === 1) return await this.onSelectButton2()
    } else if (response instanceof ActionFormResponse)
      return await this.onSelect(response.selection)

    return response
  }
}

export default Dialog
