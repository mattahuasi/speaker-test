"""Generate the static female voice clips. Requires edge-tts and miniaudio."""

import asyncio
from array import array
import io
import math
from pathlib import Path
import wave

import edge_tts
import miniaudio


ROOT = Path(__file__).resolve().parents[1]
VOICES = {
    "en": ("en-US-AriaNeural", {"left": "Left", "right": "Right", "both": "Both"}),
    "es": ("es-MX-DaliaNeural", {"left": "Izquierda", "right": "Derecha", "both": "Ambos"}),
}


async def main():
    for language, (voice, words) in VOICES.items():
        directory = ROOT / "audio" / language
        directory.mkdir(parents=True, exist_ok=True)
        for channel, word in words.items():
            speech = edge_tts.Communicate(word, voice, rate="-10%")
            encoded = bytearray()
            async for chunk in speech.stream():
                if chunk["type"] == "audio":
                    encoded.extend(chunk["data"])
            decoded = miniaudio.decode(bytes(encoded), nchannels=1, sample_rate=24000)
            samples = decoded.samples
            peak = max(abs(value) for value in samples)
            active = [value for value in samples if abs(value) > peak * 0.02]
            if not active or not peak:
                raise ValueError(f"Empty voice clip: {language}/{channel}")
            rms = math.sqrt(sum(value * value for value in active) / len(active))
            # Match active-speech RMS at -22 dBFS, leaving at least 3 dB peak headroom.
            gain = min(32767 * 10 ** (-22 / 20) / rms, 32767 * 10 ** (-3 / 20) / peak)
            normalized = array("h", (round(value * gain) for value in samples))
            output = io.BytesIO()
            with wave.open(output, "wb") as wav:
                wav.setnchannels(1)
                wav.setsampwidth(2)
                wav.setframerate(24000)
                wav.writeframes(normalized.tobytes())
            path = directory / f"{channel}.wav"
            path.write_bytes(output.getvalue())
            print(f"{path.relative_to(ROOT)}: {word} ({voice}), {len(samples) / 24000:.2f}s")


if __name__ == "__main__":
    asyncio.run(main())
