// chat-input-bar.ts
import { Component, ElementRef, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageType } from '@app/core/enums/message.enum';
import { LucideAngularModule } from 'lucide-angular';

export interface AttachmentPayload {
  file: File;
  type: MessageType;
}

@Component({
  selector: 'app-chat-input-bar',
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './chat-input-bar.html',
  host: { class: 'shrink-0' },
})
export class ChatInputBar {
  message = signal('');
  isRecording = signal(false);
  recordSeconds = signal(0);

  send = output<string>();
  sendAttachment = output<AttachmentPayload>();

  private imageInput = viewChild<ElementRef<HTMLInputElement>>('imageInput');
  private fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private recordTimer: ReturnType<typeof setInterval> | null = null;

  onSend() {
    const value = this.message().trim();
    if (!value) return;
    this.send.emit(value);
    this.message.set('');
  }

  pickImage() {
    this.imageInput()?.nativeElement.click();
  }

  pickFile() {
    this.fileInput()?.nativeElement.click();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.sendAttachment.emit({ file, type: MessageType.Image });
    input.value = '';
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.sendAttachment.emit({ file, type: MessageType.File });
    input.value = '';
  }

  async toggleRecording() {
    if (this.isRecording()) {
      this.mediaRecorder?.stop();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (e) => this.audioChunks.push(e.data);
      this.mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());

        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
        const extension = mimeType.includes('ogg') ? 'ogg' : 'webm';
        const blob = new Blob(this.audioChunks, { type: mimeType });
        const file = new File([blob], `voice-${Date.now()}.${extension}`, { type: mimeType });

        this.sendAttachment.emit({ file, type: MessageType.Voice });
        this.mediaRecorder = null;
        this.isRecording.set(false);
        if (this.recordTimer) {
          clearInterval(this.recordTimer);
          this.recordTimer = null;
        }
      };

      this.mediaRecorder.start();
      this.isRecording.set(true);
      this.recordSeconds.set(0);
      this.recordTimer = setInterval(() => this.recordSeconds.update((s) => s + 1), 1000);
    } catch {
      // người dùng từ chối quyền micro hoặc trình duyệt không hỗ trợ
    }
  }
}
