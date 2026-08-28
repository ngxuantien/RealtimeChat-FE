import {
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageType } from '@app/core/enums/message.enum';
import { LucideAngularModule } from 'lucide-angular';

const MAX_PENDING_FILES = 5;

export interface PendingFile {
  file: File;
  type: MessageType;
}

export interface AttachmentBatchPayload {
  files: PendingFile[];
  caption?: string;
}

interface PendingItem extends PendingFile {
  previewUrl: string | null;
}

export interface ReplyTarget { id: string; preview: string }
export interface EditTarget { id: string; content: string }

@Component({
  selector: 'app-chat-input-bar',
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './chat-input-bar.html',
  host: { class: 'shrink-0' },
})
export class ChatInputBar {
  protected readonly MessageType = MessageType;
  protected readonly maxPendingFiles = MAX_PENDING_FILES;

  private destroyRef = inject(DestroyRef);

  pendingFiles = signal<PendingItem[]>([]);

  message = signal('');
  isRecording = signal(false);
  recordSeconds = signal(0);

  send = output<string>();
  sendAttachment = output<AttachmentBatchPayload>();

  replyTo = input<ReplyTarget | null>(null);
  editingMessage = input<EditTarget | null>(null);

  saveEdit = output<{ id: string; content: string }>();
  cancelReply = output<void>();
  cancelEdit = output<void>();

  private imageInput = viewChild<ElementRef<HTMLInputElement>>('imageInput');
  private fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private recordTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => this.clearAllPreviewUrls());

    effect(() => {
      const editing = this.editingMessage();
      if(editing) this.message.set(editing.content);
    });
  }

  onSend() {
    const editing = this.editingMessage();
    if(editing){
      const value = this.message().trim();
      if(!value) return;
      this.saveEdit.emit({id: editing.id, content: value});
      this.message.set('');
      return;
    }

    const pending = this.pendingFiles();
    if (pending.length > 0) {
      const caption = this.message().trim();
      this.sendAttachment.emit({
        files: pending.map(({ file, type }) => ({ file, type })),
        caption: caption || undefined,
      });
      this.message.set('');
      this.pendingFiles.set([]);
      return;
    }

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
    this.addPendingFiles(Array.from(input.files ?? []), MessageType.Image);
    input.value = '';
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.addPendingFiles(Array.from(input.files ?? []), MessageType.File);
    input.value = '';
  }

  removePending(index: number) {
    const item = this.pendingFiles()[index];
    if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
    this.pendingFiles.update((list) => list.filter((_, i) => i !== index));
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  async toggleRecording() {
    if (this.isRecording()) {
      this.mediaRecorder?.stop();
      return;
    }

    if (this.pendingFiles().length >= MAX_PENDING_FILES) return;

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

        this.addPendingFiles([file], MessageType.Voice);
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

  private addPendingFiles(files: File[], type: MessageType) {
    if (files.length === 0) return;

    const remainingSlots = MAX_PENDING_FILES - this.pendingFiles().length;
    if (remainingSlots <= 0) return;

    const items: PendingItem[] = files.slice(0, remainingSlots).map((file) => ({
      file,
      type,
      previewUrl:
        type === MessageType.Image || type === MessageType.Voice ? URL.createObjectURL(file) : null,
    }));

    this.pendingFiles.update((list) => [...list, ...items]);
  }

  private clearAllPreviewUrls() {
    for (const item of this.pendingFiles()) {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    }
  }
}
