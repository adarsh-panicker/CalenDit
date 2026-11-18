import whisper
import json

print("Loading Whisper model...")
model = whisper.load_model("base")

print("Transcribing recordings/calen-dit-voice.wav...")
result = model.transcribe("recordings/calen-dit-voice.wav", fp16=False)

print("\n=== FULL TRANSCRIPT ===")
print(result["text"].strip())

print("\n=== SEGMENTS WITH TIMESTAMPS ===")
segments = []
for seg in result["segments"]:
    start = seg["start"]
    end = seg["end"]
    text = seg["text"].strip()
    print(f"[{start:05.2f}s -> {end:05.2f}s] {text}")
    segments.append({"start": start, "end": end, "text": text})

with open("recordings/transcript.json", "w", encoding="utf-8") as f:
    json.dump({"full_text": result["text"].strip(), "segments": segments}, f, indent=2)

print("\nSaved to recordings/transcript.json")
