import type { Player, RawMessage } from "@minecraft/server"
import {
  type ActionFormData,
  ActionFormResponse,
  FormCancelationReason,
  MessageFormData,
  MessageFormResponse,
  type ModalFormData,
  ModalFormResponse,
} from "@minecraft/server-ui"

import { asyncRun } from "../util/game"

interface DialogHandlers<T> {
  dialog: ModalFormData | MessageFormData | ActionFormData
  onClose?: () => Promise<T>
  onSubmit?: (
    submitted: NonNullable<ModalFormResponse["formValues"]>
  ) => Promise<T>
  onSelectButton1?: () => Promise<T>
  onSelectButton2?: () => Promise<T>
  onSelect?: (
    selected: NonNullable<ActionFormResponse["selection"]>
  ) => Promise<T>
}

export class Dialog<T> implements DialogHandlers<T> {
  static async confirm<U>({
    title = "确认",
    body,
    target,
    onCancel = async () => ({}) as U,
    onConfirm = async () => ({}) as U,
  }: {
    title?: string
    body: RawMessage | string
    target: Player
    onCancel?: () => Promise<U>
    onConfirm?: () => Promise<U>
  }): Promise<U | undefined> {
    if (!body || !target) throw new Error()
    const form = await asyncRun(() => {
      return new Dialog<U>({
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

  dialog
  onClose
  onSubmit
  onSelectButton1
  onSelectButton2
  onSelect

  constructor({
    dialog,
    onClose = async () => ({}) as T,
    onSubmit = async () => ({}) as T,
    onSelectButton1 = async () => ({}) as T,
    onSelectButton2 = async () => ({}) as T,
    onSelect = async () => ({}) as T,
  }: DialogHandlers<T>) {
    this.dialog = dialog
    this.onSubmit = onSubmit
    this.onSelectButton1 = onSelectButton1
    this.onSelectButton2 = onSelectButton2
    this.onSelect = onSelect
    this.onClose = onClose
  }

  async show(target: Player): Promise<T | undefined> {
    let response: ModalFormResponse | MessageFormResponse | ActionFormResponse

    target.sendMessage("[!] 新对话框已发送，请关闭命令输入栏或其他对话框")

    do {
      response = await this.dialog.show(target)
    } while (response.cancelationReason === FormCancelationReason.UserBusy)

    if (
      response.canceled &&
      response.cancelationReason === FormCancelationReason.UserClosed
    )
      return await this.onClose()

    if (response instanceof ModalFormResponse) {
      if (!response.formValues) throw new Error("Unexpected error.")

      return await this.onSubmit(response.formValues)
    }

    if (response instanceof MessageFormResponse) {
      if (response.selection === 0) return await this.onSelectButton1()
      if (response.selection === 1) return await this.onSelectButton2()

      throw new Error("Unexpected error.")
    }

    if (response instanceof ActionFormResponse) {
      if (!response.selection) throw new Error("Unexpected error.")

      return await this.onSelect(response.selection)
    }
  }
}

export default Dialog
