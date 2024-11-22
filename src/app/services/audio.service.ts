import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audioContext: AudioContext;
  private audioBuffers: { [key: string]: AudioBuffer } = {};

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  async loadSound(name: string, filePath: string) {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    this.audioBuffers[name] = await this.audioContext.decodeAudioData(arrayBuffer);
  }

  playSound(name: string) {
    const audioBuffer = this.audioBuffers[name];
    if (audioBuffer) {
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.start(0);
    } else {
      console.warn(`El sonido ${name} no está cargado.`);
    }
  }
}
